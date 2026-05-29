/**
 * @typedef {'brouillon' | 'decouverte' | 'contenu a completer' | 'pret pour generation' | 'en production' | 'termine'} DiscoveryStatus
 * @typedef {{ id: string, companyName: string, sector: string, contactName: string, phone: string, email: string, address: string, city: string, postalCode: string, currentWebsite: string, status: DiscoveryStatus, internalNotes: string, createdAt: string, updatedAt: string }} ClientDiscoveryProject
 * @typedef {{ id: string, projectId: string, sectionKey: string, questionKey: string, questionLabel: string, answer: string }} DiscoveryAnswer
 * @typedef {{ id: string, projectId: string, mediaType: string, name: string, url: string, notes: string }} DiscoveryMedia
 */

const STORAGE_KEY = 'lysma.discovery.v1'

const statuses = ['brouillon', 'decouverte', 'contenu a completer', 'pret pour generation', 'en production', 'termine']

const discoverySections = [
  { key: 'general', title: 'Informations generales', questions: [['companyBaseline', "Quel est le nom exact a afficher sur le futur site ?"], ['decisionMaker', 'Qui valide le contenu, les photos et les decisions finales ?'], ['mainContact', 'Quel est le meilleur canal pour echanger pendant le projet ?']] },
  { key: 'history', title: "Histoire de l'entreprise", questions: [['startDate', "Depuis quand l'entreprise existe-t-elle ?"], ['originStory', "Quelle histoire ou evolution merite d'etre racontee ?"], ['teamStory', "Faut-il presenter le dirigeant, l'equipe ou l'atelier ?"]] },
  { key: 'positioning', title: 'Valeurs et positionnement', questions: [['brandImage', 'Quelle image doit dominer : premium, local, technique, rapide, accessible ?'], ['values', 'Quelles valeurs doivent etre visibles dans les textes ?'], ['proofPoints', 'Quelles preuves rendent ce positionnement credible ?']] },
  { key: 'target', title: 'Clientele cible', questions: [['targetCustomers', 'Quels clients faut-il attirer en priorite ?'], ['customerProblems', 'Quels problemes ces clients cherchent-ils a regler ?'], ['badFits', 'Y a-t-il des profils ou demandes a ne pas mettre en avant ?']] },
  { key: 'area', title: 'Zone geographique', questions: [['mainCity', 'Quelle ville doit etre ciblee en priorite ?'], ['nearbyCities', 'Quelles communes voisines faut-il citer pour le SEO local ?'], ['serviceArea', "L'entreprise se deplace-t-elle ou recoit-elle uniquement sur place ?"]] },
  { key: 'services', title: 'Prestations', questions: [['primaryServices', 'Quelles prestations doivent etre affichees clairement ?'], ['entryOffers', "Existe-t-il une prestation rapide ou simple comme porte d'entree ?"], ['delays', "Quels delais peut-on annoncer sans trop engager l'entreprise ?"]] },
  { key: 'expertise', title: 'Equipements / savoir-faire', questions: [['equipment', 'Quels equipements, outils ou methodes doivent etre cites ?'], ['brands', 'Quelles marques, partenaires ou technologies peut-on afficher ?'], ['certifications', "Existe-t-il des certifications, agrements ou formations a mentionner ?"]] },
  { key: 'competitors', title: 'Concurrents', questions: [['competitorNames', 'Quels concurrents locaux sont connus du client ?'], ['difference', 'Quelle difference concrete faut-il rendre visible ?'], ['marketTone', 'Le marche local est-il plutot prix, confiance, rapidite ou expertise ?']] },
  { key: 'digital', title: 'Presence digitale actuelle', questions: [['currentWebsite', 'Le client possede-t-il deja un site ou un nom de domaine ?'], ['socials', 'Quels reseaux sociaux ou fiches en ligne existent deja ?'], ['reviews', 'Y a-t-il des avis clients ou temoignages exploitables ?']] },
  { key: 'goals', title: 'Objectifs du futur site', questions: [['siteGoal', 'Dans 6 mois, que doit apporter le site : appels, devis, image, recrutement, pros ?'], ['mainAction', 'Quelle action principale le visiteur doit-il faire ?'], ['conversionInfo', 'Quelles informations sont indispensables pour une demande qualifiee ?']] },
  { key: 'seo', title: 'SEO local', questions: [['keywords', 'Quels mots les clients utilisent-ils pour chercher cette entreprise ?'], ['seoPriorities', 'Quelles recherches Google sont prioritaires ?'], ['domain', 'Quel domaine faut-il utiliser ou reserver ?']] },
  { key: 'content', title: 'Photos et contenus disponibles', questions: [['availablePhotos', 'Quelles photos existent deja et sont exploitables ?'], ['photosToShoot', 'Quelles photos faut-il prendre pendant le rendez-vous ?'], ['privacy', 'Quels elements faut-il flouter ou eviter de publier ?']] },
  { key: 'strategy', title: 'Question strategique finale', questions: [['whyChooseYou', "Pourquoi un client devrait-il choisir votre entreprise plutot qu'une autre ?"]] },
]

const mediaTypes = [
  ['logo', 'Logo', 'Identite visuelle, variantes, fond clair ou sombre.'],
  ['companyPhotos', 'Photos entreprise', 'Facade, accueil, atelier, ambiance generale.'],
  ['teamPhotos', 'Photos equipe', 'Portraits, dirigeant, gestes metier.'],
  ['locationPhotos', 'Photos locaux', 'Bureaux, atelier, showroom, vehicules, signaletique.'],
  ['workSamples', 'Realisations', 'Projets finis, cas clients, preuves visuelles.'],
  ['beforeAfter', 'Avant / apres', 'Comparatifs exploitables pour rassurer et vendre.'],
  ['documents', 'Documents divers', 'Plaquettes, tarifs, certifications, contenus sources.'],
]

const generationActions = [
  ['discoveryFile', 'Generer dossier de decouverte', 'Synthese interne complete pour cadrer le projet.'],
  ['siteContent', 'Generer contenus du site', 'Architecture de page, textes et blocs prioritaires.'],
  ['localSeo', 'Generer SEO local', 'Mots-cles, zones, titres et intentions de recherche.'],
  ['imagePrompts', 'Generer prompts images', 'Prompts photo ou IA a partir du positionnement.'],
  ['specification', 'Generer cahier des charges', 'Base projet structuree pour production et validation.'],
]

/** @type {{ projects: ClientDiscoveryProject[], answers: DiscoveryAnswer[], media: DiscoveryMedia[] }} */
let state = loadState()

function loadState() {
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (_error) {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }

  const now = new Date().toISOString()
  return {
    projects: [
      {
        id: 'proj-carrosserie-mounier',
        companyName: 'Carrosserie Mounier',
        sector: 'Carrosserie et peinture automobile',
        contactName: 'M. Mounier',
        phone: '06 08 37 82 17',
        email: 'contact@carrosserie-mounier.fr',
        address: '32 Route du Pouyault',
        city: 'Trelissac',
        postalCode: '24750',
        currentWebsite: 'https://carrosserie-mounier.fr',
        status: 'decouverte',
        internalNotes: 'Questionnaire rendez-vous en cours de consolidation.',
        createdAt: '2026-05-29T09:00:00.000Z',
        updatedAt: now,
      },
      {
        id: 'proj-atelier-demo',
        companyName: 'Atelier Demo LYSMA',
        sector: 'Garage independant',
        contactName: 'Contact atelier',
        phone: '05 00 00 00 00',
        email: 'contact@example.com',
        address: 'Zone artisanale',
        city: 'Perigueux',
        postalCode: '24000',
        currentWebsite: '',
        status: 'contenu a completer',
        internalNotes: 'Projet exemple pour tester le module.',
        createdAt: '2026-05-28T14:30:00.000Z',
        updatedAt: now,
      },
    ],
    answers: [],
    media: [],
  }
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function routeTo(route) {
  window.location.hash = route
}

function getRoute() {
  return window.location.hash.replace(/^#/, '') || 'dashboard'
}

function render() {
  const route = getRoute()
  const view = document.querySelector('#view')
  if (!view) return

  setActiveRoute(route.startsWith('project/') ? 'dashboard' : route)

  if (route === 'new') {
    renderProjectForm(view)
    return
  }

  if (route.startsWith('project/')) {
    renderProjectDetail(view, route.split('/')[1])
    return
  }

  renderDashboard(view)
}

function setActiveRoute(route) {
  document.querySelectorAll('[data-route]').forEach((element) => {
    if (element instanceof HTMLElement) {
      element.classList.toggle('active', element.dataset.route === route)
    }
  })
}

function useTemplate(id) {
  const template = document.querySelector(`#${id}`)
  if (!(template instanceof HTMLTemplateElement)) throw new Error(`Template introuvable: ${id}`)
  return template.content.cloneNode(true)
}

function renderDashboard(view) {
  view.replaceChildren(useTemplate('dashboard-template'))

  const total = state.projects.length
  const ready = state.projects.filter((project) => project.status === 'pret pour generation').length
  const active = state.projects.filter((project) => !['termine', 'brouillon'].includes(project.status)).length

  setText('[data-kpi="total"]', String(total))
  setText('[data-kpi="ready"]', String(ready))
  setText('[data-kpi="active"]', String(active))

  const table = document.querySelector('[data-project-table]')
  if (!table) return

  if (!state.projects.length) {
    table.innerHTML = '<div class="empty-state">Aucun projet pour le moment.</div>'
    return
  }

  const head = document.createElement('div')
  head.className = 'project-head'
  head.innerHTML = '<span>Entreprise</span><span>Secteur</span><span>Contact</span><span>Statut</span><span>Creation</span><span>Action</span>'
  table.append(head)

  state.projects
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .forEach((project) => {
      const row = document.createElement('article')
      row.className = 'project-row'
      row.innerHTML = `
        <div class="company-cell">
          <strong>${escapeHtml(project.companyName)}</strong>
          <span>${escapeHtml(project.city || 'Ville a completer')}</span>
        </div>
        <span>${escapeHtml(project.sector)}</span>
        <span>${escapeHtml(project.contactName || 'Contact a completer')}</span>
        <span class="status-badge">${escapeHtml(project.status)}</span>
        <span class="muted-cell">${formatDate(project.createdAt)}</span>
        <button class="secondary-action" type="button" data-open-project="${project.id}">Ouvrir</button>
      `
      table.append(row)
    })
}

function renderProjectForm(view) {
  view.replaceChildren(useTemplate('project-form-template'))

  const form = document.querySelector('#project-form')
  if (!(form instanceof HTMLFormElement)) return

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(form)
    const now = new Date().toISOString()
    const companyName = String(formData.get('companyName') || '').trim()

    const project = {
      id: `proj-${Date.now()}`,
      companyName,
      sector: String(formData.get('sector') || '').trim(),
      contactName: String(formData.get('contactName') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      address: String(formData.get('address') || '').trim(),
      city: String(formData.get('city') || '').trim(),
      postalCode: String(formData.get('postalCode') || '').trim(),
      currentWebsite: String(formData.get('currentWebsite') || '').trim(),
      status: 'brouillon',
      internalNotes: String(formData.get('internalNotes') || '').trim(),
      createdAt: now,
      updatedAt: now,
    }

    state.projects.push(project)
    saveState()
    routeTo(`project/${project.id}`)
  })
}

function renderProjectDetail(view, projectId) {
  const project = state.projects.find((item) => item.id === projectId)
  if (!project) {
    view.innerHTML = '<div class="empty-state">Projet introuvable.</div>'
    return
  }

  view.replaceChildren(useTemplate('detail-template'))

  setText('[data-project-name]', project.companyName)
  setText('[data-project-sector]', project.sector || 'A completer')
  setText('[data-project-contact]', project.contactName || 'A completer')
  setText('[data-project-phone]', project.phone || 'A completer')
  setText('[data-project-email]', project.email || 'A completer')
  setText('[data-project-address]', formatAddress(project))
  setText('[data-project-created]', formatDate(project.createdAt))
  setText('[data-project-status]', project.status)

  renderStatusSelect(project)
  renderQuestionnaire(project)
  renderMediaGrid(project)
  renderGenerationGrid()
  updateProgress(project)
}

function renderStatusSelect(project) {
  const select = document.querySelector('[data-status-select]')
  if (!(select instanceof HTMLSelectElement)) return

  statuses.forEach((status) => {
    const option = document.createElement('option')
    option.value = status
    option.textContent = status
    option.selected = status === project.status
    select.append(option)
  })

  select.addEventListener('change', () => {
    project.status = /** @type {DiscoveryStatus} */ (select.value)
    project.updatedAt = new Date().toISOString()
    saveState()
    setText('[data-project-status]', project.status)
  })
}

function renderQuestionnaire(project) {
  const container = document.querySelector('[data-questionnaire]')
  if (!container) return

  discoverySections.forEach((section, index) => {
    const details = document.createElement('details')
    details.className = 'question-section'
    details.open = index < 2

    const summary = document.createElement('summary')
    summary.innerHTML = `<span>${escapeHtml(section.title)}</span><span class="section-count">${section.questions.length} questions</span>`
    details.append(summary)

    const list = document.createElement('div')
    list.className = 'question-list'

    section.questions.forEach(([questionKey, questionLabel]) => {
      const answer = getAnswer(project.id, section.key, questionKey, questionLabel)
      const card = document.createElement('div')
      card.className = 'question-card'
      card.innerHTML = `
        <label for="${answer.id}">${escapeHtml(questionLabel)}</label>
        <textarea id="${answer.id}" rows="3" data-answer-id="${answer.id}">${escapeHtml(answer.answer)}</textarea>
      `
      list.append(card)
    })

    details.append(list)
    container.append(details)
  })
}

function renderMediaGrid(project) {
  const grid = document.querySelector('[data-media-grid]')
  if (!grid) return

  mediaTypes.forEach(([mediaType, name, notes]) => {
    const item = state.media.find((media) => media.projectId === project.id && media.mediaType === mediaType)
    const card = document.createElement('article')
    card.className = 'media-card'
    card.innerHTML = `
      <span class="media-icon">M</span>
      <h3>${escapeHtml(name)}</h3>
      <p>${escapeHtml(item?.notes || notes)}</p>
      <span class="sync-pill">Upload &agrave; connecter</span>
    `
    grid.append(card)
  })
}

function renderGenerationGrid() {
  const grid = document.querySelector('[data-generation-grid]')
  if (!grid) return

  generationActions.forEach(([key, name, notes]) => {
    const card = document.createElement('article')
    card.className = 'generation-card'
    card.innerHTML = `
      <span class="generation-icon">AI</span>
      <h3>${escapeHtml(name)}</h3>
      <p>${escapeHtml(notes)}</p>
      <button class="ghost-action" type="button" disabled data-generation="${escapeHtml(key)}">A connecter</button>
    `
    grid.append(card)
  })
}

function getAnswer(projectId, sectionKey, questionKey, questionLabel) {
  let answer = state.answers.find((item) => item.projectId === projectId && item.sectionKey === sectionKey && item.questionKey === questionKey)

  if (!answer) {
    answer = {
      id: `ans-${projectId}-${sectionKey}-${questionKey}`,
      projectId,
      sectionKey,
      questionKey,
      questionLabel,
      answer: '',
    }
    state.answers.push(answer)
  }

  return answer
}

function updateProgress(project) {
  const projectAnswers = state.answers.filter((answer) => answer.projectId === project.id)
  const completed = projectAnswers.filter((answer) => answer.answer.trim()).length
  const total = discoverySections.reduce((sum, section) => sum + section.questions.length, 0)
  setText('[data-answer-progress]', `${completed}/${total} reponses`)
}

function formatDate(value) {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value))
}

function formatAddress(project) {
  const cityLine = [project.postalCode, project.city].filter(Boolean).join(' ')
  return [project.address, cityLine].filter(Boolean).join(', ') || 'A completer'
}

function setText(selector, text) {
  const element = document.querySelector(selector)
  if (element) element.textContent = text
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

document.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof Element)) return

  const routeButton = target.closest('[data-route]')
  if (routeButton instanceof HTMLElement && routeButton.dataset.route) routeTo(routeButton.dataset.route)

  const openButton = target.closest('[data-open-project]')
  if (openButton instanceof HTMLElement && openButton.dataset.openProject) routeTo(`project/${openButton.dataset.openProject}`)
})

document.addEventListener('input', (event) => {
  const target = event.target
  if (!(target instanceof HTMLTextAreaElement)) return
  const answerId = target.dataset.answerId
  if (!answerId) return

  const answer = state.answers.find((item) => item.id === answerId)
  if (!answer) return

  answer.answer = target.value
  const project = state.projects.find((item) => item.id === answer.projectId)
  if (project) {
    project.updatedAt = new Date().toISOString()
    updateProgress(project)
  }
  saveState()
})

window.addEventListener('hashchange', render)
render()
