import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const faqs = [
  {
    slug: 'choisir-carrossier-apres-accident',
    title: 'Puis-je choisir mon carrossier après un accident ?',
    answer: "Oui. Vous restez libre du choix de votre réparateur, quelle que soit votre compagnie d'assurance. Après un accident, vous pouvez confier votre véhicule à l'atelier de votre choix. Carrosserie Mounier vous accompagne dans la compréhension des démarches et dans l'estimation des réparations nécessaires.",
  },
  {
    slug: 'prise-en-charge-assurance',
    title: 'Comment se passe une prise en charge assurance ?',
    answer: "Après un sinistre, l'équipe vous aide à clarifier les étapes : première prise de contact, analyse des dommages, devis, échanges administratifs et organisation de la réparation. L'objectif est de rendre le parcours plus simple, plus lisible et plus rassurant.",
  },
  {
    slug: 'prix-renovation-phare',
    title: 'Combien coûte une rénovation de phare ?',
    answer: "La rénovation optique est proposée à partir de 80 € à 150 €*. Le tarif dépend du niveau d'altération, de l'état général des optiques et de la méthode nécessaire. Un diagnostic préalable permet d'établir une estimation adaptée à votre véhicule.",
  },
  {
    slug: 'duree-reparation-carrosserie',
    title: 'Combien de temps dure une réparation carrosserie ?',
    answer: "La durée dépend de l'étendue du dommage, de la zone touchée, des pièces éventuelles et du niveau de finition nécessaire. Après examen du véhicule, l'atelier vous donne une estimation claire du délai d'immobilisation.",
  },
  {
    slug: 'changer-courroie-distribution',
    title: 'Quand faut-il changer sa courroie de distribution ?',
    answer: "La courroie de distribution se remplace selon l'âge, le kilométrage et les préconisations du constructeur. C'est une intervention préventive importante, car une rupture peut entraîner une casse moteur coûteuse.",
  },
]

function layout({ title, body, root = '..' }) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Carrosserie Mounier</title>
  <meta name="description" content="${title} - Réponse claire par Carrosserie Mounier à Trélissac près de Périgueux.">
  <link rel="stylesheet" href="${root}/css/style.css">
  <link rel="stylesheet" href="${root}/css/responsive.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="${root}/index.html" aria-label="Accueil Carrosserie Mounier"><img src="${root}/assets/logos/logo-mounier.png" alt="Carrosserie Mounier" class="logo-img"></a>
      <nav class="main-nav" aria-label="Navigation principale">
        <a href="${root}/index.html">Accueil</a>
        <a href="${root}/pages/prestations.html">Prestations</a>
        <a href="${root}/pages/realisations.html">Réalisations</a>
        <a class="active" href="${root}/faq/">FAQ</a>
        <a href="${root}/pages/contact.html">Contact</a>
      </nav>
      <a class="btn btn-header" href="${root}/pages/contact.html">Demander un devis</a>
      <button class="mobile-toggle" type="button" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
    </div>
  </header>
  ${body}
  <footer class="site-footer">
    <div class="container footer-inner">
      <div><strong>Carrosserie Mounier</strong><br>Carrosserie, entretien, covering et flocage à Trélissac.</div>
      <div class="footer-links"><a href="${root}/pages/prestations.html">Prestations</a><a href="${root}/pages/realisations.html">Réalisations</a><a href="${root}/faq/">FAQ</a><a href="${root}/pages/contact.html">Contact</a></div>
      <div>© <span data-year></span> Carrosserie Mounier</div>
    </div>
  </footer>
  <script src="${root}/js/main.js"></script>
  <script src="${root}/js/animations.js"></script>
</body>
</html>`
}

await mkdir('faq', { recursive: true })

const indexBody = `<main>
  <section class="section section-dark">
    <div class="container section-head reveal">
      <div><div class="kicker">FAQ</div><h1 class="section-title">Questions fréquentes.</h1></div>
      <p class="section-desc">Des réponses simples sur l'assurance, les délais, les devis et les principales interventions.</p>
    </div>
  </section>
  <section class="section section-soft">
    <div class="container faq-page-grid">
      ${faqs.map((faq) => `<a class="faq-link-card reveal" href="${faq.slug}/"><strong>${faq.title}</strong><span>Lire la réponse</span></a>`).join('\n')}
    </div>
  </section>
</main>`

await writeFile('faq/index.html', layout({ title: 'FAQ carrosserie et assurance', body: indexBody, root: '..' }), 'utf8')

for (const faq of faqs) {
  const dir = path.join('faq', faq.slug)
  await mkdir(dir, { recursive: true })
  const body = `<main>
  <section class="section section-dark">
    <div class="container section-head reveal">
      <div><div class="kicker">FAQ</div><h1 class="section-title">${faq.title}</h1></div>
    </div>
  </section>
  <section class="section section-soft">
    <div class="container service-page-layout">
      <article class="service-page-main reveal">
        <h2>Réponse détaillée</h2>
        <p>${faq.answer}</p>
        <h2>Besoin d'un avis sur votre véhicule ?</h2>
        <p>Contactez l'atelier pour obtenir une réponse adaptée à votre situation, à votre véhicule et au type d'intervention envisagé.</p>
        <div class="hero-actions"><a class="btn btn-primary" href="../../pages/contact.html">Demander un devis</a><a class="btn btn-outline dark" href="tel:+33608378217">Appeler l'atelier</a></div>
      </article>
      <aside class="service-page-side reveal">
        <strong>À lire aussi</strong>
        <a class="btn btn-outline dark" href="../../prestations/reparation-carrosserie/">Réparation carrosserie</a>
        <a class="btn btn-outline dark" href="../../prestations/renovation-optique/">Rénovation optique</a>
        <a class="btn btn-outline dark" href="../../faq/">Toutes les FAQ</a>
      </aside>
    </div>
  </section>
</main>`
  await writeFile(path.join(dir, 'index.html'), layout({ title: faq.title, body, root: '../..' }), 'utf8')
}

console.log(`Generated ${faqs.length + 1} FAQ pages.`)
