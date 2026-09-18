import { useState, useEffect, useMemo, useRef } from "react";
import { Home, ShoppingBasket, Soup, Cake, Factory, Settings, Plus, Search, Trash2, ChevronLeft, FileDown, TrendingUp, TrendingDown, AlertTriangle, Info, Check } from "lucide-react";

/* ════════════════════════════════════════════════════════════════════════
   LANGUES — ordre : français, arabe, anglais, espagnol, italien, allemand
   ════════════════════════════════════════════════════════════════════════ */
const LANGS = ["fr", "ar", "en", "es", "it", "de"];
const LANG_NAMES = { fr: "Français", ar: "العربية", en: "English", es: "Español", it: "Italiano", de: "Deutsch" };
const LOCALES = { fr: "fr-FR", ar: "ar-MA", en: "en-GB", es: "es-ES", it: "it-IT", de: "de-DE" };
let LANG = "fr";
const setLang = (l) => { LANG = LANGS.includes(l) ? l : "fr"; };
const detectLang = () => { const l = (typeof navigator !== "undefined" && navigator.language || "fr").slice(0, 2); return LANGS.includes(l) ? l : "fr"; };

const TR = {
  // Navigation
  "nav.home": ["Accueil", "الرئيسية", "Home", "Inicio", "Home", "Start"],
  "nav.ingredients": ["Matières", "المواد", "Ingredients", "Materias", "Materie", "Zutaten"],
  "nav.preps": ["Préparations", "التحضيرات", "Preparations", "Preparaciones", "Preparazioni", "Zubereitungen"],
  "nav.prepsShort": ["Prépas", "تحضيرات", "Preps", "Bases", "Basi", "Basis"],
  "nav.recipes": ["Coûts", "التكاليف", "Costs", "Costes", "Costi", "Kosten"],
  "nav.production": ["Production", "الإنتاج", "Production", "Producción", "Produzione", "Produktion"],
  "nav.productionShort": ["Prod.", "إنتاج", "Prod.", "Prod.", "Prod.", "Prod."],
  "nav.settings": ["Paramètres", "الإعدادات", "Settings", "Ajustes", "Impostazioni", "Einstellungen"],
  "brand": ["Mizanerie", "Mizanerie", "Mizanerie", "Mizanerie", "Mizanerie", "Mizanerie"],

  // Commun
  "c.back": ["Retour", "رجوع", "Back", "Volver", "Indietro", "Zurück"],
  "c.save": ["Enregistrer", "حفظ", "Save", "Guardar", "Salva", "Speichern"],
  "c.add": ["Ajouter", "إضافة", "Add", "Añadir", "Aggiungi", "Hinzufügen"],
  "c.cancel": ["Annuler", "إلغاء", "Cancel", "Cancelar", "Annulla", "Abbrechen"],
  "c.delete": ["Supprimer", "حذف", "Delete", "Eliminar", "Elimina", "Löschen"],
  "c.all": ["Toutes", "الكل", "All", "Todas", "Tutte", "Alle"],
  "c.optional": ["Facultatif.", "اختياري.", "Optional.", "Opcional.", "Facoltativo.", "Optional."],
  "c.category": ["Catégorie", "الفئة", "Category", "Categoría", "Categoria", "Kategorie"],
  "c.cost": ["Coût", "التكلفة", "Cost", "Coste", "Costo", "Kosten"],
  "c.exportPdf": ["Exporter en PDF", "تصدير PDF", "Export as PDF", "Exportar en PDF", "Esporta in PDF", "Als PDF exportieren"],
  "c.loading": ["Chargement…", "جارٍ التحميل…", "Loading…", "Cargando…", "Caricamento…", "Wird geladen…"],
  "c.noMatch": ["Aucun résultat.", "لا توجد نتائج.", "No results.", "Sin resultados.", "Nessun risultato.", "Keine Ergebnisse."],
  "c.toComplete": ["À compléter", "غير مكتمل", "Incomplete", "Por completar", "Da completare", "Unvollständig"],
  "c.catHintShort": ["Facultatif.", "اختياري.", "Optional.", "Opcional.", "Facoltativo.", "Optional."],
  "app.saveFailed": ["L'enregistrement a échoué. Vos dernières modifications risquent d'être perdues si vous fermez l'application.", "فشل الحفظ. قد تفقد آخر تعديلاتك إذا أغلقت التطبيق.", "Saving failed. Your latest changes may be lost if you close the app.", "No se ha podido guardar. Sus últimos cambios podrían perderse si cierra la aplicación.", "Salvataggio non riuscito. Le ultime modifiche potrebbero andare perse chiudendo l'app.", "Speichern fehlgeschlagen. Ihre letzten Änderungen können verloren gehen, wenn Sie die App schließen."],

  // Erreurs du moteur de calcul
  "err.price": ["« {n} » : indiquez un prix positif.", "«{n}»: أدخل سعرًا موجبًا.", "“{n}”: enter a positive price.", "«{n}»: indique un precio positivo.", "«{n}»: inserisci un prezzo positivo.", "„{n}“: Geben Sie einen positiven Preis ein."],
  "err.packs": ["« {n} » : le nombre de paquets doit être supérieur à 0.", "«{n}»: يجب أن يكون عدد العلب أكبر من 0.", "“{n}”: the number of packs must be greater than 0.", "«{n}»: el número de paquetes debe ser mayor que 0.", "«{n}»: il numero di confezioni deve essere maggiore di 0.", "„{n}“: Die Anzahl der Packungen muss größer als 0 sein."],
  "err.content": ["« {n} » : la quantité contenue doit être supérieure à 0.", "«{n}»: يجب أن تكون الكمية المحتواة أكبر من 0.", "“{n}”: the quantity contained must be greater than 0.", "«{n}»: la cantidad contenida debe ser mayor que 0.", "«{n}»: la quantità contenuta deve essere maggiore di 0.", "„{n}“: Die enthaltene Menge muss größer als 0 sein."],
  "err.ingDeleted": ["Une matière première utilisée a été supprimée.", "تم حذف مادة أولية مستعملة.", "An ingredient in use has been deleted.", "Se ha eliminado una materia prima utilizada.", "È stata eliminata una materia prima utilizzata.", "Eine verwendete Zutat wurde gelöscht."],
  "err.prepDeleted": ["Une préparation utilisée a été supprimée.", "تم حذف تحضير مستعمل.", "A preparation in use has been deleted.", "Se ha eliminado una preparación utilizada.", "È stata eliminata una preparazione utilizzata.", "Eine verwendete Zubereitung wurde gelöscht."],
  "err.loop": ["« {n} » s'utilise elle-même, directement ou via une autre préparation.", "«{n}» تستعمل نفسها، مباشرة أو عبر تحضير آخر.", "“{n}” uses itself, directly or through another preparation.", "«{n}» se utiliza a sí misma, directamente o a través de otra preparación.", "«{n}» usa sé stessa, direttamente o tramite un'altra preparazione.", "„{n}“ verwendet sich selbst, direkt oder über eine andere Zubereitung."],
  "err.prepYield": ["« {n} » : indiquez la quantité finale obtenue.", "«{n}»: أدخل الكمية النهائية المحصلة.", "“{n}”: enter the final quantity obtained.", "«{n}»: indique la cantidad final obtenida.", "«{n}»: indica la quantità finale ottenuta.", "„{n}“: Geben Sie die erhaltene Endmenge ein."],
  "err.recipeNotFound": ["Recette introuvable.", "الوصفة غير موجودة.", "Recipe not found.", "Receta no encontrada.", "Ricetta non trovata.", "Rezept nicht gefunden."],
  "err.pieces": ["Indiquez combien de pièces sont obtenues.", "أدخل عدد القطع المحصلة.", "Enter how many pieces are obtained.", "Indique cuántas piezas se obtienen.", "Indica quanti pezzi si ottengono.", "Geben Sie an, wie viele Stück entstehen."],
  "err.noItems": ["Ajoutez au moins un élément.", "أضف عنصرًا واحدًا على الأقل.", "Add at least one item.", "Añada al menos un elemento.", "Aggiungi almeno un elemento.", "Fügen Sie mindestens ein Element hinzu."],
  "err.fixedAmount": ["Indiquez le montant de cette ligne.", "أدخل مبلغ هذا السطر.", "Enter the amount for this line.", "Indique el importe de esta línea.", "Indica l'importo di questa riga.", "Geben Sie den Betrag dieser Zeile ein."],
  "err.chooseItem": ["Choisissez un élément.", "اختر عنصرًا.", "Choose an item.", "Elija un elemento.", "Scegli un elemento.", "Wählen Sie ein Element."],
  "err.lineQty": ["Indiquez la quantité de « {n} ».", "أدخل كمية «{n}».", "Enter the quantity of “{n}”.", "Indique la cantidad de «{n}».", "Indica la quantità di «{n}».", "Geben Sie die Menge von „{n}“ ein."],
  "err.unit": ["« {n} » est compté en {a}, pas en {b}.", "«{n}» يُحسب بـ{a} وليس بـ{b}.", "“{n}” is counted in {a}, not in {b}.", "«{n}» se cuenta en {a}, no en {b}.", "«{n}» si conta in {a}, non in {b}.", "„{n}“ wird in {a} gezählt, nicht in {b}."],
  "err.chooseRecipe": ["Choisissez une recette pour chaque ligne.", "اختر وصفة لكل سطر.", "Choose a recipe for each line.", "Elija una receta para cada línea.", "Scegli una ricetta per ogni riga.", "Wählen Sie für jede Zeile ein Rezept."],
  "err.prodQty": ["« {n} » : indiquez la quantité produite.", "«{n}»: أدخل الكمية المنتجة.", "“{n}”: enter the quantity produced.", "«{n}»: indique la cantidad producida.", "«{n}»: indica la quantità prodotta.", "„{n}“: Geben Sie die produzierte Menge ein."],
  "err.flat": ["Forfait", "مبلغ ثابت", "Flat amount", "Importe fijo", "Importo fisso", "Pauschale"],
  "err.thisProduct": ["Ce produit", "هذا المنتج", "This product", "Este producto", "Questo prodotto", "Dieses Produkt"],
  "err.thisPrep": ["Cette préparation", "هذا التحضير", "This preparation", "Esta preparación", "Questa preparazione", "Diese Zubereitung"],
  "err.thisRecipe": ["Cette recette", "هذه الوصفة", "This recipe", "Esta receta", "Questa ricetta", "Dieses Rezept"],

  // Erreurs de formulaire
  "f.nameIng": ["Donnez un nom au produit.", "أدخل اسم المنتج.", "Give the product a name.", "Ponga un nombre al producto.", "Dai un nome al prodotto.", "Geben Sie dem Produkt einen Namen."],
  "f.priceReq": ["Indiquez le prix payé.", "أدخل الثمن المدفوع.", "Enter the price paid.", "Indique el precio pagado.", "Indica il prezzo pagato.", "Geben Sie den bezahlten Preis ein."],
  "f.priceInvalid": ["Prix invalide.", "سعر غير صالح.", "Invalid price.", "Precio no válido.", "Prezzo non valido.", "Ungültiger Preis."],
  "f.qtyReq": ["Indiquez la quantité contenue.", "أدخل الكمية المحتواة.", "Enter the quantity contained.", "Indique la cantidad contenida.", "Indica la quantità contenuta.", "Geben Sie die enthaltene Menge ein."],
  "f.qtyPos": ["La quantité doit être supérieure à 0.", "يجب أن تكون الكمية أكبر من 0.", "The quantity must be greater than 0.", "La cantidad debe ser mayor que 0.", "La quantità deve essere maggiore di 0.", "Die Menge muss größer als 0 sein."],
  "f.packsReq": ["Indiquez le nombre de paquets.", "أدخل عدد العلب.", "Enter the number of packs.", "Indique el número de paquetes.", "Indica il numero di confezioni.", "Geben Sie die Anzahl der Packungen ein."],
  "f.namePrep": ["Donnez un nom à la préparation.", "أدخل اسم التحضير.", "Give the preparation a name.", "Ponga un nombre a la preparación.", "Dai un nome alla preparazione.", "Geben Sie der Zubereitung einen Namen."],
  "f.yieldReq": ["Indiquez la quantité finale obtenue.", "أدخل الكمية النهائية المحصلة.", "Enter the final quantity obtained.", "Indique la cantidad final obtenida.", "Indica la quantità finale ottenuta.", "Geben Sie die erhaltene Endmenge ein."],
  "f.nameRecipe": ["Donnez un nom à la recette.", "أدخل اسم الوصفة.", "Give the recipe a name.", "Ponga un nombre a la receta.", "Dai un nome alla ricetta.", "Geben Sie dem Rezept einen Namen."],
  "f.piecesReq": ["Indiquez le nombre de pièces obtenues.", "أدخل عدد القطع المحصلة.", "Enter the number of pieces obtained.", "Indique el número de piezas obtenidas.", "Indica il numero di pezzi ottenuti.", "Geben Sie die Anzahl der erhaltenen Stück ein."],
  "f.rateMax": ["Une marge sur le prix de vente doit rester sous 100 %.", "يجب أن يبقى الهامش على سعر البيع أقل من 100 %.", "A margin on the selling price must stay below 100%.", "Un margen sobre el precio de venta debe ser inferior al 100 %.", "Un margine sul prezzo di vendita deve restare sotto il 100%.", "Eine Marge auf den Verkaufspreis muss unter 100 % liegen."],

  // Suppression
  "del.blocked": ["Impossible de supprimer {w} : utilisé dans {list}. Retirez-le d'abord de ces éléments.", "لا يمكن حذف {w}: مستعمل في {list}. أزله أولًا من هذه العناصر.", "Can't delete {w}: used in {list}. Remove it from these first.", "No se puede eliminar {w}: se usa en {list}. Quítelo primero de esos elementos.", "Impossibile eliminare {w}: è usato in {list}. Rimuovilo prima da questi elementi.", "{w} kann nicht gelöscht werden: verwendet in {list}. Entfernen Sie es zuerst dort."],
  "del.confirm": ["Supprimer définitivement {w} ?", "حذف {w} نهائيًا؟", "Permanently delete {w}?", "¿Eliminar {w} definitivamente?", "Eliminare definitivamente {w}?", "{w} endgültig löschen?"],
  "del.btn": ["Supprimer {w}", "حذف {w}", "Delete {w}", "Eliminar {w}", "Elimina {w}", "{w} löschen"],
  "del.inProd": ["la production du {d}", "إنتاج {d}", "the production of {d}", "la producción del {d}", "la produzione del {d}", "die Produktion vom {d}"],

  // Liste de choix des catégories
  "combo.create": ["Créer « {v} »", "إنشاء «{v}»", "Create “{v}”", "Crear «{v}»", "Crea «{v}»", "„{v}“ anlegen"],
  "combo.didYouMean": ["Vouliez-vous dire « {v} » ?", "هل تقصد «{v}»؟", "Did you mean “{v}”?", "¿Quería decir «{v}»?", "Intendevi «{v}»?", "Meinten Sie „{v}“?"],
  "combo.existing": ["Catégories existantes", "الفئات الموجودة", "Existing categories", "Categorías existentes", "Categorie esistenti", "Vorhandene Kategorien"],


  // ─── Compte & abonnement ───
  "auth.signIn": ["Se connecter", "تسجيل الدخول", "Sign in", "Iniciar sesión", "Accedi", "Anmelden"],
  "auth.signUp": ["Créer un compte", "إنشاء حساب", "Create account", "Crear cuenta", "Crea un account", "Konto erstellen"],
  "auth.signOut": ["Se déconnecter", "تسجيل الخروج", "Sign out", "Cerrar sesión", "Esci", "Abmelden"],
  "auth.email": ["Adresse e-mail", "البريد الإلكتروني", "Email address", "Correo electrónico", "Indirizzo email", "E-Mail-Adresse"],
  "auth.password": ["Mot de passe", "كلمة المرور", "Password", "Contraseña", "Password", "Passwort"],
  "auth.pwdHint": ["8 caractères minimum.", "8 أحرف على الأقل.", "At least 8 characters.", "Mínimo 8 caracteres.", "Almeno 8 caratteri.", "Mindestens 8 Zeichen."],
  "auth.forgot": ["Mot de passe oublié ?", "نسيت كلمة المرور؟", "Forgot your password?", "¿Olvidó su contraseña?", "Password dimenticata?", "Passwort vergessen?"],
  "auth.resetSent": ["Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d'être envoyé.", "إذا كان هناك حساب بهذا البريد، فقد أُرسلت رسالة لإعادة التعيين.", "If an account exists for this address, a reset email has just been sent.", "Si existe una cuenta con esa dirección, se acaba de enviar un correo de restablecimiento.", "Se esiste un account per questo indirizzo, è stata inviata un'email di reimpostazione.", "Falls ein Konto für diese Adresse existiert, wurde soeben eine E-Mail zum Zurücksetzen gesendet."],
  "auth.confirmSent": ["Vérifiez votre boîte mail : un lien de confirmation vous a été envoyé.", "تحقق من بريدك: أُرسل إليك رابط للتأكيد.", "Check your inbox: a confirmation link has been sent to you.", "Revise su correo: le hemos enviado un enlace de confirmación.", "Controlla la tua email: ti abbiamo inviato un link di conferma.", "Prüfen Sie Ihr Postfach: Wir haben Ihnen einen Bestätigungslink gesendet."],
  "auth.noAccount": ["Pas encore de compte ?", "ليس لديك حساب؟", "No account yet?", "¿Aún no tiene cuenta?", "Non hai un account?", "Noch kein Konto?"],
  "auth.hasAccount": ["Vous avez déjà un compte ?", "لديك حساب بالفعل؟", "Already have an account?", "¿Ya tiene una cuenta?", "Hai già un account?", "Sie haben bereits ein Konto?"],
  "auth.why": ["Votre compte sauvegarde vos données et vous les retrouvez sur tous vos appareils.", "حسابك يحفظ بياناتك وتجدها على كل أجهزتك.", "Your account saves your data and syncs it across all your devices.", "Su cuenta guarda sus datos y los recupera en todos sus dispositivos.", "Il tuo account salva i dati e li ritrovi su tutti i dispositivi.", "Ihr Konto sichert Ihre Daten und synchronisiert sie auf allen Geräten."],
  "auth.errBadLogin": ["Adresse e-mail ou mot de passe incorrect.", "البريد الإلكتروني أو كلمة المرور غير صحيحة.", "Incorrect email address or password.", "Correo o contraseña incorrectos.", "Email o password non corretti.", "E-Mail-Adresse oder Passwort falsch."],
  "auth.errExists": ["Un compte existe déjà avec cette adresse. Connectez-vous.", "يوجد حساب بهذا البريد. سجّل الدخول.", "An account already exists with this address. Please sign in.", "Ya existe una cuenta con esa dirección. Inicie sesión.", "Esiste già un account con questo indirizzo. Accedi.", "Mit dieser Adresse existiert bereits ein Konto. Bitte anmelden."],
  "auth.errShortPwd": ["Le mot de passe est trop court.", "كلمة المرور قصيرة جدًا.", "The password is too short.", "La contraseña es demasiado corta.", "La password è troppo corta.", "Das Passwort ist zu kurz."],
  "auth.errBadEmail": ["Cette adresse e-mail n'est pas valide.", "هذا البريد الإلكتروني غير صالح.", "This email address is not valid.", "Esta dirección de correo no es válida.", "Questo indirizzo email non è valido.", "Diese E-Mail-Adresse ist ungültig."],
  "auth.errTooMany": ["Trop de tentatives. Réessayez dans quelques minutes.", "محاولات كثيرة. أعد المحاولة بعد دقائق.", "Too many attempts. Try again in a few minutes.", "Demasiados intentos. Inténtelo de nuevo en unos minutos.", "Troppi tentativi. Riprova tra qualche minuto.", "Zu viele Versuche. Versuchen Sie es in einigen Minuten erneut."],
  "auth.errNotConfirmed": ["Confirmez d'abord votre adresse depuis l'e-mail reçu.", "أكّد بريدك أولًا عبر الرسالة المرسلة.", "Please confirm your address using the email you received first.", "Confirme antes su dirección con el correo recibido.", "Conferma prima il tuo indirizzo tramite l'email ricevuta.", "Bestätigen Sie zuerst Ihre Adresse über die erhaltene E-Mail."],
  "auth.errNetwork": ["Connexion impossible. Vérifiez votre accès à internet.", "تعذّر الاتصال. تحقق من الإنترنت.", "Can't connect. Check your internet access.", "No se pudo conectar. Compruebe su conexión a internet.", "Impossibile connettersi. Verifica la connessione a internet.", "Verbindung nicht möglich. Prüfen Sie Ihre Internetverbindung."],
  "auth.errGeneric": ["Une erreur est survenue. Réessayez.", "حدث خطأ. أعد المحاولة.", "Something went wrong. Please try again.", "Se ha producido un error. Inténtelo de nuevo.", "Si è verificato un errore. Riprova.", "Ein Fehler ist aufgetreten. Bitte erneut versuchen."],
  "acc.title": ["Mon compte", "حسابي", "My account", "Mi cuenta", "Il mio account", "Mein Konto"],
  "acc.offline": ["Vos données sont enregistrées sur cet appareil uniquement. Créez un compte pour les sauvegarder et les retrouver partout.", "بياناتك محفوظة على هذا الجهاز فقط. أنشئ حسابًا لحفظها والوصول إليها من أي مكان.", "Your data is saved on this device only. Create an account to back it up and access it anywhere.", "Sus datos se guardan solo en este dispositivo. Cree una cuenta para respaldarlos y acceder desde cualquier lugar.", "I tuoi dati sono salvati solo su questo dispositivo. Crea un account per salvarli e ritrovarli ovunque.", "Ihre Daten werden nur auf diesem Gerät gespeichert. Erstellen Sie ein Konto, um sie zu sichern und überall abzurufen."],
  "acc.synced": ["Vos données sont sauvegardées et synchronisées.", "بياناتك محفوظة ومتزامنة.", "Your data is backed up and synced.", "Sus datos están respaldados y sincronizados.", "I tuoi dati sono salvati e sincronizzati.", "Ihre Daten sind gesichert und synchronisiert."],
  "acc.plan": ["Formule", "الصيغة", "Plan", "Plan", "Piano", "Tarif"],
  "acc.free": ["Gratuite", "مجانية", "Free", "Gratuita", "Gratuito", "Kostenlos"],
  "acc.premium": ["Premium", "بريميوم", "Premium", "Premium", "Premium", "Premium"],
  "acc.delete": ["Supprimer mon compte", "حذف حسابي", "Delete my account", "Eliminar mi cuenta", "Elimina il mio account", "Mein Konto löschen"],
  "acc.deleteWarn": ["Votre compte et toutes vos données seront définitivement supprimés.", "سيُحذف حسابك وكل بياناتك نهائيًا.", "Your account and all your data will be permanently deleted.", "Su cuenta y todos sus datos se eliminarán definitivamente.", "Il tuo account e tutti i dati saranno eliminati definitivamente.", "Ihr Konto und alle Daten werden endgültig gelöscht."],
  "acc.migrating": ["Transfert de vos données vers votre compte…", "جارٍ نقل بياناتك إلى حسابك…", "Transferring your data to your account…", "Transfiriendo sus datos a su cuenta…", "Trasferimento dei dati nel tuo account…", "Ihre Daten werden in Ihr Konto übertragen…"],
  "acc.migrated": ["{n} éléments transférés dans votre compte.", "تم نقل {n} عنصرًا إلى حسابك.", "{n} items transferred to your account.", "{n} elementos transferidos a su cuenta.", "{n} elementi trasferiti nel tuo account.", "{n} Elemente in Ihr Konto übertragen."],
  "lim.title": ["Vous avez atteint la limite de la version gratuite", "لقد بلغت حدّ النسخة المجانية", "You've reached the free plan limit", "Ha alcanzado el límite de la versión gratuita", "Hai raggiunto il limite della versione gratuita", "Sie haben das Limit der kostenlosen Version erreicht"],
  "lim.intro": ["Passez à Mizanerie Premium pour débloquer :", "انتقل إلى Mizanerie Premium لتفتح:", "Upgrade to Mizanerie Premium to unlock:", "Pase a Mizanerie Premium para desbloquear:", "Passa a Mizanerie Premium per sbloccare:", "Wechseln Sie zu Mizanerie Premium und erhalten Sie:"],
  "lim.f1": ["Matières, préparations et recettes illimitées", "مواد وتحضيرات ووصفات بلا حدود", "Unlimited ingredients, preparations and recipes", "Materias, preparaciones y recetas ilimitadas", "Materie, preparazioni e ricette illimitate", "Unbegrenzte Zutaten, Zubereitungen und Rezepte"],
  "lim.f2": ["Photo de recette → liste d'ingrédients", "صورة وصفة ← قائمة مكونات", "Recipe photo → ingredient list", "Foto de receta → lista de ingredientes", "Foto ricetta → elenco ingredienti", "Rezeptfoto → Zutatenliste"],
  "lim.f3": ["Fiches PDF et calcul de production", "بطاقات PDF وحساب الإنتاج", "PDF sheets and production costing", "Fichas PDF y cálculo de producción", "Schede PDF e calcolo della produzione", "PDF-Blätter und Produktionsberechnung"],
  "lim.f4": ["Sauvegarde et synchronisation de vos données", "حفظ بياناتك ومزامنتها", "Backup and sync of your data", "Copia de seguridad y sincronización de sus datos", "Backup e sincronizzazione dei dati", "Sicherung und Synchronisierung Ihrer Daten"],
  "lim.cta": ["Essayer 3 jours gratuitement", "جرّب 3 أيام مجانًا", "Try 3 days free", "Probar 3 días gratis", "Prova 3 giorni gratis", "3 Tage kostenlos testen"],
  "lim.price": ["5 €/mois ou 49 €/an, sans engagement", "5 € شهريًا أو 49 € سنويًا، دون التزام", "€5/month or €49/year, cancel anytime", "5 €/mes o 49 €/año, sin compromiso", "5 €/mese o 49 €/anno, senza vincoli", "5 €/Monat oder 49 €/Jahr, jederzeit kündbar"],
  "lim.later": ["Plus tard", "لاحقًا", "Later", "Más tarde", "Più tardi", "Später"],
  "lim.soon": ["L'abonnement arrive très bientôt. En attendant, tout reste accessible en lecture.", "الاشتراك قادم قريبًا. في هذه الأثناء يبقى كل شيء متاحًا للقراءة.", "Subscriptions are coming very soon. In the meantime, everything stays readable.", "La suscripción llegará muy pronto. Mientras tanto, todo sigue disponible para consulta.", "L'abbonamento arriverà molto presto. Nel frattempo tutto resta consultabile.", "Das Abo kommt sehr bald. Bis dahin bleibt alles lesbar."],
  "lim.counter": ["{u} sur {c}", "{u} من {c}", "{u} of {c}", "{u} de {c}", "{u} di {c}", "{u} von {c}"],

  // Matières premières
  "ing.title": ["Matières premières", "المواد الأولية", "Ingredients", "Materias primas", "Materie prime", "Zutaten"],
  "ing.subtitle": ["Ce que vous achetez, avec son coût à l'unité.", "ما تشتريه، مع تكلفة الوحدة.", "What you buy, with its cost per unit.", "Lo que compra, con su coste por unidad.", "Ciò che acquisti, con il costo unitario.", "Was Sie einkaufen, mit dem Preis pro Einheit."],
  "ing.new": ["Nouvelle matière première", "مادة أولية جديدة", "New ingredient", "Nueva materia prima", "Nuova materia prima", "Neue Zutat"],
  "ing.name": ["Nom du produit", "اسم المنتج", "Product name", "Nombre del producto", "Nome del prodotto", "Produktname"],
  "ing.namePh": ["Ex. Mascarpone", "مثال: ماسكاربوني", "E.g. Mascarpone", "Ej. Mascarpone", "Es. Mascarpone", "z. B. Mascarpone"],
  "ing.price": ["Combien l'avez-vous payé ?", "كم دفعت ثمنه؟", "How much did you pay for it?", "¿Cuánto ha pagado?", "Quanto l'hai pagato?", "Wie viel haben Sie bezahlt?"],
  "ing.priceHint": ["Le prix total de ce que vous achetez : le carton, le pot, le sac…", "الثمن الإجمالي لما تشتريه: الكرتونة، العلبة، الكيس…", "The total price of what you buy: the box, the tub, the bag…", "El precio total de lo que compra: la caja, el bote, el saco…", "Il prezzo totale di ciò che acquisti: il cartone, il vasetto, il sacco…", "Der Gesamtpreis Ihres Einkaufs: Karton, Becher, Sack…"],
  "ing.pricePh": ["Ex. 25", "مثال: 25", "E.g. 25", "Ej. 25", "Es. 25", "z. B. 25"],
  "ing.form": ["Sous quelle forme ?", "بأي شكل؟", "In what form?", "¿En qué formato?", "In che formato?", "In welcher Form?"],
  "ing.formHint": ["Facultatif : carton, pot, sac, bouteille…", "اختياري: كرتونة، علبة، كيس، قنينة…", "Optional: box, tub, bag, bottle…", "Opcional: caja, bote, saco, botella…", "Facoltativo: cartone, vasetto, sacco, bottiglia…", "Optional: Karton, Becher, Sack, Flasche…"],
  "ing.formPh": ["Ex. pot", "مثال: علبة", "E.g. tub", "Ej. bote", "Es. vasetto", "z. B. Becher"],
  "ing.forms": ["carton,paquet,pot,sac,bouteille,bidon,boîte,lot", "كرتونة,علبة,كيس,قنينة,سطل,صندوق,رزمة", "box,pack,tub,bag,bottle,can,case,lot", "caja,paquete,bote,saco,botella,garrafa,lata,lote", "cartone,confezione,vasetto,sacco,bottiglia,tanica,scatola,lotto", "Karton,Packung,Becher,Sack,Flasche,Kanister,Dose,Gebinde"],
  "ing.multi": ["Il contient plusieurs paquets identiques", "يحتوي على عدة علب متماثلة", "It contains several identical packs", "Contiene varios paquetes idénticos", "Contiene più confezioni identiche", "Enthält mehrere gleiche Packungen"],
  "ing.packs": ["Combien de paquets ?", "كم عدد العلب؟", "How many packs?", "¿Cuántos paquetes?", "Quante confezioni?", "Wie viele Packungen?"],
  "ing.packsPh": ["Ex. 6", "مثال: 6", "E.g. 6", "Ej. 6", "Es. 6", "z. B. 6"],
  "ing.packsSuffix": ["paquets", "علب", "packs", "paquetes", "confezioni", "Packungen"],
  "ing.contains": ["Combien contient-il ?", "كم يحتوي؟", "How much does it contain?", "¿Cuánto contiene?", "Quanto contiene?", "Wie viel ist enthalten?"],
  "ing.eachContains": ["Que contient chaque paquet ?", "ماذا تحتوي كل علبة؟", "What does each pack contain?", "¿Qué contiene cada paquete?", "Cosa contiene ogni confezione?", "Was enthält jede Packung?"],
  "ing.qtyPh": ["Ex. 250", "مثال: 250", "E.g. 250", "Ej. 250", "Es. 250", "z. B. 250"],
  "ing.unitCost": ["Coût unitaire", "تكلفة الوحدة", "Unit cost", "Coste unitario", "Costo unitario", "Stückkosten"],
  "ing.perKg": [", soit {v} le kg", "، أي {v} للكيلوغرام", ", i.e. {v} per kg", ", es decir {v} el kg", ", cioè {v} al kg", ", also {v} pro kg"],
  "ing.perL": [", soit {v} le litre", "، أي {v} للتر", ", i.e. {v} per litre", ", es decir {v} el litro", ", cioè {v} al litro", ", also {v} pro Liter"],
  "ing.pending": ["Remplissez le prix et la quantité : le calcul se fait tout seul.", "أدخل الثمن والكمية: يتم الحساب تلقائيًا.", "Fill in the price and quantity: the calculation is automatic.", "Rellene el precio y la cantidad: el cálculo es automático.", "Inserisci prezzo e quantità: il calcolo è automatico.", "Preis und Menge eingeben: Die Berechnung erfolgt automatisch."],
  "ing.catHint": ["Facultatif, pour retrouver vos produits plus vite.", "اختياري، للعثور على منتجاتك بسرعة.", "Optional, to find your products faster.", "Opcional, para encontrar sus productos más rápido.", "Facoltativo, per trovare prima i tuoi prodotti.", "Optional, um Ihre Produkte schneller zu finden."],
  "ing.catPh": ["Ex. Produits laitiers", "مثال: مشتقات الحليب", "E.g. Dairy", "Ej. Lácteos", "Es. Latticini", "z. B. Milchprodukte"],
  "ing.defaultCats": ["Produits laitiers,Biscuits,Chocolat,Fruits,Décoration,Emballages", "مشتقات الحليب,بسكويت,شوكولاتة,فواكه,تزيين,تغليف", "Dairy,Biscuits,Chocolate,Fruit,Decoration,Packaging", "Lácteos,Galletas,Chocolate,Frutas,Decoración,Envases", "Latticini,Biscotti,Cioccolato,Frutta,Decorazione,Imballaggi", "Milchprodukte,Kekse,Schokolade,Obst,Dekoration,Verpackung"],
  "ing.impact": ["Si vous changez le prix, ces éléments seront recalculés automatiquement : préparations {p}, recettes {r}.", "إذا غيّرت الثمن، ستُعاد حسابات هذه العناصر تلقائيًا: التحضيرات {p}، الوصفات {r}.", "If you change the price, these will be recalculated automatically: preparations {p}, recipes {r}.", "Si cambia el precio, se recalcularán automáticamente: preparaciones {p}, recetas {r}.", "Se cambi il prezzo, verranno ricalcolati automaticamente: preparazioni {p}, ricette {r}.", "Wenn Sie den Preis ändern, wird automatisch neu berechnet: Zubereitungen {p}, Rezepte {r}."],

  // ── Stock ──
  "st.track": ["Suivre le stock de ce produit", "تتبع مخزون هذا المنتج", "Track this product's stock", "Seguir el stock de este producto", "Monitora la scorta di questo prodotto", "Bestand dieses Produkts verfolgen"],
  "st.current": ["Stock actuel", "المخزون الحالي", "Current stock", "Stock actual", "Scorta attuale", "Aktueller Bestand"],
  "st.currentHint": ["Ce qu'il vous reste aujourd'hui. Il diminuera tout seul à chaque production.", "ما تبقى لديك اليوم. سينقص تلقائيًا مع كل إنتاج.", "What you have left today. It goes down by itself with each production.", "Lo que le queda hoy. Bajará solo con cada producción.", "Quello che ti resta oggi. Diminuirà da solo a ogni produzione.", "Was Ihnen heute bleibt. Er sinkt bei jeder Produktion automatisch."],
  "st.min": ["M'alerter en dessous de", "نبّهني تحت", "Alert me below", "Avisarme por debajo de", "Avvisami sotto", "Warnen unter"],
  "st.minHint": ["Facultatif. Le produit sera signalé sur l'accueil.", "اختياري. سيظهر المنتج في الصفحة الرئيسية.", "Optional. The product will be flagged on the home screen.", "Opcional. El producto se señalará en el inicio.", "Facoltativo. Il prodotto sarà segnalato nella home.", "Optional. Das Produkt wird auf der Startseite angezeigt."],
  "st.restock": ["Réapprovisionner", "إعادة التموين", "Restock", "Reponer", "Rifornisci", "Auffüllen"],
  "st.restockQ": ["Quantité reçue", "الكمية المستلمة", "Quantity received", "Cantidad recibida", "Quantità ricevuta", "Erhaltene Menge"],
  "st.added": ["Stock mis à jour", "تم تحديث المخزون", "Stock updated", "Stock actualizado", "Scorta aggiornata", "Bestand aktualisiert"],
  "st.left": ["Reste {q}", "يتبقى {q}", "{q} left", "Quedan {q}", "Restano {q}", "Noch {q}"],
  "st.low": ["Stock bas", "مخزون منخفض", "Low stock", "Stock bajo", "Scorta bassa", "Wenig Bestand"],
  "st.negative": ["Stock dépassé", "تجاوز المخزون", "Stock exceeded", "Stock superado", "Scorta superata", "Bestand überschritten"],
  "st.title": ["Stock à surveiller", "مخزون يحتاج انتباهًا", "Stock to watch", "Stock a vigilar", "Scorte da controllare", "Bestände im Blick"],
  "st.afterProd": ["Production enregistrée, stock mis à jour.", "تم تسجيل الإنتاج وتحديث المخزون.", "Production saved, stock updated.", "Producción guardada, stock actualizado.", "Produzione salvata, scorte aggiornate.", "Produktion gespeichert, Bestand aktualisiert."],
  "st.warnNeg": ["Attention : {n} produit(s) passent en négatif. Vérifiez votre stock réel.", "تنبيه: {n} منتج(ات) أصبحت بالسالب. تحقق من مخزونك الفعلي.", "Careful: {n} product(s) go negative. Check your real stock.", "Atención: {n} producto(s) quedan en negativo. Compruebe su stock real.", "Attenzione: {n} prodotto/i vanno in negativo. Controlla la scorta reale.", "Achtung: {n} Produkt(e) werden negativ. Prüfen Sie Ihren echten Bestand."],
  "st.willUse": ["Cette production consommera :", "سيستهلك هذا الإنتاج:", "This production will use:", "Esta producción consumirá:", "Questa produzione consumerà:", "Diese Produktion verbraucht:"],
  "st.moves": ["Mouvements de stock", "حركات المخزون", "Stock movements", "Movimientos de stock", "Movimenti di scorta", "Bestandsbewegungen"],
  "st.reasonProduction": ["Production", "إنتاج", "Production", "Producción", "Produzione", "Produktion"],
  "st.reasonRestock": ["Réapprovisionnement", "تموين", "Restock", "Reposición", "Rifornimento", "Auffüllung"],
  "st.reasonAdjust": ["Correction", "تصحيح", "Adjustment", "Corrección", "Correzione", "Korrektur"],
  "st.reasonUndo": ["Annulation", "إلغاء", "Cancellation", "Cancelación", "Annullamento", "Stornierung"],
  "st.noTrack": ["Non suivi", "غير متتبع", "Not tracked", "Sin seguimiento", "Non monitorata", "Nicht verfolgt"],

  "ing.history": ["Historique des prix", "سجل الأسعار", "Price history", "Historial de precios", "Storico dei prezzi", "Preisverlauf"],
  "ing.createdAt": ["Créé à {v}", "أُنشئ بسعر {v}", "Created at {v}", "Creado a {v}", "Creato a {v}", "Angelegt zu {v}"],
  "ing.this": ["ce produit", "هذا المنتج", "this product", "este producto", "questo prodotto", "dieses Produkt"],
  "ing.emptyTitle": ["Votre première matière première", "مادتك الأولية الأولى", "Your first ingredient", "Su primera materia prima", "La tua prima materia prima", "Ihre erste Zutat"],
  "ing.emptyText": ["Indiquez un produit que vous achetez, son prix et ce qu'il contient. L'application calcule son coût à la pièce, au gramme ou au millilitre.", "أدخل منتجًا تشتريه وثمنه وما يحتويه. يحسب التطبيق تكلفته للقطعة أو للغرام أو للمليلتر.", "Enter a product you buy, its price and what it contains. The app calculates its cost per piece, per gram or per millilitre.", "Indique un producto que compra, su precio y lo que contiene. La aplicación calcula su coste por pieza, gramo o mililitro.", "Indica un prodotto che acquisti, il suo prezzo e cosa contiene. L'app calcola il costo al pezzo, al grammo o al millilitro.", "Geben Sie ein eingekauftes Produkt, seinen Preis und Inhalt ein. Die App berechnet die Kosten pro Stück, Gramm oder Milliliter."],
  "ing.emptyAction": ["Ajouter un produit", "إضافة منتج", "Add a product", "Añadir un producto", "Aggiungi un prodotto", "Produkt hinzufügen"],
  "ing.search": ["Rechercher un produit", "البحث عن منتج", "Search for a product", "Buscar un producto", "Cerca un prodotto", "Produkt suchen"],
  "ing.added": ["Matière première ajoutée", "تمت إضافة المادة الأولية", "Ingredient added", "Materia prima añadida", "Materia prima aggiunta", "Zutat hinzugefügt"],
  "ing.updated": ["Modifications enregistrées, tout est recalculé", "تم حفظ التعديلات وإعادة الحساب", "Changes saved, everything recalculated", "Cambios guardados, todo recalculado", "Modifiche salvate, tutto ricalcolato", "Änderungen gespeichert, alles neu berechnet"],
  "ing.deleted": ["Produit supprimé", "تم حذف المنتج", "Product deleted", "Producto eliminado", "Prodotto eliminato", "Produkt gelöscht"],
  "ing.packOf": ["{l} de {c}", "{l} ({c})", "{l} of {c}", "{l} de {c}", "{l} da {c}", "{l} mit {c}"],

  // Préparations
  "prep.title": ["Préparations", "التحضيرات", "Preparations", "Preparaciones", "Preparazioni", "Zubereitungen"],
  "prep.subtitle": ["Crèmes, coulis, pâtes : réutilisables dans toutes vos recettes.", "كريمات، صلصات، عجائن: قابلة للاستعمال في كل وصفاتك.", "Creams, coulis, doughs: reusable in all your recipes.", "Cremas, coulis, masas: reutilizables en todas sus recetas.", "Creme, coulis, impasti: riutilizzabili in tutte le tue ricette.", "Cremes, Soßen, Teige: in allen Rezepten wiederverwendbar."],
  "prep.new": ["Nouvelle préparation", "تحضير جديد", "New preparation", "Nueva preparación", "Nuova preparazione", "Neue Zubereitung"],
  "prep.name": ["Nom de la préparation", "اسم التحضير", "Preparation name", "Nombre de la preparación", "Nome della preparazione", "Name der Zubereitung"],
  "prep.namePh": ["Ex. Crème mascarpone", "مثال: كريمة الماسكاربوني", "E.g. Mascarpone cream", "Ej. Crema de mascarpone", "Es. Crema al mascarpone", "z. B. Mascarponecreme"],
  "prep.uses": ["Ce que vous utilisez", "ما تستعمله", "What you use", "Lo que utiliza", "Cosa utilizzi", "Was Sie verwenden"],
  "prep.usesHint": ["Pour une fournée complète, même si elle sert à plusieurs produits de la gamme.", "لكمية كاملة، حتى لو كانت تُستعمل لعدة منتجات من نفس التشكيلة.", "For a full batch, even if it's used for several products in the range.", "Para una tanda completa, aunque sirva para varios productos de la gama.", "Per un'intera infornata, anche se serve a più prodotti della gamma.", "Für eine ganze Charge, auch wenn sie für mehrere Produkte der Reihe dient."],
  "prep.yield": ["Quelle quantité obtenez-vous au final ?", "ما الكمية التي تحصل عليها في النهاية؟", "How much do you get in the end?", "¿Qué cantidad obtiene al final?", "Quanta ne ottieni alla fine?", "Welche Menge erhalten Sie am Ende?"],
  "prep.yieldHint": ["Pesez la préparation terminée, ou indiquez pour combien de produits elle suffit (ex. 140 portions).", "زِن التحضير الجاهز، أو حدّد عدد المنتجات التي يكفيها (مثال: 140 حصة).", "Weigh the finished preparation, or enter how many products it serves (e.g. 140 portions).", "Pese la preparación terminada o indique para cuántos productos alcanza (ej. 140 porciones).", "Pesa la preparazione finita o indica per quanti prodotti basta (es. 140 porzioni).", "Wiegen Sie die fertige Zubereitung oder geben Sie an, für wie viele Produkte sie reicht (z. B. 140 Portionen)."],
  "prep.yieldPh": ["Ex. 10000", "مثال: 10000", "E.g. 10000", "Ej. 10000", "Es. 10000", "z. B. 10000"],
  "prep.cost": ["Coût de la préparation", "تكلفة التحضير", "Preparation cost", "Coste de la preparación", "Costo della preparazione", "Kosten der Zubereitung"],
  "prep.calc": ["Total {t} ÷ {q}", "المجموع {t} ÷ {q}", "Total {t} ÷ {q}", "Total {t} ÷ {q}", "Totale {t} ÷ {q}", "Gesamt {t} ÷ {q}"],
  "prep.sample": [", soit {v} les {s}", "، أي {v} لكل {s}", ", i.e. {v} per {s}", ", es decir {v} por {s}", ", cioè {v} per {s}", ", also {v} pro {s}"],
  "prep.pending": ["Ajoutez les éléments et la quantité obtenue.", "أضف العناصر والكمية المحصلة.", "Add the items and the quantity obtained.", "Añada los elementos y la cantidad obtenida.", "Aggiungi gli elementi e la quantità ottenuta.", "Fügen Sie die Elemente und die erhaltene Menge hinzu."],
  "prep.catPh": ["Ex. Crèmes", "مثال: كريمات", "E.g. Creams", "Ej. Cremas", "Es. Creme", "z. B. Cremes"],
  "prep.defaultCats": ["Crèmes,Coulis,Pâtes,Garnitures", "كريمات,صلصات,عجائن,حشوات", "Creams,Coulis,Doughs,Fillings", "Cremas,Coulis,Masas,Rellenos", "Creme,Coulis,Impasti,Farciture", "Cremes,Soßen,Teige,Füllungen"],
  "prep.usedIn": ["Utilisée dans ces recettes, qui suivent automatiquement ses changements de coût : {list}.", "مستعمل في هذه الوصفات، التي تتبع تغيرات تكلفته تلقائيًا: {list}.", "Used in these recipes, which follow its cost changes automatically: {list}.", "Se usa en estas recetas, que siguen automáticamente sus cambios de coste: {list}.", "Usata in queste ricette, che seguono automaticamente le variazioni di costo: {list}.", "Verwendet in diesen Rezepten, die Kostenänderungen automatisch übernehmen: {list}."],
  "prep.exportSheet": ["Exporter la fiche PDF", "تصدير البطاقة PDF", "Export sheet as PDF", "Exportar la ficha en PDF", "Esporta la scheda in PDF", "Blatt als PDF exportieren"],
  "prep.this": ["cette préparation", "هذا التحضير", "this preparation", "esta preparación", "questa preparazione", "diese Zubereitung"],
  "prep.emptyTitle": ["Aucune préparation", "لا توجد تحضيرات", "No preparations", "Ninguna preparación", "Nessuna preparazione", "Keine Zubereitungen"],
  "prep.emptyText": ["Une préparation, c'est une base faite en grande quantité pour plusieurs produits, comme votre crème. Son coût est calculé à part, puis chaque recette reprend la part qu'elle utilise.", "التحضير هو قاعدة تُصنع بكمية كبيرة لعدة منتجات، مثل الكريمة. تُحسب تكلفته على حدة، ثم تأخذ كل وصفة الحصة التي تستعملها.", "A preparation is a base made in large quantity for several products, like your cream. Its cost is calculated separately, then each recipe takes the share it uses.", "Una preparación es una base hecha en gran cantidad para varios productos, como su crema. Su coste se calcula aparte y cada receta toma la parte que usa.", "Una preparazione è una base fatta in grande quantità per più prodotti, come la tua crema. Il suo costo si calcola a parte, poi ogni ricetta prende la parte che usa.", "Eine Zubereitung ist eine Basis, die in großer Menge für mehrere Produkte hergestellt wird, wie Ihre Creme. Ihre Kosten werden separat berechnet, jedes Rezept übernimmt seinen Anteil."],
  "prep.emptyAction": ["Créer une préparation", "إنشاء تحضير", "Create a preparation", "Crear una preparación", "Crea una preparazione", "Zubereitung anlegen"],
  "prep.search": ["Rechercher une préparation", "البحث عن تحضير", "Search for a preparation", "Buscar una preparación", "Cerca una preparazione", "Zubereitung suchen"],
  "prep.rowSub": ["{t} pour {q}", "{t} مقابل {q}", "{t} for {q}", "{t} por {q}", "{t} per {q}", "{t} für {q}"],
  "prep.created": ["Préparation créée", "تم إنشاء التحضير", "Preparation created", "Preparación creada", "Preparazione creata", "Zubereitung angelegt"],
  "prep.updated": ["Préparation mise à jour", "تم تحديث التحضير", "Preparation updated", "Preparación actualizada", "Preparazione aggiornata", "Zubereitung aktualisiert"],
  "prep.deleted": ["Préparation supprimée", "تم حذف التحضير", "Preparation deleted", "Preparación eliminada", "Preparazione eliminata", "Zubereitung gelöscht"],

  // Éditeur de composition
  "cat.all": ["Toutes", "الكل", "All", "Todas", "Tutte", "Alle"],
  "cat.none": ["Sans catégorie", "بدون فئة", "No category", "Sin categoría", "Senza categoria", "Ohne Kategorie"],
  "cat.reorder": ["Réorganiser", "إعادة الترتيب", "Reorder", "Reorganizar", "Riordina", "Neu anordnen"],
  "cat.done": ["Terminé", "تم", "Done", "Listo", "Fatto", "Fertig"],
  "cat.moveLeft": ["Déplacer avant", "نقل إلى قبل", "Move earlier", "Mover antes", "Sposta prima", "Nach vorne"],
  "cat.moveRight": ["Déplacer après", "نقل إلى بعد", "Move later", "Mover después", "Sposta dopo", "Nach hinten"],
  "cat.hint": ["Touchez une catégorie pour filtrer.", "المس فئة للتصفية.", "Tap a category to filter.", "Toque una categoría para filtrar.", "Tocca una categoria per filtrare.", "Tippen Sie auf eine Kategorie zum Filtern."],
  "pick.title": ["Choisir un élément", "اختر عنصرًا", "Choose an item", "Elegir un elemento", "Scegli un elemento", "Element wählen"],
  "pick.search": ["Rechercher…", "بحث…", "Search…", "Buscar…", "Cerca…", "Suchen…"],
  "pick.empty": ["Aucun élément ne correspond.", "لا يوجد عنصر مطابق.", "No matching item.", "Ningún elemento coincide.", "Nessun elemento corrisponde.", "Kein passendes Element."],
  "pick.change": ["Changer", "تغيير", "Change", "Cambiar", "Cambia", "Ändern"],
  "items.none": ["Aucun élément pour l'instant.", "لا توجد عناصر حاليًا.", "No items yet.", "Todavía no hay elementos.", "Nessun elemento per ora.", "Noch keine Elemente."],
  "items.choose": ["Choisir un élément…", "اختر عنصرًا…", "Choose an item…", "Elegir un elemento…", "Scegli un elemento…", "Element wählen…"],
  "items.groupIng": ["Matières premières", "المواد الأولية", "Ingredients", "Materias primas", "Materie prime", "Zutaten"],
  "items.groupPrep": ["Préparations", "التحضيرات", "Preparations", "Preparaciones", "Preparazioni", "Zubereitungen"],
  "items.fixed": ["Montant forfaitaire (épices, divers…)", "مبلغ ثابت (توابل، متفرقات…)", "Flat amount (spices, sundries…)", "Importe fijo (especias, varios…)", "Importo fisso (spezie, varie…)", "Pauschalbetrag (Gewürze, Diverses…)"],
  "items.labelPh": ["Libellé (ex. épices)", "الوصف (مثال: توابل)", "Label (e.g. spices)", "Concepto (ej. especias)", "Descrizione (es. spezie)", "Bezeichnung (z. B. Gewürze)"],
  "items.amountPh": ["Montant", "المبلغ", "Amount", "Importe", "Importo", "Betrag"],
  "items.qtyPh": ["Quantité", "الكمية", "Quantity", "Cantidad", "Quantità", "Menge"],
  "items.add": ["Ajouter un élément", "إضافة عنصر", "Add an item", "Añadir un elemento", "Aggiungi un elemento", "Element hinzufügen"],
  "items.needIng": ["Ajoutez d'abord vos matières premières pour pouvoir les choisir ici.", "أضف موادك الأولية أولًا لتتمكن من اختيارها هنا.", "Add your ingredients first to be able to pick them here.", "Añada primero sus materias primas para poder elegirlas aquí.", "Aggiungi prima le materie prime per poterle scegliere qui.", "Legen Sie zuerst Ihre Zutaten an, um sie hier auszuwählen."],
  "items.remove": ["Retirer cette ligne", "إزالة هذا السطر", "Remove this line", "Quitar esta línea", "Rimuovi questa riga", "Zeile entfernen"],
  "items.prepTag": ["(préparation)", "(تحضير)", "(preparation)", "(preparación)", "(preparazione)", "(Zubereitung)"],
  "items.element": ["Élément", "العنصر", "Item", "Elemento", "Elemento", "Element"],
  "items.unit": ["Unité", "الوحدة", "Unit", "Unidad", "Unità", "Einheit"],

  // Recettes
  "rec.title": ["Coûts par produit", "تكاليف المنتجات", "Cost per product", "Costes por producto", "Costi per prodotto", "Kosten pro Produkt"],
  "rec.subtitle": ["Vos produits vendus, avec leur coût à la pièce.", "منتجاتك المبيعة، مع تكلفة القطعة.", "The products you sell, with their cost per piece.", "Sus productos a la venta, con su coste por pieza.", "I prodotti che vendi, con il costo al pezzo.", "Ihre Verkaufsprodukte mit Kosten pro Stück."],
  "rec.new": ["Nouvelle recette", "وصفة جديدة", "New recipe", "Nueva receta", "Nuova ricetta", "Neues Rezept"],
  "rec.name": ["Nom du produit vendu", "اسم المنتج المبيع", "Name of the product sold", "Nombre del producto vendido", "Nome del prodotto venduto", "Name des Verkaufsprodukts"],
  "rec.namePh": ["Ex. Tiramisu Cookies", "مثال: تيراميسو كوكيز", "E.g. Tiramisu Cookies", "Ej. Tiramisú Cookies", "Es. Tiramisù Cookies", "z. B. Tiramisu Cookies"],
  "rec.pieces": ["Combien de pièces obtenez-vous avec ces quantités ?", "كم قطعة تحصل عليها بهذه الكميات؟", "How many pieces do you get with these quantities?", "¿Cuántas piezas obtiene con estas cantidades?", "Quanti pezzi ottieni con queste quantità?", "Wie viele Stück erhalten Sie mit diesen Mengen?"],
  "rec.piecesHint": ["Mettez 1 si vous décrivez ce qu'il faut pour une seule pièce.", "ضع 1 إذا كنت تصف ما تحتاجه لقطعة واحدة.", "Enter 1 if you describe what one single piece needs.", "Ponga 1 si describe lo necesario para una sola pieza.", "Metti 1 se descrivi ciò che serve per un solo pezzo.", "Geben Sie 1 ein, wenn Sie ein einzelnes Stück beschreiben."],
  "rec.composition": ["Composition", "المكونات", "Composition", "Composición", "Composizione", "Zusammensetzung"],
  "rec.compositionHint": ["Ajoutez la part de préparation utilisée (ex. 1 portion ou 120 g de crème), puis les autres ingrédients : biscuits, décoration, emballage.", "أضف حصة التحضير المستعملة (مثال: حصة واحدة أو 120 g من الكريمة)، ثم باقي المكونات: بسكويت، تزيين، تغليف.", "Add the share of preparation used (e.g. 1 portion or 120 g of cream), then the other ingredients: biscuits, decoration, packaging.", "Añada la parte de preparación utilizada (ej. 1 porción o 120 g de crema) y luego los demás ingredientes: galletas, decoración, envase.", "Aggiungi la parte di preparazione usata (es. 1 porzione o 120 g di crema), poi gli altri ingredienti: biscotti, decorazione, imballaggio.", "Fügen Sie den verwendeten Anteil der Zubereitung hinzu (z. B. 1 Portion oder 120 g Creme), dann die übrigen Zutaten: Kekse, Dekoration, Verpackung."],
  "rec.costLabel": ["Coût de revient", "تكلفة الإنتاج", "Cost price", "Coste de producción", "Costo di produzione", "Selbstkosten"],
  "rec.batch": ["{t} pour {q}", "{t} مقابل {q}", "{t} for {q}", "{t} por {q}", "{t} per {q}", "{t} für {q}"],
  "rec.onePiece": ["Préparations, ingrédients et emballage d'une pièce", "التحضيرات والمكونات والتغليف لقطعة واحدة", "Preparations, ingredients and packaging for one piece", "Preparaciones, ingredientes y envase de una pieza", "Preparazioni, ingredienti e imballaggio di un pezzo", "Zubereitungen, Zutaten und Verpackung für ein Stück"],
  "rec.pending": ["Ajoutez la composition : le coût d'une pièce s'affichera ici.", "أضف المكونات: ستظهر تكلفة القطعة هنا.", "Add the composition: the cost per piece will appear here.", "Añada la composición: el coste por pieza aparecerá aquí.", "Aggiungi la composizione: il costo al pezzo apparirà qui.", "Fügen Sie die Zusammensetzung hinzu: Die Kosten pro Stück erscheinen hier."],
  "bd.title": ["Détail pour une pièce", "التفصيل لقطعة واحدة", "Breakdown for one piece", "Detalle por pieza", "Dettaglio per un pezzo", "Aufschlüsselung pro Stück"],
  "bd.others": ["+ Autres ingrédients et emballage", "+ مكونات أخرى وتغليف", "+ Other ingredients and packaging", "+ Otros ingredientes y envase", "+ Altri ingredienti e imballaggio", "+ Weitere Zutaten und Verpackung"],
  "bd.total": ["= Coût de revient", "= تكلفة الإنتاج", "= Cost price", "= Coste de producción", "= Costo di produzione", "= Selbstkosten"],
  "rec.priceTitle": ["Prix de vente", "سعر البيع", "Selling price", "Precio de venta", "Prezzo di vendita", "Verkaufspreis"],
  "rec.marginHow": ["Comment voulez-vous calculer la marge ?", "كيف تريد حساب الهامش؟", "How do you want to calculate the margin?", "¿Cómo quiere calcular el margen?", "Come vuoi calcolare il margine?", "Wie möchten Sie die Marge berechnen?"],
  "mode.price": ["Sur le prix de vente", "على سعر البيع", "On selling price", "Sobre el precio de venta", "Sul prezzo di vendita", "Auf den Verkaufspreis"],
  "mode.cost": ["Sur le coût", "على التكلفة", "On cost", "Sobre el coste", "Sul costo", "Auf die Kosten"],
  "rec.marginWanted": ["Marge souhaitée", "الهامش المرغوب", "Target margin", "Margen deseado", "Margine desiderato", "Gewünschte Marge"],
  "rec.marginHintPrice": ["La part du prix de vente qui vous reste après les ingrédients.", "الجزء من سعر البيع الذي يبقى لك بعد المكونات.", "The share of the selling price you keep after ingredients.", "La parte del precio de venta que le queda tras los ingredientes.", "La parte del prezzo di vendita che ti resta dopo gli ingredienti.", "Der Anteil des Verkaufspreises, der nach den Zutaten bleibt."],
  "rec.marginHintCost": ["Ce que vous ajoutez au coût, en pourcentage du coût.", "ما تضيفه إلى التكلفة، كنسبة مئوية منها.", "What you add to the cost, as a percentage of the cost.", "Lo que añade al coste, en porcentaje del coste.", "Ciò che aggiungi al costo, in percentuale del costo.", "Was Sie auf die Kosten aufschlagen, in Prozent der Kosten."],
  "rec.marginPh": ["Ex. 50", "مثال: 50", "E.g. 50", "Ej. 50", "Es. 50", "z. B. 50"],
  "rec.indicative": ["Prix indicatif", "السعر المقترح", "Suggested price", "Precio orientativo", "Prezzo indicativo", "Preisempfehlung"],
  "rec.useThis": ["Utiliser ce prix", "استعمال هذا السعر", "Use this price", "Usar este precio", "Usa questo prezzo", "Diesen Preis übernehmen"],
  "rec.yourPrice": ["Votre prix de vente", "سعر البيع الخاص بك", "Your selling price", "Su precio de venta", "Il tuo prezzo di vendita", "Ihr Verkaufspreis"],
  "rec.yourPriceHint": ["Vous restez libre : saisissez le prix que vous pratiquez vraiment.", "أنت حر: أدخل السعر الذي تبيع به فعلًا.", "It's your call: enter the price you actually charge.", "Usted decide: introduzca el precio que aplica realmente.", "Sei libero: inserisci il prezzo che applichi davvero.", "Sie entscheiden: Geben Sie den Preis ein, den Sie tatsächlich verlangen."],
  "rec.pricePh": ["Ex. 12", "مثال: 12", "E.g. 12", "Ej. 12", "Es. 12", "z. B. 12"],
  "rec.loss": ["À ce prix, vous vendez à perte : {v} par pièce.", "بهذا السعر، تبيع بخسارة: {v} للقطعة.", "At this price you sell at a loss: {v} per piece.", "A este precio vende con pérdidas: {v} por pieza.", "A questo prezzo vendi in perdita: {v} al pezzo.", "Zu diesem Preis verkaufen Sie mit Verlust: {v} pro Stück."],
  "st.margin": ["Marge brute par pièce", "الهامش الإجمالي للقطعة", "Gross margin per piece", "Margen bruto por pieza", "Margine lordo al pezzo", "Rohertrag pro Stück"],
  "st.markup": ["Taux de marque", "نسبة الهامش من السعر", "Margin on price", "Margen sobre precio", "Margine sul prezzo", "Handelsspanne"],
  "st.onPrice": ["sur le prix", "على السعر", "of the price", "sobre el precio", "sul prezzo", "vom Preis"],
  "st.marginRate": ["Taux de marge", "نسبة الهامش من التكلفة", "Markup on cost", "Margen sobre coste", "Ricarico sul costo", "Aufschlag"],
  "st.onCost": ["sur le coût", "على التكلفة", "of the cost", "sobre el coste", "sul costo", "auf die Kosten"],
  "st.coef": ["Coefficient", "المعامل", "Multiplier", "Coeficiente", "Coefficiente", "Kalkulationsfaktor"],
  "st.coefSub": ["prix ÷ coût", "السعر ÷ التكلفة", "price ÷ cost", "precio ÷ coste", "prezzo ÷ costo", "Preis ÷ Kosten"],
  "sim.for": ["Pour", "لـ", "For", "Para", "Per", "Für"],
  "sim.qty": ["Quantité simulée", "الكمية المفترضة", "Simulated quantity", "Cantidad simulada", "Quantità simulata", "Simulierte Menge"],
  "sim.cost": ["Coût", "التكلفة", "Cost", "Coste", "Costo", "Kosten"],
  "sim.revenue": ["Chiffre d'affaires", "رقم المعاملات", "Revenue", "Facturación", "Fatturato", "Umsatz"],
  "sim.margin": ["Marge brute", "الهامش الإجمالي", "Gross margin", "Margen bruto", "Margine lordo", "Rohertrag"],
  "rec.catPh": ["Ex. Tiramisus", "مثال: تيراميسو", "E.g. Tiramisus", "Ej. Tiramisús", "Es. Tiramisù", "z. B. Tiramisu"],
  "rec.defaultCats": ["Tiramisus,Gâteaux,Tartes,Verrines,Cookies", "تيراميسو,حلويات,تارت,كؤوس,كوكيز", "Tiramisus,Cakes,Tarts,Verrines,Cookies", "Tiramisús,Tartas,Tartaletas,Vasitos,Cookies", "Tiramisù,Torte,Crostate,Bicchierini,Cookies", "Tiramisu,Kuchen,Tartes,Gläser,Cookies"],
  "rec.exportSheet": ["Exporter la fiche recette PDF", "تصدير بطاقة الوصفة PDF", "Export recipe sheet as PDF", "Exportar la ficha de receta en PDF", "Esporta la scheda ricetta in PDF", "Rezeptblatt als PDF exportieren"],
  "rec.this": ["cette recette", "هذه الوصفة", "this recipe", "esta receta", "questa ricetta", "dieses Rezept"],
  "rec.emptyTitle": ["Aucune recette", "لا توجد وصفات", "No recipes", "Ninguna receta", "Nessuna ricetta", "Keine Rezepte"],
  "rec.emptyText": ["Composez un produit fini avec vos matières premières et vos préparations : vous obtenez son coût de revient par pièce et un prix de vente conseillé.", "كوّن منتجًا نهائيًا من موادك الأولية وتحضيراتك: تحصل على تكلفة القطعة وسعر بيع مقترح.", "Build a finished product from your ingredients and preparations: you get its cost per piece and a suggested selling price.", "Componga un producto terminado con sus materias primas y preparaciones: obtendrá su coste por pieza y un precio de venta orientativo.", "Componi un prodotto finito con materie prime e preparazioni: ottieni il costo al pezzo e un prezzo di vendita consigliato.", "Stellen Sie ein Endprodukt aus Zutaten und Zubereitungen zusammen: Sie erhalten die Kosten pro Stück und einen empfohlenen Verkaufspreis."],
  "rec.emptyAction": ["Créer une recette", "إنشاء وصفة", "Create a recipe", "Crear una receta", "Crea una ricetta", "Rezept anlegen"],
  "rec.search": ["Rechercher un produit", "البحث عن منتج", "Search for a product", "Buscar un producto", "Cerca un prodotto", "Produkt suchen"],
  "rec.sold": ["Vendu {p}, marge {m}", "يباع بـ {p}، الهامش {m}", "Sold at {p}, margin {m}", "Vendido a {p}, margen {m}", "Venduto a {p}, margine {m}", "Verkauft für {p}, Marge {m}"],
  "rec.noPrice": ["Pas encore de prix de vente", "لا يوجد سعر بيع بعد", "No selling price yet", "Aún sin precio de venta", "Nessun prezzo di vendita", "Noch kein Verkaufspreis"],
  "rec.created": ["Recette créée", "تم إنشاء الوصفة", "Recipe created", "Receta creada", "Ricetta creata", "Rezept angelegt"],
  "rec.updated": ["Recette mise à jour", "تم تحديث الوصفة", "Recipe updated", "Receta actualizada", "Ricetta aggiornata", "Rezept aktualisiert"],
  "rec.deleted": ["Recette supprimée", "تم حذف الوصفة", "Recipe deleted", "Receta eliminada", "Ricetta eliminata", "Rezept gelöscht"],
  "rec.report": ["Rapport PDF", "تقرير PDF", "PDF report", "Informe PDF", "Report PDF", "PDF-Bericht"],

  // Lexique
  "gl.title": ["Comprendre les termes", "فهم المصطلحات", "Understanding the terms", "Entender los términos", "Capire i termini", "Die Begriffe verstehen"],
  "gl.costT": ["Coût de revient", "تكلفة الإنتاج", "Cost price", "Coste de producción", "Costo di produzione", "Selbstkosten"],
  "gl.costD": ["Ce que vous coûtent les ingrédients et l'emballage d'une pièce.", "ما تكلفك المكونات والتغليف لقطعة واحدة.", "What the ingredients and packaging of one piece cost you.", "Lo que le cuestan los ingredientes y el envase de una pieza.", "Quanto ti costano gli ingredienti e l'imballaggio di un pezzo.", "Was Sie Zutaten und Verpackung für ein Stück kosten."],
  "gl.marginT": ["Marge brute", "الهامش الإجمالي", "Gross margin", "Margen bruto", "Margine lordo", "Rohertrag"],
  "gl.marginD": ["Prix de vente moins coût de revient. Elle doit encore payer votre temps, le loyer, l'énergie, les charges et les impôts.", "سعر البيع ناقص تكلفة الإنتاج. يجب أن يغطي بعد ذلك وقتك والكراء والطاقة والتكاليف والضرائب.", "Selling price minus cost price. It still has to pay for your time, rent, energy, overheads and taxes.", "Precio de venta menos coste de producción. Aún debe cubrir su tiempo, el alquiler, la energía, los gastos y los impuestos.", "Prezzo di vendita meno costo di produzione. Deve ancora pagare il tuo tempo, l'affitto, l'energia, le spese e le tasse.", "Verkaufspreis minus Selbstkosten. Davon müssen noch Ihre Zeit, Miete, Energie, Nebenkosten und Steuern bezahlt werden."],
  "gl.rateT": ["Taux de marge", "نسبة الهامش من التكلفة", "Markup on cost", "Margen sobre coste", "Ricarico sul costo", "Aufschlag"],
  "gl.rateD": ["La marge rapportée au coût. 5 de coût vendu 10 : 100 % de taux de marge.", "الهامش مقارنة بالتكلفة. تكلفة 5 وبيع بـ10: نسبة 100 %.", "The margin compared with the cost. Cost 5, sold at 10: 100% markup.", "El margen respecto al coste. Coste 5, vendido a 10: 100 % sobre coste.", "Il margine rispetto al costo. Costo 5, venduto a 10: ricarico del 100%.", "Die Marge im Verhältnis zu den Kosten. Kosten 5, Verkauf 10: 100 % Aufschlag."],
  "gl.markT": ["Taux de marque", "نسبة الهامش من السعر", "Margin on price", "Margen sobre precio", "Margine sul prezzo", "Handelsspanne"],
  "gl.markD": ["La marge rapportée au prix de vente. 5 de coût vendu 10 : 50 % de taux de marque.", "الهامش مقارنة بسعر البيع. تكلفة 5 وبيع بـ10: نسبة 50 %.", "The margin compared with the selling price. Cost 5, sold at 10: 50% margin.", "El margen respecto al precio de venta. Coste 5, vendido a 10: 50 % sobre precio.", "Il margine rispetto al prezzo di vendita. Costo 5, venduto a 10: margine del 50%.", "Die Marge im Verhältnis zum Verkaufspreis. Kosten 5, Verkauf 10: 50 % Handelsspanne."],
  "gl.revT": ["Chiffre d'affaires", "رقم المعاملات", "Revenue", "Facturación", "Fatturato", "Umsatz"],
  "gl.revD": ["Le total encaissé : prix de vente × quantité vendue.", "مجموع المبالغ المحصلة: سعر البيع × الكمية المبيعة.", "The total you take in: selling price × quantity sold.", "El total cobrado: precio de venta × cantidad vendida.", "Il totale incassato: prezzo di vendita × quantità venduta.", "Die gesamten Einnahmen: Verkaufspreis × verkaufte Menge."],
  "gl.profitT": ["Bénéfice", "الربح", "Profit", "Beneficio", "Utile", "Gewinn"],
  "gl.profitD": ["Ce qui reste une fois TOUTES les dépenses payées. L'application calcule une marge brute, pas un bénéfice.", "ما يبقى بعد دفع كل المصاريف. التطبيق يحسب هامشًا إجماليًا وليس ربحًا.", "What's left once ALL expenses are paid. The app calculates a gross margin, not a profit.", "Lo que queda una vez pagados TODOS los gastos. La aplicación calcula un margen bruto, no un beneficio.", "Ciò che resta dopo aver pagato TUTTE le spese. L'app calcola un margine lordo, non un utile.", "Was nach Abzug ALLER Ausgaben bleibt. Die App berechnet einen Rohertrag, keinen Gewinn."],

  // Production
  "prod.title": ["Production", "الإنتاج", "Production", "Producción", "Produzione", "Produktion"],
  "prod.subtitle": ["Combien vous coûte ce que vous fabriquez.", "كم يكلفك ما تصنعه.", "What the things you make cost you.", "Cuánto le cuesta lo que fabrica.", "Quanto ti costa ciò che produci.", "Was Ihre Produktion kostet."],
  "prod.new": ["Nouvelle production", "إنتاج جديد", "New production", "Nueva producción", "Nuova produzione", "Neue Produktion"],
  "prod.of": ["Production du {d}", "إنتاج {d}", "Production of {d}", "Producción del {d}", "Produzione del {d}", "Produktion vom {d}"],
  "prod.date": ["Date", "التاريخ", "Date", "Fecha", "Data", "Datum"],
  "prod.lot": ["N° de lot", "رقم الدفعة", "Batch no.", "N.º de lote", "N. lotto", "Chargennr."],
  "prod.what": ["Ce que vous produisez", "ما تنتجه", "What you produce", "Lo que produce", "Cosa produci", "Was Sie herstellen"],
  "prod.choose": ["Choisir une recette…", "اختر وصفة…", "Choose a recipe…", "Elegir una receta…", "Scegli una ricetta…", "Rezept wählen…"],
  "prod.recipe": ["Recette", "الوصفة", "Recipe", "Receta", "Ricetta", "Rezept"],
  "prod.qty": ["Quantité produite", "الكمية المنتجة", "Quantity produced", "Cantidad producida", "Quantità prodotta", "Produzierte Menge"],
  "prod.addLine": ["Ajouter un produit", "إضافة منتج", "Add a product", "Añadir un producto", "Aggiungi un prodotto", "Produkt hinzufügen"],
  "prod.total": ["Coût total de production", "التكلفة الإجمالية للإنتاج", "Total production cost", "Coste total de producción", "Costo totale di produzione", "Gesamte Produktionskosten"],
  "prod.totalSub": ["{q}, aux prix actuels", "{q}، بالأسعار الحالية", "{q}, at current prices", "{q}, a precios actuales", "{q}, ai prezzi attuali", "{q}, zu aktuellen Preisen"],
  "prod.revenue": ["Chiffre d'affaires potentiel", "رقم المعاملات المحتمل", "Potential revenue", "Facturación potencial", "Fatturato potenziale", "Möglicher Umsatz"],
  "prod.margin": ["Marge brute potentielle", "الهامش الإجمالي المحتمل", "Potential gross margin", "Margen bruto potencial", "Margine lordo potenziale", "Möglicher Rohertrag"],
  "prod.incomplete": ["Certaines recettes n'ont pas de prix de vente : le chiffre d'affaires et la marge ne les comptent pas.", "بعض الوصفات ليس لها سعر بيع: لا تُحتسب في رقم المعاملات والهامش.", "Some recipes have no selling price: revenue and margin don't include them.", "Algunas recetas no tienen precio de venta: la facturación y el margen no las incluyen.", "Alcune ricette non hanno un prezzo di vendita: fatturato e margine non le includono.", "Einige Rezepte haben keinen Verkaufspreis: Umsatz und Rohertrag berücksichtigen sie nicht."],
  "prod.auto": ["Ces montants se recalculent automatiquement quand vos prix d'achat changent.", "تُعاد حساب هذه المبالغ تلقائيًا عند تغير أسعار الشراء.", "These amounts are recalculated automatically when your purchase prices change.", "Estos importes se recalculan automáticamente cuando cambian sus precios de compra.", "Questi importi si ricalcolano automaticamente quando cambiano i prezzi d'acquisto.", "Diese Beträge werden automatisch neu berechnet, wenn sich Ihre Einkaufspreise ändern."],
  "prod.notes": ["Notes", "ملاحظات", "Notes", "Notas", "Note", "Notizen"],
  "prod.this": ["cette production", "هذا الإنتاج", "this production", "esta producción", "questa produzione", "diese Produktion"],
  "prod.needTitle": ["Créez d'abord une recette", "أنشئ وصفة أولًا", "Create a recipe first", "Cree primero una receta", "Crea prima una ricetta", "Legen Sie zuerst ein Rezept an"],
  "prod.needText": ["Une production se calcule à partir du coût par pièce de vos recettes.", "يُحسب الإنتاج انطلاقًا من تكلفة القطعة في وصفاتك.", "A production is calculated from the cost per piece of your recipes.", "Una producción se calcula a partir del coste por pieza de sus recetas.", "Una produzione si calcola dal costo al pezzo delle tue ricette.", "Eine Produktion wird aus den Kosten pro Stück Ihrer Rezepte berechnet."],
  "prod.goRecipes": ["Aller aux coûts", "الذهاب إلى التكاليف", "Go to costs", "Ir a los costes", "Vai ai costi", "Zu den Kosten"],
  "prod.emptyTitle": ["Aucune production", "لا يوجد إنتاج", "No productions", "Ninguna producción", "Nessuna produzione", "Keine Produktionen"],
  "prod.emptyText": ["Indiquez ce que vous fabriquez, par exemple 50 Tiramisu Cookies et 50 Tiramisu Lotus, et obtenez le coût total et la marge potentielle.", "أدخل ما تصنعه، مثلًا 50 تيراميسو كوكيز و50 تيراميسو لوتس، واحصل على التكلفة الإجمالية والهامش المحتمل.", "Enter what you make, for example 50 Tiramisu Cookies and 50 Tiramisu Lotus, and get the total cost and potential margin.", "Indique lo que fabrica, por ejemplo 50 Tiramisú Cookies y 50 Tiramisú Lotus, y obtenga el coste total y el margen potencial.", "Indica cosa produci, ad esempio 50 Tiramisù Cookies e 50 Tiramisù Lotus, e ottieni il costo totale e il margine potenziale.", "Geben Sie ein, was Sie herstellen, z. B. 50 Tiramisu Cookies und 50 Tiramisu Lotus, und erhalten Sie Gesamtkosten und möglichen Rohertrag."],
  "prod.lotRow": [", lot {l}", "، الدفعة {l}", ", batch {l}", ", lote {l}", ", lotto {l}", ", Charge {l}"],
  "prod.rowSub": ["{q}, marge {m}", "{q}، الهامش {m}", "{q}, margin {m}", "{q}, margen {m}", "{q}, margine {m}", "{q}, Rohertrag {m}"],
  "prod.totalShort": ["coût total", "التكلفة الإجمالية", "total cost", "coste total", "costo totale", "Gesamtkosten"],
  "prod.saved": ["Production enregistrée", "تم حفظ الإنتاج", "Production saved", "Producción guardada", "Produzione salvata", "Produktion gespeichert"],
  "prod.deleted": ["Production supprimée", "تم حذف الإنتاج", "Production deleted", "Producción eliminada", "Produzione eliminata", "Produktion gelöscht"],

  // Accueil
  "home.hello": ["Bonjour", "مرحبًا", "Hello", "Hola", "Buongiorno", "Hallo"],
  "home.counts": ["Matières premières : {a}, préparations : {b}, produits : {c}", "المواد الأولية: {a}، التحضيرات: {b}، المنتجات: {c}", "Ingredients: {a}, preparations: {b}, products: {c}", "Materias primas: {a}, preparaciones: {b}, productos: {c}", "Materie prime: {a}, preparazioni: {b}, prodotti: {c}", "Zutaten: {a}, Zubereitungen: {b}, Produkte: {c}"],
  "home.start": ["Pour bien démarrer", "للبدء بشكل جيد", "Getting started", "Para empezar", "Per iniziare", "Erste Schritte"],
  "home.s1t": ["Ajoutez vos matières premières", "أضف موادك الأولية", "Add your ingredients", "Añada sus materias primas", "Aggiungi le materie prime", "Zutaten anlegen"],
  "home.s1x": ["Prix payé et contenu : le coût unitaire est calculé.", "الثمن المدفوع والمحتوى: تُحسب تكلفة الوحدة.", "Price paid and contents: the unit cost is calculated.", "Precio pagado y contenido: se calcula el coste unitario.", "Prezzo pagato e contenuto: il costo unitario viene calcolato.", "Bezahlter Preis und Inhalt: Die Stückkosten werden berechnet."],
  "home.s2t": ["Créez vos préparations", "أنشئ تحضيراتك", "Create your preparations", "Cree sus preparaciones", "Crea le preparazioni", "Zubereitungen anlegen"],
  "home.s2x": ["Crèmes, coulis, pâtes, calculés à part et réutilisables.", "كريمات، صلصات، عجائن، تُحسب على حدة وتُعاد استعمالها.", "Creams, coulis, doughs, calculated separately and reusable.", "Cremas, coulis, masas, calculadas aparte y reutilizables.", "Creme, coulis, impasti, calcolati a parte e riutilizzabili.", "Cremes, Soßen, Teige, separat berechnet und wiederverwendbar."],
  "home.s3t": ["Composez vos recettes", "كوّن وصفاتك", "Build your recipes", "Componga sus recetas", "Componi le ricette", "Rezepte zusammenstellen"],
  "home.s3x": ["Vous obtenez le coût d'une pièce et un prix conseillé.", "تحصل على تكلفة القطعة وسعر مقترح.", "You get the cost per piece and a suggested price.", "Obtiene el coste por pieza y un precio orientativo.", "Ottieni il costo al pezzo e un prezzo consigliato.", "Sie erhalten die Kosten pro Stück und einen Preisvorschlag."],
  "home.s4t": ["Calculez une production", "احسب إنتاجًا", "Calculate a production", "Calcule una producción", "Calcola una produzione", "Produktion berechnen"],
  "home.s4x": ["Coût total et marge pour les quantités fabriquées.", "التكلفة الإجمالية والهامش للكميات المصنوعة.", "Total cost and margin for the quantities made.", "Coste total y margen de las cantidades fabricadas.", "Costo totale e margine per le quantità prodotte.", "Gesamtkosten und Rohertrag für die hergestellten Mengen."],
  "home.products": ["Vos produits", "منتجاتك", "Your products", "Sus productos", "I tuoi prodotti", "Ihre Produkte"],
  "home.productsHint": ["Du plus rentable au moins rentable, selon le taux de marque.", "من الأكثر ربحية إلى الأقل، حسب نسبة الهامش من السعر.", "From most to least profitable, by margin on price.", "Del más al menos rentable, según el margen sobre precio.", "Dal più al meno redditizio, secondo il margine sul prezzo.", "Vom rentabelsten zum am wenigsten rentablen, nach Handelsspanne."],
  "home.toComplete": ["Recette à compléter", "وصفة غير مكتملة", "Recipe incomplete", "Receta por completar", "Ricetta da completare", "Rezept unvollständig"],
  "home.soldRate": ["Vendu {p}, taux de marque {r}", "يباع بـ {p}، نسبة الهامش {r}", "Sold at {p}, margin {r}", "Vendido a {p}, margen {r}", "Venduto a {p}, margine {r}", "Verkauft für {p}, Spanne {r}"],
  "home.noPrice": ["Pas encore de prix", "لا يوجد سعر بعد", "No price yet", "Aún sin precio", "Nessun prezzo", "Noch kein Preis"],
  "home.costPiece": ["coût / pièce", "تكلفة القطعة", "cost / piece", "coste / pieza", "costo / pezzo", "Kosten / Stück"],
  "home.changes": ["Derniers changements de prix", "آخر تغييرات الأسعار", "Latest price changes", "Últimos cambios de precio", "Ultime variazioni di prezzo", "Letzte Preisänderungen"],
  "home.product": ["Produit", "منتج", "Product", "Producto", "Prodotto", "Produkt"],


  // ── Compte, connexion, abonnement ──
  "acc.signIn": ["Se connecter", "تسجيل الدخول", "Sign in", "Iniciar sesión", "Accedi", "Anmelden"],
  "acc.signUp": ["Créer un compte", "إنشاء حساب", "Create an account", "Crear una cuenta", "Crea un account", "Konto erstellen"],
  "acc.signOut": ["Se déconnecter", "تسجيل الخروج", "Sign out", "Cerrar sesión", "Esci", "Abmelden"],
  "acc.email": ["Adresse e-mail", "البريد الإلكتروني", "Email address", "Correo electrónico", "Indirizzo e-mail", "E-Mail-Adresse"],
  "acc.password": ["Mot de passe", "كلمة المرور", "Password", "Contraseña", "Password", "Passwort"],
  "acc.showPwd": ["Afficher le mot de passe", "إظهار كلمة المرور", "Show password", "Mostrar la contraseña", "Mostra la password", "Passwort anzeigen"],
  "acc.hidePwd": ["Masquer le mot de passe", "إخفاء كلمة المرور", "Hide password", "Ocultar la contraseña", "Nascondi la password", "Passwort verbergen"],
  "acc.passwordHint": ["Au moins 8 caractères.", "8 أحرف على الأقل.", "At least 8 characters.", "Al menos 8 caracteres.", "Almeno 8 caratteri.", "Mindestens 8 Zeichen."],
  "acc.forgot": ["Mot de passe oublié ?", "نسيت كلمة المرور؟", "Forgot your password?", "¿Olvidó su contraseña?", "Password dimenticata?", "Passwort vergessen?"],
  "acc.sendReset": ["Recevoir un lien de réinitialisation", "إرسال رابط إعادة التعيين", "Send a reset link", "Enviar enlace de restablecimiento", "Invia link di reimpostazione", "Link zum Zurücksetzen senden"],
  "acc.resetSent": ["Si un compte existe avec cette adresse, un e-mail vient d'être envoyé.", "إذا كان هناك حساب بهذا البريد، فقد تم إرسال رسالة.", "If an account exists for this address, an email has been sent.", "Si existe una cuenta con esa dirección, se ha enviado un correo.", "Se esiste un account con questo indirizzo, è stata inviata un'e-mail.", "Falls ein Konto mit dieser Adresse besteht, wurde eine E-Mail gesendet."],
  "acc.confirmSent": ["Vérifiez votre boîte mail : un lien de confirmation vous attend.", "تحقق من بريدك: في انتظارك رابط تأكيد.", "Check your inbox: a confirmation link is waiting for you.", "Revise su correo: le espera un enlace de confirmación.", "Controlla la tua casella: ti aspetta un link di conferma.", "Prüfen Sie Ihr Postfach: Dort wartet ein Bestätigungslink."],
  "acc.haveAccount": ["J'ai déjà un compte", "لدي حساب بالفعل", "I already have an account", "Ya tengo una cuenta", "Ho già un account", "Ich habe schon ein Konto"],
  "acc.noAccount": ["Je n'ai pas encore de compte", "ليس لدي حساب بعد", "I don't have an account yet", "Todavía no tengo cuenta", "Non ho ancora un account", "Ich habe noch kein Konto"],
  "acc.syncOn": ["Vos données sont enregistrées dans votre compte et vous suivent sur tous vos appareils.", "بياناتك محفوظة في حسابك وتتبعك على كل أجهزتك.", "Your data is saved in your account and follows you on every device.", "Sus datos se guardan en su cuenta y le acompañan en todos sus dispositivos.", "I tuoi dati sono salvati nel tuo account e ti seguono su ogni dispositivo.", "Ihre Daten sind in Ihrem Konto gespeichert und auf allen Geräten verfügbar."],
  "acc.syncOff": ["Vos données sont enregistrées sur cet appareil uniquement. Créez un compte pour les sauvegarder et les retrouver partout.", "بياناتك محفوظة على هذا الجهاز فقط. أنشئ حسابًا لحفظها واستعادتها في كل مكان.", "Your data is saved on this device only. Create an account to back it up and find it anywhere.", "Sus datos se guardan solo en este dispositivo. Cree una cuenta para conservarlos y recuperarlos donde sea.", "I tuoi dati sono salvati solo su questo dispositivo. Crea un account per conservarli e ritrovarli ovunque.", "Ihre Daten liegen nur auf diesem Gerät. Erstellen Sie ein Konto, um sie zu sichern und überall abzurufen."],
  "acc.uploading": ["Transfert de vos données vers votre compte…", "جارٍ نقل بياناتك إلى حسابك…", "Moving your data into your account…", "Transfiriendo sus datos a su cuenta…", "Trasferimento dei dati nel tuo account…", "Ihre Daten werden ins Konto übertragen…"],
  "acc.uploaded": ["Vos données ont été transférées dans votre compte.", "تم نقل بياناتك إلى حسابك.", "Your data has been moved into your account.", "Sus datos se han transferido a su cuenta.", "I tuoi dati sono stati trasferiti nel tuo account.", "Ihre Daten wurden in Ihr Konto übertragen."],
  "acc.deleteTitle": ["Supprimer mon compte", "حذف حسابي", "Delete my account", "Eliminar mi cuenta", "Elimina il mio account", "Mein Konto löschen"],
  "acc.deleteText": ["Votre compte et toutes vos données seront définitivement supprimés. Cette action est irréversible.", "سيتم حذف حسابك وكل بياناتك نهائيًا. لا يمكن التراجع عن هذا الإجراء.", "Your account and all your data will be permanently deleted. This cannot be undone.", "Su cuenta y todos sus datos se eliminarán definitivamente. Esta acción es irreversible.", "Il tuo account e tutti i dati saranno eliminati definitivamente. L'azione è irreversibile.", "Ihr Konto und alle Daten werden endgültig gelöscht. Das lässt sich nicht rückgängig machen."],
  "acc.deleted": ["Compte supprimé.", "تم حذف الحساب.", "Account deleted.", "Cuenta eliminada.", "Account eliminato.", "Konto gelöscht."],
  "acc.signedOut": ["Vous êtes déconnecté.", "تم تسجيل خروجك.", "You are signed out.", "Ha cerrado sesión.", "Hai effettuato la disconnessione.", "Sie sind abgemeldet."],
  "acc.welcomeBack": ["Content de vous revoir !", "سعداء بعودتك!", "Good to see you again!", "¡Nos alegra verle de nuevo!", "Bentornato!", "Schön, Sie wiederzusehen!"],
  "acc.working": ["Un instant…", "لحظة…", "One moment…", "Un momento…", "Un attimo…", "Einen Moment…"],
  // Erreurs
  "auth.badCredentials": ["Adresse e-mail ou mot de passe incorrect.", "البريد الإلكتروني أو كلمة المرور غير صحيحة.", "Incorrect email address or password.", "Correo o contraseña incorrectos.", "E-mail o password non corretti.", "E-Mail-Adresse oder Passwort ist falsch."],
  "auth.emailTaken": ["Un compte existe déjà avec cette adresse.", "يوجد حساب بهذا البريد الإلكتروني.", "An account already exists with this address.", "Ya existe una cuenta con esta dirección.", "Esiste già un account con questo indirizzo.", "Mit dieser Adresse besteht bereits ein Konto."],
  "auth.weakPassword": ["Mot de passe trop court : 8 caractères au minimum.", "كلمة المرور قصيرة جدًا: 8 أحرف على الأقل.", "Password too short: 8 characters minimum.", "Contraseña demasiado corta: mínimo 8 caracteres.", "Password troppo corta: minimo 8 caratteri.", "Passwort zu kurz: mindestens 8 Zeichen."],
  "auth.badEmail": ["Adresse e-mail invalide.", "بريد إلكتروني غير صالح.", "Invalid email address.", "Correo electrónico no válido.", "Indirizzo e-mail non valido.", "Ungültige E-Mail-Adresse."],
  "auth.notConfirmed": ["Confirmez d'abord votre adresse e-mail, le lien est dans votre boîte mail.", "أكّد بريدك الإلكتروني أولًا، الرابط في صندوق بريدك.", "Confirm your email address first, the link is in your inbox.", "Confirme primero su correo electrónico, el enlace está en su bandeja.", "Conferma prima il tuo indirizzo e-mail, il link è nella tua casella.", "Bestätigen Sie zuerst Ihre E-Mail-Adresse, der Link ist in Ihrem Postfach."],
  "auth.tooMany": ["Trop de tentatives. Réessayez dans quelques minutes.", "محاولات كثيرة. أعد المحاولة بعد دقائق.", "Too many attempts. Try again in a few minutes.", "Demasiados intentos. Inténtelo en unos minutos.", "Troppi tentativi. Riprova tra qualche minuto.", "Zu viele Versuche. Versuchen Sie es in einigen Minuten erneut."],
  "auth.expired": ["Votre session a expiré. Reconnectez-vous.", "انتهت الجلسة. أعد تسجيل الدخول.", "Your session has expired. Please sign in again.", "Su sesión ha caducado. Vuelva a iniciar sesión.", "La sessione è scaduta. Accedi di nuovo.", "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an."],
  "auth.generic": ["La connexion a échoué. Réessayez.", "فشل الاتصال. حاول مرة أخرى.", "Sign-in failed. Please try again.", "Error al conectar. Inténtelo de nuevo.", "Accesso non riuscito. Riprova.", "Anmeldung fehlgeschlagen. Bitte erneut versuchen."],
  "net.offline": ["Pas de connexion internet. Vos modifications seront enregistrées dès le retour du réseau.", "لا يوجد اتصال بالإنترنت. ستُحفظ تعديلاتك عند عودة الشبكة.", "No internet connection. Your changes will be saved once you're back online.", "Sin conexión a internet. Sus cambios se guardarán al recuperar la red.", "Nessuna connessione a internet. Le modifiche saranno salvate al ritorno della rete.", "Keine Internetverbindung. Ihre Änderungen werden gespeichert, sobald Sie wieder online sind."],
  "db.generic": ["L'enregistrement a échoué. Réessayez.", "فشل الحفظ. حاول مرة أخرى.", "Saving failed. Please try again.", "No se pudo guardar. Inténtelo de nuevo.", "Salvataggio non riuscito. Riprova.", "Speichern fehlgeschlagen. Bitte erneut versuchen."],
  // Abonnement
  "pw.title": ["Vous avez atteint la limite de la version gratuite", "لقد بلغت حد النسخة المجانية", "You've reached the free plan limit", "Ha alcanzado el límite del plan gratuito", "Hai raggiunto il limite del piano gratuito", "Sie haben das Limit der Gratisversion erreicht"],
  "pw.intro": ["Passez à Mizanerie Premium pour débloquer :", "انتقل إلى Mizanerie Premium لفتح:", "Upgrade to Mizanerie Premium to unlock:", "Cambie a Mizanerie Premium para desbloquear:", "Passa a Mizanerie Premium per sbloccare:", "Wechseln Sie zu Mizanerie Premium und schalten Sie frei:"],
  "pw.f1": ["Matières, préparations et produits illimités", "مواد وتحضيرات ومنتجات بلا حدود", "Unlimited ingredients, preparations and products", "Materias, preparaciones y productos ilimitados", "Materie, preparazioni e prodotti illimitati", "Unbegrenzte Zutaten, Zubereitungen und Produkte"],
  "pw.f2": ["Photo de recette convertie en liste d'ingrédients", "تحويل صورة الوصفة إلى قائمة مكونات", "Recipe photo turned into an ingredient list", "Foto de receta convertida en lista de ingredientes", "Foto della ricetta convertita in lista ingredienti", "Rezeptfoto wird zur Zutatenliste"],
  "pw.f3": ["Fiches PDF et calcul de production", "بطاقات PDF وحساب الإنتاج", "PDF sheets and production costing", "Fichas PDF y cálculo de producción", "Schede PDF e calcolo della produzione", "PDF-Blätter und Produktionsberechnung"],
  "pw.f4": ["Sauvegarde et synchronisation sur tous vos appareils", "نسخ احتياطي ومزامنة على كل أجهزتك", "Backup and sync across all your devices", "Copia de seguridad y sincronización en todos sus dispositivos", "Backup e sincronizzazione su tutti i dispositivi", "Sicherung und Synchronisierung auf allen Geräten"],
  "pw.cta": ["Essayer 3 jours gratuitement", "جرّب 3 أيام مجانًا", "Try 3 days free", "Probar 3 días gratis", "Prova 3 giorni gratis", "3 Tage kostenlos testen"],
  "pw.price": ["5 €/mois ou 49 €/an, sans engagement", "5 €/شهر أو 49 €/سنة، بدون التزام", "€5/month or €49/year, cancel anytime", "5 €/mes o 49 €/año, sin compromiso", "5 €/mese o 49 €/anno, senza vincoli", "5 €/Monat oder 49 €/Jahr, jederzeit kündbar"],
  "pw.later": ["Plus tard", "لاحقًا", "Later", "Más tarde", "Più tardi", "Später"],
  "pw.soon": ["L'abonnement arrive très bientôt. En attendant, créez un compte : vos données seront sauvegardées.", "الاشتراك قادم قريبًا. في الأثناء، أنشئ حسابًا وستُحفظ بياناتك.", "Subscriptions are coming very soon. Meanwhile, create an account so your data is backed up.", "La suscripción llegará muy pronto. Mientras tanto, cree una cuenta y sus datos estarán a salvo.", "L'abbonamento arriverà molto presto. Intanto crea un account: i tuoi dati saranno al sicuro.", "Das Abo kommt sehr bald. Erstellen Sie solange ein Konto, damit Ihre Daten gesichert sind."],
  "pw.plan": ["Formule", "الصيغة", "Plan", "Plan", "Piano", "Tarif"],
  "pw.free": ["Gratuite", "مجانية", "Free", "Gratuita", "Gratuito", "Gratis"],
  "pw.premium": ["Premium", "بريميوم", "Premium", "Premium", "Premium", "Premium"],
  "pw.usage": ["{n} / {cap} utilisés", "{n} / {cap} مستعملة", "{n} / {cap} used", "{n} / {cap} usados", "{n} / {cap} usati", "{n} / {cap} genutzt"],

  // Paramètres
  "set.title": ["Paramètres", "الإعدادات", "Settings", "Ajustes", "Impostazioni", "Einstellungen"],
  "set.business": ["Nom de votre activité", "اسم نشاطك", "Business name", "Nombre de su negocio", "Nome della tua attività", "Name Ihres Betriebs"],
  "set.businessHint": ["Affiché en haut de vos PDF.", "يظهر في أعلى ملفات PDF.", "Shown at the top of your PDFs.", "Aparece en la parte superior de sus PDF.", "Mostrato in alto nei tuoi PDF.", "Erscheint oben in Ihren PDFs."],
  "set.businessPh": ["Ex. Les douceurs de Sara", "مثال: حلويات سارة", "E.g. Sara's Sweets", "Ej. Los dulces de Sara", "Es. I dolci di Sara", "z. B. Saras Süßes"],
  "set.language": ["Langue", "اللغة", "Language", "Idioma", "Lingua", "Sprache"],
  "set.theme": ["Apparence", "المظهر", "Appearance", "Apariencia", "Aspetto", "Erscheinungsbild"],
  "set.themeHint": ["« Automatique » suit le réglage de votre téléphone.", "«تلقائي» يتبع إعداد هاتفك.", "“Automatic” follows your phone's setting.", "«Automático» sigue el ajuste de su teléfono.", "«Automatico» segue l'impostazione del telefono.", "„Automatisch“ folgt der Einstellung Ihres Telefons."],
  "theme.auto": ["Automatique", "تلقائي", "Automatic", "Automático", "Automatico", "Automatisch"],
  "theme.light": ["Clair", "فاتح", "Light", "Claro", "Chiaro", "Hell"],
  "theme.dark": ["Sombre", "داكن", "Dark", "Oscuro", "Scuro", "Dunkel"],
  "set.currency": ["Devise", "العملة", "Currency", "Moneda", "Valuta", "Währung"],
  "set.currencyHint": ["Aucune conversion : tous vos montants sont saisis et calculés dans cette devise.", "بدون تحويل: كل مبالغك تُدخل وتُحسب بهذه العملة.", "No conversion: all your amounts are entered and calculated in this currency.", "Sin conversión: todos sus importes se introducen y calculan en esta moneda.", "Nessuna conversione: tutti gli importi sono inseriti e calcolati in questa valuta.", "Keine Umrechnung: Alle Beträge werden in dieser Währung erfasst und berechnet."],
  "set.priceLabel": ["Vos prix de vente sont…", "أسعار البيع لديك…", "Your selling prices are…", "Sus precios de venta son…", "I tuoi prezzi di vendita sono…", "Ihre Verkaufspreise sind…"],
  "set.priceLabelHint": ["Simple mention affichée à côté des prix. La TVA n'est pas calculée.", "مجرد إشارة بجانب الأسعار. لا تُحسب الضريبة على القيمة المضافة.", "Just a label shown next to prices. VAT is not calculated.", "Solo una indicación junto a los precios. El IVA no se calcula.", "Solo un'indicazione accanto ai prezzi. L'IVA non viene calcolata.", "Nur ein Hinweis neben den Preisen. Die MwSt. wird nicht berechnet."],
  "set.noLabel": ["Sans mention", "بدون إشارة", "No label", "Sin indicación", "Nessuna", "Ohne Hinweis"],
  "set.HT": ["HT", "دون ضريبة", "excl. VAT", "sin IVA", "IVA esclusa", "netto"],
  "set.TTC": ["TTC", "مع الضريبة", "incl. VAT", "IVA incl.", "IVA inclusa", "brutto"],
  "set.defaultMode": ["Calcul de marge par défaut", "طريقة حساب الهامش الافتراضية", "Default margin calculation", "Cálculo de margen por defecto", "Calcolo del margine predefinito", "Standard-Margenberechnung"],
  "set.defaultRate": ["Marge proposée pour les nouvelles recettes", "الهامش المقترح للوصفات الجديدة", "Margin suggested for new recipes", "Margen propuesto para nuevas recetas", "Margine proposto per le nuove ricette", "Vorgeschlagene Marge für neue Rezepte"],
  "set.demoIn": ["Version de démonstration : vos données sont enregistrées dans cet aperçu.", "نسخة تجريبية: بياناتك محفوظة في هذه المعاينة.", "Demo version: your data is saved in this preview.", "Versión de demostración: sus datos se guardan en esta vista previa.", "Versione dimostrativa: i tuoi dati sono salvati in questa anteprima.", "Demoversion: Ihre Daten werden in dieser Vorschau gespeichert."],
  "set.demoOut": ["Version de démonstration ouverte hors de Claude : vos données sont effacées à la fermeture de la page.", "نسخة تجريبية مفتوحة خارج Claude: تُحذف بياناتك عند إغلاق الصفحة.", "Demo version opened outside Claude: your data is cleared when the page closes.", "Versión de demostración abierta fuera de Claude: sus datos se borran al cerrar la página.", "Versione dimostrativa aperta fuori da Claude: i dati vengono cancellati alla chiusura della pagina.", "Demoversion außerhalb von Claude: Ihre Daten werden beim Schließen der Seite gelöscht."],
  "set.demoMore": ["Les comptes personnels, la connexion depuis plusieurs appareils et la récupération du mot de passe arrivent avec la base de données.", "الحسابات الشخصية والدخول من عدة أجهزة واسترجاع كلمة المرور ستأتي مع قاعدة البيانات.", "Personal accounts, multi-device sign-in and password recovery come with the database.", "Las cuentas personales, el acceso desde varios dispositivos y la recuperación de contraseña llegarán con la base de datos.", "Account personali, accesso da più dispositivi e recupero password arriveranno con il database.", "Persönliche Konten, Anmeldung auf mehreren Geräten und Passwort-Wiederherstellung kommen mit der Datenbank."],
  "set.pdfArabic": ["", "تُنشأ ملفات PDF حاليًا بالفرنسية، إلى حين دعم اللغة العربية في المستندات.", "", "", "", ""],
  "set.erase": ["Effacer toutes les données", "حذف كل البيانات", "Erase all data", "Borrar todos los datos", "Cancella tutti i dati", "Alle Daten löschen"],
  "set.eraseBtn": ["Tout effacer", "حذف الكل", "Erase everything", "Borrar todo", "Cancella tutto", "Alles löschen"],
  "set.eraseText": ["Toutes vos matières, préparations, recettes et productions seront supprimées.", "سيتم حذف كل موادك وتحضيراتك ووصفاتك وإنتاجاتك.", "All your ingredients, preparations, recipes and productions will be deleted.", "Se eliminarán todas sus materias primas, preparaciones, recetas y producciones.", "Tutte le materie prime, preparazioni, ricette e produzioni verranno eliminate.", "Alle Zutaten, Zubereitungen, Rezepte und Produktionen werden gelöscht."],
  "set.erased": ["Données effacées", "تم حذف البيانات", "Data erased", "Datos borrados", "Dati cancellati", "Daten gelöscht"],




  // ── Administration ──
  "adm.title": ["Administration", "الإدارة", "Administration", "Administración", "Amministrazione", "Verwaltung"],
  "adm.open": ["Gérer les comptes", "إدارة الحسابات", "Manage accounts", "Gestionar las cuentas", "Gestisci gli account", "Konten verwalten"],
  "adm.subtitle": ["Activer ou retirer l'accès Premium.", "تفعيل أو سحب الوصول بريميوم.", "Grant or remove Premium access.", "Activar o retirar el acceso Premium.", "Attiva o rimuovi l'accesso Premium.", "Premium-Zugang geben oder entziehen."],
  "adm.search": ["Rechercher un compte", "البحث عن حساب", "Search for an account", "Buscar una cuenta", "Cerca un account", "Konto suchen"],
  "adm.count": ["{n} compte(s)", "{n} حسابات", "{n} accounts", "{n} cuentas", "{n} account", "{n} Konten"],
  "adm.premiumCount": ["dont {n} en Premium", "منها {n} بريميوم", "{n} of them Premium", "de las cuales {n} Premium", "di cui {n} Premium", "davon {n} Premium"],
  "adm.since": ["inscrit le {d}", "مسجل في {d}", "joined {d}", "registrado el {d}", "iscritto il {d}", "registriert am {d}"],
  "adm.seen": ["vu le {d}", "آخر دخول {d}", "last seen {d}", "visto el {d}", "visto il {d}", "zuletzt am {d}"],
  "adm.privacy": ["Vous ne voyez ici que les adresses e-mail et les abonnements. Le contenu des comptes reste privé : recettes, matières et prix ne sont accessibles à personne d'autre qu'à leur propriétaire.", "لا ترى هنا سوى عناوين البريد والاشتراكات. محتوى الحسابات يبقى خاصًا: الوصفات والمواد والأسعار لا يصل إليها أحد غير صاحبها.", "You only see email addresses and subscriptions here. Account content stays private: recipes, ingredients and prices are accessible to their owner alone.", "Aquí solo ve las direcciones de correo y las suscripciones. El contenido de las cuentas es privado: recetas, materias y precios solo son accesibles para su propietario.", "Qui vedi solo indirizzi e-mail e abbonamenti. Il contenuto degli account resta privato: ricette, materie e prezzi sono accessibili solo al proprietario.", "Sie sehen hier nur E-Mail-Adressen und Abos. Die Inhalte der Konten bleiben privat: Rezepte, Zutaten und Preise sind nur für ihre Besitzer zugänglich."],
  "adm.until": ["jusqu'au {d}", "حتى {d}", "until {d}", "hasta el {d}", "fino al {d}", "bis {d}"],
  "adm.unlimited": ["illimité", "بلا حدود", "unlimited", "ilimitado", "illimitato", "unbegrenzt"],
  "adm.expired": ["expiré le {d}", "انتهى في {d}", "expired on {d}", "caducado el {d}", "scaduto il {d}", "abgelaufen am {d}"],
  "adm.grant": ["Donner le Premium", "منح بريميوم", "Grant Premium", "Dar Premium", "Concedi Premium", "Premium geben"],
  "adm.revoke": ["Repasser en gratuit", "العودة إلى المجاني", "Back to free", "Volver a gratuito", "Torna a gratuito", "Zurück auf Gratis"],
  "adm.duration": ["Pour combien de temps ?", "لأي مدة؟", "For how long?", "¿Por cuánto tiempo?", "Per quanto tempo?", "Für wie lange?"],
  "adm.d1": ["1 mois", "شهر واحد", "1 month", "1 mes", "1 mese", "1 Monat"],
  "adm.d3": ["3 mois", "3 أشهر", "3 months", "3 meses", "3 mesi", "3 Monate"],
  "adm.d12": ["1 an", "سنة واحدة", "1 year", "1 año", "1 anno", "1 Jahr"],
  "adm.dInf": ["Sans limite", "بلا حد", "No limit", "Sin límite", "Senza limite", "Ohne Limit"],
  "adm.done": ["Compte mis à jour", "تم تحديث الحساب", "Account updated", "Cuenta actualizada", "Account aggiornato", "Konto aktualisiert"],
  "adm.you": ["vous", "أنت", "you", "usted", "tu", "Sie"],
  "adm.admin": ["administrateur", "مدير", "administrator", "administrador", "amministratore", "Administrator"],
  "adm.empty": ["Aucun compte ne correspond.", "لا يوجد حساب مطابق.", "No matching account.", "Ninguna cuenta coincide.", "Nessun account corrisponde.", "Kein passendes Konto."],

  // ── Parcours d'accueil ──
  "ob.next": ["Continuer", "متابعة", "Continue", "Continuar", "Continua", "Weiter"],
  "ob.back": ["Retour", "رجوع", "Back", "Atrás", "Indietro", "Zurück"],
  "ob.skip": ["Passer", "تخطي", "Skip", "Omitir", "Salta", "Überspringen"],

  "ob.tradeQ": ["Quel est votre métier ?", "ما هي مهنتك؟", "What do you do?", "¿A qué se dedica?", "Qual è il tuo mestiere?", "Was machen Sie?"],
  "ob.tradeS": ["Nous adaptons les catégories et les exemples à votre activité.", "نكيّف الفئات والأمثلة حسب نشاطك.", "We tailor the categories and examples to your work.", "Adaptamos las categorías y los ejemplos a su actividad.", "Adattiamo categorie ed esempi alla tua attività.", "Wir passen Kategorien und Beispiele an Ihre Tätigkeit an."],
  "ob.t1": ["Pâtissier", "حلواني", "Pastry chef", "Pastelero", "Pasticciere", "Konditor"],
  "ob.t1s": ["Gâteaux, entremets, desserts", "كعك، حلويات، تحليات", "Cakes, entremets, desserts", "Tartas, postres", "Torte, dolci al cucchiaio", "Torten, Desserts"],
  "ob.t2": ["Boulanger", "خباز", "Baker", "Panadero", "Panettiere", "Bäcker"],
  "ob.t2s": ["Pains, viennoiseries", "خبز، معجنات", "Bread, viennoiserie", "Panes, bollería", "Pane, lievitati", "Brot, Feingebäck"],
  "ob.t3": ["Traiteur", "متعهد حفلات", "Caterer", "Catering", "Catering", "Caterer"],
  "ob.t3s": ["Plats, buffets, événements", "أطباق، بوفيهات، مناسبات", "Dishes, buffets, events", "Platos, bufés, eventos", "Piatti, buffet, eventi", "Gerichte, Buffets, Events"],
  "ob.t4": ["Restauration rapide", "مطاعم سريعة", "Fast food", "Comida rápida", "Fast food", "Schnellgastronomie"],
  "ob.t4s": ["Burgers, snacks, boissons", "برغر، وجبات خفيفة، مشروبات", "Burgers, snacks, drinks", "Hamburguesas, snacks, bebidas", "Burger, snack, bevande", "Burger, Snacks, Getränke"],
  "ob.t5": ["Autre", "أخرى", "Something else", "Otro", "Altro", "Etwas anderes"],
  "ob.t5s": ["Chocolat, glaces, confiserie…", "شوكولاتة، مثلجات، حلويات…", "Chocolate, ice cream, confectionery…", "Chocolate, helados, confitería…", "Cioccolato, gelati, confetteria…", "Schokolade, Eis, Süßwaren…"],

  "ob.placeQ": ["Où travaillez-vous ?", "أين تعمل؟", "Where do you work?", "¿Dónde trabaja?", "Dove lavori?", "Wo arbeiten Sie?"],
  "ob.placeS": ["Pour adapter les conseils à votre réalité.", "لتكييف النصائح مع واقعك.", "So the advice matches your reality.", "Para adaptar los consejos a su realidad.", "Per adattare i consigli alla tua realtà.", "Damit die Hinweise zu Ihrer Situation passen."],
  "ob.p1": ["Depuis chez moi", "من المنزل", "From home", "Desde casa", "Da casa", "Von zu Hause"],
  "ob.p2": ["En boutique", "في محل", "In a shop", "En tienda", "In negozio", "Im Laden"],
  "ob.p3": ["En laboratoire", "في مختبر", "In a production kitchen", "En obrador", "In laboratorio", "In der Produktionsküche"],
  "ob.p4": ["Sur les marchés et événements", "في الأسواق والمناسبات", "Markets and events", "Mercados y eventos", "Mercati ed eventi", "Märkte und Events"],

  "ob.sellQ": ["Vendez-vous déjà ?", "هل تبيع بالفعل؟", "Are you already selling?", "¿Ya vende?", "Vendi già?", "Verkaufen Sie bereits?"],
  "ob.sellS": ["Il n'y a pas de mauvaise réponse.", "لا توجد إجابة خاطئة.", "There's no wrong answer.", "No hay respuesta incorrecta.", "Non c'è una risposta sbagliata.", "Es gibt keine falsche Antwort."],
  "ob.s1": ["Pas encore", "ليس بعد", "Not yet", "Todavía no", "Non ancora", "Noch nicht"],
  "ob.s1s": ["Je prépare mon lancement", "أحضّر لانطلاقتي", "I'm preparing to launch", "Estoy preparando el lanzamiento", "Sto preparando il lancio", "Ich bereite den Start vor"],
  "ob.s2": ["Un peu, autour de moi", "قليلاً، لمن حولي", "A little, to people I know", "Un poco, a mi entorno", "Un po', a chi conosco", "Ein wenig, im Umfeld"],
  "ob.s3": ["Régulièrement", "بانتظام", "Regularly", "Con regularidad", "Regolarmente", "Regelmäßig"],
  "ob.s3s": ["C'est mon activité", "هذا نشاطي", "This is my business", "Es mi actividad", "È la mia attività", "Das ist mein Geschäft"],

  "ob.currencyQ": ["Dans quelle devise travaillez-vous ?", "بأي عملة تعمل؟", "Which currency do you work in?", "¿En qué moneda trabaja?", "In che valuta lavori?", "In welcher Währung arbeiten Sie?"],
  "ob.currencyS": ["Tous vos calculs se feront dans cette devise, sans conversion.", "ستتم كل حساباتك بهذه العملة، دون تحويل.", "All your calculations will use this currency, with no conversion.", "Todos sus cálculos se harán en esta moneda, sin conversión.", "Tutti i calcoli useranno questa valuta, senza conversione.", "Alle Berechnungen erfolgen in dieser Währung, ohne Umrechnung."],

  "ob.nameQ": ["Comment s'appelle votre activité ?", "ما اسم نشاطك؟", "What's your business called?", "¿Cómo se llama su actividad?", "Come si chiama la tua attività?", "Wie heißt Ihr Betrieb?"],
  "ob.nameS": ["Elle apparaîtra en haut de vos fiches PDF. Vous pouvez passer cette étape.", "سيظهر في أعلى بطاقات PDF. يمكنك تخطي هذه الخطوة.", "It will appear at the top of your PDF sheets. You can skip this step.", "Aparecerá en la parte superior de sus fichas PDF. Puede omitir este paso.", "Apparirà in cima alle tue schede PDF. Puoi saltare questo passaggio.", "Er erscheint oben auf Ihren PDF-Blättern. Sie können diesen Schritt überspringen."],

  "ob.marginQ": ["Quelle marge visez-vous ?", "ما الهامش الذي تستهدفه؟", "What margin do you aim for?", "¿Qué margen busca?", "Che margine punti?", "Welche Marge streben Sie an?"],
  "ob.marginS": ["Elle servira à proposer un prix de vente. Vous pourrez la changer à chaque produit.", "سيُستعمل لاقتراح سعر البيع. يمكنك تغييره لكل منتج.", "It will be used to suggest a selling price. You can change it for each product.", "Servirá para proponer un precio de venta. Podrá cambiarlo en cada producto.", "Servirà a proporre un prezzo di vendita. Potrai cambiarlo per ogni prodotto.", "Damit schlagen wir einen Verkaufspreis vor. Pro Produkt änderbar."],
  "ob.m1": ["30 %", "30 %", "30%", "30 %", "30%", "30 %"],
  "ob.m1s": ["Prudente", "متحفظ", "Cautious", "Prudente", "Prudente", "Vorsichtig"],
  "ob.m2": ["50 %", "50 %", "50%", "50 %", "50%", "50 %"],
  "ob.m2s": ["Le plus courant", "الأكثر شيوعًا", "The most common", "Lo más habitual", "Il più comune", "Am häufigsten"],
  "ob.m3": ["65 %", "65 %", "65%", "65 %", "65%", "65 %"],
  "ob.m3s": ["Ambitieux", "طموح", "Ambitious", "Ambicioso", "Ambizioso", "Ehrgeizig"],
  "ob.m4": ["Je ne sais pas encore", "لا أعرف بعد", "I don't know yet", "Todavía no lo sé", "Non lo so ancora", "Weiß ich noch nicht"],
  "ob.m4s": ["Nous partirons sur 50 %", "سننطلق من 50 %", "We'll start at 50%", "Empezaremos con el 50 %", "Partiamo dal 50%", "Wir starten mit 50 %"],

  "ob.readyT": ["Votre espace est prêt", "مساحتك جاهزة", "Your workspace is ready", "Su espacio está listo", "Il tuo spazio è pronto", "Ihr Bereich ist bereit"],
  "ob.readyS": ["Voici comment Mizanerie est configuré. Tout reste modifiable dans les réglages.", "هكذا تم إعداد Mizanerie. كل شيء قابل للتعديل في الإعدادات.", "Here's how Mizanerie is set up. Everything can be changed in settings.", "Así queda configurado Mizanerie. Todo se puede cambiar en los ajustes.", "Ecco come è configurato Mizanerie. Tutto è modificabile nelle impostazioni.", "So ist Mizanerie eingerichtet. Alles lässt sich in den Einstellungen ändern."],
  "ob.recapTrade": ["Métier", "المهنة", "Trade", "Oficio", "Mestiere", "Tätigkeit"],
  "ob.recapPlace": ["Lieu de travail", "مكان العمل", "Workplace", "Lugar de trabajo", "Luogo di lavoro", "Arbeitsort"],
  "ob.recapCurrency": ["Devise", "العملة", "Currency", "Moneda", "Valuta", "Währung"],
  "ob.recapMargin": ["Marge visée", "الهامش المستهدف", "Target margin", "Margen objetivo", "Margine obiettivo", "Zielmarge"],
  "ob.start": ["C'est parti", "لننطلق", "Let's go", "¡Vamos!", "Iniziamo", "Los geht's"],
  "ob.firstStep": ["Première étape : ajoutez une matière première et découvrez son coût à l'unité.", "الخطوة الأولى: أضف مادة أولية واكتشف تكلفة الوحدة.", "First step: add an ingredient and discover its cost per unit.", "Primer paso: añada una materia prima y descubra su coste unitario.", "Primo passo: aggiungi una materia prima e scopri il costo unitario.", "Erster Schritt: Zutat anlegen und die Stückkosten sehen."],

  // ── Écran d'entrée ──
  "gate.tagline": ["Calculez, maîtrisez, commercez", "احسب، تحكّم، تاجر", "Calculate, control, sell", "Calcule, controle, venda", "Calcola, controlla, vendi", "Rechnen, steuern, verkaufen"],
  "gate.pitch": ["Le coût de revient d'une pièce, le prix de vente conseillé et votre marge. En quelques minutes.", "تكلفة القطعة الواحدة، وسعر البيع المقترح، وهامشك. في دقائق.", "The cost of one piece, a suggested selling price and your margin. In minutes.", "El coste de una pieza, el precio de venta orientativo y su margen. En minutos.", "Il costo di un pezzo, il prezzo consigliato e il tuo margine. In pochi minuti.", "Die Kosten pro Stück, ein empfohlener Verkaufspreis und Ihre Marge. In wenigen Minuten."],
  "gate.guest": ["Continuer sans compte", "المتابعة بدون حساب", "Continue without an account", "Continuar sin cuenta", "Continua senza account", "Ohne Konto fortfahren"],
  "gate.guestHint": ["Vos données restent sur cet appareil. Version gratuite : {a} matières, {b} préparation, {c} produit.", "تبقى بياناتك على هذا الجهاز. النسخة المجانية: {a} مواد، {b} تحضير، {c} منتج.", "Your data stays on this device. Free plan: {a} ingredients, {b} preparation, {c} product.", "Sus datos permanecen en este dispositivo. Plan gratuito: {a} materias, {b} preparación, {c} producto.", "I tuoi dati restano su questo dispositivo. Piano gratuito: {a} materie, {b} preparazione, {c} prodotto.", "Ihre Daten bleiben auf diesem Gerät. Gratisversion: {a} Zutaten, {b} Zubereitung, {c} Produkt."],
  "gate.stay": ["Rester connecté sur cet appareil", "البقاء متصلًا على هذا الجهاز", "Stay signed in on this device", "Mantener la sesión en este dispositivo", "Resta connesso su questo dispositivo", "Auf diesem Gerät angemeldet bleiben"],
  "gate.stayHint": ["Décochez sur un téléphone partagé.", "ألغِ التحديد على هاتف مشترك.", "Uncheck on a shared phone.", "Desmárquelo en un teléfono compartido.", "Deseleziona su un telefono condiviso.", "Auf einem geteilten Telefon abwählen."],
  "gate.setup": ["Quelques réglages pour commencer", "بعض الإعدادات للبدء", "A few settings to get started", "Unos ajustes para empezar", "Qualche impostazione per iniziare", "Ein paar Einstellungen zum Start"],

  // Bienvenue
  "w.title": ["Sachez ce que vous coûte chaque pièce", "اعرف تكلفة كل قطعة", "Know what each piece costs you", "Sepa lo que le cuesta cada pieza", "Scopri quanto ti costa ogni pezzo", "Wissen, was jedes Stück kostet"],
  "w.text": ["Vous indiquez vos prix d'achat et vos recettes. L'application calcule le coût de revient d'une pièce, le prix de vente conseillé et votre marge.", "تُدخل أسعار الشراء ووصفاتك، ويحسب التطبيق تكلفة القطعة وسعر البيع المقترح والهامش.", "You enter your purchase prices and recipes. The app calculates the cost per piece, a suggested selling price and your margin.", "Usted indica sus precios de compra y sus recetas. La aplicación calcula el coste por pieza, el precio de venta orientativo y su margen.", "Inserisci i prezzi d'acquisto e le ricette. L'app calcola il costo al pezzo, il prezzo di vendita consigliato e il margine.", "Sie geben Einkaufspreise und Rezepte ein. Die App berechnet die Kosten pro Stück, einen Verkaufspreis und Ihre Marge."],
  "w.businessHint": ["Facultatif, vous pourrez le changer plus tard.", "اختياري، يمكنك تغييره لاحقًا.", "Optional, you can change it later.", "Opcional, podrá cambiarlo más tarde.", "Facoltativo, potrai cambiarlo in seguito.", "Optional, später änderbar."],
  "w.currency": ["Dans quelle devise travaillez-vous ?", "بأي عملة تعمل؟", "Which currency do you work in?", "¿En qué moneda trabaja?", "In che valuta lavori?", "In welcher Währung arbeiten Sie?"],
  "w.start": ["Commencer", "ابدأ", "Get started", "Empezar", "Inizia", "Loslegen"],

  // PDF
  "pdf.issued": ["Édité le {d}", "", "Issued on {d}", "Emitido el {d}", "Emesso il {d}", "Erstellt am {d}"],
  "pdf.recipe1": ["Fiche recette, décrite pour 1 pièce", "", "Recipe sheet, described for 1 piece", "Ficha de receta, descrita para 1 pieza", "Scheda ricetta, descritta per 1 pezzo", "Rezeptblatt, beschrieben für 1 Stück"],
  "pdf.recipeN": ["Fiche recette, quantités pour {q}", "", "Recipe sheet, quantities for {q}", "Ficha de receta, cantidades para {q}", "Scheda ricetta, quantità per {q}", "Rezeptblatt, Mengen für {q}"],
  "pdf.flat": ["forfait", "", "flat", "fijo", "fisso", "pauschal"],
  "pdf.batch": ["Coût du lot ({q})", "", "Batch cost ({q})", "Coste del lote ({q})", "Costo del lotto ({q})", "Chargenkosten ({q})"],
  "pdf.perPiece": ["Coût de revient d'une pièce", "", "Cost price per piece", "Coste de producción por pieza", "Costo di produzione al pezzo", "Selbstkosten pro Stück"],
  "pdf.indicative": ["Prix indicatif (marge {r} {m})", "", "Suggested price ({r} margin {m})", "Precio orientativo (margen {r} {m})", "Prezzo indicativo (margine {r} {m})", "Preisempfehlung (Marge {r} {m})"],
  "pdf.retained": ["Prix de vente retenu", "", "Selling price", "Precio de venta aplicado", "Prezzo di vendita applicato", "Gewählter Verkaufspreis"],
  "pdf.bdPrep": ["{n} (préparation), par pièce", "", "{n} (preparation), per piece", "{n} (preparación), por pieza", "{n} (preparazione), al pezzo", "{n} (Zubereitung), pro Stück"],
  "pdf.bdOthers": ["Autres ingrédients et emballage, par pièce", "", "Other ingredients and packaging, per piece", "Otros ingredientes y envase, por pieza", "Altri ingredienti e imballaggio, al pezzo", "Weitere Zutaten und Verpackung, pro Stück"],
  "pdf.prepSub": ["Préparation, rendement {q}", "", "Preparation, yield {q}", "Preparación, rendimiento {q}", "Preparazione, resa {q}", "Zubereitung, Ausbeute {q}"],
  "pdf.totalCost": ["Coût total", "", "Total cost", "Coste total", "Costo totale", "Gesamtkosten"],
  "pdf.costPer": ["Coût par {u}", "", "Cost per {u}", "Coste por {u}", "Costo per {u}", "Kosten pro {u}"],
  "pdf.ingSub": ["Produits : {n}, prix actuels", "", "Products: {n}, current prices", "Productos: {n}, precios actuales", "Prodotti: {n}, prezzi attuali", "Produkte: {n}, aktuelle Preise"],
  "pdf.packaging": ["Conditionnement", "", "Pack size", "Formato", "Confezione", "Gebinde"],
  "pdf.paid": ["Prix payé", "", "Price paid", "Precio pagado", "Prezzo pagato", "Bezahlter Preis"],
  "pdf.prepsSub": ["Préparations : {n}, coûts actuels", "", "Preparations: {n}, current costs", "Preparaciones: {n}, costes actuales", "Preparazioni: {n}, costi attuali", "Zubereitungen: {n}, aktuelle Kosten"],
  "pdf.yield": ["Rendement", "", "Yield", "Rendimiento", "Resa", "Ausbeute"],
  "pdf.reportTitle": ["Rapport des coûts", "", "Cost report", "Informe de costes", "Report dei costi", "Kostenbericht"],
  "pdf.reportSub": ["Coût de revient, prix et marge brute de chaque produit", "", "Cost price, price and gross margin of each product", "Coste, precio y margen bruto de cada producto", "Costo, prezzo e margine lordo di ogni prodotto", "Selbstkosten, Preis und Rohertrag je Produkt"],
  "pdf.price": ["Prix", "", "Price", "Precio", "Prezzo", "Preis"],
  "pdf.marginPiece": ["Marge / pièce", "", "Margin / piece", "Margen / pieza", "Margine / pezzo", "Marge / Stück"],
  "pdf.costPiece": ["Coût / pièce", "", "Cost / piece", "Coste / pieza", "Costo / pezzo", "Kosten / Stück"],
  "pdf.prodLot": ["Lot {l}", "", "Batch {l}", "Lote {l}", "Lotto {l}", "Charge {l}"],
  "pdf.prodSub": ["Coûts recalculés aux prix actuels", "", "Costs recalculated at current prices", "Costes recalculados a precios actuales", "Costi ricalcolati ai prezzi attuali", "Kosten zu aktuellen Preisen berechnet"],
  "pdf.revenue": ["CA potentiel", "", "Potential revenue", "Facturación pot.", "Fatturato pot.", "Mögl. Umsatz"],
  "pdf.noPrice": ["sans prix", "", "no price", "sin precio", "senza prezzo", "ohne Preis"],
  "pdf.totalQty": ["Quantité totale", "", "Total quantity", "Cantidad total", "Quantità totale", "Gesamtmenge"],
  "pdf.notes": ["Notes : {n}", "", "Notes: {n}", "Notas: {n}", "Note: {n}", "Notizen: {n}"],
  "pdf.footer": ["Document généré par Mizanerie. Marges brutes : hors charges fixes, main-d'œuvre et impôts.", "", "Generated by Mizanerie. Gross margins: excluding overheads, labour and taxes.", "Generado por Mizanerie. Márgenes brutos: sin gastos fijos, mano de obra ni impuestos.", "Generato da Mizanerie. Margini lordi: esclusi costi fissi, manodopera e tasse.", "Erstellt mit Mizanerie. Roherträge: ohne Fixkosten, Arbeitszeit und Steuern."],
  "pdf.page": ["Page {i} / {n}", "", "Page {i} / {n}", "Página {i} / {n}", "Pagina {i} / {n}", "Seite {i} / {n}"],
  "pdf.incomplete": ["incomplet", "", "incomplete", "incompleto", "incompleto", "unvollständig"],
};

function t(key, vars, lang = LANG) {
  const row = TR[key];
  if (!row) return key;
  let s = row[LANGS.indexOf(lang)];
  if (!s) s = row[0];
  return vars ? s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : "")) : s;
}
const tList = (key, lang = LANG) => t(key, null, lang).split(",").map((x) => x.trim()).filter(Boolean);

import * as Cloud from "./cloud.js";

/* ════════════════════════════════════════════════════════════════════════
   1. ARITHMÉTIQUE EXACTE (fractions BigInt) — aucune erreur d'arrondi
   ════════════════════════════════════════════════════════════════════════ */
function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a || 1n; }
function numToString(v) {
  if (!Number.isFinite(v)) throw new Error("NaN");
  const s = String(v);
  return /e/i.test(s) ? v.toFixed(20).replace(/0+$/, "").replace(/\.$/, "") : s;
}
class Dec {
  constructor(n, d) {
    if (d === 0n) throw new Error("Division par zéro");
    if (d < 0n) { n = -n; d = -d; }
    const g = gcd(n < 0n ? -n : n, d);
    this.n = n / g; this.d = d / g;
  }
  static of(v) {
    if (v instanceof Dec) return v;
    if (typeof v === "bigint") return new Dec(v, 1n);
    if (v === null || v === undefined) throw new Error("NaN");
    let s = typeof v === "number" ? numToString(v) : String(v).trim().replace(",", ".").replace(/\s/g, "");
    if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) throw new Error("NaN");
    const neg = s.startsWith("-"); s = s.replace(/^[-+]/, "");
    const [i, f = ""] = s.split(".");
    return new Dec(BigInt((i || "0") + f) * (neg ? -1n : 1n), 10n ** BigInt(f.length));
  }
  add(o) { const b = Dec.of(o); return new Dec(this.n * b.d + b.n * this.d, this.d * b.d); }
  sub(o) { const b = Dec.of(o); return new Dec(this.n * b.d - b.n * this.d, this.d * b.d); }
  mul(o) { const b = Dec.of(o); return new Dec(this.n * b.n, this.d * b.d); }
  div(o) { const b = Dec.of(o); if (b.n === 0n) throw new Error("Division par zéro"); return new Dec(this.n * b.d, this.d * b.n); }
  cmp(o) { const b = Dec.of(o); const x = this.n * b.d - b.n * this.d; return x === 0n ? 0 : x > 0n ? 1 : -1; }
  eq(o) { return this.cmp(o) === 0; }
  isZero() { return this.n === 0n; }
  isNeg() { return this.n < 0n; }
  isPos() { return this.n > 0n; }
  toFixed(digits) {
    const scale = 10n ** BigInt(digits);
    const abs = this.n < 0n ? -this.n : this.n;
    let q = (abs * scale) / this.d;
    if (((abs * scale) % this.d) * 2n >= this.d) q += 1n;
    const sign = this.n < 0n && q !== 0n ? "-" : "";
    const str = q.toString().padStart(digits + 1, "0");
    return digits === 0 ? sign + str : `${sign}${str.slice(0, -digits)}.${str.slice(-digits)}`;
  }
  toString() { return this.toFixed(6); }
}
Dec.ZERO = new Dec(0n, 1n);
Dec.ONE = new Dec(1n, 1n);
const D = (v) => Dec.of(v);
const sum = (arr) => arr.reduce((a, b) => a.add(b), Dec.ZERO);
function tryDec(v) { if (v === "" || v === null || v === undefined) return null; try { return Dec.of(v); } catch { return null; } }

/* ════════════════════════════════════════════════════════════════════════
   2. UNITÉS (libellés traduits)
   ════════════════════════════════════════════════════════════════════════ */
const UNITS = {
  piece: { dim: "piece", factor: D(1) }, g: { dim: "masse", factor: D(1) }, kg: { dim: "masse", factor: D(1000) },
  mg: { dim: "masse", factor: D("0.001") }, ml: { dim: "volume", factor: D(1) }, cl: { dim: "volume", factor: D(10) },
  l: { dim: "volume", factor: D(1000) }, portion: { dim: "portion", factor: D(1) },
};
const UNIT_WORDS = {
  piece: [["pièce", "pièces"], ["قطعة", "قطع"], ["piece", "pieces"], ["pieza", "piezas"], ["pezzo", "pezzi"], ["Stück", "Stück"]],
  portion: [["portion", "portions"], ["حصة", "حصص"], ["portion", "portions"], ["porción", "porciones"], ["porzione", "porzioni"], ["Portion", "Portionen"]],
};
const UNIT_ABBR = { g: "g", kg: "kg", mg: "mg", ml: "ml", cl: "cl", l: "L" };
const uLabel = (u, plural = false, lang = LANG) => (UNIT_WORDS[u] ? UNIT_WORDS[u][LANGS.indexOf(lang)][plural ? 1 : 0] : UNIT_ABBR[u]);
const BASE_UNIT = { masse: "g", volume: "ml", piece: "piece", portion: "portion" };
const INGREDIENT_UNITS = ["piece", "g", "kg", "mg", "ml", "l", "cl"];
const YIELD_UNITS = ["g", "kg", "ml", "l", "portion"];
const dimOf = (u) => UNITS[u].dim;
const compatible = (a, b) => dimOf(a) === dimOf(b);
const compatibleUnits = (u) => Object.keys(UNITS).filter((x) => compatible(x, u));
const toBase = (qty, unit) => qty.mul(UNITS[unit].factor);

/* ════════════════════════════════════════════════════════════════════════
   3. MOTEUR DE CALCUL — rien n'est stocké, tout est recalculé à la lecture
   ════════════════════════════════════════════════════════════════════════ */
class CalcError extends Error { constructor(code, msg) { super(msg); this.code = code; } }
function positive(v, code, msg) { const d = tryDec(v); if (!d || !d.isPos()) throw new CalcError(code, msg); return d; }
function nonNegative(v, code, msg) { const d = tryDec(v); if (!d || d.isNeg()) throw new CalcError(code, msg); return d; }

function ingredientUnitCost(ing) {
  const n = ing.name || t("err.thisProduct");
  const price = nonNegative(ing.price, "PRIX", t("err.price", { n }));
  const packs = positive(ing.packCount || 1, "QTE", t("err.packs", { n }));
  const qty = positive(ing.qtyPerPack, "QTE", t("err.content", { n }));
  const totalBase = toBase(packs.mul(qty), ing.unit);
  const dim = dimOf(ing.unit);
  return { perBase: price.div(totalBase), baseUnit: BASE_UNIT[dim], dim, totalBase, price };
}

class CostEngine {
  constructor(data) {
    this.ing = new Map(data.ingredients.map((i) => [i.id, i]));
    this.prep = new Map(data.preparations.map((p) => [p.id, p]));
    this.rec = new Map(data.recipes.map((r) => [r.id, r]));
    this.cache = new Map();
  }
  ingredient(id) {
    const ing = this.ing.get(id);
    if (!ing) throw new CalcError("REF", t("err.ingDeleted"));
    return ingredientUnitCost(ing);
  }
  preparation(id, stack = []) {
    if (this.cache.has(id)) return this.cache.get(id);
    const p = this.prep.get(id);
    if (!p) throw new CalcError("REF", t("err.prepDeleted"));
    if (stack.includes(id)) throw new CalcError("BOUCLE", t("err.loop", { n: p.name }));
    const y = positive(p.yieldQty, "RENDEMENT", t("err.prepYield", { n: p.name || t("err.thisPrep") }));
    const lines = p.items.map((it) => ({ item: it, ...this.lineCost(it, [...stack, id]) }));
    const total = sum(lines.map((l) => l.cost));
    const dim = dimOf(p.yieldUnit);
    const r = { total, lines, perBase: total.div(toBase(y, p.yieldUnit)), baseUnit: BASE_UNIT[dim], dim };
    this.cache.set(id, r);
    return r;
  }
  recipe(id) {
    const r = this.rec.get(id);
    if (!r) throw new CalcError("REF", t("err.recipeNotFound"));
    return this.recipeOf(r);
  }
  recipeOf(r) {
    const pieces = positive(r.yieldPieces, "RENDEMENT", t("err.pieces"));
    if (!r.items.length) throw new CalcError("VIDE", t("err.noItems"));
    const lines = r.items.map((it) => ({ item: it, ...this.lineCost(it, []) }));
    const batchTotal = sum(lines.map((l) => l.cost));
    return { batchTotal, perPiece: batchTotal.div(pieces), lines, pieces };
  }
  lineCost(item, stack = []) {
    if (item.kind === "fixed") {
      const amount = nonNegative(item.amount, "PRIX", t("err.fixedAmount"));
      return { name: item.label || t("err.flat"), cost: amount };
    }
    if (!item.refId || !item.unit) throw new CalcError("LIGNE", t("err.chooseItem"));
    const uc = item.kind === "ingredient" ? this.ingredient(item.refId) : this.preparation(item.refId, stack);
    const name = (item.kind === "ingredient" ? this.ing : this.prep).get(item.refId).name;
    const qty = positive(item.qty, "QTE", t("err.lineQty", { n: name }));
    if (!compatible(item.unit, uc.baseUnit)) {
      throw new CalcError("UNITE", t("err.unit", { n: name, a: uLabel(uc.baseUnit, true), b: uLabel(item.unit, true) }));
    }
    return { name, cost: toBase(qty, item.unit).mul(uc.perBase) };
  }

  /**
   * Ce qu'une recette consomme réellement en matières premières, pour une pièce.
   * On remonte toute la chaîne : produit → préparations → matières.
   * Résultat : une carte { id de la matière → quantité en unité de base }.
   */
  consumption(recipe, pieces = 1) {
    const out = new Map();
    const add = (id, q) => out.set(id, (out.get(id) || Dec.ZERO).add(q));
    const walk = (items, factor, stack) => {
      for (const it of items) {
        if (it.kind === "fixed") continue;
        if (!it.refId || !it.unit) continue;
        const qty = tryDec(it.qty);
        if (!qty || !qty.isPos()) continue;
        const base = toBase(qty, it.unit).mul(factor);
        if (it.kind === "ingredient") { add(it.refId, base); continue; }
        const prep = this.prep.get(it.refId);
        if (!prep || stack.includes(prep.id)) continue;
        const y = tryDec(prep.yieldQty);
        if (!y || !y.isPos()) continue;
        // part de la fournée utilisée : quantité prise ÷ rendement total
        walk(prep.items, base.div(toBase(y, prep.yieldUnit)), [...stack, prep.id]);
      }
    };
    const per = tryDec(recipe.yieldPieces);
    if (!per || !per.isPos()) return out;
    walk(recipe.items, D(pieces).div(per), []);
    return out;
  }

  /** Consommation cumulée d'une production entière. */
  productionConsumption(recipes, lines) {
    const byId = new Map(recipes.map((r) => [r.id, r]));
    const out = new Map();
    for (const l of lines) {
      const r = byId.get(l.recipeId);
      const q = tryDec(l.quantity);
      if (!r || !q || !q.isPos()) continue;
      for (const [id, v] of this.consumption(r, q)) out.set(id, (out.get(id) || Dec.ZERO).add(v));
    }
    return out;
  }

  dependentsOf(kind, id) {
    const preps = new Set(); const queue = [[kind, id]];
    while (queue.length) {
      const [k, ref] = queue.shift();
      for (const p of this.prep.values()) {
        if (!preps.has(p.id) && p.items.some((i) => i.kind === k && i.refId === ref)) { preps.add(p.id); queue.push(["preparation", p.id]); }
      }
    }
    const recipes = [...this.rec.values()].filter((r) =>
      r.items.some((i) => (i.kind === kind && i.refId === id) || (i.kind === "preparation" && preps.has(i.refId))));
    return { preparations: [...preps].map((x) => this.prep.get(x)), recipes };
  }
  safe(fn) { try { return { ok: true, value: fn() }; } catch (e) { return { ok: false, error: e.message }; } }
}

/** coût 5, 50 % : "prix_vente" → 10 ; "cout" → 7,50 */
function suggestedPrice(cost, rate, mode) {
  const c = D(cost); const r = tryDec(rate);
  if (!r || r.isNeg()) return null;
  if (mode === "prix_vente") return r.cmp(1) >= 0 ? null : c.div(Dec.ONE.sub(r));
  return c.mul(Dec.ONE.add(r));
}
function analyzeMargin(cost, price) {
  const c = D(cost); const p = D(price); const m = p.sub(c);
  return { unitMargin: m, onCost: c.isZero() ? null : m.div(c), onPrice: p.isZero() ? null : m.div(p), coef: c.isZero() ? null : p.div(c) };
}
function effectivePrice(r, perPiece) {
  const sp = tryDec(r.sellingPrice);
  if (sp && !sp.isNeg()) return sp;
  const rate = tryDec(r.targetRate);
  return rate ? suggestedPrice(perPiece, rate, r.marginMode || "prix_vente") : null;
}
function computeProduction(engine, recipes, lines) {
  const byId = new Map(recipes.map((r) => [r.id, r]));
  const res = lines.map((l) => {
    const r = byId.get(l.recipeId);
    if (!r) throw new CalcError("REF", t("err.chooseRecipe"));
    const quantity = positive(l.quantity, "QTE", t("err.prodQty", { n: r.name }));
    const unitCost = engine.recipe(r.id).perPiece;
    const unitPrice = effectivePrice(r, unitCost);
    const totalCost = unitCost.mul(quantity);
    const revenue = unitPrice ? unitPrice.mul(quantity) : null;
    return { recipe: r, quantity, unitCost, totalCost, unitPrice, revenue };
  });
  const priced = res.filter((l) => l.revenue);
  const revenue = sum(priced.map((l) => l.revenue));
  return {
    lines: res, totalQuantity: sum(res.map((l) => l.quantity)), totalCost: sum(res.map((l) => l.totalCost)),
    revenue, margin: revenue.sub(sum(priced.map((l) => l.totalCost))), incomplete: priced.length < res.length,
  };
}
/** Décompose le coût d'une pièce : chaque préparation (ex. la crème) à part, puis le reste. */
function costBreakdown(res) {
  const groups = new Map(); let others = Dec.ZERO;
  for (const l of res.lines) {
    if (l.item.kind === "preparation") groups.set(l.name, (groups.get(l.name) || Dec.ZERO).add(l.cost));
    else others = others.add(l.cost);
  }
  const pp = (v) => v.div(res.pieces);
  return { preps: [...groups.entries()].map(([name, v]) => ({ name, value: pp(v) })), others: pp(others), hasOthers: res.lines.some((l) => l.item.kind !== "preparation") };
}

/* ════════════════════════════════════════════════════════════════════════
   4. AFFICHAGE — formats de nombres selon la langue (arrondi uniquement ici)
   ════════════════════════════════════════════════════════════════════════ */
const CURRENCIES = ["MAD", "EUR", "USD", "GBP", "CHF", "CAD", "XOF", "XAF", "TND", "DZD", "SAR", "AED"];
const SYMBOLS = { MAD: "DH", EUR: "€", USD: "$", GBP: "£", CHF: "CHF", CAD: "$ CA", XOF: "FCFA", XAF: "FCFA", TND: "DT", DZD: "DA", SAR: "SAR", AED: "AED" };
const sym = (c) => SYMBOLS[c] || c;
const NUMFMT = { fr: [",", "\u202f"], ar: [",", "\u202f"], en: [".", ","], es: [",", "."], it: [",", "."], de: [",", "."] };
function fmtNum(s, lang = LANG) {
  const [dec, grp] = NUMFMT[lang];
  const [int, frac] = s.split(".");
  const neg = int.startsWith("-"); const digits = neg ? int.slice(1) : int;
  return (neg ? "-" : "") + digits.replace(/\B(?=(\d{3})+(?!\d))/g, grp) + (frac ? dec + frac : "");
}
const money = (v, cur, digits = 2, lang = LANG) => `${fmtNum(v.toFixed(digits), lang)} ${sym(cur)}`;
const unitCostFmt = (v, unit, cur, lang = LANG) => `${money(v, cur, 3, lang)} / ${uLabel(unit, false, lang)}`;
const pct = (v, lang = LANG) => (v === null || v === undefined ? "—" : `${fmtNum(v.mul(100).toFixed(1), lang)}${lang === "en" || lang === "it" ? "" : "\u00a0"}%`);
const trimZeros = (s) => (s.includes(".") ? s.replace(/0+$/, "").replace(/\.$/, "") : s);
const numShort = (v, lang = LANG) => fmtNum(trimZeros(v.toFixed(3)), lang);
const qtyFmt = (v, unit, lang = LANG) => `${numShort(v, lang)} ${uLabel(unit, !v.eq(1), lang)}`;
const dateFmt = (d, lang = LANG) => new Date(d).toLocaleDateString(LOCALES[lang]);
const byName = (a, b) => a.name.localeCompare(b.name, LOCALES[LANG]);
const uid = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const toInput = (v) => (v === null || v === undefined ? "" : String(v).replace(".", NUMFMT[LANG][0]));
const fromInput = (v) => String(v ?? "").trim().replace(",", ".");
function packDesc(ing, lang = LANG) {
  const q = tryDec(ing.qtyPerPack); const pc = tryDec(ing.packCount || 1);
  if (!q) return "";
  const inner = qtyFmt(q, ing.unit, lang);
  const content = pc && !pc.eq(1) ? `${numShort(pc, lang)} × ${inner}` : inner;
  if (!ing.packLabel) return content;
  const l = ing.packLabel[0].toLocaleUpperCase(LOCALES[lang]) + ing.packLabel.slice(1);
  return t("ing.packOf", { l, c: content }, lang);
}
const priceLabelText = (s) => (s.priceLabel && s.priceLabel !== "aucun" ? ` ${t("set." + s.priceLabel)}` : "");

/* Recherche tolérante : sans accents, sans majuscules */
const norm = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim().replace(/\s+/g, " ");
function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return m[a.length][b.length];
}
/** Si la catégorie tapée existe déjà (à la casse ou aux accents près), on garde l'orthographe existante. */
function snapCategory(value, existing) {
  const v = (value || "").trim().replace(/\s+/g, " ");
  if (!v) return "";
  return existing.find((o) => norm(o) === norm(v)) || v;
}
const uniq = (arr) => { const seen = new Set(); return arr.filter((x) => { const k = norm(x); if (!x || seen.has(k)) return false; seen.add(k); return true; }); };

/* ════════════════════════════════════════════════════════════════════════
   5. PDF (générateur autonome, texte vectoriel, imprimable)
   Alphabet latin uniquement : en arabe, les PDF sont produits en français.
   ════════════════════════════════════════════════════════════════════════ */
const CP1252 = { "€": 0x80, "‚": 0x82, "„": 0x84, "…": 0x85, "Œ": 0x8c, "‘": 0x91, "’": 0x92, "“": 0x93, "”": 0x94, "–": 0x96, "—": 0x97, "œ": 0x9c, "Ÿ": 0x9f, "\u202f": 0x20, "\u00a0": 0x20 };
const pdfClean = (s) => [...String(s)].map((c) => { const k = c.charCodeAt(0); if (CP1252[c] !== undefined) return String.fromCharCode(CP1252[c]); return k < 256 ? c : "?"; }).join("");
const pdfEsc = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
function charW(c, bold) {
  if (/[0-9]/.test(c) || c === "\x80") return 556;
  const tb = { " ": 278, ",": 278, ".": 278, "-": 333, "/": 278, "%": 889, "(": 333, ")": 333, ":": 278, "×": 584, "÷": 584 };
  if (tb[c] !== undefined) return tb[c];
  if (/[A-ZÀ-Ý]/.test(c)) return bold ? 722 : 667;
  if (/[mwMW]/.test(c)) return 833;
  if (/[ijlftrI]/.test(c)) return bold ? 333 : 278;
  return bold ? 611 : 556;
}
class Pdf {
  constructor(lang) { this.lang = lang; this.pages = []; this.addPage(); }
  addPage() { this.ops = []; this.pages.push(this.ops); this.y = 780; }
  rgb(c) { return c.map((v) => (v / 255).toFixed(3)).join(" "); }
  width(s, size, bold) { let w = 0; for (const c of s) w += charW(c, bold); return (w * size) / 1000; }
  text(x, y, s, { size = 10, bold = false, color = [51, 32, 26], align = "left" } = {}) {
    const str = pdfClean(s);
    const xx = align === "right" ? x - this.width(str, size, bold) : x;
    this.ops.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${this.rgb(color)} rg ${xx.toFixed(2)} ${y.toFixed(2)} Td (${pdfEsc(str)}) Tj ET`);
  }
  rect(x, y, w, h, color) { this.ops.push(`${this.rgb(color)} rg ${x} ${y} ${w} ${h} re f`); }
  line(x1, y1, x2, y2, color = [232, 224, 212], w = 0.7) { this.ops.push(`${this.rgb(color)} RG ${w} w ${x1} ${y1} m ${x2} ${y2} l S`); }
  ensure(h) { if (this.y - h < 70) this.addPage(); }
  build() {
    const n = this.pages.length;
    this.pages.forEach((ops, i) => {
      this.ops = ops;
      this.line(40, 50, 555, 50);
      this.text(40, 36, t("pdf.footer", null, this.lang), { size: 8, color: [122, 106, 102] });
      this.text(555, 36, t("pdf.page", { i: i + 1, n }, this.lang), { size: 8, color: [122, 106, 102], align: "right" });
    });
    const objs = [];
    objs[1] = "<< /Type /Catalog /Pages 2 0 R >>";
    objs[2] = `<< /Type /Pages /Kids [${this.pages.map((_, i) => `${5 + i * 2} 0 R`).join(" ")}] /Count ${n} >>`;
    objs[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
    objs[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";
    this.pages.forEach((ops, i) => {
      const content = ops.join("\n");
      objs[5 + i * 2] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${6 + i * 2} 0 R >>`;
      objs[6 + i * 2] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
    });
    let out = "%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"; const offs = [];
    for (let i = 1; i < objs.length; i++) { offs[i] = out.length; out += `${i} 0 obj\n${objs[i]}\nendobj\n`; }
    const xref = out.length;
    out += `xref\n0 ${objs.length}\n0000000000 65535 f \n`;
    for (let i = 1; i < objs.length; i++) out += `${String(offs[i]).padStart(10, "0")} 00000 n \n`;
    out += `trailer\n<< /Size ${objs.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    const bytes = new Uint8Array(out.length);
    for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 0xff;
    return bytes;
  }
}
const INK = [62, 34, 24], MUTED = [122, 106, 98], RASP = [180, 15, 81];
const pdfLang = () => (LANG === "ar" ? "fr" : LANG);
function pdfHeader(pdf, s, title, subtitle) {
  const L = pdf.lang;
  pdf.rect(0, 800, 595, 42, INK);
  pdf.text(40, 816, s.businessName || t("brand", null, L), { size: 11, bold: true, color: [255, 255, 255] });
  pdf.text(555, 816, t("pdf.issued", { d: dateFmt(Date.now(), L) }, L), { size: 9, color: [237, 226, 214], align: "right" });
  pdf.y = 762;
  pdf.text(40, pdf.y, title, { size: 20, bold: true });
  pdf.y -= 18;
  if (subtitle) { pdf.text(40, pdf.y, subtitle, { size: 10, color: MUTED }); pdf.y -= 14; }
  pdf.y -= 12;
}
function pdfTable(pdf, cols, rows) {
  const head = () => {
    cols.forEach((c) => pdf.text(c.align === "right" ? c.x + c.w : c.x, pdf.y, c.label, { size: 8.5, bold: true, color: MUTED, align: c.align }));
    pdf.y -= 7; pdf.line(40, pdf.y, 555, pdf.y, INK, 0.8); pdf.y -= 14;
  };
  head();
  rows.forEach((r, i) => {
    if (pdf.y < 80) { pdf.addPage(); head(); }
    if (i % 2 === 1) pdf.rect(40, pdf.y - 5, 515, 18, [250, 246, 238]);
    cols.forEach((c, j) => {
      let tx = String(r[j] ?? "");
      while (tx.length > 1 && pdf.width(pdfClean(tx), 9.5, false) > c.w - 4) tx = tx.slice(0, -2) + "…";
      pdf.text(c.align === "right" ? c.x + c.w : c.x, pdf.y, tx, { size: 9.5, align: c.align });
    });
    pdf.y -= 18;
  });
  pdf.y -= 6;
}
function pdfKeyValues(pdf, pairs) {
  pairs.forEach(([k, v, strong]) => {
    pdf.ensure(20);
    pdf.text(300, pdf.y, k, { size: 10, color: MUTED });
    pdf.text(555, pdf.y, v, { size: strong ? 12 : 10, bold: !!strong, align: "right", color: strong === "rasp" ? RASP : INK });
    pdf.y -= strong ? 20 : 16;
  });
}
function downloadPdf(pdf, filename) {
  const blob = new Blob([pdf.build()], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.rel = "noopener";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}
const slug = (s) => (s || "document").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase().replace(/^-|-$/g, "") || "document";
const itemCols = (L) => [{ label: t("items.element", null, L), x: 40, w: 290 }, { label: t("items.qtyPh", null, L), x: 335, w: 110, align: "right" }, { label: t("c.cost", null, L), x: 450, w: 105, align: "right" }];
function itemRowsForPdf(lines, cur, L) {
  return lines.map((l) => {
    const it = l.item;
    const q = it.kind === "fixed" ? t("pdf.flat", null, L) : qtyFmt(D(it.qty), it.unit, L);
    const name = it.kind === "fixed" && !it.label ? t("err.flat", null, L) : l.name;
    return [name + (it.kind === "preparation" ? ` ${t("items.prepTag", null, L)}` : ""), q, money(l.cost, cur, 2, L)];
  });
}
function exportRecipePdf(recipe, res, data) {
  const s = data.settings; const cur = s.currency; const L = pdfLang(); const pdf = new Pdf(L);
  const pieces = D(recipe.yieldPieces);
  pdfHeader(pdf, s, recipe.name, pieces.eq(1) ? t("pdf.recipe1", null, L) : t("pdf.recipeN", { q: qtyFmt(pieces, "piece", L) }, L));
  pdfTable(pdf, itemCols(L), itemRowsForPdf(res.lines, cur, L));
  pdf.ensure(170);
  const pairs = [];
  if (!pieces.eq(1)) pairs.push([t("pdf.batch", { q: qtyFmt(pieces, "piece", L) }, L), money(res.batchTotal, cur, 2, L)]);
  const bd = costBreakdown(res);
  if (bd.preps.length) {
    bd.preps.forEach((p) => pairs.push([t("pdf.bdPrep", { n: p.name }, L), money(p.value, cur, 2, L)]));
    if (bd.hasOthers) pairs.push([t("pdf.bdOthers", null, L), money(bd.others, cur, 2, L)]);
  }
  pairs.push([t("pdf.perPiece", null, L), money(res.perPiece, cur, 2, L), true]);
  const ind = suggestedPrice(res.perPiece, tryDec(recipe.targetRate), recipe.marginMode || "prix_vente");
  const lbl = s.priceLabel && s.priceLabel !== "aucun" ? ` ${t("set." + s.priceLabel, null, L)}` : "";
  if (ind) pairs.push([t("pdf.indicative", { r: pct(D(recipe.targetRate), L), m: t(recipe.marginMode === "cout" ? "st.onCost" : "st.onPrice", null, L) }, L), money(ind, cur, 2, L)]);
  const price = effectivePrice(recipe, res.perPiece);
  if (price) {
    const a = analyzeMargin(res.perPiece, price);
    pairs.push([t("pdf.retained", null, L) + lbl, money(price, cur, 2, L), "rasp"]);
    pairs.push([t("st.margin", null, L), money(a.unitMargin, cur, 2, L)]);
    pairs.push([`${t("st.marginRate", null, L)} (${t("st.onCost", null, L)})`, pct(a.onCost, L)]);
    pairs.push([`${t("st.markup", null, L)} (${t("st.onPrice", null, L)})`, pct(a.onPrice, L)]);
  }
  pdfKeyValues(pdf, pairs);
  downloadPdf(pdf, `${slug(recipe.name)}.pdf`);
}
function exportPreparationPdf(prep, res, data) {
  const cur = data.settings.currency; const L = pdfLang(); const pdf = new Pdf(L);
  pdfHeader(pdf, data.settings, prep.name, t("pdf.prepSub", { q: qtyFmt(D(prep.yieldQty), prep.yieldUnit, L) }, L));
  pdfTable(pdf, itemCols(L), itemRowsForPdf(res.lines, cur, L));
  pdfKeyValues(pdf, [[t("pdf.totalCost", null, L), money(res.total, cur, 2, L), true], [t("pdf.costPer", { u: uLabel(res.baseUnit, false, L) }, L), unitCostFmt(res.perBase, res.baseUnit, cur, L)]]);
  downloadPdf(pdf, `${slug(prep.name)}.pdf`);
}
function exportIngredientsPdf(data) {
  const cur = data.settings.currency; const L = pdfLang(); const pdf = new Pdf(L);
  pdfHeader(pdf, data.settings, t("ing.title", null, L), t("pdf.ingSub", { n: data.ingredients.length }, L));
  const rows = [...data.ingredients].sort(byName).map((i) => {
    const r = (() => { try { return ingredientUnitCost(i); } catch { return null; } })();
    return [i.name, packDesc(i, L), money(D(i.price || 0), cur, 2, L), r ? unitCostFmt(r.perBase, r.baseUnit, cur, L) : t("pdf.incomplete", null, L)];
  });
  pdfTable(pdf, [{ label: t("home.product", null, L), x: 40, w: 150 }, { label: t("pdf.packaging", null, L), x: 195, w: 150 }, { label: t("pdf.paid", null, L), x: 350, w: 85, align: "right" }, { label: t("ing.unitCost", null, L), x: 440, w: 115, align: "right" }], rows);
  downloadPdf(pdf, `${slug(t("ing.title", null, L))}.pdf`);
}
function exportPreparationsListPdf(data, engine) {
  const cur = data.settings.currency; const L = pdfLang(); const pdf = new Pdf(L);
  pdfHeader(pdf, data.settings, t("prep.title", null, L), t("pdf.prepsSub", { n: data.preparations.length }, L));
  const rows = [...data.preparations].sort(byName).map((p) => {
    const r = engine.safe(() => engine.preparation(p.id));
    return [p.name, qtyFmt(D(p.yieldQty), p.yieldUnit, L), r.ok ? money(r.value.total, cur, 2, L) : t("pdf.incomplete", null, L), r.ok ? unitCostFmt(r.value.perBase, r.value.baseUnit, cur, L) : ""];
  });
  pdfTable(pdf, [{ label: t("prep.title", null, L), x: 40, w: 170 }, { label: t("pdf.yield", null, L), x: 215, w: 100, align: "right" }, { label: t("pdf.totalCost", null, L), x: 320, w: 100, align: "right" }, { label: t("ing.unitCost", null, L), x: 425, w: 130, align: "right" }], rows);
  downloadPdf(pdf, `${slug(t("prep.title", null, L))}.pdf`);
}
function exportCostsReportPdf(data, engine) {
  const cur = data.settings.currency; const L = pdfLang(); const pdf = new Pdf(L);
  pdfHeader(pdf, data.settings, t("pdf.reportTitle", null, L), t("pdf.reportSub", null, L));
  const rows = [...data.recipes].sort(byName).map((r) => {
    const res = engine.safe(() => engine.recipe(r.id));
    if (!res.ok) return [r.name, t("pdf.incomplete", null, L), "", "", ""];
    const price = effectivePrice(r, res.value.perPiece);
    const a = price ? analyzeMargin(res.value.perPiece, price) : null;
    return [r.name, money(res.value.perPiece, cur, 2, L), price ? money(price, cur, 2, L) : "—", a ? money(a.unitMargin, cur, 2, L) : "—", a ? pct(a.onPrice, L) : "—"];
  });
  pdfTable(pdf, [{ label: t("home.product", null, L), x: 40, w: 165 }, { label: t("pdf.costPiece", null, L), x: 205, w: 85, align: "right" }, { label: t("pdf.price", null, L), x: 295, w: 80, align: "right" }, { label: t("pdf.marginPiece", null, L), x: 380, w: 90, align: "right" }, { label: t("st.markup", null, L), x: 475, w: 80, align: "right" }], rows);
  downloadPdf(pdf, `${slug(t("pdf.reportTitle", null, L))}.pdf`);
}
function exportProductionPdf(prod, res, data) {
  const cur = data.settings.currency; const L = pdfLang(); const pdf = new Pdf(L);
  pdfHeader(pdf, data.settings, t("prod.of", { d: dateFmt(prod.date, L) }, L), prod.lot ? t("pdf.prodLot", { l: prod.lot }, L) : t("pdf.prodSub", null, L));
  pdfTable(pdf, [{ label: t("home.product", null, L), x: 40, w: 160 }, { label: t("items.qtyPh", null, L), x: 200, w: 70, align: "right" }, { label: t("pdf.costPiece", null, L), x: 275, w: 90, align: "right" }, { label: t("pdf.totalCost", null, L), x: 370, w: 90, align: "right" }, { label: t("pdf.revenue", null, L), x: 465, w: 90, align: "right" }],
    res.lines.map((l) => [l.recipe.name, numShort(l.quantity, L), money(l.unitCost, cur, 2, L), money(l.totalCost, cur, 2, L), l.revenue ? money(l.revenue, cur, 2, L) : t("pdf.noPrice", null, L)]));
  pdfKeyValues(pdf, [
    [t("pdf.totalQty", null, L), qtyFmt(res.totalQuantity, "piece", L)],
    [t("prod.total", null, L), money(res.totalCost, cur, 2, L), true],
    [t("prod.revenue", null, L), money(res.revenue, cur, 2, L)],
    [t("prod.margin", null, L), money(res.margin, cur, 2, L), "rasp"],
  ]);
  if (prod.notes) { pdf.ensure(30); pdf.text(40, pdf.y, t("pdf.notes", { n: prod.notes }, L), { size: 9, color: MUTED }); }
  downloadPdf(pdf, `production-${prod.date}${prod.lot ? "-" + slug(prod.lot) : ""}.pdf`);
}

/* ════════════════════════════════════════════════════════════════════════
   6. STOCKAGE — module unique, à remplacer par Supabase
   ════════════════════════════════════════════════════════════════════════ */
const KEY = "couts-patisserie:v1";
const emptyData = () => ({
  version: 1,
  settings: { businessName: "", currency: "MAD", lang: detectLang(), priceLabel: "aucun", marginMode: "prix_vente", defaultRatePct: "", onboarded: false, entered: false, theme: "auto" },
  subscription: { plan: "free", premium: false },
  ingredients: [], preparations: [], recipes: [], productions: [], priceHistory: [],
});
const migrate = (d) => { const e = emptyData(); return d ? { ...e, ...d, settings: { ...e.settings, ...(d.settings || {}) } } : e; };
const hasStorage = () => typeof window !== "undefined" && (!!window.storage || !!localSafe.ok);
const localSafe = (() => {
  try { const k = "__mz"; window.localStorage.setItem(k, "1"); window.localStorage.removeItem(k); return { ok: true }; }
  catch { return { ok: false }; }
})();
const storage = {
  async load() {
    if (localSafe.ok) { try { const raw = window.localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch { /* illisible */ } }
    if (window.storage) { try { const r = await window.storage.get(KEY, false); return r ? JSON.parse(r.value) : null; } catch { /* absent */ } }
    return null;
  },
  async save(data) {
    const txt = JSON.stringify(data);
    if (localSafe.ok) { try { window.localStorage.setItem(KEY, txt); return true; } catch { /* plein */ } }
    if (window.storage) { try { return !!(await window.storage.set(KEY, txt, false)); } catch { return false; } }
    return !localSafe.ok ? true : false;
  },
};

const LOGO = "data:image/png;base64,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";

/* ════════════════════════════════════════════════════════════════════════
   7. COMPOSANTS D'INTERFACE
   ════════════════════════════════════════════════════════════════════════ */
function Field({ label, hint, error, children }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
      {error && <span className="field-err"><AlertTriangle size={14} />{error}</span>}
    </div>
  );
}
function NumInput({ value, onChange, placeholder, suffix, ariaLabel, invalid }) {
  return (
    <div className={`input-wrap${invalid ? " invalid" : ""}`}>
      <input className="input num" dir="ltr" inputMode="decimal" value={value} placeholder={placeholder} aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ""))} />
      {suffix && <span className="suffix">{suffix}</span>}
    </div>
  );
}
function Segmented({ value, onChange, options }) {
  return (
    <div className="seg" role="radiogroup">
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} className={value === o.value ? "on" : ""} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}
function Sheet({ title, onClose, onSave, saveDisabled, children }) {
  useEffect(() => { const h = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [onClose]);
  return (
    <div className="sheet-backdrop">
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <header className="sheet-head">
          <button className="btn-ghost" onClick={onClose}><ChevronLeft size={22} className="flip-rtl" />{t("c.back")}</button>
          <h2>{title}</h2>
        </header>
        <div className="sheet-body">{children}</div>
        {onSave && (
          <footer className="sheet-foot">
            <button className="btn-primary block" disabled={saveDisabled} onClick={onSave}><Check size={20} />{t("c.save")}</button>
          </footer>
        )}
      </div>
    </div>
  );
}
function ScreenHead({ title, subtitle, onAdd, extra }) {
  return (
    <>
      <div className="screen-head">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
        {extra && <div className="head-actions">{extra}</div>}
      </div>
      {onAdd && <button className="fab" onClick={onAdd} aria-label={t("c.add")} title={t("c.add")}><Plus size={28} strokeWidth={2.2} /></button>}
    </>
  );
}
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search">
      <Search size={18} aria-hidden />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </div>
  );
}
function CategoryChips({ items, value, onChange }) {
  const cats = uniq(items.map((i) => i.category)).sort((a, b) => a.localeCompare(b, LOCALES[LANG]));
  if (!cats.length) return null;
  return (
    <div className="chips">
      <button className={!value ? "chip on" : "chip"} onClick={() => onChange("")}>{t("c.all")}</button>
      {cats.map((c) => <button key={c} className={value === c ? "chip on" : "chip"} onClick={() => onChange(c)}>{c}</button>)}
    </div>
  );
}
function filterList(items, q, cat) {
  return items.filter((i) => {
    const okCat = !cat || (cat === "__none__" ? !i.category : norm(i.category) === norm(cat));
    return okCat && (norm(i.name).includes(norm(q)) || norm(i.category || "").includes(norm(q)));
  }).sort(byName);
}
function Empty({ icon: Icon, title, text, action, onAction }) {
  return (
    <div className="empty">
      <Icon size={34} strokeWidth={1.6} />
      <h3>{title}</h3>
      <p>{text}</p>
      {action && <button className="btn-dark empty-cta" onClick={onAction}><Plus size={20} />{action}</button>}
    </div>
  );
}
function Row({ title, sub, value, valueSub, onClick, tone }) {
  return (
    <button className="row" onClick={onClick}>
      <span className="row-main"><span className="row-title">{title}</span>{sub && <span className="row-sub">{sub}</span>}</span>
      <span className={`row-val ${tone || ""}`} dir="ltr">{value}{valueSub && <small>{valueSub}</small>}</span>
    </button>
  );
}
function Notice({ tone = "info", children }) {
  const Icon = tone === "warn" || tone === "loss" ? AlertTriangle : Info;
  return <div className={`notice ${tone}`}><Icon size={18} /><div>{children}</div></div>;
}
function Ticket({ label, value, sub }) {
  return (
    <div className="ticket" aria-live="polite">
      <span className="ticket-label">{label}</span>
      <span className="ticket-value" dir="ltr">{value}</span>
      {sub && <span className="ticket-sub">{sub}</span>}
    </div>
  );
}

/**
 * Champ à suggestions : dès les premières lettres, les catégories existantes sont proposées.
 * « produits lait » → « Produits laitiers ». Une faute de frappe proche d'une catégorie
 * existante déclenche « Vouliez-vous dire… ? ». La même catégorie tapée avec d'autres
 * majuscules ou accents est automatiquement rattachée à l'existante.
 */
function Combo({ value, onChange, existing, suggestions = [], placeholder }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const all = uniq([...existing, ...suggestions]);
  const q = norm(value);
  const matches = (q ? all.filter((o) => norm(o).includes(q)) : all)
    .sort((a, b) => (norm(b).startsWith(q) - norm(a).startsWith(q)) || (existing.includes(b) - existing.includes(a)) || a.localeCompare(b, LOCALES[LANG]))
    .slice(0, 6);
  const exact = all.find((o) => norm(o) === q);
  const near = !exact && q.length >= 3 ? all.find((o) => lev(norm(o), q) <= (q.length > 6 ? 2 : 1)) : null;
  const pick = (v) => { onChange(v); setOpen(false); setActive(-1); };
  const showNew = !!value.trim() && !exact && !matches.some((o) => norm(o).startsWith(q));
  const list = open && (matches.length > 0 || showNew);
  return (
    <div className="combo">
      <input className="input" value={value} placeholder={placeholder} role="combobox" aria-expanded={list} aria-autocomplete="list" autoComplete="off"
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(-1); }}
        onFocus={(e) => { setOpen(true); const el = e.target; setTimeout(() => el.scrollIntoView({ block: "center", behavior: "smooth" }), 250); }}
        onBlur={() => setTimeout(() => { setOpen(false); if (exact && exact !== value) onChange(exact); }, 160)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, matches.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          else if (e.key === "Enter" && active >= 0 && matches[active]) { e.preventDefault(); pick(matches[active]); }
          else if (e.key === "Escape") setOpen(false);
        }} />
      {list && (
        <ul className="combo-list" role="listbox">
          {matches.map((o, i) => {
            const n = norm(o); const idx = q ? n.indexOf(q) : -1;
            return (
              <li key={o} role="option" aria-selected={i === active}>
                <button type="button" className={i === active ? "on" : ""} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)}>
                  <span className="combo-txt">{idx >= 0 ? <>{o.slice(0, idx)}<mark>{o.slice(idx, idx + q.length)}</mark>{o.slice(idx + q.length)}</> : o}</span>
                  {existing.some((x) => norm(x) === n) && <Check size={15} className="combo-check" />}
                </button>
              </li>
            );
          })}
          {showNew && (
            <li className="combo-new">
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(value.trim())}><Plus size={16} /><span className="combo-txt">{t("combo.create", { v: value.trim() })}</span></button>
            </li>
          )}
        </ul>
      )}
      {!open && near && <button type="button" className="combo-hint" onClick={() => onChange(near)}><Info size={15} />{t("combo.didYouMean", { v: near })}</button>}
    </div>
  );
}
function DeleteZone({ blockers, onDelete, what }) {
  const [confirm, setConfirm] = useState(false);
  if (blockers.length) return <Notice tone="warn">{t("del.blocked", { w: what, list: blockers.join(LANG === "ar" ? "، " : ", ") })}</Notice>;
  return confirm ? (
    <div className="delete-confirm">
      <p>{t("del.confirm", { w: what })}</p>
      <div className="btn-pair">
        <button className="btn-secondary" onClick={() => setConfirm(false)}>{t("c.cancel")}</button>
        <button className="btn-danger" onClick={onDelete}><Trash2 size={18} />{t("c.delete")}</button>
      </div>
    </div>
  ) : (
    <button className="btn-ghost danger" onClick={() => setConfirm(true)}><Trash2 size={18} />{t("del.btn", { w: what })}</button>
  );
}
const quote = (n) => (LANG === "en" ? `“${n}”` : LANG === "de" ? `„${n}“` : `«${LANG === "fr" ? "\u00a0" : ""}${n}${LANG === "fr" ? "\u00a0" : ""}»`);



/* ─────────── Stock : affichage et alertes ─────────── */
const stockState = (ing) => {
  if (ing.stock === null || ing.stock === undefined) return null;
  const q = D(ing.stock);
  const min = tryDec(ing.stockMin);
  return { qty: q, unit: BASE_UNIT[dimOf(ing.unit)], negative: q.isNeg() || q.isZero(), low: min ? q.cmp(min) <= 0 : false };
};
const stockLabel = (ing) => {
  const st = stockState(ing);
  return st ? t("st.left", { q: qtyFmt(st.qty, st.unit) }) : null;
};

/* ════════════════════════════════════════════════════════════════════════
   CATÉGORIES EN PASTILLES — un pictogramme deviné d'après le nom
   ════════════════════════════════════════════════════════════════════════ */
const CAT_ICONS = [
  // [pictogramme, mots-clés dans les six langues]
  ["🥛", "lait laitier laitiers crème creme beurre fromage mascarpone dairy milk cream butter leche nata latticini milch sahne حليب مشتقات"],
  ["🍫", "chocolat chocolate chocolade cacao cioccolato schokolade شوكولاتة كاكاو"],
  ["🍪", "biscuit biscuits cookie cookies galleta galletas biscotti keks kekse بسكويت"],
  ["🍓", "fruit fruits fruta frutas frutta obst فواكه fraise citron pomme berry"],
  ["🌾", "farine sucre levure flour sugar yeast harina azúcar farina zucchero mehl zucker دقيق سكر"],
  ["🥚", "oeuf oeufs œuf egg eggs huevo uova ei eier بيض"],
  ["📦", "emballage emballages boîte packaging box envase imballaggio verpackung تغليف علب gobelet pot barquette"],
  ["🍬", "decoration décoration topping garniture nappage decoración decorazione dekoration تزيين"],
  ["🥜", "fruits secs noix amande pistache nuts almond pistachio frutos secos frutta secca nüsse مكسرات"],
  ["🧊", "glace glaces sorbet ice cream helado gelato eis مثلجات"],
  ["🧂", "epice épices arome arôme vanille spice spices vanilla especias spezie gewürze توابل فانيليا"],
  ["🍯", "miel sirop coulis confiture honey syrup jam miel mermelada miele marmellata honig sirup عسل"],
  ["🥐", "pain viennoiserie pâte pate brioche bread dough pan masa impasto teig brot خبز عجين"],
  ["🍹", "boisson jus eau drink juice water bebida bevanda getränk مشروب عصير"],
];
function catIcon(name) {
  const n = norm(name);
  for (const [ico, words] of CAT_ICONS) {
    if (words.split(" ").some((w) => w.length > 2 && n.includes(w))) return ico;
  }
  return null;
}

/** Pastilles rondes : filtrer d'un geste, réorganiser à sa main. */
function CategoryCircles({ items, value, onChange, order, onOrder }) {
  const [edit, setEdit] = useState(false);
  const present = uniq(items.map((i) => i.category));
  const hasNone = items.some((i) => !i.category);
  const ordered = [
    ...(order || []).filter((c) => present.some((p) => norm(p) === norm(c))).map((c) => present.find((p) => norm(p) === norm(c))),
    ...present.filter((p) => !(order || []).some((c) => norm(c) === norm(p))),
  ];
  const cells = [
    { key: "", label: t("cat.all"), icon: "◎", count: items.length },
    ...ordered.map((c) => ({ key: c, label: c, icon: catIcon(c), count: items.filter((i) => norm(i.category) === norm(c)).length })),
    ...(hasNone ? [{ key: "__none__", label: t("cat.none"), icon: null, count: items.filter((i) => !i.category).length }] : []),
  ];
  const move = (c, dir) => {
    const list = [...ordered];
    const i = list.findIndex((x) => norm(x) === norm(c));
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    onOrder(list);
  };
  if (!present.length && !hasNone) return null;
  return (
    <div className="cats">
      <div className="cats-row">
        {cells.map((c) => (
          <div className="cat" key={c.key || "all"}>
            <button className={`cat-btn${(value || "") === c.key ? " on" : ""}`} onClick={() => onChange(c.key)}>
              <span className="cat-ico">{c.icon || (c.label ? c.label.trim()[0].toUpperCase() : "?")}</span>
              <span className="cat-badge">{c.count}</span>
            </button>
            <span className="cat-label">{c.label}</span>
            {edit && c.key && c.key !== "__none__" && (
              <span className="cat-move">
                <button onClick={() => move(c.key, -1)} aria-label={t("cat.moveLeft")}>‹</button>
                <button onClick={() => move(c.key, 1)} aria-label={t("cat.moveRight")}>›</button>
              </span>
            )}
          </div>
        ))}
      </div>
      {ordered.length > 1 && (
        <button className="btn-ghost cats-edit" onClick={() => setEdit((v) => !v)}>{edit ? t("cat.done") : t("cat.reorder")}</button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SÉLECTEUR D'ÉLÉMENT — on tape les premières lettres au lieu de dérouler
   ════════════════════════════════════════════════════════════════════════ */
function ItemPicker({ data, excludePrepId, onPick, onClose }) {
  const [q, setQ] = useState("");
  const preps = data.preparations.filter((p) => p.id !== excludePrepId).sort(byName);
  const ings = [...data.ingredients].sort(byName);
  const match = (x) => norm(x.name).includes(norm(q)) || norm(x.category || "").includes(norm(q));
  const fp = preps.filter(match), fi = ings.filter(match);
  const line = (x, kind) => (
    <button className="pick-row" key={kind + x.id} onClick={() => onPick(kind, x.id)}>
      <span className="pick-ico">{catIcon(x.category) || (kind === "preparation" ? "🥣" : "•")}</span>
      <span className="pick-main">
        <span className="pick-name">{x.name}</span>
        {x.category && <span className="muted small">{x.category}</span>}
      </span>
    </button>
  );
  return (
    <Sheet title={t("pick.title")} onClose={onClose}>
      <SearchBar value={q} onChange={setQ} placeholder={t("pick.search")} />
      {fp.length > 0 && (
        <section className="block-section">
          <h3>{t("items.groupPrep")}</h3>
          <div className="pick-list">{fp.map((x) => line(x, "preparation"))}</div>
        </section>
      )}
      {fi.length > 0 && (
        <section className="block-section">
          <h3>{t("items.groupIng")}</h3>
          <div className="pick-list">{fi.map((x) => line(x, "ingredient"))}</div>
        </section>
      )}
      {!fp.length && !fi.length && <p className="muted pad">{t("pick.empty")}</p>}
      <button className="btn-secondary block" onClick={() => onPick("fixed")}>{t("items.fixed")}</button>
    </Sheet>
  );
}

/* ─────────── Éditeur de composition (préparations & recettes) ─────────── */
function ItemsEditor({ items, onChange, data, engine, excludePrepId, cur }) {
  const set = (i, patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const remove = (i) => onChange(items.filter((_, j) => j !== i));
  const add = () => onChange([...items, { key: uid(), kind: "ingredient", refId: "", qty: "", unit: "" }]);
  const [picking, setPicking] = useState(null);
  const ings = [...data.ingredients].sort(byName);
  const preps = data.preparations.filter((p) => p.id !== excludePrepId).sort(byName);
  const refOf = (it) => (it.kind === "ingredient" ? data.ingredients : data.preparations).find((x) => x.id === it.refId);
  const baseOf = (kind, id) => {
    if (kind === "ingredient") { const i = data.ingredients.find((x) => x.id === id); return i ? BASE_UNIT[dimOf(i.unit)] : "g"; }
    const p = data.preparations.find((x) => x.id === id); return p ? BASE_UNIT[dimOf(p.yieldUnit)] : "g";
  };
  return (
    <div className="items">
      {items.length === 0 && <p className="muted small">{t("items.none")}</p>}
      {items.map((it, i) => {
        const code = it.kind === "fixed" ? "fixed" : it.refId ? `${it.kind === "ingredient" ? "i" : "p"}:${it.refId}` : "";
        const r = engine.safe(() => engine.lineCost({ ...it, qty: fromInput(it.qty), amount: fromInput(it.amount) }));
        const touched = it.kind === "fixed" ? it.amount !== "" && it.amount !== undefined : it.refId && it.qty !== "";
        return (
          <div className="item" key={it.key || i}>
            <div className="item-top">
              <button className="picker-btn" onClick={() => setPicking(i)}>
                <span className="picker-ico">{it.kind === "fixed" ? "＝" : it.refId ? (catIcon(refOf(it)?.category) || (it.kind === "preparation" ? "🥣" : "•")) : "＋"}</span>
                <span className="picker-name">{it.kind === "fixed" ? t("items.fixed") : it.refId ? refOf(it)?.name : t("items.choose")}</span>
                <span className="picker-chev">›</span>
              </button>
              <button className="icon-btn" onClick={() => remove(i)} aria-label={t("items.remove")}><Trash2 size={18} /></button>
            </div>
            {it.kind === "fixed" ? (
              <div className="item-bottom">
                <input className="input" value={it.label || ""} placeholder={t("items.labelPh")} onChange={(e) => set(i, { label: e.target.value })} aria-label={t("items.labelPh")} />
                <NumInput value={it.amount || ""} onChange={(v) => set(i, { amount: v })} placeholder={t("items.amountPh")} suffix={sym(cur)} ariaLabel={t("items.amountPh")} />
              </div>
            ) : it.refId ? (
              <div className="item-bottom">
                <NumInput value={it.qty} onChange={(v) => set(i, { qty: v })} placeholder={t("items.qtyPh")} ariaLabel={t("items.qtyPh")} invalid={touched && !r.ok} />
                <select className="input unit" value={it.unit} onChange={(e) => set(i, { unit: e.target.value })} aria-label={t("items.unit")}>
                  {compatibleUnits(baseOf(it.kind, it.refId)).map((u) => <option key={u} value={u}>{uLabel(u, true)}</option>)}
                </select>
              </div>
            ) : null}
            <div className="item-cost">
              {r.ok ? <><span className="muted">{t("c.cost")}</span><strong dir="ltr">{money(r.value.cost, cur)}</strong></> : touched ? <span className="err-text">{r.error}</span> : null}
            </div>
          </div>
        );
      })}
      <button className="btn-secondary block" onClick={add}><Plus size={20} />{t("items.add")}</button>
      {!data.ingredients.length && <p className="field-hint">{t("items.needIng")}</p>}
      {picking !== null && (
        <ItemPicker data={data} excludePrepId={excludePrepId} onClose={() => setPicking(null)}
          onPick={(kind, id) => {
            if (kind === "fixed") set(picking, { kind: "fixed", refId: "", unit: "", qty: "", amount: items[picking].amount || "", label: items[picking].label || "" });
            else set(picking, { kind, refId: id, unit: baseOf(kind, id) });
            setPicking(null);
          }} />
      )}
    </div>
  );
}
const toDraftItems = (items) => items.map((it) => ({ ...it, key: it.id || uid(), qty: toInput(it.qty), amount: toInput(it.amount) }));
const fromDraftItems = (items) => items.map(({ key, ...it }) => (it.kind === "fixed"
  ? { id: key, kind: "fixed", label: (it.label || "").trim(), amount: fromInput(it.amount) }
  : { id: key, kind: it.kind, refId: it.refId, qty: fromInput(it.qty), unit: it.unit }));
function linesValid(engine, items) {
  if (!items.length) return t("err.noItems");
  for (const it of items) {
    const r = engine.safe(() => engine.lineCost({ ...it, qty: fromInput(it.qty), amount: fromInput(it.amount) }));
    if (!r.ok) return r.error;
  }
  return null;
}
function Breakdown({ res, cur }) {
  const b = costBreakdown(res);
  if (!b.preps.length) return null;
  return (
    <div className="breakdown">
      <span className="breakdown-title">{t("bd.title")}</span>
      {b.preps.map((p) => <div key={p.name} className="bd-row"><span>{p.name} <em>{t("items.prepTag")}</em></span><strong dir="ltr">{money(p.value, cur)}</strong></div>)}
      {b.hasOthers && <div className="bd-row"><span>{t("bd.others")}</span><strong dir="ltr">{money(b.others, cur)}</strong></div>}
      <div className="bd-row bd-total"><span>{t("bd.total")}</span><strong dir="ltr">{money(res.perPiece, cur)}</strong></div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   8. ÉCRANS
   ════════════════════════════════════════════════════════════════════════ */

/* ─────────── Matières premières ─────────── */
function IngredientEditor({ initial, data, engine, onSave, onDelete, onClose }) {
  const cur = data.settings.currency;
  const [d, setD] = useState(() => initial
    ? { ...initial, category: initial.category || "", packLabel: initial.packLabel || "", price: toInput(initial.price), qtyPerPack: toInput(initial.qtyPerPack), packCount: toInput(initial.packCount || 1), multi: D(initial.packCount || 1).cmp(1) !== 0,
        track: initial.stock !== null && initial.stock !== undefined,
        stockIn: initial.stock !== null && initial.stock !== undefined ? toInput(trimZeros(D(initial.stock).toFixed(3))) : "",
        stockMinIn: initial.stockMin !== null && initial.stockMin !== undefined ? toInput(trimZeros(D(initial.stockMin).toFixed(3))) : "",
        stockUnit: BASE_UNIT[dimOf(initial.unit)] }
    : { name: "", category: "", price: "", packLabel: "", multi: false, packCount: "", qtyPerPack: "", unit: "piece", stock: null, stockMin: null });
  const up = (p) => setD((x) => ({ ...x, ...p }));
  const cand = { ...d, price: fromInput(d.price), qtyPerPack: fromInput(d.qtyPerPack), packCount: d.multi ? fromInput(d.packCount) : "1" };
  const res = (() => { try { return { ok: true, v: ingredientUnitCost({ ...cand, name: d.name }) }; } catch (e) { return { ok: false, e: e.message }; } })();
  const errors = {
    name: !d.name.trim() ? t("f.nameIng") : null,
    price: d.price === "" ? t("f.priceReq") : !tryDec(cand.price) ? t("f.priceInvalid") : null,
    qty: d.qtyPerPack === "" ? t("f.qtyReq") : !tryDec(cand.qtyPerPack)?.isPos() ? t("f.qtyPos") : null,
    packs: d.multi && !tryDec(cand.packCount)?.isPos() ? t("f.packsReq") : null,
  };
  const valid = !Object.values(errors).some(Boolean) && res.ok;
  const [showErr, setShowErr] = useState(false);
  const deps = initial ? engine.dependentsOf("ingredient", initial.id) : { preparations: [], recipes: [] };
  const direct = initial ? [
    ...data.preparations.filter((p) => p.items.some((i) => i.refId === initial.id)).map((p) => quote(p.name)),
    ...data.recipes.filter((r) => r.items.some((i) => i.refId === initial.id)).map((r) => quote(r.name)),
  ] : [];
  const history = initial ? data.priceHistory.filter((h) => h.ingredientId === initial.id).slice().reverse() : [];
  const existingCats = uniq(data.ingredients.map((i) => i.category));
  const existingForms = uniq(data.ingredients.map((i) => i.packLabel));
  const save = () => {
    if (!valid) return setShowErr(true);
    onSave({
      id: initial?.id || uid(), name: d.name.trim(), category: snapCategory(d.category, existingCats), price: cand.price,
      packLabel: snapCategory(d.packLabel, [...existingForms, ...tList("ing.forms")]), packCount: cand.packCount, qtyPerPack: cand.qtyPerPack, unit: d.unit, createdAt: initial?.createdAt || Date.now(),
      stock: d.track ? toBase(tryDec(fromInput(d.stockIn)) || Dec.ZERO, d.stockUnit || BASE_UNIT[dimOf(d.unit)]).toString() : null,
      stockMin: d.track && tryDec(fromInput(d.stockMinIn)) ? toBase(D(fromInput(d.stockMinIn)), d.stockUnit || BASE_UNIT[dimOf(d.unit)]).toString() : null,
    });
  };
  return (
    <Sheet title={initial ? initial.name : t("ing.new")} onClose={onClose} onSave={save}>
      <Field label={t("ing.name")} error={showErr && errors.name}>
        <input className="input" value={d.name} onChange={(e) => up({ name: e.target.value })} placeholder={t("ing.namePh")} autoFocus={!initial} />
      </Field>
      <Field label={t("ing.price")} hint={t("ing.priceHint")} error={showErr && errors.price}>
        <NumInput value={d.price} onChange={(v) => up({ price: v })} placeholder={t("ing.pricePh")} suffix={sym(cur)} invalid={showErr && !!errors.price} />
      </Field>
      <Field label={t("ing.form")} hint={t("ing.formHint")}>
        <Combo value={d.packLabel} onChange={(v) => up({ packLabel: v })} existing={existingForms} suggestions={tList("ing.forms")} placeholder={t("ing.formPh")} />
      </Field>
      <label className="toggle">
        <input type="checkbox" checked={d.multi} onChange={(e) => up({ multi: e.target.checked })} />
        <span>{t("ing.multi")}</span>
      </label>
      {d.multi && (
        <Field label={t("ing.packs")} error={showErr && errors.packs}>
          <NumInput value={d.packCount} onChange={(v) => up({ packCount: v })} placeholder={t("ing.packsPh")} suffix={t("ing.packsSuffix")} />
        </Field>
      )}
      <Field label={d.multi ? t("ing.eachContains") : t("ing.contains")} error={showErr && errors.qty}>
        <div className="pair">
          <NumInput value={d.qtyPerPack} onChange={(v) => up({ qtyPerPack: v })} placeholder={t("ing.qtyPh")} invalid={showErr && !!errors.qty} />
          <select className="input unit" value={d.unit} onChange={(e) => up({ unit: e.target.value })} aria-label={t("items.unit")}>
            {INGREDIENT_UNITS.map((u) => <option key={u} value={u}>{uLabel(u, true)}</option>)}
          </select>
        </div>
      </Field>
      {res.ok ? (
        <div className="result">
          <span className="result-label">{t("ing.unitCost")}</span>
          <span className="result-value" dir="ltr">{unitCostFmt(res.v.perBase, res.v.baseUnit, cur)}</span>
          <span className="result-calc"><bdi>{money(res.v.price, cur)} ÷ {qtyFmt(res.v.totalBase, res.v.baseUnit)}</bdi>
            {res.v.dim === "masse" && t("ing.perKg", { v: money(res.v.perBase.mul(1000), cur) })}
            {res.v.dim === "volume" && t("ing.perL", { v: money(res.v.perBase.mul(1000), cur) })}
          </span>
        </div>
      ) : (
        <div className="result pending"><span className="result-label">{t("ing.unitCost")}</span><span className="muted">{t("ing.pending")}</span></div>
      )}
      <Field label={t("c.category")} hint={t("ing.catHint")}>
        <Combo value={d.category} onChange={(v) => up({ category: v })} existing={existingCats} suggestions={tList("ing.defaultCats")} placeholder={t("ing.catPh")} />
      </Field>
      <label className="toggle">
        <input type="checkbox" checked={!!d.track} onChange={(e) => up({ track: e.target.checked, stockUnit: d.stockUnit || BASE_UNIT[dimOf(d.unit)] })} />
        <span>{t("st.track")}</span>
      </label>
      {d.track && (
        <>
          <Field label={t("st.current")} hint={t("st.currentHint")}>
            <div className="pair">
              <NumInput value={d.stockIn || ""} onChange={(v) => up({ stockIn: v })} placeholder="0" />
              <select className="input unit" value={d.stockUnit || BASE_UNIT[dimOf(d.unit)]} onChange={(e) => up({ stockUnit: e.target.value })} aria-label={t("items.unit")}>
                {compatibleUnits(BASE_UNIT[dimOf(d.unit)]).map((u) => <option key={u} value={u}>{uLabel(u, true)}</option>)}
              </select>
            </div>
          </Field>
          <Field label={t("st.min")} hint={t("st.minHint")}>
            <NumInput value={d.stockMinIn || ""} onChange={(v) => up({ stockMinIn: v })} placeholder="0" suffix={uLabel(d.stockUnit || BASE_UNIT[dimOf(d.unit)], true)} />
          </Field>
        </>
      )}
      {initial && (deps.preparations.length > 0 || deps.recipes.length > 0) && (
        <Notice>{t("ing.impact", { p: deps.preparations.length, r: deps.recipes.length })}</Notice>
      )}
      {history.length > 0 && (
        <section className="block-section">
          <h3>{t("ing.history")}</h3>
          <ul className="history">
            {history.map((h) => {
              const up2 = h.oldPrice !== null && D(h.newPrice).cmp(h.oldPrice) > 0;
              const down = h.oldPrice !== null && D(h.newPrice).cmp(h.oldPrice) < 0;
              return (
                <li key={h.id}>
                  <span className="muted">{dateFmt(h.at)}</span>
                  <span dir="ltr">{h.oldPrice === null ? t("ing.createdAt", { v: money(D(h.newPrice), cur) }) : <>{money(D(h.oldPrice), cur)} → <strong>{money(D(h.newPrice), cur)}</strong></>}</span>
                  {up2 && <TrendingUp size={16} className="loss" />}{down && <TrendingDown size={16} className="gain" />}
                </li>
              );
            })}
          </ul>
        </section>
      )}
      {initial && <DeleteZone blockers={direct} what={t("ing.this")} onDelete={() => onDelete(initial.id)} />}
    </Sheet>
  );
}

function IngredientsScreen({ data, update, engine, notify, account }) {
  const cur = data.settings.currency;
  const [q, setQ] = useState(""); const [cat, setCat] = useState(""); const [edit, setEdit] = useState(null);
  const list = filterList(data.ingredients, q, cat);
  const save = async (ing) => {
    const isNew = !data.ingredients.some((x) => x.id === ing.id);
    if (isNew && !account.signedIn && !data.subscription?.premium && data.ingredients.length >= FREE.ingredients) return account.showPaywall();
    if (!(await account.push(() => Cloud.saveIngredient(ing)))) return;
    update((prev) => {
      const old = prev.ingredients.find((x) => x.id === ing.id);
      const history = [...prev.priceHistory];
      const desc = packDesc(ing, "fr");
      if (!old) history.push({ id: uid(), ingredientId: ing.id, oldPrice: null, newPrice: ing.price, newDesc: desc, at: Date.now() });
      else if (!D(old.price).eq(ing.price) || packDesc(old, "fr") !== desc) history.push({ id: uid(), ingredientId: ing.id, oldPrice: old.price, newPrice: ing.price, oldDesc: packDesc(old, "fr"), newDesc: desc, at: Date.now() });
      return { ...prev, ingredients: old ? prev.ingredients.map((x) => (x.id === ing.id ? ing : x)) : [...prev.ingredients, ing], priceHistory: history };
    });
    notify(edit?.id ? t("ing.updated") : t("ing.added"));
    setEdit(null);
  };
  const del = async (id) => {
    if (!(await account.push(() => Cloud.deleteIngredient(id)))) return;
    update((p) => ({ ...p, ingredients: p.ingredients.filter((x) => x.id !== id), priceHistory: p.priceHistory.filter((h) => h.ingredientId !== id) }));
    notify(t("ing.deleted")); setEdit(null);
  };
  return (
    <>
      <ScreenHead title={t("ing.title")} subtitle={t("ing.subtitle")} onAdd={() => setEdit({})}
        extra={data.ingredients.length > 0 && <button className="icon-btn" onClick={() => exportIngredientsPdf(data)} aria-label={t("c.exportPdf")} title={t("c.exportPdf")}><FileDown size={20} /></button>} />
      {data.ingredients.length === 0 ? (
        <Empty icon={ShoppingBasket} title={t("ing.emptyTitle")} text={t("ing.emptyText")} action={t("ing.emptyAction")} onAction={() => setEdit({})} />
      ) : (
        <>
          <SearchBar value={q} onChange={setQ} placeholder={t("ing.search")} />
          <CategoryCircles items={data.ingredients} value={cat} onChange={setCat}
            order={data.settings.catOrder} onOrder={(o) => update((p) => ({ ...p, settings: { ...p.settings, catOrder: o } }))} />
          <div className="list">
            {list.map((i) => {
              const r = (() => { try { return ingredientUnitCost(i); } catch { return null; } })();
              const st = stockState(i);
              const sub = st
                ? `${packDesc(i)} · ${st.negative ? t("st.negative") : stockLabel(i)}`
                : `${packDesc(i)}, ${money(D(i.price), cur)}`;
              return <Row key={i.id} title={i.name} sub={sub} tone={st && (st.negative || st.low) ? "loss" : ""}
                value={r ? money(r.perBase, cur, 3) : "—"} valueSub={r ? `/ ${uLabel(r.baseUnit)}` : ""} onClick={() => setEdit(i)} />;
            })}
            {!list.length && <p className="muted pad">{t("c.noMatch")}</p>}
          </div>
        </>
      )}
      {edit && <IngredientEditor initial={edit.id ? edit : null} data={data} engine={engine} onSave={save} onDelete={del} onClose={() => setEdit(null)} />}
    </>
  );
}

/* ─────────── Préparations ─────────── */
function PreparationEditor({ initial, data, onSave, onDelete, onClose }) {
  const cur = data.settings.currency;
  const [d, setD] = useState(() => initial
    ? { ...initial, category: initial.category || "", yieldQty: toInput(initial.yieldQty), items: toDraftItems(initial.items) }
    : { name: "", category: "", yieldQty: "", yieldUnit: "g", items: [], notes: "" });
  const up = (p) => setD((x) => ({ ...x, ...p }));
  const [showErr, setShowErr] = useState(false);
  const id = initial?.id || "__draft__";
  const draftPrep = { id, name: d.name || t("err.thisPrep"), yieldQty: fromInput(d.yieldQty), yieldUnit: d.yieldUnit, items: fromDraftItems(d.items) };
  const engine = useMemo(() => new CostEngine({ ...data, preparations: [...data.preparations.filter((p) => p.id !== id), draftPrep] }), [data, d]); // eslint-disable-line
  const res = engine.safe(() => engine.preparation(id));
  const errors = { name: !d.name.trim() ? t("f.namePrep") : null, yield: !tryDec(fromInput(d.yieldQty))?.isPos() ? t("f.yieldReq") : null, lines: linesValid(engine, d.items) };
  const valid = !Object.values(errors).some(Boolean) && res.ok;
  const blockers = initial ? [
    ...data.preparations.filter((p) => p.items.some((i) => i.kind === "preparation" && i.refId === initial.id)).map((p) => quote(p.name)),
    ...data.recipes.filter((r) => r.items.some((i) => i.kind === "preparation" && i.refId === initial.id)).map((r) => quote(r.name)),
  ] : [];
  const users = initial ? new CostEngine(data).dependentsOf("preparation", initial.id).recipes : [];
  const existingCats = uniq(data.preparations.map((p) => p.category));
  const save = () => {
    if (!valid) return setShowErr(true);
    onSave({ id: initial?.id || uid(), name: d.name.trim(), category: snapCategory(d.category, existingCats), yieldQty: fromInput(d.yieldQty), yieldUnit: d.yieldUnit, items: fromDraftItems(d.items), notes: d.notes || "", createdAt: initial?.createdAt || Date.now() });
  };
  const sample = res.ok && (res.value.dim === "masse" ? "100 g" : res.value.dim === "volume" ? "100 ml" : null);
  return (
    <Sheet title={initial ? initial.name : t("prep.new")} onClose={onClose} onSave={save}>
      <Field label={t("prep.name")} error={showErr && errors.name}>
        <input className="input" value={d.name} onChange={(e) => up({ name: e.target.value })} placeholder={t("prep.namePh")} autoFocus={!initial} />
      </Field>
      <section className="block-section">
        <h3>{t("prep.uses")}</h3>
        <p className="muted small">{t("prep.usesHint")}</p>
        <ItemsEditor items={d.items} onChange={(items) => up({ items })} data={data} engine={engine} excludePrepId={id} cur={cur} />
        {showErr && errors.lines && <span className="field-err"><AlertTriangle size={14} />{errors.lines}</span>}
      </section>
      <Field label={t("prep.yield")} hint={t("prep.yieldHint")} error={showErr && errors.yield}>
        <div className="pair">
          <NumInput value={d.yieldQty} onChange={(v) => up({ yieldQty: v })} placeholder={t("prep.yieldPh")} />
          <select className="input unit" value={d.yieldUnit} onChange={(e) => up({ yieldUnit: e.target.value })} aria-label={t("items.unit")}>
            {YIELD_UNITS.map((u) => <option key={u} value={u}>{uLabel(u, true)}</option>)}
          </select>
        </div>
      </Field>
      {res.ok ? (
        <div className="result">
          <span className="result-label">{t("prep.cost")}</span>
          <span className="result-value" dir="ltr">{unitCostFmt(res.value.perBase, res.value.baseUnit, cur)}</span>
          <span className="result-calc">{t("prep.calc", { t: money(res.value.total, cur), q: qtyFmt(toBase(D(fromInput(d.yieldQty)), d.yieldUnit), res.value.baseUnit) })}{sample && t("prep.sample", { v: money(res.value.perBase.mul(100), cur), s: sample })}</span>
        </div>
      ) : (
        <div className="result pending"><span className="result-label">{t("prep.cost")}</span><span className="muted">{t("prep.pending")}</span></div>
      )}
      <Field label={t("c.category")} hint={t("c.optional")}>
        <Combo value={d.category} onChange={(v) => up({ category: v })} existing={existingCats} suggestions={tList("prep.defaultCats")} placeholder={t("prep.catPh")} />
      </Field>
      {users.length > 0 && <Notice>{t("prep.usedIn", { list: users.map((r) => r.name).join(", ") })}</Notice>}
      {res.ok && valid && <button className="btn-secondary block" onClick={() => exportPreparationPdf(draftPrep, res.value, data)}><FileDown size={20} />{t("prep.exportSheet")}</button>}
      {initial && <DeleteZone blockers={blockers} what={t("prep.this")} onDelete={() => onDelete(initial.id)} />}
    </Sheet>
  );
}

function PreparationsScreen({ data, update, engine, notify, account }) {
  const cur = data.settings.currency;
  const [q, setQ] = useState(""); const [cat, setCat] = useState(""); const [edit, setEdit] = useState(null);
  const list = filterList(data.preparations, q, cat);
  const save = async (p) => {
    const isNew = !data.preparations.some((x) => x.id === p.id);
    if (isNew && !account.signedIn && !data.subscription?.premium && data.preparations.length >= FREE.preparations) return account.showPaywall();
    if (!(await account.push(() => Cloud.savePreparation(p)))) return;
    update((prev) => ({ ...prev, preparations: prev.preparations.some((x) => x.id === p.id) ? prev.preparations.map((x) => (x.id === p.id ? p : x)) : [...prev.preparations, p] }));
    notify(edit?.id ? t("prep.updated") : t("prep.created")); setEdit(null);
  };
  const del = async (id) => {
    if (!(await account.push(() => Cloud.deletePreparation(id)))) return;
    update((p) => ({ ...p, preparations: p.preparations.filter((x) => x.id !== id) })); notify(t("prep.deleted")); setEdit(null);
  };
  return (
    <>
      <ScreenHead title={t("prep.title")} subtitle={t("prep.subtitle")} onAdd={() => setEdit({})}
        extra={data.preparations.length > 0 && <button className="icon-btn" onClick={() => exportPreparationsListPdf(data, engine)} aria-label={t("c.exportPdf")} title={t("c.exportPdf")}><FileDown size={20} /></button>} />
      {data.preparations.length === 0 ? (
        <Empty icon={Soup} title={t("prep.emptyTitle")} text={t("prep.emptyText")} action={t("prep.emptyAction")} onAction={() => setEdit({})} />
      ) : (
        <>
          <SearchBar value={q} onChange={setQ} placeholder={t("prep.search")} />
          <CategoryCircles items={data.preparations} value={cat} onChange={setCat}
            order={data.settings.catOrderPrep} onOrder={(o) => update((p) => ({ ...p, settings: { ...p.settings, catOrderPrep: o } }))} />
          <div className="list">
            {list.map((p) => {
              const r = engine.safe(() => engine.preparation(p.id));
              return <Row key={p.id} title={p.name} sub={r.ok ? t("prep.rowSub", { t: money(r.value.total, cur), q: qtyFmt(D(p.yieldQty), p.yieldUnit) }) : r.error} tone={r.ok ? "" : "loss"}
                value={r.ok ? money(r.value.perBase, cur, 3) : t("c.toComplete")} valueSub={r.ok ? `/ ${uLabel(r.value.baseUnit)}` : ""} onClick={() => setEdit(p)} />;
            })}
            {!list.length && <p className="muted pad">{t("c.noMatch")}</p>}
          </div>
        </>
      )}
      {edit && <PreparationEditor initial={edit.id ? edit : null} data={data} onSave={save} onDelete={del} onClose={() => setEdit(null)} />}
    </>
  );
}

/* ─────────── Recettes ─────────── */
function Glossary() {
  const terms = ["cost", "margin", "rate", "mark", "rev", "profit"];
  return (
    <details className="glossary">
      <summary><Info size={16} />{t("gl.title")}</summary>
      <dl>{terms.map((k) => <div key={k}><dt>{t(`gl.${k}T`)}</dt><dd>{t(`gl.${k}D`)}</dd></div>)}</dl>
    </details>
  );
}

function RecipeEditor({ initial, data, onSave, onDelete, onClose }) {
  const s = data.settings; const cur = s.currency;
  const [d, setD] = useState(() => initial
    ? { ...initial, category: initial.category || "", yieldPieces: toInput(initial.yieldPieces), items: toDraftItems(initial.items), ratePct: initial.targetRate ? toInput(trimZeros(D(initial.targetRate).mul(100).toFixed(2))) : "", sellingPrice: toInput(initial.sellingPrice || "") }
    : { name: "", category: "", yieldPieces: "1", items: [], marginMode: s.marginMode, ratePct: toInput(s.defaultRatePct || ""), sellingPrice: "" });
  const up = (p) => setD((x) => ({ ...x, ...p }));
  const [showErr, setShowErr] = useState(false);
  const [simQty, setSimQty] = useState("100");
  const engine = useMemo(() => new CostEngine(data), [data]);
  const rate = tryDec(fromInput(d.ratePct));
  const draft = { id: initial?.id || "__draft__", name: d.name || t("err.thisRecipe"), yieldPieces: fromInput(d.yieldPieces), items: fromDraftItems(d.items), marginMode: d.marginMode,
    targetRate: rate ? rate.div(100).toString() : "", sellingPrice: fromInput(d.sellingPrice) };
  const res = engine.safe(() => engine.recipeOf(draft));
  const rateErr = d.ratePct !== "" && (!rate || (d.marginMode === "prix_vente" && rate.cmp(100) >= 0)) ? t("f.rateMax") : null;
  const errors = {
    name: !d.name.trim() ? t("f.nameRecipe") : null,
    pieces: !tryDec(fromInput(d.yieldPieces))?.isPos() ? t("f.piecesReq") : null,
    lines: linesValid(engine, d.items), rate: rateErr,
    price: d.sellingPrice !== "" && !tryDec(fromInput(d.sellingPrice)) ? t("f.priceInvalid") : null,
  };
  const valid = !Object.values(errors).some(Boolean) && res.ok;
  const perPiece = res.ok ? res.value.perPiece : null;
  const indicative = perPiece && rate && !rateErr ? suggestedPrice(perPiece, rate.div(100), d.marginMode) : null;
  const chosen = tryDec(fromInput(d.sellingPrice));
  const price = chosen || indicative;
  const a = perPiece && price ? analyzeMargin(perPiece, price) : null;
  const sim = tryDec(fromInput(simQty));
  const lbl = priceLabelText(s);
  const blockers = initial ? data.productions.filter((p) => p.lines.some((l) => l.recipeId === initial.id)).map((p) => t("del.inProd", { d: dateFmt(p.date) })) : [];
  const existingCats = uniq(data.recipes.map((r) => r.category));
  const save = () => {
    if (!valid) return setShowErr(true);
    onSave({ id: initial?.id || uid(), name: d.name.trim(), category: snapCategory(d.category, existingCats), yieldPieces: fromInput(d.yieldPieces), items: fromDraftItems(d.items), marginMode: d.marginMode,
      targetRate: draft.targetRate, sellingPrice: chosen ? fromInput(d.sellingPrice) : "", createdAt: initial?.createdAt || Date.now() });
  };
  return (
    <Sheet title={initial ? initial.name : t("rec.new")} onClose={onClose} onSave={save}>
      <Field label={t("rec.name")} error={showErr && errors.name}>
        <input className="input" value={d.name} onChange={(e) => up({ name: e.target.value })} placeholder={t("rec.namePh")} autoFocus={!initial} />
      </Field>
      <Field label={t("rec.pieces")} hint={t("rec.piecesHint")} error={showErr && errors.pieces}>
        <NumInput value={d.yieldPieces} onChange={(v) => up({ yieldPieces: v })} placeholder="1" suffix={uLabel("piece", true)} />
      </Field>
      <section className="block-section">
        <h3>{t("rec.composition")}</h3>
        <p className="muted small">{t("rec.compositionHint")}</p>
        <ItemsEditor items={d.items} onChange={(items) => up({ items })} data={data} engine={engine} cur={cur} />
        {showErr && errors.lines && <span className="field-err"><AlertTriangle size={14} />{errors.lines}</span>}
      </section>
      {res.ok ? (
        <Ticket label={t("rec.costLabel")} value={<>{money(res.value.perPiece, cur)}<small> / {uLabel("piece")}</small></>}
          sub={!res.value.pieces.eq(1) ? t("rec.batch", { t: money(res.value.batchTotal, cur), q: qtyFmt(res.value.pieces, "piece") }) : t("rec.onePiece")} />
      ) : (
        <div className="result pending"><span className="result-label">{t("rec.costLabel")}</span><span className="muted">{d.items.length ? res.error : t("rec.pending")}</span></div>
      )}
      {res.ok && <Breakdown res={res.value} cur={cur} />}
      <section className="block-section">
        <h3>{t("rec.priceTitle")}</h3>
        <Field label={t("rec.marginHow")}>
          <Segmented value={d.marginMode} onChange={(v) => up({ marginMode: v })} options={[{ value: "prix_vente", label: t("mode.price") }, { value: "cout", label: t("mode.cost") }]} />
        </Field>
        <Field label={t("rec.marginWanted")} hint={d.marginMode === "prix_vente" ? t("rec.marginHintPrice") : t("rec.marginHintCost")} error={errors.rate}>
          <NumInput value={d.ratePct} onChange={(v) => up({ ratePct: v })} placeholder={t("rec.marginPh")} suffix="%" />
        </Field>
        {indicative && (
          <div className="indicative">
            <div><span className="muted small">{t("rec.indicative")}{lbl}</span><strong dir="ltr">{money(indicative, cur)}</strong></div>
            <button className="btn-secondary" onClick={() => up({ sellingPrice: toInput(indicative.toFixed(2)) })}>{t("rec.useThis")}</button>
          </div>
        )}
        <Field label={t("rec.yourPrice") + lbl} hint={t("rec.yourPriceHint")} error={errors.price}>
          <NumInput value={d.sellingPrice} onChange={(v) => up({ sellingPrice: v })} placeholder={indicative ? toInput(indicative.toFixed(2)) : t("rec.pricePh")} suffix={sym(cur)} />
        </Field>
        {a && (
          <>
            {a.unitMargin.isNeg() && <Notice tone="loss">{t("rec.loss", { v: money(a.unitMargin, cur) })}</Notice>}
            <div className="stats">
              <div className="stat"><span>{t("st.margin")}</span><strong dir="ltr" className={a.unitMargin.isNeg() ? "loss" : "gain"}>{money(a.unitMargin, cur)}</strong></div>
              <div className="stat"><span>{t("st.markup")}</span><strong dir="ltr">{pct(a.onPrice)}</strong><small>{t("st.onPrice")}</small></div>
              <div className="stat"><span>{t("st.marginRate")}</span><strong dir="ltr">{pct(a.onCost)}</strong><small>{t("st.onCost")}</small></div>
              <div className="stat"><span>{t("st.coef")}</span><strong dir="ltr">{a.coef ? `× ${fmtNum(a.coef.toFixed(2))}` : "—"}</strong><small>{t("st.coefSub")}</small></div>
            </div>
            <div className="sim">
              <div className="sim-head"><span>{t("sim.for")}</span><NumInput value={simQty} onChange={setSimQty} ariaLabel={t("sim.qty")} suffix={uLabel("piece", true)} /></div>
              {sim && sim.isPos() && (
                <dl className="sim-grid">
                  <dt>{t("sim.cost")}</dt><dd dir="ltr">{money(perPiece.mul(sim), cur)}</dd>
                  <dt>{t("sim.revenue")}</dt><dd dir="ltr">{money(price.mul(sim), cur)}</dd>
                  <dt>{t("sim.margin")}</dt><dd dir="ltr" className={a.unitMargin.isNeg() ? "loss" : "gain"}>{money(a.unitMargin.mul(sim), cur)}</dd>
                </dl>
              )}
            </div>
          </>
        )}
        <Glossary />
      </section>
      <Field label={t("c.category")} hint={t("c.optional")}>
        <Combo value={d.category} onChange={(v) => up({ category: v })} existing={existingCats} suggestions={tList("rec.defaultCats")} placeholder={t("rec.catPh")} />
      </Field>
      {valid && <button className="btn-secondary block" onClick={() => exportRecipePdf(draft, res.value, data)}><FileDown size={20} />{t("rec.exportSheet")}</button>}
      {initial && <DeleteZone blockers={blockers} what={t("rec.this")} onDelete={() => onDelete(initial.id)} />}
    </Sheet>
  );
}

function RecipesScreen({ data, update, engine, notify, account }) {
  const cur = data.settings.currency;
  const [q, setQ] = useState(""); const [cat, setCat] = useState(""); const [edit, setEdit] = useState(null);
  const list = filterList(data.recipes, q, cat);
  const save = async (r) => {
    const isNew = !data.recipes.some((x) => x.id === r.id);
    if (isNew && !account.signedIn && !data.subscription?.premium && data.recipes.length >= FREE.recipes) return account.showPaywall();
    if (!(await account.push(() => Cloud.saveRecipe(r)))) return;
    update((prev) => ({ ...prev, recipes: prev.recipes.some((x) => x.id === r.id) ? prev.recipes.map((x) => (x.id === r.id ? r : x)) : [...prev.recipes, r] }));
    notify(edit?.id ? t("rec.updated") : t("rec.created")); setEdit(null);
  };
  const del = async (id) => {
    if (!(await account.push(() => Cloud.deleteRecipe(id)))) return;
    update((p) => ({ ...p, recipes: p.recipes.filter((x) => x.id !== id) })); notify(t("rec.deleted")); setEdit(null);
  };
  return (
    <>
      <ScreenHead title={t("rec.title")} subtitle={t("rec.subtitle")} onAdd={() => setEdit({})}
        extra={data.recipes.length > 0 && <button className="icon-btn" onClick={() => exportCostsReportPdf(data, engine)} aria-label={t("rec.report")} title={t("rec.report")}><FileDown size={20} /></button>} />
      {data.recipes.length === 0 ? (
        <Empty icon={Cake} title={t("rec.emptyTitle")} text={t("rec.emptyText")} action={t("rec.emptyAction")} onAction={() => setEdit({})} />
      ) : (
        <>
          <SearchBar value={q} onChange={setQ} placeholder={t("rec.search")} />
          <CategoryCircles items={data.recipes} value={cat} onChange={setCat}
            order={data.settings.catOrderRec} onOrder={(o) => update((p) => ({ ...p, settings: { ...p.settings, catOrderRec: o } }))} />
          <div className="list">
            {list.map((r) => {
              const res = engine.safe(() => engine.recipe(r.id));
              if (!res.ok) return <Row key={r.id} title={r.name} sub={res.error} value={t("c.toComplete")} tone="loss" onClick={() => setEdit(r)} />;
              const price = effectivePrice(r, res.value.perPiece);
              const a = price ? analyzeMargin(res.value.perPiece, price) : null;
              return <Row key={r.id} title={r.name} sub={price ? t("rec.sold", { p: money(price, cur), m: money(a.unitMargin, cur) }) : t("rec.noPrice")}
                value={money(res.value.perPiece, cur)} valueSub={`/ ${uLabel("piece")}`} tone={a && a.unitMargin.isNeg() ? "loss" : ""} onClick={() => setEdit(r)} />;
            })}
            {!list.length && <p className="muted pad">{t("c.noMatch")}</p>}
          </div>
        </>
      )}
      {edit && <RecipeEditor initial={edit.id ? edit : null} data={data} onSave={save} onDelete={del} onClose={() => setEdit(null)} />}
    </>
  );
}

/* ─────────── Production ─────────── */
const today = () => new Date().toISOString().slice(0, 10);
function nextLot(productions) {
  const nums = productions.map((p) => p.lot).filter((l) => /^\d+$/.test(l || ""));
  if (!nums.length) return "";
  const last = nums.reduce((a, b) => (Number(b) > Number(a) ? b : a));
  return String(Number(last) + 1).padStart(last.length, "0");
}
function ProductionEditor({ initial, data, engine, onSave, onDelete, onClose }) {
  const cur = data.settings.currency;
  const [d, setD] = useState(() => initial
    ? { ...initial, lines: initial.lines.map((l) => ({ ...l, key: uid(), quantity: toInput(l.quantity) })) }
    : { date: today(), lot: nextLot(data.productions), notes: "", lines: [{ key: uid(), recipeId: "", quantity: "" }] });
  const up = (p) => setD((x) => ({ ...x, ...p }));
  const setLine = (i, p) => up({ lines: d.lines.map((l, j) => (j === i ? { ...l, ...p } : l)) });
  const [showErr, setShowErr] = useState(false);
  const clean = d.lines.map((l) => ({ recipeId: l.recipeId, quantity: fromInput(l.quantity) }));
  const res = engine.safe(() => computeProduction(engine, data.recipes, clean));
  const valid = d.date && d.lines.length > 0 && res.ok;
  const recipes = [...data.recipes].sort(byName);
  const save = () => { if (!valid) return setShowErr(true); onSave({ id: initial?.id || uid(), date: d.date, lot: (d.lot || "").trim(), notes: d.notes || "", lines: clean, createdAt: initial?.createdAt || Date.now() }); };
  return (
    <Sheet title={initial ? t("prod.of", { d: dateFmt(initial.date) }) : t("prod.new")} onClose={onClose} onSave={save}>
      <div className="pair">
        <Field label={t("prod.date")}><input className="input" type="date" value={d.date} onChange={(e) => up({ date: e.target.value })} /></Field>
        <Field label={t("prod.lot")}><input className="input" value={d.lot} onChange={(e) => up({ lot: e.target.value })} placeholder={t("c.optional")} /></Field>
      </div>
      <section className="block-section">
        <h3>{t("prod.what")}</h3>
        <div className="items">
          {d.lines.map((l, i) => {
            const r = data.recipes.find((x) => x.id === l.recipeId);
            const lc = r ? engine.safe(() => engine.recipe(r.id)) : null;
            const q = tryDec(fromInput(l.quantity));
            return (
              <div className="item" key={l.key}>
                <div className="item-top">
                  <select className="input" value={l.recipeId} onChange={(e) => setLine(i, { recipeId: e.target.value })} aria-label={t("prod.recipe")}>
                    <option value="">{t("prod.choose")}</option>
                    {recipes.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                  </select>
                  <button className="icon-btn" onClick={() => up({ lines: d.lines.filter((_, j) => j !== i) })} aria-label={t("items.remove")}><Trash2 size={18} /></button>
                </div>
                <div className="item-bottom">
                  <NumInput value={l.quantity} onChange={(v) => setLine(i, { quantity: v })} placeholder={t("items.qtyPh")} suffix={uLabel("piece", true)} ariaLabel={t("prod.qty")} />
                </div>
                <div className="item-cost">
                  {lc && !lc.ok && <span className="err-text">{lc.error}</span>}
                  {lc && lc.ok && <><span className="muted" dir="ltr">{money(lc.value.perPiece, cur)} / {uLabel("piece")}{q && q.isPos() ? ` × ${numShort(q)}` : ""}</span>{q && q.isPos() && <strong dir="ltr">{money(lc.value.perPiece.mul(q), cur)}</strong>}</>}
                </div>
              </div>
            );
          })}
          <button className="btn-secondary block" onClick={() => up({ lines: [...d.lines, { key: uid(), recipeId: "", quantity: "" }] })}><Plus size={20} />{t("prod.addLine")}</button>
        </div>
        {showErr && !res.ok && <span className="field-err"><AlertTriangle size={14} />{res.error}</span>}
      </section>
      {res.ok && (
        <>
          <Ticket label={t("prod.total")} value={money(res.value.totalCost, cur)} sub={t("prod.totalSub", { q: qtyFmt(res.value.totalQuantity, "piece") })} />
          <div className="stats">
            <div className="stat"><span>{t("prod.revenue")}</span><strong dir="ltr">{money(res.value.revenue, cur)}</strong></div>
            <div className="stat"><span>{t("prod.margin")}</span><strong dir="ltr" className={res.value.margin.isNeg() ? "loss" : "gain"}>{money(res.value.margin, cur)}</strong></div>
          </div>
          {res.value.incomplete && <Notice tone="warn">{t("prod.incomplete")}</Notice>}
          {(() => {
            const use = engine.productionConsumption(data.recipes, clean);
            const rows = [...use].map(([id, q]) => ({ ing: data.ingredients.find((x) => x.id === id), q }))
              .filter((x) => x.ing).sort((a, b) => a.ing.name.localeCompare(b.ing.name, LOCALES[LANG]));
            if (!rows.length) return null;
            return (
              <div className="breakdown">
                <span className="breakdown-title">{t("st.willUse")}</span>
                {rows.map(({ ing, q }) => {
                  const st = stockState(ing);
                  const after = st ? st.qty.sub(q) : null;
                  return (
                    <div className="bd-row" key={ing.id}>
                      <span>{ing.name}{st && <em> · {t("st.left", { q: qtyFmt(st.qty, st.unit) })}</em>}</span>
                      <strong className={after && after.isNeg() ? "loss" : ""}>
                        {qtyFmt(q, BASE_UNIT[dimOf(ing.unit)])}
                      </strong>
                    </div>
                  );
                })}
              </div>
            );
          })()}
          <Notice>{t("prod.auto")}</Notice>
        </>
      )}
      <Field label={t("prod.notes")} hint={t("c.optional")}><textarea className="input" rows={2} value={d.notes} onChange={(e) => up({ notes: e.target.value })} /></Field>
      {res.ok && valid && <button className="btn-secondary block" onClick={() => exportProductionPdf({ ...d, lines: clean }, res.value, data)}><FileDown size={20} />{t("c.exportPdf")}</button>}
      {initial && <DeleteZone blockers={[]} what={t("prod.this")} onDelete={() => onDelete(initial.id)} />}
    </Sheet>
  );
}
function ProductionScreen({ data, update, engine, notify, account, goRecipes }) {
  const cur = data.settings.currency;
  const [edit, setEdit] = useState(null);
  const list = [...data.productions].sort((a, b) => (b.date + (b.lot || "")).localeCompare(a.date + (a.lot || "")));
  const save = async (p) => {
    const before = data.productions.find((x) => x.id === p.id);
    if (!(await account.push(() => Cloud.saveProduction(p)))) return;
    update((prev) => ({ ...prev, productions: prev.productions.some((x) => x.id === p.id) ? prev.productions.map((x) => (x.id === p.id ? p : x)) : [...prev.productions, p] }));
    // le stock suit : on annule l'ancienne consommation, on applique la nouvelle
    const undo = before ? engine.productionConsumption(data.recipes, before.lines) : new Map();
    const use = engine.productionConsumption(data.recipes, p.lines);
    const deltas = new Map();
    for (const [id, q] of undo) deltas.set(id, q);
    for (const [id, q] of use) deltas.set(id, (deltas.get(id) || Dec.ZERO).sub(q));
    await account.applyStock(deltas, "production", p.id, t("st.afterProd"));
    setEdit(null);
  };
  const del = async (id) => {
    const prod = data.productions.find((x) => x.id === id);
    if (!(await account.push(() => Cloud.deleteProduction(id)))) return;
    update((p) => ({ ...p, productions: p.productions.filter((x) => x.id !== id) }));
    if (prod) await account.applyStock(engine.productionConsumption(data.recipes, prod.lines), "undo", null, t("prod.deleted"));
    else notify(t("prod.deleted"));
    setEdit(null);
  };
  return (
    <>
      <ScreenHead title={t("prod.title")} subtitle={t("prod.subtitle")} onAdd={data.recipes.length ? () => setEdit({}) : null} />
      {!data.recipes.length ? (
        <Empty icon={Factory} title={t("prod.needTitle")} text={t("prod.needText")} action={t("prod.goRecipes")} onAction={goRecipes} />
      ) : !list.length ? (
        <Empty icon={Factory} title={t("prod.emptyTitle")} text={t("prod.emptyText")} action={t("prod.new")} onAction={() => setEdit({})} />
      ) : (
        <div className="list">
          {list.map((p) => {
            const r = engine.safe(() => computeProduction(engine, data.recipes, p.lines));
            return <Row key={p.id} title={dateFmt(p.date) + (p.lot ? t("prod.lotRow", { l: p.lot }) : "")} sub={r.ok ? t("prod.rowSub", { q: qtyFmt(r.value.totalQuantity, "piece"), m: money(r.value.margin, cur) }) : r.error}
              value={r.ok ? money(r.value.totalCost, cur) : "—"} valueSub={t("prod.totalShort")} onClick={() => setEdit(p)} />;
          })}
        </div>
      )}
      {edit && <ProductionEditor initial={edit.id ? edit : null} data={data} engine={engine} onSave={save} onDelete={del} onClose={() => setEdit(null)} />}
    </>
  );
}

/* ─────────── Accueil ─────────── */
function HomeScreen({ data, engine, go }) {
  const cur = data.settings.currency;
  const steps = [["ingredients", data.ingredients.length], ["preparations", data.preparations.length], ["recipes", data.recipes.length], ["production", data.productions.length]]
    .map(([tab, n], i) => ({ tab, done: n > 0, title: t(`home.s${i + 1}t`), text: t(`home.s${i + 1}x`) }));
  const key = (x) => (x.a?.onPrice ? Number(x.a.onPrice.toFixed(6)) : -99);
  const products = data.recipes.map((r) => {
    const res = engine.safe(() => engine.recipe(r.id));
    if (!res.ok) return { r, ok: false };
    const price = effectivePrice(r, res.value.perPiece);
    return { r, ok: true, cost: res.value.perPiece, price, a: price ? analyzeMargin(res.value.perPiece, price) : null };
  }).sort((x, y) => key(y) - key(x));
  const changes = data.priceHistory.filter((h) => h.oldPrice !== null).slice(-5).reverse();
  const alerts = data.ingredients.filter((i) => { const st = stockState(i); return st && (st.negative || st.low); }).sort(byName).slice(0, 6);
  return (
    <>
      <div className="hello">
        <h1>{data.settings.businessName || t("home.hello")}</h1>
        <p className="muted">{t("home.counts", { a: data.ingredients.length, b: data.preparations.length, c: data.recipes.length })}</p>
      </div>
      {!steps.every((s) => s.done) && (
        <section className="block-section">
          <h3>{t("home.start")}</h3>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={i} className={s.done ? "done" : ""}>
                <button onClick={() => go(s.tab)}>
                  <span className="step-n">{s.done ? <Check size={16} /> : i + 1}</span>
                  <span><strong>{s.title}</strong><span className="muted small">{s.text}</span></span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
      {products.length > 0 && (
        <section className="block-section">
          <div className="section-row"><h3>{t("home.products")}</h3><button className="btn-ghost" onClick={() => exportCostsReportPdf(data, engine)}><FileDown size={18} />{t("rec.report")}</button></div>
          <p className="muted small">{t("home.productsHint")}</p>
          <div className="list">
            {products.map(({ r, ok, cost, price, a }) => (
              <Row key={r.id} title={r.name} onClick={() => go("recipes")}
                sub={!ok ? t("home.toComplete") : price ? t("home.soldRate", { p: money(price, cur), r: pct(a.onPrice) }) : t("home.noPrice")}
                value={ok ? money(cost, cur) : "—"} valueSub={ok ? t("home.costPiece") : ""} tone={a && a.unitMargin.isNeg() ? "loss" : ""} />
            ))}
          </div>
        </section>
      )}
      {alerts.length > 0 && (
        <section className="block-section">
          <h3>{t("st.title")}</h3>
          <div className="list">
            {alerts.map((i) => {
              const st = stockState(i);
              return <Row key={i.id} title={i.name} sub={st.negative ? t("st.negative") : t("st.low")} tone="loss"
                value={qtyFmt(st.qty, st.unit)} onClick={() => go("ingredients")} />;
            })}
          </div>
        </section>
      )}
      {changes.length > 0 && (
        <section className="block-section">
          <h3>{t("home.changes")}</h3>
          <ul className="history">
            {changes.map((h) => {
              const ing = data.ingredients.find((i) => i.id === h.ingredientId);
              const upP = D(h.newPrice).cmp(h.oldPrice) > 0;
              return (
                <li key={h.id}>
                  <span><strong>{ing?.name || t("home.product")}</strong> <span className="muted small">{dateFmt(h.at)}</span></span>
                  <span dir="ltr">{money(D(h.oldPrice), cur)} → <strong>{money(D(h.newPrice), cur)}</strong></span>
                  {upP ? <TrendingUp size={16} className="loss" /> : <TrendingDown size={16} className="gain" />}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}

/* ─────────── Paramètres & bienvenue ─────────── */
function LangSelect({ value, onChange }) {
  return (
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)} aria-label={t("set.language")}>
      {LANGS.map((l) => <option key={l} value={l} lang={l}>{LANG_NAMES[l]}</option>)}
    </select>
  );
}
function CurrencySelect({ value, onChange }) {
  return (
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)} dir="ltr">
      {CURRENCIES.map((c) => <option key={c} value={c}>{c} ({sym(c)})</option>)}
    </select>
  );
}
function SettingsScreen({ data, update, notify, account }) {
  const s = data.settings;
  const [adminOpen, setAdmin] = useState(false);
  const set = (p) => {
    update((prev) => {
      const next = { ...prev, settings: { ...prev.settings, ...p } };
      if (account.signedIn) account.push(() => Cloud.saveProfile(next.settings));
      return next;
    });
  };
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <ScreenHead title={t("set.title")} />
      <Field label={t("set.language")} hint={t("set.pdfArabic") || undefined}>
        <LangSelect value={s.lang} onChange={(l) => set({ lang: l })} />
      </Field>
      <Field label={t("set.business")} hint={t("set.businessHint")}>
        <input className="input" value={s.businessName} onChange={(e) => set({ businessName: e.target.value })} placeholder={t("set.businessPh")} />
      </Field>
      <Field label={t("set.theme")} hint={t("set.themeHint")}>
        <Segmented value={s.theme || "auto"} onChange={(v) => set({ theme: v })}
          options={[{ value: "auto", label: t("theme.auto") }, { value: "light", label: t("theme.light") }, { value: "dark", label: t("theme.dark") }]} />
      </Field>
      <Field label={t("set.currency")} hint={t("set.currencyHint")}>
        <CurrencySelect value={s.currency} onChange={(c) => set({ currency: c })} />
      </Field>
      <Field label={t("set.priceLabel")} hint={t("set.priceLabelHint")}>
        <Segmented value={s.priceLabel} onChange={(v) => set({ priceLabel: v })} options={[{ value: "aucun", label: t("set.noLabel") }, { value: "HT", label: t("set.HT") }, { value: "TTC", label: t("set.TTC") }]} />
      </Field>
      <Field label={t("set.defaultMode")}>
        <Segmented value={s.marginMode} onChange={(v) => set({ marginMode: v })} options={[{ value: "prix_vente", label: t("mode.price") }, { value: "cout", label: t("mode.cost") }]} />
      </Field>
      <Field label={t("set.defaultRate")} hint={t("c.optional")}>
        <NumInput value={toInput(s.defaultRatePct)} onChange={(v) => set({ defaultRatePct: fromInput(v) })} placeholder={t("rec.marginPh")} suffix="%" />
      </Field>
      <AccountSection data={data} signedIn={account.signedIn} email={account.email}
        onAuth={account.openAuth} onSignOut={account.signOut} onDelete={account.deleteAccount} />
      {account.admin && (
        <section className="block-section">
          <h3>{t("adm.title")}</h3>
          <button className="btn-secondary block" onClick={() => setAdmin(true)}>{t("adm.open")}</button>
        </section>
      )}
      <section className="block-section">
        <h3>{t("set.erase")}</h3>
        {!confirm ? <button className="btn-ghost danger" onClick={() => setConfirm(true)}><Trash2 size={18} />{t("set.eraseBtn")}</button> : (
          <div className="delete-confirm">
            <p>{t("set.eraseText")}</p>
            <div className="btn-pair">
              <button className="btn-secondary" onClick={() => setConfirm(false)}>{t("c.cancel")}</button>
              <button className="btn-danger" onClick={() => { update(() => { const e = emptyData(); return { ...e, settings: { ...e.settings, onboarded: true, entered: true, currency: s.currency, lang: s.lang } }; }); setConfirm(false); notify(t("set.erased")); }}><Trash2 size={18} />{t("set.eraseBtn")}</button>
            </div>
          </div>
        )}
      </section>
      {adminOpen && <AdminSheet data={data} notify={notify} onClose={() => setAdmin(false)} />}
    </>
  );
}


/* ─── Pictogrammes du parcours d'accueil, dessinés pour Mizanerie ─── */
const P = (d, k) => <path key={k} d={d} />;
const Pic = ({ paths, extra }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {paths.map(P)}{extra}
  </svg>
);
/* Pâtissier : part de gâteau à étages avec sa bougie */
const IcPastry = () => <Pic paths={["M4.6 20.4h14.8", "M5.6 20.4v-6.2h12.8v6.2", "M7.4 14.2V9.6h9.2v4.6", "M12 9.6V6.8"]}
  extra={<circle cx="12" cy="5.3" r="1.2" />} />;
/* Boulanger : miche de pain avec ses grignes */
const IcBread = () => <Pic paths={["M3.4 12.6c0-2.8 2.3-5 5.1-5h6.8c2.9 0 5.3 2.4 5.3 5.3 0 2-1.6 3.7-3.6 3.7H7.6a4.2 4.2 0 0 1-4.2-4z",
  "M8.4 10.6l1.4 2.2", "M12 10.4l1.4 2.2", "M15.6 10.6l1.3 2"]} />;
/* Traiteur : cloche de service */
const IcCater = () => <Pic paths={["M3.2 17.4h17.6", "M5 17.4a7 7 0 0 1 14 0", "M12 10.4V8.6"]}
  extra={<circle cx="12" cy="7.4" r="1.1" />} />;
/* Restauration rapide : burger */
const IcFast = () => <Pic paths={["M4 9.6c0-2.6 3.6-4.6 8-4.6s8 2 8 4.6", "M3.8 12.4h16.4", "M4.4 15.6h15.2a4 4 0 0 1-4 3.8H8.4a4 4 0 0 1-4-3.8z"]} />;
/* Autre : trois douceurs variées */
const IcOther = () => <Pic paths={["M6.2 20.2V13a2.8 2.8 0 1 1 5.6 0v7.2", "M14 20.2v-4.4a2.4 2.4 0 1 1 4.8 0v4.4", "M3.6 20.4h16.8", "M9 7.2V4.6"]} />;
/* Domicile : maison avec fumée */
const IcHome2 = () => <Pic paths={["M4 11 12 4.6 20 11", "M6 12.4v7.8h12v-7.8", "M10.4 20.2v-4.4h3.2v4.4"]} />;
/* Boutique : devanture avec store */
const IcShop = () => <Pic paths={["M3.6 8.6 5.2 4.6h13.6l1.6 4", "M3.6 8.6h16.8v2a2.6 2.6 0 0 1-5.2 0 2.6 2.6 0 0 1-5.2 0 2.6 2.6 0 0 1-5.2 0z",
  "M5.4 13.2v7h13.2v-7", "M9.6 20.2v-4.4h4.8v4.4"]} />;
/* Laboratoire : batteur sur socle */
const IcLab = () => <Pic paths={["M5 4.8h9.6a4.4 4.4 0 0 1 0 8.8H5z", "M8.4 13.6v3", "M11.6 13.6v3", "M5.6 19.4h9.2", "M5 4.8v14.6"]} />;
/* Marchés : camionnette de vente */
const IcMarket = () => <Pic paths={["M2.8 16.4V8.2h10.4v8.2", "M13.2 10.6h3.4l3.6 3.4v2.4", "M2.8 16.4h2", "M9.4 16.4h5.4"]}
  extra={<><circle cx="6.6" cy="17.8" r="1.7" /><circle cx="17" cy="17.8" r="1.7" /></>} />;
/* Pas encore de vente : graine qui pousse */
const IcSeed = () => <Pic paths={["M12 20.4v-6.6", "M12 13.8c0-2.6 2.1-4.7 4.7-4.7 0 2.6-2.1 4.7-4.7 4.7z", "M12 15.4c-2.3 0-4.2-1.9-4.2-4.2 2.3 0 4.2 1.9 4.2 4.2z"]} />;
/* Un peu : deux personnes */
const IcFew = () => <Pic paths={["M4.2 19.6a4 4 0 0 1 7.6 0", "M14 19.6a4 4 0 0 1 5.8-3.4"]}
  extra={<><circle cx="8" cy="9.4" r="2.8" /><circle cx="16.6" cy="10.6" r="2.3" /></>} />;
/* Régulièrement : courbe qui monte */
const IcRegular = () => <Pic paths={["M3.6 19.4h16.8", "M6.4 16.2l4-4.4 3.2 2.6 4.4-5.4", "M14.8 8.6h3.6v3.4"]} />;
/* Marges : jauge selon le niveau */
const IcGauge = ({ level }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
    <path d="M4.2 17.4a8.4 8.4 0 0 1 15.6 0" />
    <path d={level === 1 ? "M12 16.6 7.8 12.4" : level === 2 ? "M12 16.6V10.6" : "M12 16.6l4.2-4.2"} strokeWidth="2" />
    <circle cx="12" cy="17" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
/* Je ne sais pas : point d'interrogation */
const IcUnknown = () => <Pic paths={["M9.4 9.4a2.7 2.7 0 1 1 3.4 2.6c-.9.3-1.4 1-1.4 1.9v.5", "M11.4 17.8v.01"]}
  extra={<circle cx="12" cy="12" r="8.6" />} />;

/* ════════════════════════════════════════════════════════════════════════
   PARCOURS D'ACCUEIL — une question par écran, réponse en un geste
   ════════════════════════════════════════════════════════════════════════ */
function OptionCard({ selected, onSelect, icon, title, sub }) {
  return (
    <button type="button" className={`opt${selected ? " on" : ""}`} onClick={onSelect} aria-pressed={selected}>
      {icon && <span className="opt-ico" aria-hidden>{icon}</span>}
      <span className="opt-txt">
        <span className="opt-title">{title}</span>
        {sub && <span className="opt-sub">{sub}</span>}
      </span>
      <span className="opt-radio" aria-hidden />
    </button>
  );
}

function Onboarding({ lang, onLang, onDone }) {
  const [i, setI] = useState(0);
  const [a, setA] = useState({ trade: "", workplace: "", selling: "", currency: lang === "fr" || lang === "ar" ? "MAD" : "EUR", name: "", ratePct: "50" });
  const up = (p) => setA((x) => ({ ...x, ...p }));

  const trades = [["t1", <IcPastry />], ["t2", <IcBread />], ["t3", <IcCater />], ["t4", <IcFast />], ["t5", <IcOther />]];
  const places = [["p1", <IcHome2 />], ["p2", <IcShop />], ["p3", <IcLab />], ["p4", <IcMarket />]];
  const sells = [["s1", <IcSeed />], ["s2", <IcFew />], ["s3", <IcRegular />]];
  const margins = [["m1", "30", <IcGauge level={1} />], ["m2", "50", <IcGauge level={2} />], ["m3", "65", <IcGauge level={3} />], ["m4", "50", <IcUnknown />]];

  const steps = [
    { key: "trade", q: "ob.tradeQ", s: "ob.tradeS",
      body: <div className="opts">{trades.map(([k, ic]) => (
        <OptionCard key={k} icon={ic} selected={a.trade === k} onSelect={() => up({ trade: k })} title={t("ob." + k)} sub={t("ob." + k + "s")} />
      ))}</div>, ok: !!a.trade },
    { key: "place", q: "ob.placeQ", s: "ob.placeS",
      body: <div className="opts">{places.map(([k, ic]) => (
        <OptionCard key={k} icon={ic} selected={a.workplace === k} onSelect={() => up({ workplace: k })} title={t("ob." + k)} />
      ))}</div>, ok: !!a.workplace },
    { key: "sell", q: "ob.sellQ", s: "ob.sellS",
      body: <div className="opts">{sells.map(([k, ic]) => (
        <OptionCard key={k} icon={ic} selected={a.selling === k} onSelect={() => up({ selling: k })} title={t("ob." + k)} sub={k === "s2" ? null : t("ob." + k + "s")} />
      ))}</div>, ok: !!a.selling },
    { key: "currency", q: "ob.currencyQ", s: "ob.currencyS",
      body: <div className="opts">{CURRENCIES.slice(0, 6).map((c) => (
        <OptionCard key={c} selected={a.currency === c} onSelect={() => up({ currency: c })} title={`${c} · ${sym(c)}`} />
      ))}
        <div className="opt-more"><CurrencySelect value={a.currency} onChange={(c) => up({ currency: c })} /></div>
      </div>, ok: !!a.currency },
    { key: "margin", q: "ob.marginQ", s: "ob.marginS",
      body: <div className="opts">{margins.map(([k, v, ic]) => (
        <OptionCard key={k} icon={ic} selected={a.mk === k} onSelect={() => up({ ratePct: v, mk: k })} title={t("ob." + k)} sub={t("ob." + k + "s")} />
      ))}</div>, ok: !!a.mk },
    { key: "name", q: "ob.nameQ", s: "ob.nameS", skippable: true,
      body: <input className="input big" value={a.name} onChange={(e) => up({ name: e.target.value })} placeholder={t("set.businessPh")} autoFocus />, ok: true },
  ];

  const last = steps.length;           // écran récapitulatif
  const step = i < last ? steps[i] : null;
  const pct = Math.round(((i + 1) / (last + 1)) * 100);

  const finish = () => onDone({
    businessName: a.name.trim(), currency: a.currency, defaultRatePct: a.ratePct,
    trade: a.trade, workplace: a.workplace, selling: a.selling,
  });

  return (
    <div className="ob">
      <header className="ob-head">
        {i > 0 ? (
          <button className="ob-back" onClick={() => setI(i - 1)} aria-label={t("ob.back")}><ChevronLeft size={22} className="flip-rtl" /></button>
        ) : <div className="ob-lang"><LangSelect value={lang} onChange={onLang} /></div>}
        <div className="ob-bar"><span style={{ width: pct + "%" }} /></div>
      </header>

      <div className="ob-body">
        {step ? (
          <>
            <h1>{t(step.q)}</h1>
            <p className="ob-sub">{t(step.s)}</p>
            <div className="ob-content">{step.body}</div>
          </>
        ) : (
          <>
            <div className="ob-done" aria-hidden><Check size={28} /></div>
            <h1>{t("ob.readyT")}</h1>
            <p className="ob-sub">{t("ob.readyS")}</p>
            <dl className="recap">
              <div><dt>{t("ob.recapTrade")}</dt><dd>{t("ob." + a.trade)}</dd></div>
              <div><dt>{t("ob.recapPlace")}</dt><dd>{t("ob." + a.workplace)}</dd></div>
              <div><dt>{t("ob.recapCurrency")}</dt><dd>{a.currency} · {sym(a.currency)}</dd></div>
              <div><dt>{t("ob.recapMargin")}</dt><dd>{a.ratePct} %</dd></div>
            </dl>
            <p className="muted small">{t("ob.firstStep")}</p>
          </>
        )}
      </div>

      <footer className="ob-foot">
        {step ? (
          <>
            <button className="btn-dark block" disabled={!step.ok} onClick={() => setI(i + 1)}>{t("ob.next")}</button>
            {step.skippable && <button className="btn-ghost block" onClick={() => setI(i + 1)}>{t("ob.skip")}</button>}
          </>
        ) : (
          <button className="btn-dark block" onClick={finish}>{t("ob.start")}</button>
        )}
      </footer>
    </div>
  );
}

/** Écran d'entrée : le choix du compte avant tout le reste. */
function Gate({ lang, onLang, onAuth, onGuest }) {
  return (
    <div className="welcome">
      <div className="welcome-card">
        <div className="gate-lang"><LangSelect value={lang} onChange={onLang} /></div>
        <img src={LOGO} alt="Mizanerie" className="welcome-logo" width={128} height={128} />
        <h1>Mizanerie</h1>
        <p className="gate-tagline">{t("gate.tagline")}</p>
        <p>{t("gate.pitch")}</p>
        <button className="btn-dark block" onClick={() => onAuth("signup")}>{t("acc.signUp")}</button>
        <button className="btn-secondary block" onClick={() => onAuth("signin")}>{t("acc.haveAccount")}</button>
        <button className="btn-ghost block" onClick={onGuest}>{t("gate.guest")}</button>
        <p className="muted small center">{t("gate.guestHint", { a: FREE.ingredients, b: FREE.preparations, c: FREE.recipes })}</p>
      </div>
    </div>
  );
}

function Welcome({ lang, onLang, onDone }) {
  const [name, setName] = useState(""); const [cur, setCur] = useState(lang === "fr" || lang === "ar" ? "MAD" : "EUR");
  return (
    <div className="welcome">
      <div className="welcome-card">
        <h1>{t("gate.setup")}</h1>
        <p>{t("w.text")}</p>
        <Field label={t("set.business")} hint={t("w.businessHint")}>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("set.businessPh")} />
        </Field>
        <Field label={t("w.currency")}><CurrencySelect value={cur} onChange={setCur} /></Field>
        <button className="btn-primary block" onClick={() => onDone(name.trim(), cur)}>{t("w.start")}</button>
      </div>
    </div>
  );
}



/* Œil : afficher ou masquer le mot de passe */
const IcEye = ({ off }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2.4 12S6.2 5.6 12 5.6 21.6 12 21.6 12 17.8 18.4 12 18.4 2.4 12 2.4 12z" />
    <circle cx="12" cy="12" r="3.1" />
    {off && <path d="M4 20 20 4" strokeWidth="2" />}
  </svg>
);

/* ─────────── Compte : connexion, inscription, mot de passe oublié ─────────── */
function AuthSheet({ mode: initialMode, onClose, onDone }) {
  const [mode, setMode] = useState(initialMode || "signup"); // signup | signin | forgot
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [info, setInfo] = useState(null);
  const [stay, setStay] = useState(true);
  const [showPwd, setShowPwd] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const pwdOk = pwd.length >= 8;
  const canSubmit = emailOk && (mode === "forgot" || pwdOk) && !busy;

  const run = async () => {
    setBusy(true); setErr(null); setInfo(null);
    try {
      Cloud.setPersist(stay);
      if (mode === "forgot") { await Cloud.resetPassword(email); setInfo(t("acc.resetSent")); }
      else if (mode === "signin") { await Cloud.signIn(email, pwd); await onDone(); }
      else {
        const r = await Cloud.signUp(email, pwd);
        if (r.signedIn) await onDone(); else setInfo(t("acc.confirmSent"));
      }
    } catch (e) { setErr(t(e.code || "auth.generic")); }
    setBusy(false);
  };

  const title = mode === "signin" ? t("acc.signIn") : mode === "forgot" ? t("acc.forgot") : t("acc.signUp");
  return (
    <Sheet title={title} onClose={onClose}>
      <Notice>{t("acc.syncOff")}</Notice>
      <Field label={t("acc.email")}>
        <input className="input" type="email" inputMode="email" autoComplete="email" autoCapitalize="none"
          value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nom@exemple.com" />
      </Field>
      {mode !== "forgot" && (
        <Field label={t("acc.password")} hint={mode === "signup" ? t("acc.passwordHint") : undefined}>
          <div className="input-wrap">
            <input className="input pwd" type={showPwd ? "text" : "password"}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              autoCapitalize="none" autoCorrect="off" spellCheck="false"
              value={pwd} onChange={(e) => setPwd(e.target.value)} />
            <button type="button" className="eye" onClick={() => setShowPwd((v) => !v)}
              aria-label={t(showPwd ? "acc.hidePwd" : "acc.showPwd")} aria-pressed={showPwd}>
              <IcEye off={showPwd} />
            </button>
          </div>
        </Field>
      )}
      {mode !== "forgot" && (
        <label className="toggle">
          <input type="checkbox" checked={stay} onChange={(e) => setStay(e.target.checked)} />
          <span>{t("gate.stay")}<span className="muted small block-hint">{t("gate.stayHint")}</span></span>
        </label>
      )}
      {err && <Notice tone="loss">{err}</Notice>}
      {info && <Notice tone="info">{info}</Notice>}
      <button className="btn-primary block" disabled={!canSubmit} onClick={run}>
        {busy ? t("acc.working") : mode === "forgot" ? t("acc.sendReset") : title}
      </button>
      <div className="auth-links">
        {mode !== "forgot" && (
          <button className="btn-ghost" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); setInfo(null); }}>
            {mode === "signin" ? t("acc.noAccount") : t("acc.haveAccount")}
          </button>
        )}
        {mode === "signin" && <button className="btn-ghost" onClick={() => { setMode("forgot"); setErr(null); }}>{t("acc.forgot")}</button>}
        {mode === "forgot" && <button className="btn-ghost" onClick={() => { setMode("signin"); setInfo(null); }}>{t("acc.signIn")}</button>}
      </div>
    </Sheet>
  );
}

/* ─────────── Fenêtre de limite gratuite ─────────── */
function Paywall({ onClose, onSignUp, signedIn }) {
  return (
    <div className="sheet-backdrop paywall-backdrop">
      <div className="paywall" role="dialog" aria-modal="true">
        <h2>{t("pw.title")}</h2>
        <p className="muted">{t("pw.intro")}</p>
        <ul className="pw-list">
          {["pw.f1", "pw.f2", "pw.f3", "pw.f4"].map((k) => <li key={k}><Check size={18} />{t(k)}</li>)}
        </ul>
        <Notice>{t("pw.soon")}</Notice>
        {!signedIn && <button className="btn-primary block" onClick={onSignUp}>{t("acc.signUp")}</button>}
        <button className="btn-ghost block" onClick={onClose}>{t("pw.later")}</button>
        <p className="muted small center">{t("pw.price")}</p>
      </div>
    </div>
  );
}


/* ─────────── Écran d'administration ─────────── */
function AdminSheet({ data, onClose, notify }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(null);
  const [ask, setAsk] = useState(null);   // compte en attente de durée

  const load = async () => {
    try { setRows(await Cloud.adminListUsers()); setErr(null); }
    catch (e) { setErr(t(e.code === "net.offline" ? "net.offline" : "db.generic")); }
  };
  useEffect(() => { load(); }, []);

  const apply = async (row, plan, months) => {
    setBusy(row.user_id); setAsk(null);
    try { await Cloud.adminSetPlan(row.user_id, plan, months); await load(); notify(t("adm.done")); }
    catch (e) { notify(t(e.code === "net.offline" ? "net.offline" : "db.generic")); }
    setBusy(null);
  };

  const list = (rows || []).filter((r) => norm(r.email).includes(norm(q)));
  const premium = (rows || []).filter((r) => r.plan === "premium" && (!r.expires_at || new Date(r.expires_at) > new Date())).length;
  const me = Cloud.getSession()?.user?.id;

  return (
    <Sheet title={t("adm.title")} onClose={onClose}>
      <p className="muted" style={{ marginTop: -6, marginBottom: 14 }}>{t("adm.subtitle")}</p>
      <Notice>{t("adm.privacy")}</Notice>
      {err && <Notice tone="loss">{err}</Notice>}
      {rows === null && !err && <p className="muted">{t("acc.working")}</p>}

      {rows && (
        <>
          <p className="muted small" style={{ marginBottom: 10 }}>
            {t("adm.count", { n: rows.length })} · {t("adm.premiumCount", { n: premium })}
          </p>
          <SearchBar value={q} onChange={setQ} placeholder={t("adm.search")} />
          <div className="admin-list">
            {list.map((r) => {
              const active = r.plan === "premium" && (!r.expires_at || new Date(r.expires_at) > new Date());
              const expired = r.plan === "premium" && r.expires_at && new Date(r.expires_at) <= new Date();
              return (
                <div className="admin-row" key={r.user_id}>
                  <div className="admin-main">
                    <span className="admin-mail">{r.email}</span>
                    <span className="muted small">
                      {t("adm.since", { d: dateFmt(r.created_at) })}
                      {r.last_sign_in_at ? " · " + t("adm.seen", { d: dateFmt(r.last_sign_in_at) }) : ""}
                    </span>
                    <span className="admin-tags">
                      <span className={`tag ${active ? "on" : ""}`}>{active ? t("pw.premium") : t("pw.free")}</span>
                      {active && <span className="muted small">{r.expires_at ? t("adm.until", { d: dateFmt(r.expires_at) }) : t("adm.unlimited")}</span>}
                      {expired && <span className="muted small">{t("adm.expired", { d: dateFmt(r.expires_at) })}</span>}
                      {r.is_admin && <span className="tag">{t("adm.admin")}</span>}
                      {r.user_id === me && <span className="tag">{t("adm.you")}</span>}
                    </span>
                  </div>
                  {ask === r.user_id ? (
                    <div className="admin-durations">
                      <span className="muted small">{t("adm.duration")}</span>
                      <div className="dur-btns">
                        {[["adm.d1", 1], ["adm.d3", 3], ["adm.d12", 12], ["adm.dInf", null]].map(([k, m]) => (
                          <button key={k} className="btn-secondary small-btn" onClick={() => apply(r, "premium", m)}>{t(k)}</button>
                        ))}
                      </div>
                      <button className="btn-ghost" onClick={() => setAsk(null)}>{t("c.cancel")}</button>
                    </div>
                  ) : (
                    <button className={active ? "btn-secondary small-btn" : "btn-primary small-btn"}
                      disabled={busy === r.user_id}
                      onClick={() => (active ? apply(r, "free", null) : setAsk(r.user_id))}>
                      {busy === r.user_id ? "…" : active ? t("adm.revoke") : t("adm.grant")}
                    </button>
                  )}
                </div>
              );
            })}
            {!list.length && <p className="muted pad">{t("adm.empty")}</p>}
          </div>
        </>
      )}
    </Sheet>
  );
}

/* ─────────── Bloc compte dans les paramètres ─────────── */
function AccountSection({ data, signedIn, email, onAuth, onSignOut, onDelete }) {
  const [confirm, setConfirm] = useState(false);
  const sub = data.subscription || { plan: "free" };
  return (
    <section className="block-section">
      <h3>{t("acc.title")}</h3>
      {signedIn ? (
        <>
          <div className="account-box">
            <span className="muted small">{t("acc.email")}</span>
            <strong>{email}</strong>
            <span className="muted small" style={{ marginTop: 8 }}>{t("pw.plan")}</span>
            <strong>{sub.premium ? t("pw.premium") : t("pw.free")}</strong>
          </div>
          <Notice>{t("acc.syncOn")}</Notice>
          <button className="btn-secondary block" onClick={onSignOut}>{t("acc.signOut")}</button>
          {!confirm ? (
            <button className="btn-ghost danger" onClick={() => setConfirm(true)}><Trash2 size={18} />{t("acc.deleteTitle")}</button>
          ) : (
            <div className="delete-confirm">
              <p>{t("acc.deleteText")}</p>
              <div className="btn-pair">
                <button className="btn-secondary" onClick={() => setConfirm(false)}>{t("c.cancel")}</button>
                <button className="btn-danger" onClick={onDelete}><Trash2 size={18} />{t("c.delete")}</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <Notice tone="warn">{t("acc.syncOff")}</Notice>
          <button className="btn-dark block" onClick={() => onAuth("signup")}>{t("acc.signUp")}</button>
          <button className="btn-ghost block" onClick={() => onAuth("signin")}>{t("acc.haveAccount")}</button>
        </>
      )}
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   9. APPLICATION
   ════════════════════════════════════════════════════════════════════════ */
const FREE = { ingredients: 15, preparations: 1, recipes: 1 };

const TABS = [
  { id: "home", label: "nav.home", icon: Home },
  { id: "ingredients", label: "nav.ingredients", icon: ShoppingBasket },
  { id: "preparations", label: "nav.preps", short: "nav.prepsShort", icon: Soup },
  { id: "recipes", label: "nav.recipes", icon: Cake },
  { id: "production", label: "nav.production", short: "nav.productionShort", icon: Factory },
];

export default function App() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("home");
  const [toast, setToast] = useState(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const [signedIn, setSignedIn] = useState(Cloud.isSignedIn());
  const [authMode, setAuthMode] = useState(null);
  const [paywall, setPaywall] = useState(false);
  const [admin, setAdmin] = useState(false);
  const loaded = useRef(false);
  const toastTimer = useRef(null);

  const notify = (msg) => { setToast(msg); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 2800); };

  // Chargement : nuage si connecté, sinon appareil
  useEffect(() => { (async () => {
    if (Cloud.isSignedIn()) {
      try {
        const cloud = await Cloud.pullAll();
        setData(migrate({ ...emptyData(), ...cloud }));
        loaded.current = true;
        Cloud.isAdmin().then((v) => setAdmin(!!v)).catch(() => {});
        return;
      } catch (e) { if (e.code === "auth.expired") { await Cloud.signOut(); setSignedIn(false); } }
    }
    setData(migrate(await storage.load()));
    loaded.current = true;
  })(); }, []);

  // Sauvegarde locale (cache hors connexion et mode gratuit)
  useEffect(() => {
    if (!data || !loaded.current) return;
    const tm = setTimeout(async () => setSaveFailed(!(await storage.save(data))), 300);
    return () => clearTimeout(tm);
  }, [data]);

  /** Envoie une écriture au nuage quand l'utilisateur est connecté. */
  const push = async (fn) => {
    if (!Cloud.isSignedIn()) return true;
    try { await fn(); return true; }
    catch (e) {
      if (e.code === "limit") { setPaywall(true); return false; }
      if (e.code === "auth.expired") { await Cloud.signOut(); setSignedIn(false); }
      notify(t(e.code === "net.offline" ? "net.offline" : "db.generic"));
      return false;
    }
  };

  const afterSignIn = async () => {
    setAuthMode(null);
    setSignedIn(true);
    try {
      const local = data;
      const empty = await Cloud.isEmptyAccount();
      const hasLocal = local && (local.ingredients.length || local.preparations.length || local.recipes.length);
      if (empty && hasLocal) {
        notify(t("acc.uploading"));
        await Cloud.uploadLocal(local);
        notify(t("acc.uploaded"));
      } else {
        notify(t("acc.welcomeBack"));
      }
      const cloud = await Cloud.pullAll();
      setData(migrate({ ...emptyData(), ...cloud }));
      Cloud.isAdmin().then((v) => setAdmin(!!v)).catch(() => {});
    } catch (e) {
      if (e.code === "limit") setPaywall(true); else notify(t(e.code || "db.generic"));
    }
  };

  /** Applique des variations de stock : localement, et dans le compte si connecté. */
  const applyStock = async (deltas, reason, prodId, okMessage) => {
    const list = [...deltas].filter(([, q]) => !q.isZero());
    // on compte les dépassements tout de suite, avant la mise à jour de l'écran
    let negatives = 0;
    for (const [id, q] of deltas) {
      const ing = data?.ingredients.find((x) => x.id === id);
      if (ing && ing.stock !== null && ing.stock !== undefined && D(ing.stock).add(q).isNeg()) negatives += 1;
    }
    setData((prev) => {
      if (!prev) return prev;
      const ingredients = prev.ingredients.map((i) => {
        const d = deltas.get(i.id);
        if (!d || i.stock === null || i.stock === undefined) return i;
        return { ...i, stock: D(i.stock).add(d).toString() };
      });
      return { ...prev, ingredients };
    });
    if (Cloud.isSignedIn() && list.length) {
      try { await Cloud.applyStockMoves(list.map(([id, q]) => ({ id, delta: q.toString() })), reason, prodId); }
      catch (e) { notify(t(e.code === "net.offline" ? "net.offline" : "db.generic")); return; }
    }
    notify(negatives ? t("st.warnNeg", { n: negatives }) : okMessage);
  };

  const account = {
    signedIn,
    admin,
    applyStock,
    push,
    showPaywall: () => setPaywall(true),
    email: Cloud.userEmail(),
    openAuth: (mode) => setAuthMode(mode),
    signOut: async () => {
      await Cloud.signOut();
      setSignedIn(false);
      setAdmin(false);
      setData(migrate(await storage.load()));
      notify(t("acc.signedOut"));
    },
    deleteAccount: async () => {
      try { await Cloud.deleteAccount(); } catch { /* le compte peut déjà être parti */ }
      await Cloud.signOut();
      setSignedIn(false);
      const e = emptyData(); e.settings.onboarded = true;
      setData(e);
      await storage.save(e);
      notify(t("acc.deleted"));
    },
  };

  if (data) setLang(data.settings.lang);
  const dir = LANG === "ar" ? "rtl" : "ltr";

  // Mode sombre : suit le système, ou forcé par l'utilisateur
  const [sysDark, setSysDark] = useState(() => typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const h = (e) => setSysDark(e.matches);
    mq.addEventListener ? mq.addEventListener("change", h) : mq.addListener(h);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", h) : mq.removeListener(h));
  }, []);
  const themePref = data?.settings.theme || "auto";
  const dark = themePref === "dark" || (themePref === "auto" && sysDark);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#000000" : "#FFFFFF");
  }, [dark]);
  useEffect(() => { if (typeof document !== "undefined") { document.documentElement.lang = LANG; document.documentElement.dir = dir; } }, [dir, data?.settings.lang]);

  const update = (fn) => setData((prev) => fn(prev));
  const engine = useMemo(() => (data ? new CostEngine(data) : null), [data]);

  if (!data) return <div className={`app${dark ? " dark" : ""}`}><style>{CSS}</style><div className="loading">…</div></div>;

  const setLangPref = (l) => update((p) => ({ ...p, settings: { ...p.settings, lang: l } }));

  // 1) Écran d'entrée : tant que l'utilisateur n'a ni compte ni choix « sans compte »
  if (!signedIn && !data.settings.entered && !data.settings.onboarded) {
    return (
      <div className={`app${dark ? " dark" : ""}`} dir={dir} lang={LANG}><style>{CSS}</style>
        <Gate lang={data.settings.lang} onLang={setLangPref} onAuth={(m) => setAuthMode(m)}
          onGuest={() => update((p) => ({ ...p, settings: { ...p.settings, entered: true } }))} />
        {authMode && <AuthSheet mode={authMode} onClose={() => setAuthMode(null)} onDone={afterSignIn} />}
      </div>
    );
  }

  // 2) Parcours d'accueil : quelques questions pour adapter l'application
  if (!data.settings.onboarded) {
    return (
      <div className={`app${dark ? " dark" : ""}`} dir={dir} lang={LANG}><style>{CSS}</style>
        <Onboarding lang={data.settings.lang} onLang={setLangPref}
          onDone={(ans) => {
            update((p) => {
              const next = { ...p, settings: { ...p.settings, ...ans, onboarded: true, entered: true } };
              if (Cloud.isSignedIn()) push(() => Cloud.saveProfile(next.settings));
              return next;
            });
          }} />
      </div>
    );
  }
  const props = { data, update, engine, notify, account };
  return (
    <div className={`app${dark ? " dark" : ""}`} dir={dir} lang={LANG}>
      <style>{CSS}</style>
      <nav className="nav" aria-label={t("brand")}>
        <div className="brand"><img src={LOGO} alt="" width={32} height={32} /><span>{t("brand")}</span></div>
        {TABS.map((tb) => (
          <button key={tb.id} className={tab === tb.id ? "tab on" : "tab"} onClick={() => setTab(tb.id)} aria-current={tab === tb.id ? "page" : undefined}>
            <tb.icon size={29} strokeWidth={tab === tb.id ? 2.3 : 2} />
            {tb.short ? <><span className="lbl-short">{t(tb.short)}</span><span className="lbl-long">{t(tb.label)}</span></> : <span>{t(tb.label)}</span>}
          </button>
        ))}
        <button className={tab === "settings" ? "tab on settings-tab" : "tab settings-tab"} onClick={() => setTab("settings")}><Settings size={22} /><span>{t("nav.settings")}</span></button>
      </nav>
      <button className="settings-fab" onClick={() => setTab("settings")} aria-label={t("nav.settings")} title={t("nav.settings")}><Settings size={21} strokeWidth={1.9} /></button>
      <main className="main">
        {saveFailed && <Notice tone="warn">{t("app.saveFailed")}</Notice>}
        {tab === "home" && <HomeScreen data={data} engine={engine} go={setTab} />}
        {tab === "ingredients" && <IngredientsScreen {...props} />}
        {tab === "preparations" && <PreparationsScreen {...props} />}
        {tab === "recipes" && <RecipesScreen {...props} />}
        {tab === "production" && <ProductionScreen {...props} goRecipes={() => setTab("recipes")} />}
        {tab === "settings" && <SettingsScreen {...props} />}
      </main>
      {authMode && <AuthSheet mode={authMode} onClose={() => setAuthMode(null)} onDone={afterSignIn} />}
      {paywall && <Paywall signedIn={signedIn} onClose={() => setPaywall(false)} onSignUp={() => { setPaywall(false); setAuthMode("signup"); }} />}
      {toast && <div className="toast" role="status"><Check size={18} />{toast}</div>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   10. STYLES — sucre glace, cacao, framboise, pistache (propriétés logiques → arabe OK)
   ════════════════════════════════════════════════════════════════════════ */
const CSS = `
/* ════════════════════════════════════════════════════════════════════════
   Mizanerie — interface sobre : la police du système, du contraste,
   et la couleur réservée à ce qui compte.
   ════════════════════════════════════════════════════════════════════════ */
.app{
  --bg:#F5F5F7; --card:#FFFFFF; --ink:#0B0B0C; --ink-2:#3C3C43; --muted:#8A8A8E;
  --line:#E3E3E6; --hair:#D9D9DE;
  --rasp:#B40F51; --rasp-d:#8E0B40; --rasp-soft:#FCEDF3;
  --pista:#1E7A45; --pista-soft:#E9F5ED; --warn:#8A5A00; --warn-soft:#FDF3DF;
  --body:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,'Helvetica Neue','IBM Plex Sans Arabic',Arial,sans-serif;
  --display:var(--body);
  --r:14px; --r-lg:18px;
  min-height:100vh;background:var(--bg);color:var(--ink);font-family:var(--body);
  font-size:17px;line-height:1.45;letter-spacing:-.01em;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent}
.app[dir=rtl]{--body:'IBM Plex Sans Arabic',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;letter-spacing:0}
.app *{box-sizing:border-box}
.app :where(button){font:inherit;color:inherit;cursor:pointer}
h1,h2,h3{margin:0;letter-spacing:-.024em}
h1{font-size:32px;font-weight:700;line-height:1.12}
h3{font-size:17px;font-weight:600}
.muted{color:var(--muted)} .small{font-size:14px} .pad{padding:18px}
.loading{padding:60px;text-align:center;color:var(--muted)}
.main{padding:14px 16px 108px;max-width:720px;margin:0 auto}

/* ── Navigation ── */
.nav{position:fixed;inset-inline:0;bottom:0;z-index:20;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));
  background:rgba(255,255,255,.82);backdrop-filter:saturate(180%) blur(22px);-webkit-backdrop-filter:saturate(180%) blur(22px);
  border-top:.5px solid var(--hair);padding:6px 4px calc(6px + env(safe-area-inset-bottom))}
.brand,.tab.settings-tab{display:none}
.tab{display:flex;flex-direction:column;align-items:center;gap:5px;min-height:58px;justify-content:center;background:none;border:0;
  font-size:10.5px;font-weight:500;color:var(--ink-2);padding:4px 0;min-width:0;letter-spacing:-.005em}
.tab span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tab .lbl-long{display:none}
@media (min-width:420px){.tab .lbl-long{display:inline}.tab .lbl-short{display:none}}
.tab.on{color:var(--rasp);font-weight:600}
.settings-fab{position:fixed;top:10px;inset-inline-end:14px;z-index:15;width:40px;height:40px;border-radius:50%;border:.5px solid var(--hair);
  background:rgba(255,255,255,.8);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);color:var(--ink);display:grid;place-items:center}
.settings-fab:active{opacity:.5}
@media (min-width:900px){
  .nav{top:0;inset-inline-end:auto;width:250px;display:flex;flex-direction:column;border-top:0;border-inline-end:.5px solid var(--hair);
    padding:22px 12px;gap:2px;background:rgba(245,245,247,.9)}
  .brand{display:flex;align-items:center;gap:11px;font-weight:700;font-size:19px;padding:6px 12px 24px;letter-spacing:-.03em}
  .brand img{width:30px;height:30px;border-radius:8px}
  .tab{flex-direction:row;justify-content:flex-start;gap:12px;font-size:16px;padding:9px 12px;min-height:44px;border-radius:10px}
  .tab.on{background:rgba(180,15,81,.08)}
  .tab .lbl-long{display:inline}.tab .lbl-short{display:none}
  .tab.settings-tab{display:flex;margin-top:auto}
  .settings-fab{display:none}
  .main{margin-inline-start:250px;padding:40px 40px 60px;max-width:840px}
}
@media (min-width:1340px){.main{margin-inline-start:max(250px,calc((100vw - 840px)/2))}}

/* ── Titres d'écran ── */
.screen-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin:10px 0 18px;margin-inline-end:52px}
@media (min-width:900px){.screen-head{margin-inline-end:0}}
.screen-head p{margin:5px 0 0;font-size:15px;color:var(--muted);max-width:34em}
.head-actions{display:flex;gap:8px;align-items:center;flex:none}
.hello{margin:10px 0 22px;margin-inline-end:52px}.hello p{margin:5px 0 0;color:var(--muted)}

/* ── Boutons ── */
.btn-primary,.btn-secondary,.btn-danger,.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:52px;
  padding:0 22px;border-radius:999px;font-weight:600;font-size:17px;border:0;transition:opacity .12s,background .12s}
.btn-primary{background:#18181B;color:#fff}
.btn-primary:hover{background:#000}
.btn-primary:active,.btn-secondary:active,.btn-danger:active,.btn-ghost:active{opacity:.55}
.btn-primary:disabled{opacity:.35}
.btn-secondary{background:var(--card);border:1.5px solid #ECECEF;color:var(--ink)}
.btn-danger{background:#C8102E;color:#fff;border-radius:999px}
.btn-ghost{background:none;padding:0 8px;color:var(--ink);font-weight:500}
.btn-ghost.danger{color:#C8102E;margin-top:10px}
.block{width:100%}
.empty-cta{width:auto;padding:0 26px}
.fab{position:fixed;inset-inline-end:18px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:25;
  width:60px;height:60px;border-radius:50%;border:0;background:#18181B;color:#fff;display:grid;place-items:center;
  box-shadow:0 8px 24px rgba(0,0,0,.26);transition:transform .12s,opacity .12s}
.fab:active{transform:scale(.93);opacity:.85}
@media (min-width:900px){.fab{bottom:28px;inset-inline-end:32px}}
.icon-btn{width:44px;height:44px;flex:none;border-radius:12px;border:.5px solid var(--hair);background:var(--card);display:grid;place-items:center;color:var(--ink)}
.app[dir=rtl] .flip-rtl{transform:scaleX(-1)}
.app :focus-visible{outline:2.5px solid rgba(180,15,81,.55);outline-offset:2px}

/* ── Recherche et filtres ── */
.search{display:flex;align-items:center;gap:8px;background:rgba(118,118,128,.1);border:0;border-radius:11px;padding:0 12px;min-height:40px;margin-bottom:14px;color:var(--muted)}
.search input{border:0;outline:0;flex:1;font:inherit;font-size:17px;background:none;color:var(--ink);min-height:38px;min-width:0}
.chips{display:flex;gap:7px;overflow-x:auto;padding-bottom:14px;scrollbar-width:none}
.chips::-webkit-scrollbar{display:none}
.chip{flex:none;min-height:34px;padding:0 14px;border-radius:999px;border:0;background:rgba(118,118,128,.1);font-size:14.5px;font-weight:500;color:var(--ink-2)}
.chip.on{background:var(--ink);color:#fff}

/* ── Catégories en pastilles ── */
.cats{margin:2px 0 16px}
.cats-row{display:flex;gap:14px;overflow-x:auto;padding:4px 2px 8px;scrollbar-width:none}
.cats-row::-webkit-scrollbar{display:none}
.cat{display:flex;flex-direction:column;align-items:center;gap:6px;flex:none;width:72px}
.cat-btn{position:relative;width:60px;height:60px;border-radius:50%;border:1.5px solid var(--hair);background:var(--card);
  display:grid;place-items:center;font-size:26px;line-height:1;transition:transform .12s,border-color .12s}
.cat-btn:active{transform:scale(.94)}
.cat-btn.on{border-color:var(--ink);border-width:2px;background:var(--ink);color:#fff}
.cat-badge{position:absolute;top:-2px;inset-inline-end:-2px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;
  background:var(--rasp);color:#fff;font-size:11.5px;font-weight:700;display:grid;place-items:center;font-family:var(--body)}
.cat-label{font-size:12.5px;text-align:center;line-height:1.2;color:var(--ink-2);max-width:72px;overflow:hidden;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.cat-move{display:flex;gap:4px}
.cat-move button{width:26px;height:26px;border-radius:50%;border:.5px solid var(--hair);background:var(--card);font-size:16px;line-height:1;color:var(--ink)}
.cats-edit{margin-top:2px;padding:0;font-size:14.5px}

/* ── Sélecteur d'élément ── */
.picker-btn{flex:1;min-width:0;display:flex;align-items:center;gap:10px;min-height:48px;padding:0 12px;border-radius:12px;
  border:.5px solid var(--hair);background:var(--card);text-align:start;font-size:17px}
.picker-btn:active{background:rgba(118,118,128,.08)}
.picker-ico{flex:none;font-size:19px;width:24px;text-align:center}
.picker-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.picker-chev{color:var(--muted);font-size:20px}
.pick-list{display:flex;flex-direction:column;background:var(--card);border:.5px solid var(--hair);border-radius:var(--r-lg);overflow:hidden;margin-top:8px}
.pick-row{display:flex;align-items:center;gap:12px;min-height:58px;padding:10px 14px;border:0;background:none;text-align:start;position:relative}
.pick-row+.pick-row::before{content:"";position:absolute;top:0;inset-inline-start:48px;inset-inline-end:0;height:.5px;background:var(--hair)}
.pick-row:active{background:rgba(118,118,128,.08)}
.pick-ico{flex:none;width:30px;font-size:20px;text-align:center}
.pick-main{display:flex;flex-direction:column;min-width:0}
.pick-name{font-size:16.5px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ── Listes groupées ── */
.list{background:var(--card);border-radius:var(--r-lg);overflow:hidden;border:.5px solid var(--hair)}
.row{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;min-height:60px;background:none;border:0;text-align:start;position:relative}
.row+.row::before{content:"";position:absolute;top:0;inset-inline-start:16px;inset-inline-end:0;height:.5px;background:var(--hair)}
.row:active{background:rgba(118,118,128,.08)}
.row-main{display:flex;flex-direction:column;min-width:0;gap:1px}
.row-title{font-weight:500;font-size:17px;letter-spacing:-.015em}
.row-sub{font-size:14px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.row-val{text-align:right;font-weight:600;font-size:17px;font-variant-numeric:tabular-nums;white-space:nowrap;display:flex;flex-direction:column;gap:0}
.row-val small{font-weight:400;font-size:12.5px;color:var(--muted)}
.app[dir=rtl] .row-val{text-align:left}
.row-val.loss{color:#C8102E}

/* ── État vide ── */
.empty{text-align:center;padding:56px 24px;color:var(--muted)}
.empty svg{color:var(--muted);opacity:.5}
.empty h3{color:var(--ink);margin:14px 0 8px;font-size:20px;font-weight:600}
.empty p{max-width:30em;margin:0 auto 22px;font-size:15.5px}

/* ── Champs ── */
.field{display:flex;flex-direction:column;gap:7px;margin-bottom:20px;min-width:0}
.field-label{font-weight:500;font-size:15px;color:var(--ink-2)}
.field-hint{font-size:13.5px;color:var(--muted);line-height:1.35}
.field-err,.err-text{display:flex;align-items:center;gap:6px;font-size:14px;color:#C8102E;font-weight:500}
.input{width:100%;min-height:48px;padding:0 14px;border-radius:12px;border:.5px solid var(--hair);background:var(--card);font:inherit;font-size:17px;color:var(--ink);appearance:none;-webkit-appearance:none}
textarea.input{padding:12px 14px;min-height:76px}
select.input{background-image:linear-gradient(45deg,transparent 50%,var(--muted) 50%),linear-gradient(135deg,var(--muted) 50%,transparent 50%);background-position:calc(100% - 20px) 50%,calc(100% - 14px) 50%;background-size:6px 6px;background-repeat:no-repeat;padding-inline-end:38px}
.app[dir=rtl] select.input{background-position:14px 50%,20px 50%}
.app[dir=rtl] select.input[dir=ltr]{background-position:calc(100% - 20px) 50%,calc(100% - 14px) 50%}
.input:focus{border-color:var(--rasp);outline:0;box-shadow:0 0 0 3.5px rgba(180,15,81,.12)}
.input-wrap{position:relative;display:flex;align-items:center;flex:1;min-width:0}
.input-wrap .input{padding-inline-end:62px;font-variant-numeric:tabular-nums}
.app[dir=rtl] .input.num{text-align:right}
.input-wrap.invalid .input{border-color:#C8102E}
.suffix{position:absolute;inset-inline-end:14px;color:var(--muted);font-size:15px;pointer-events:none}
.input-wrap .input.pwd{padding-inline-end:52px;letter-spacing:.02em}
.eye{position:absolute;inset-inline-end:6px;width:40px;height:40px;border:0;background:none;border-radius:50%;
  display:grid;place-items:center;color:var(--muted)}
.eye:active{opacity:.5}
.eye[aria-pressed=true]{color:var(--ink)}
.pair{display:flex;gap:10px}.pair>*{flex:1}
.pair .unit,.item-bottom .unit{flex:0 0 128px;padding-inline-end:32px;font-size:16px}
.toggle{display:flex;align-items:flex-start;gap:12px;min-height:44px;margin:-4px 0 16px;font-weight:400;font-size:16px}
.toggle input{width:22px;height:22px;accent-color:var(--rasp);flex:none;margin-top:2px}
.seg{display:flex;background:rgba(118,118,128,.12);padding:2px;border-radius:10px;gap:2px}
.seg button{flex:1;min-height:36px;border:0;border-radius:8px;background:none;font-weight:500;font-size:14.5px;color:var(--ink);padding:0 6px}
.seg button.on{background:var(--card);font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.1)}

/* ── Champ à suggestions ── */
.combo{position:relative;scroll-margin:120px}
.combo-list{position:absolute;inset-inline:0;top:calc(100% + 6px);z-index:30;list-style:none;margin:0;padding:5px;background:rgba(255,255,255,.96);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:.5px solid var(--hair);border-radius:14px;
  box-shadow:0 12px 34px rgba(0,0,0,.14);max-height:290px;overflow-y:auto}
.combo-list button{width:100%;display:flex;align-items:center;gap:8px;min-height:44px;padding:0 12px;border:0;border-radius:9px;background:none;text-align:start;font-size:17px}
.combo-list button:hover,.combo-list button.on{background:rgba(118,118,128,.1)}
.combo-list mark{background:none;color:var(--rasp);font-weight:600}
.combo-txt{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.combo-check{margin-inline-start:auto;color:var(--pista)}
.combo-new{border-top:.5px solid var(--hair);margin-top:4px;padding-top:4px}
.combo-new button{color:var(--rasp);font-weight:500}
.combo-hint{display:flex;align-items:center;gap:6px;margin-top:8px;padding:8px 12px;border:0;border-radius:10px;background:var(--warn-soft);color:var(--warn);font-weight:500;font-size:14.5px;text-align:start}

/* ── Résultat calculé ── */
.result{display:flex;flex-direction:column;gap:3px;background:var(--card);border:.5px solid var(--hair);border-radius:var(--r-lg);padding:16px 18px;margin:4px 0 22px}
.result.pending{background:transparent;border-style:dashed}
.result-label{font-size:13px;font-weight:500;letter-spacing:.01em;text-transform:uppercase;color:var(--muted)}
.result-value{font-size:30px;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums;text-align:start;color:var(--rasp)}
.app[dir=rtl] .result-value{text-align:right}
.result-calc{font-size:14px;color:var(--muted)}

/* ── Le chiffre principal ── */
.ticket{display:flex;flex-direction:column;background:var(--card);border:.5px solid var(--hair);border-radius:20px;padding:22px 20px;margin:10px 0 20px}
.ticket-label{font-size:13px;font-weight:500;letter-spacing:.02em;text-transform:uppercase;color:var(--muted)}
.ticket-value{font-size:clamp(40px,11vw,52px);font-weight:700;letter-spacing:-.04em;line-height:1.02;font-variant-numeric:tabular-nums;margin:6px 0 4px}
.app[dir=rtl] .ticket-value{text-align:right}
.ticket-value small{font-size:19px;font-weight:500;letter-spacing:-.01em;color:var(--muted)}
.ticket-sub{font-size:14.5px;color:var(--muted)}

.block-section{margin:26px 0}
.section-row{display:flex;justify-content:space-between;align-items:center;gap:12px}

/* ── Détail du coût ── */
.breakdown{background:var(--card);border:.5px solid var(--hair);border-radius:var(--r-lg);padding:6px 16px;margin:-8px 0 22px;font-variant-numeric:tabular-nums}
.breakdown-title{display:block;font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:.02em;color:var(--muted);margin:12px 0 4px}
.bd-row{display:flex;justify-content:space-between;gap:12px;padding:9px 0;font-size:16px;border-top:.5px solid var(--hair)}
.bd-row:first-of-type{border-top:0}
.bd-row strong{white-space:nowrap;font-weight:500}
.bd-row em{font-style:normal;color:var(--muted);font-size:13.5px}
.bd-total{font-weight:600;border-top:.5px solid var(--ink);margin-bottom:10px}
.bd-total strong{font-weight:700}

/* ── Lignes de composition ── */
.items{display:flex;flex-direction:column;gap:10px;margin-top:12px}
.item{background:var(--card);border:.5px solid var(--hair);border-radius:var(--r);padding:10px;display:flex;flex-direction:column;gap:8px}
.item-top,.item-bottom{display:flex;gap:8px}
.item-bottom>*{flex:1}
.item-cost{display:flex;justify-content:space-between;align-items:center;padding:0 4px 2px;min-height:20px;font-size:14.5px;font-variant-numeric:tabular-nums;color:var(--muted)}
.item-cost strong{font-size:16px;font-weight:600;color:var(--ink)}

/* ── Prix indicatif ── */
.indicative{display:flex;align-items:center;justify-content:space-between;gap:12px;background:var(--rasp-soft);border-radius:var(--r);padding:12px 14px;margin:-6px 0 18px}
.indicative div{display:flex;flex-direction:column}
.indicative strong{font-size:24px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.02em;color:var(--rasp)}
.indicative .btn-secondary{min-height:40px;font-size:15px;padding:0 14px}

/* ── Statistiques ── */
.stats{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin:6px 0 18px;background:var(--hair);border:.5px solid var(--hair);border-radius:var(--r-lg);overflow:hidden}
.stat{background:var(--card);padding:14px 16px;display:flex;flex-direction:column;gap:2px}
.stat span{font-size:13px;color:var(--muted);font-weight:400}
.stat strong{font-size:22px;font-weight:600;font-variant-numeric:tabular-nums;letter-spacing:-.025em;text-align:start}
.app[dir=rtl] .stat strong{text-align:right}
.stat small{font-size:12px;color:var(--muted)}
.gain{color:var(--pista)} .loss{color:#C8102E}

/* ── Simulation ── */
.sim{background:var(--card);border:.5px solid var(--hair);border-radius:var(--r-lg);padding:14px 16px;margin-bottom:18px}
.sim-head{display:flex;align-items:center;gap:10px;font-weight:500;font-size:16px}
.sim-head .input-wrap{max-width:180px}
.sim-grid{display:grid;grid-template-columns:1fr auto;gap:8px 12px;margin:14px 0 0;font-variant-numeric:tabular-nums;font-size:16px}
.sim-grid dt{color:var(--muted)} .sim-grid dd{margin:0;font-weight:600;text-align:end}

/* ── Messages ── */
.notice{display:flex;gap:10px;align-items:flex-start;border-radius:var(--r);padding:12px 14px;font-size:14.5px;line-height:1.4;margin:0 0 16px;background:rgba(118,118,128,.09);color:var(--ink-2)}
.notice svg{flex:none;margin-top:2px;opacity:.75}
.notice.warn{background:var(--warn-soft);color:var(--warn)}
.notice.loss{background:#FDECEE;color:#C8102E;font-weight:500}

/* ── Lexique ── */
.glossary{border:.5px solid var(--hair);border-radius:var(--r-lg);background:var(--card);padding:0 16px}
.glossary summary{display:flex;align-items:center;gap:8px;min-height:48px;font-weight:500;cursor:pointer;list-style:none;color:var(--rasp)}
.glossary summary::-webkit-details-marker{display:none}
.glossary dl{margin:0 0 16px;font-size:15px}
.glossary dt{font-weight:600;margin-top:12px}
.glossary dd{margin:2px 0 0;color:var(--muted)}

/* ── Historique ── */
.history{list-style:none;margin:10px 0 0;padding:0;background:var(--card);border:.5px solid var(--hair);border-radius:var(--r-lg);overflow:hidden}
.history li{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 16px;font-size:15px;flex-wrap:wrap;position:relative}
.history li+li::before{content:"";position:absolute;top:0;inset-inline-start:16px;inset-inline-end:0;height:.5px;background:var(--hair)}
.history li>span:first-child{display:flex;flex-direction:column}

/* ── Étapes de démarrage ── */
.steps{list-style:none;margin:12px 0 0;padding:0;background:var(--card);border:.5px solid var(--hair);border-radius:var(--r-lg);overflow:hidden}
.steps li{position:relative}
.steps li+li::before{content:"";position:absolute;top:0;inset-inline-start:60px;inset-inline-end:0;height:.5px;background:var(--hair)}
.steps button{width:100%;display:flex;gap:14px;align-items:center;text-align:start;background:none;border:0;padding:13px 16px;min-height:60px}
.steps button:active{background:rgba(118,118,128,.08)}
.steps button>span:last-child{display:flex;flex-direction:column;gap:1px}
.steps strong{font-weight:500;font-size:17px}
.step-n{flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-weight:600;font-size:14px;background:rgba(118,118,128,.12);color:var(--ink-2)}
.steps li.done .step-n{background:var(--pista-soft);color:var(--pista)}
.steps li.done strong{color:var(--muted)}

/* ── Suppression ── */
.delete-confirm{background:#FDECEE;border-radius:var(--r);padding:14px;margin-top:12px}
.delete-confirm p{margin:0 0 12px;font-weight:500;font-size:15.5px;color:#8E0B1F}
.btn-pair{display:flex;gap:10px}.btn-pair>*{flex:1}

/* ── Feuilles ── */
.sheet-backdrop{position:fixed;inset:0;z-index:40;background:var(--bg)}
.sheet{display:flex;flex-direction:column;height:100%;background:var(--bg)}
.sheet-head{display:flex;align-items:center;gap:4px;padding:6px 10px 6px 4px;border-bottom:.5px solid var(--hair);
  background:rgba(245,245,247,.86);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px)}
.sheet-head h2{font-size:17px;font-weight:600;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sheet-head .btn-ghost{color:var(--ink)}
.sheet-body{flex:1;overflow-y:auto;padding:20px 16px 28px;-webkit-overflow-scrolling:touch}
.sheet-foot{padding:10px 16px calc(10px + env(safe-area-inset-bottom));background:rgba(245,245,247,.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:.5px solid var(--hair)}
@media (min-width:760px){
  .sheet-backdrop{background:rgba(0,0,0,.28);backdrop-filter:blur(3px);display:grid;place-items:center;padding:3vh 20px}
  .sheet{height:auto;max-height:94vh;width:100%;max-width:620px;border-radius:20px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.26)}
  .sheet-body{padding:24px 28px}
}

/* ── Compte ── */
.auth-links{display:flex;flex-direction:column;gap:2px;margin-top:14px;align-items:flex-start}
.account-box{display:flex;flex-direction:column;gap:2px;background:var(--card);border:.5px solid var(--hair);border-radius:var(--r-lg);padding:14px 16px;margin-bottom:14px}
.account-box strong{font-size:17px;font-weight:500;word-break:break-all}

/* ── Administration ── */
.admin-list{display:flex;flex-direction:column;gap:10px;margin-top:4px}
.admin-row{background:var(--card);border:.5px solid var(--hair);border-radius:var(--r);padding:14px;display:flex;flex-direction:column;gap:12px}
.admin-main{display:flex;flex-direction:column;gap:3px;min-width:0}
.admin-mail{font-weight:500;font-size:16px;word-break:break-all}
.admin-tags{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:4px}
.tag{font-size:12.5px;font-weight:600;padding:3px 9px;border-radius:999px;background:rgba(118,118,128,.14);color:var(--ink-2)}
.tag.on{background:var(--rasp);color:#fff}
.small-btn{min-height:42px;font-size:15.5px;padding:0 16px;align-self:flex-start}
.admin-durations{display:flex;flex-direction:column;gap:8px}
.dur-btns{display:flex;flex-wrap:wrap;gap:8px}
.dur-btns .small-btn{flex:1;min-width:88px;align-self:auto}

/* ── Fenêtre Premium ── */
.paywall-backdrop{display:grid;place-items:end center;background:rgba(0,0,0,.34);backdrop-filter:blur(3px);padding:0}
@media (min-width:760px){.paywall-backdrop{place-items:center;padding:20px}}
.paywall{width:100%;max-width:460px;background:var(--bg);border-radius:22px 22px 0 0;padding:26px 22px calc(24px + env(safe-area-inset-bottom));max-height:92vh;overflow-y:auto}
@media (min-width:760px){.paywall{border-radius:22px}}
.paywall h2{font-size:24px;font-weight:700;margin:0 0 8px;letter-spacing:-.03em}
.paywall p{margin:0 0 16px;color:var(--muted)}
.pw-list{list-style:none;margin:0 0 18px;padding:0;display:flex;flex-direction:column;gap:12px}
.pw-list li{display:flex;gap:11px;align-items:flex-start;font-size:16px}
.pw-list svg{flex:none;color:var(--pista);margin-top:2px}
.center{text-align:center;margin-top:12px}

/* ── Notification ── */
.toast{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(86px + env(safe-area-inset-bottom));z-index:60;
  background:rgba(20,20,22,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);color:#fff;padding:11px 18px;border-radius:14px;
  display:flex;align-items:center;gap:8px;font-weight:500;font-size:15px;max-width:calc(100vw - 32px);box-shadow:0 8px 30px rgba(0,0,0,.2)}
@media (min-width:900px){.toast{bottom:28px}}


/* ── Parcours d'accueil ── */
.btn-dark{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:58px;padding:0 24px;border-radius:999px;
  background:#18181B;color:#fff;font-weight:600;font-size:17.5px;border:0;transition:opacity .12s}
.btn-dark:active{opacity:.7}
.btn-dark:disabled{opacity:.25}
.ob{min-height:100vh;display:flex;flex-direction:column;background:#fff;max-width:520px;margin:0 auto}
.ob-head{display:flex;align-items:center;gap:14px;padding:14px 20px 4px}
.ob-back{width:40px;height:40px;flex:none;border-radius:50%;border:0;background:#F2F2F5;display:grid;place-items:center;color:var(--ink)}
.ob-back:active{opacity:.6}
.ob-lang{flex:none}
.ob-lang select{min-height:40px;padding:0 30px 0 12px;font-size:14.5px;border-radius:999px;background-color:#F2F2F5;border:0}
.ob-bar{flex:1;height:5px;border-radius:999px;background:#EDEDF0;overflow:hidden}
.ob-bar span{display:block;height:100%;border-radius:999px;background:#18181B;transition:width .3s ease}
.ob-body{flex:1;overflow-y:auto;padding:24px 20px 20px;-webkit-overflow-scrolling:touch}
.ob-body h1{font-size:clamp(28px,7.4vw,36px);font-weight:700;letter-spacing:-.03em;line-height:1.1}
.ob-sub{color:var(--muted);margin:12px 0 0;font-size:16.5px;line-height:1.4}
.ob-content{margin-top:28px}
.ob-foot{padding:12px 20px calc(16px + env(safe-area-inset-bottom));background:#fff;border-top:.5px solid var(--hair)}
.ob-foot .btn-ghost{margin-top:6px;color:var(--muted);width:100%}
.opts{display:flex;flex-direction:column;gap:12px}
.opt{display:flex;align-items:center;gap:14px;width:100%;text-align:start;background:#fff;border:1.5px solid #ECECEF;border-radius:16px;
  padding:16px;min-height:68px;transition:border-color .12s,box-shadow .12s}
.opt.on{border-color:#18181B;box-shadow:0 0 0 1px #18181B}
.opt:active{background:#FAFAFB}
.opt-ico{flex:none;width:44px;height:44px;border-radius:50%;background:#F4F4F7;display:grid;place-items:center}
.opt-txt{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
.opt-title{font-size:17.5px;font-weight:600;letter-spacing:-.015em}
.opt-sub{font-size:14.5px;color:var(--muted);line-height:1.3}
.opt-radio{flex:none;width:24px;height:24px;border-radius:50%;border:1.5px solid #D7D7DC;position:relative}
.opt.on .opt-radio{border-color:#18181B;background:#18181B}
.opt.on .opt-radio::after{content:"";position:absolute;inset:7px;border-radius:50%;background:#fff}
.opt-more{margin-top:4px}
.opt-more select{min-height:52px;border-radius:14px;border:1.5px solid #ECECEF}
.input.big{min-height:58px;font-size:19px;border-radius:16px;border:1.5px solid #ECECEF}
.ob-done{width:56px;height:56px;border-radius:50%;background:#18181B;color:#fff;display:grid;place-items:center;margin:0 0 20px}
.app[dir=rtl] .ob-done{margin-inline-start:auto}
.recap{margin:26px 0 20px;padding:0;background:#F7F7F9;border-radius:18px;overflow:hidden}
.recap>div{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:14px 16px;position:relative}
.recap>div+div::before{content:"";position:absolute;top:0;inset-inline:16px 0;height:.5px;background:#E4E4E8}
.recap dt{color:var(--muted);font-size:15px}
.recap dd{margin:0;font-weight:600;font-size:16px;text-align:end}

/* ── Écrans d'entrée ── */
.welcome{min-height:100vh;display:grid;place-items:center;padding:24px 20px}
.welcome-card{width:100%;max-width:420px}
.gate-lang{display:flex;justify-content:flex-end;margin-bottom:22px}
.gate-lang select{max-width:180px;min-height:40px;font-size:15px}
.welcome-logo{display:block;width:76px;height:76px;margin:0 0 22px;border-radius:18px}
.app[dir=rtl] .welcome-logo{margin-inline-start:auto;margin-inline-end:0}
.welcome h1{font-size:34px;margin-bottom:10px}
.gate-tagline{font-weight:600;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--rasp);margin:0 0 16px}
.welcome p{color:var(--muted);margin:0 0 28px;font-size:17px}
.welcome .btn-secondary,.welcome .btn-ghost{margin-top:10px}
.welcome .btn-ghost{min-height:48px}
.block-hint{display:block;font-weight:400;line-height:1.3;color:var(--muted);font-size:13.5px}


/* ════════════════ MODE SOMBRE ════════════════ */
.app.dark{
  --bg:#000000; --card:#1C1C1E; --ink:#F5F5F7; --ink-2:#D7D7DB; --muted:#98989E;
  --line:#2C2C2E; --hair:#38383A;
  --rasp:#FF5C8A; --rasp-d:#FF7CA1; --rasp-soft:#2A1620;
  --pista:#4BD07B; --pista-soft:#14281B; --warn:#F3C266; --warn-soft:#2A2213;
}
.app.dark .nav{background:rgba(22,22,24,.86);border-top-color:var(--hair)}
.app.dark .settings-fab{background:rgba(40,40,44,.9);border-color:var(--hair);color:var(--ink)}
.app.dark .search{background:rgba(118,118,128,.24)}
.app.dark .chip{background:rgba(118,118,128,.24);color:var(--ink)}
.app.dark .chip.on{background:var(--ink);color:#0B0B0C}
.app.dark .row:active,.app.dark .steps button:active{background:rgba(255,255,255,.06)}
.app.dark .btn-primary,.app.dark .btn-dark,.app.dark .fab{background:#F5F5F7;color:#0B0B0C}
.app.dark .btn-primary:hover,.app.dark .btn-dark:hover{background:#fff}
.app.dark .fab{box-shadow:0 8px 24px rgba(0,0,0,.6)}
.app.dark .btn-secondary{background:var(--card);border-color:var(--hair)}
.app.dark .seg{background:rgba(118,118,128,.24)}
.app.dark .seg button{color:var(--ink)}
.app.dark .seg button.on{background:#48484A;box-shadow:none}
.app.dark .stats{background:var(--hair)}
.app.dark .notice{background:rgba(118,118,128,.2);color:var(--ink-2)}
.app.dark .notice.loss{background:#2B1416;color:#FF8089}
.app.dark .delete-confirm{background:#2B1416}
.app.dark .delete-confirm p{color:#FF8089}
.app.dark .btn-danger{background:#FF453A;color:#0B0B0C}
.app.dark .btn-ghost.danger{color:#FF6961}
.app.dark .loss,.app.dark .row-val.loss{color:#FF6961}
.app.dark .combo-list{background:rgba(40,40,44,.97);border-color:var(--hair);box-shadow:0 12px 34px rgba(0,0,0,.6)}
.app.dark .combo-list button:hover,.app.dark .combo-list button.on{background:rgba(255,255,255,.1)}
.app.dark .sheet-backdrop,.app.dark .sheet{background:var(--bg)}
.app.dark .sheet-head,.app.dark .sheet-foot{background:rgba(22,22,24,.88);border-color:var(--hair)}
.app.dark .toast{background:rgba(240,240,245,.94);color:#0B0B0C}
.app.dark .input{background:var(--card);border-color:var(--hair);color:var(--ink)}
.app.dark .input:focus{border-color:var(--rasp);box-shadow:0 0 0 3.5px rgba(255,92,138,.2)}
.app.dark .ob{background:#000}
.app.dark .ob-foot{background:#000;border-color:var(--hair)}
.app.dark .ob-back,.app.dark .ob-lang select{background:#1C1C1E;color:var(--ink)}
.app.dark .ob-bar{background:#2C2C2E}
.app.dark .ob-bar span{background:#F5F5F7}
.app.dark .opt{background:var(--card);border-color:var(--hair)}
.app.dark .opt.on{border-color:#F5F5F7;box-shadow:0 0 0 1px #F5F5F7}
.app.dark .opt:active{background:#222225}
.app.dark .opt-ico{background:rgba(255,255,255,.1)}
.app.dark .opt-radio{border-color:#5A5A5F}
.app.dark .opt.on .opt-radio{background:#F5F5F7;border-color:#F5F5F7}
.app.dark .opt.on .opt-radio::after{background:#0B0B0C}
.app.dark .ob-done{background:#F5F5F7;color:#0B0B0C}
.app.dark .recap{background:var(--card)}
.app.dark .recap>div+div::before{background:var(--hair)}
.app.dark .input.big,.app.dark .opt-more select{border-color:var(--hair)}
.app.dark .glossary,.app.dark .paywall{background:var(--bg)}
.app.dark .glossary{background:var(--card)}
.app.dark .welcome-logo{box-shadow:0 0 0 1px rgba(255,255,255,.12)}

@media (max-width:360px){.stats{grid-template-columns:1fr}.pair .unit,.item-bottom .unit{flex-basis:112px}h1{font-size:28px}}
@media (prefers-reduced-motion:reduce){.app *{transition:none!important}}
`;
