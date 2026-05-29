const DISCOVERY_ENDPOINT = "https://script.google.com/macros/s/AKfycbz7hwyXsfvpkJ-j6rMPZwzH6c-hFOGqvDW4JliA_gdpJU2s-JkrkQZlfru3xopVhhM16A/exec";

const form = document.querySelector('#discovery-form')
const submitButton = document.querySelector('#submit-button')
const submitLabel = document.querySelector('[data-submit-label]')
const message = document.querySelector('#form-message')

let isSubmitting = false

if (form instanceof HTMLFormElement) {
  form.addEventListener('submit', handleSubmit)
}

async function handleSubmit(event) {
  event.preventDefault()

  if (!(form instanceof HTMLFormElement) || !(submitButton instanceof HTMLButtonElement)) return
  if (isSubmitting) return

  clearMessage()

  if (!form.reportValidity()) return

  const payload = readPayload(form)

  if (payload.websiteUrl) {
    setSuccess('Votre découverte a bien été envoyée à LYSMA Solutions.')
    form.reset()
    return
  }

  if (!isEndpointConfigured()) {
    setError("L’envoi n’est pas encore connecté. Ajoutez l’URL Google Apps Script dans DISCOVERY_ENDPOINT.")
    return
  }

  setSubmitting(true)

  try {
    const response = await fetch(DISCOVERY_ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    })

    const result = await parseResponse(response)

    if (!response.ok || result?.success === false) {
      throw new Error(result?.error || "L’envoi n’a pas pu être confirmé.")
    }

    setSuccess('Votre découverte a bien été envoyée à LYSMA Solutions.')
    form.reset()
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Erreur inconnue.'
    setError(`Impossible d’envoyer la découverte pour le moment. ${details}`)
  } finally {
    setSubmitting(false)
  }
}

function readPayload(sourceForm) {
  const formData = new FormData(sourceForm)

  return {
    companyName: getValue(formData, 'companyName'),
    sector: getValue(formData, 'sector'),
    contactName: getValue(formData, 'contactName'),
    phone: getValue(formData, 'phone'),
    email: getValue(formData, 'email'),
    address: getValue(formData, 'address'),
    city: getValue(formData, 'city'),
    postalCode: getValue(formData, 'postalCode'),
    currentWebsite: getValue(formData, 'currentWebsite'),
    story: getValue(formData, 'story'),
    values: getValue(formData, 'values'),
    services: getValue(formData, 'services'),
    targetCustomers: getValue(formData, 'targetCustomers'),
    serviceArea: getValue(formData, 'serviceArea'),
    competitors: getValue(formData, 'competitors'),
    currentDigitalPresence: getValue(formData, 'currentDigitalPresence'),
    goals: getValue(formData, 'goals'),
    seoCities: getValue(formData, 'seoCities'),
    seoKeywords: getValue(formData, 'seoKeywords'),
    availablePhotos: getValue(formData, 'availablePhotos'),
    strategicAnswer: getValue(formData, 'strategicAnswer'),
    internalNotes: getValue(formData, 'internalNotes'),
    websiteUrl: getValue(formData, 'websiteUrl'),
    submittedAt: new Date().toISOString(),
    source: 'lysma-decouverte-client',
  }
}

function getValue(formData, key) {
  return String(formData.get(key) || '').trim()
}

function isEndpointConfigured() {
  return DISCOVERY_ENDPOINT && DISCOVERY_ENDPOINT !== 'COLLER_ICI_URL_GOOGLE_APPS_SCRIPT'
}

async function parseResponse(response) {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch (_error) {
    return { success: response.ok }
  }
}

function setSubmitting(value) {
  isSubmitting = value
  if (submitButton instanceof HTMLButtonElement) submitButton.disabled = value
  if (submitLabel) submitLabel.textContent = value ? 'Envoi en cours...' : 'Envoyer la découverte à LYSMA'
  document.body.classList.toggle('is-submitting', value)
}

function clearMessage() {
  if (!message) return
  message.textContent = ''
  message.className = 'form-message'
}

function setSuccess(text) {
  if (!message) return
  message.textContent = text
  message.className = 'form-message success'
}

function setError(text) {
  if (!message) return
  message.textContent = text
  message.className = 'form-message error'
}
