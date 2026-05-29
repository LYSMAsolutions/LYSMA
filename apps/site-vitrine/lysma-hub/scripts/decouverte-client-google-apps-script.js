function doGet(e) {
  return ContentService
    .createTextOutput("OK - Script actif")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || "{}");

    var companyName = data.companyName || "";
    var sector = data.sector || "";
    var contactName = data.contactName || "";
    var phone = data.phone || "";
    var email = data.email || "";
    var address = data.address || "";
    var city = data.city || "";
    var postalCode = data.postalCode || "";
    var currentWebsite = data.currentWebsite || "";

    var story = data.story || "";
    var values = data.values || "";
    var services = data.services || "";
    var targetCustomers = data.targetCustomers || "";
    var serviceArea = data.serviceArea || "";
    var competitors = data.competitors || "";
    var currentDigitalPresence = data.currentDigitalPresence || "";
    var goals = data.goals || "";
    var seoCities = data.seoCities || "";
    var seoKeywords = data.seoKeywords || "";
    var seoTargetCities = data.seoTargetCities || "";
    var seoPriorityServices = data.seoPriorityServices || "";
    var seoKnownKeywords = data.seoKnownKeywords || "";
    var seoGrowthServices = data.seoGrowthServices || "";
    var seoSpecialities = data.seoSpecialities || "";
    var seoAdvantages = data.seoAdvantages || "";
    var idealCustomer = data.idealCustomer || "";
    var mainBusinessAreas = data.mainBusinessAreas || "";
    var excludedKeywords = data.excludedKeywords || "";
    var faqQuestion1 = data.faqQuestion1 || "";
    var faqAnswer1 = data.faqAnswer1 || "";
    var faqQuestion2 = data.faqQuestion2 || "";
    var faqAnswer2 = data.faqAnswer2 || "";
    var faqQuestion3 = data.faqQuestion3 || "";
    var faqAnswer3 = data.faqAnswer3 || "";
    var faqQuestion4 = data.faqQuestion4 || "";
    var faqAnswer4 = data.faqAnswer4 || "";
    var faqQuestion5 = data.faqQuestion5 || "";
    var faqAnswer5 = data.faqAnswer5 || "";
    var availablePhotos = data.availablePhotos || "";
    var strategicAnswer = data.strategicAnswer || "";
    var internalNotes = data.internalNotes || "";

    var destinataire = "lysmasolutions@gmail.com";
    var sujet = "Nouvelle découverte client - " + companyName;

    var message =
      "NOUVELLE DÉCOUVERTE CLIENT LYSMA\n\n" +

      "ENTREPRISE\n" +
      "Nom : " + companyName + "\n" +
      "Secteur : " + sector + "\n" +
      "Adresse : " + address + "\n" +
      "Ville : " + postalCode + " " + city + "\n" +
      "Site actuel : " + currentWebsite + "\n\n" +

      "CONTACT\n" +
      "Nom : " + contactName + "\n" +
      "Téléphone : " + phone + "\n" +
      "Email : " + email + "\n\n" +

      "HISTOIRE\n" +
      story + "\n\n" +

      "VALEURS / POSITIONNEMENT\n" +
      values + "\n\n" +

      "PRESTATIONS\n" +
      services + "\n\n" +

      "CLIENTÈLE CIBLE\n" +
      targetCustomers + "\n\n" +

      "ZONE GÉOGRAPHIQUE\n" +
      serviceArea + "\n\n" +

      "CONCURRENTS\n" +
      competitors + "\n\n" +

      "PRÉSENCE DIGITALE ACTUELLE\n" +
      currentDigitalPresence + "\n\n" +

      "OBJECTIFS DU FUTUR SITE\n" +
      goals + "\n\n" +

      "SEO & VISIBILITÉ GOOGLE\n" +
      "Villes ciblées existantes : " + seoCities + "\n" +
      "Mots-clés existants : " + seoKeywords + "\n" +
      "Villes prioritaires Google : " + seoTargetCities + "\n" +
      "Services prioritaires SEO : " + seoPriorityServices + "\n" +
      "Mots-clés supposés clients : " + seoKnownKeywords + "\n" +
      "Prestations à développer : " + seoGrowthServices + "\n" +
      "Spécialités / expertises : " + seoSpecialities + "\n" +
      "Avantages concurrentiels : " + seoAdvantages + "\n" +
      "Client idéal : " + idealCustomer + "\n" +
      "Zones principales de chiffre d'affaires : " + mainBusinessAreas + "\n" +
      "Mots-clés / prestations / zones à éviter : " + excludedKeywords + "\n\n" +

      "FAQ CLIENTS POUR GOOGLE\n" +
      "Question 1 : " + faqQuestion1 + "\n" +
      "Réponse 1 : " + faqAnswer1 + "\n\n" +
      "Question 2 : " + faqQuestion2 + "\n" +
      "Réponse 2 : " + faqAnswer2 + "\n\n" +
      "Question 3 : " + faqQuestion3 + "\n" +
      "Réponse 3 : " + faqAnswer3 + "\n\n" +
      "Question 4 : " + faqQuestion4 + "\n" +
      "Réponse 4 : " + faqAnswer4 + "\n\n" +
      "Question 5 : " + faqQuestion5 + "\n" +
      "Réponse 5 : " + faqAnswer5 + "\n\n" +

      "PHOTOS / CONTENUS DISPONIBLES\n" +
      availablePhotos + "\n\n" +

      "QUESTION STRATÉGIQUE\n" +
      strategicAnswer + "\n\n" +

      "NOTES COMPLÉMENTAIRES\n" +
      internalNotes;

    MailApp.sendEmail({
      to: destinataire,
      subject: sujet,
      body: message,
      name: "LYSMA Solutions",
      replyTo: email || destinataire
    });

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    MailApp.sendEmail({
      to: "lysmasolutions@gmail.com",
      subject: "Erreur formulaire Découverte Client LYSMA",
      body: err.message
    });

    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
