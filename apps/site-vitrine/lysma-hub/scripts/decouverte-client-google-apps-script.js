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

      "SEO LOCAL\n" +
      "Villes ciblées : " + seoCities + "\n" +
      "Mots-clés : " + seoKeywords + "\n\n" +

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
