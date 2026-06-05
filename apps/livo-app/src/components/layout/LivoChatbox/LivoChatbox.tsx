'use client'

import { FormEvent, useRef, useState } from 'react'
import { ChatCircleText, PaperPlaneTilt, X } from '@phosphor-icons/react'
import { getChatboxPageMetadata } from '@/lib/chatbox-page-metadata'
import styles from './LivoChatbox.module.css'

type Message = {
  role: 'assistant' | 'user'
  content: string
}

const quickReplies = [
  'A quoi sert LIVO ?',
  'Conformite temps',
  'Ordres de reparation',
  'Pointage atelier',
  'Rentabilite',
  'Contacter LYSMA',
]

const mailUrl =
  'mailto:lysmasolutions@gmail.com?subject=Question%20LIVO%20App&body=Bonjour%20LYSMA%20Solutions%2C%0A%0ANous%20souhaitons%20vous%20poser%20une%20question%20sur%20LIVO%20App.%0A'

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function getAnswer(message: string) {
  const text = normalize(message)

  if (text.includes('sert') || text.includes('livo')) {
    return 'LIVO aide un atelier automobile a mieux suivre les ordres de reparation, le temps passe, les compagnons et les indicateurs utiles au quotidien.'
  }

  if (
    (text.includes('legal') || text.includes('conformite') || text.includes('fliquer') || text.includes('surveillance')) &&
    (text.includes('pointage') || text.includes('vehicule') || text.includes('voiture') || text.includes('or') || text.includes('reparation'))
  ) {
    return "Le pointage par vehicule peut etre presente comme un suivi d'atelier, pas comme un outil de surveillance individuelle. L'usage doit rester transparent, proportionne et explique aux collaborateurs : objectif, donnees suivies, duree de conservation et personnes autorisees a les consulter. LIVO sert surtout a relier le temps aux ordres de reparation pour mieux organiser l'atelier et comprendre la rentabilite."
  }

  if (text.includes('conformite') || text.includes('legal') || text.includes('inspection') || text.includes('prud')) {
    return "LIVO aide a conserver un historique horodate et consultable des temps de travail. Pour rester sain cote equipe, l'outil doit etre annonce clairement, utilise pour l'organisation de l'atelier et limite aux donnees utiles."
  }

  if (text.includes('ordre') || text.includes('or') || text.includes('reparation') || text.includes('vehicule')) {
    return 'La partie atelier centralise les fiches, les vehicules, les compagnons et les informations importantes autour des ordres de reparation.'
  }

  if (text.includes('pointage') || text.includes('temps') || text.includes('compagnon') || text.includes('rh')) {
    return "Le pointage aide a suivre le temps de travail et a mieux comprendre l'activite de l'atelier, sans multiplier les fichiers disperses."
  }

  if (text.includes('rentabilite') || text.includes('rapport') || text.includes('stat')) {
    return "Les rapports donnent une lecture plus claire de l'activite : temps, suivi atelier et indicateurs utiles pour piloter plus sereinement."
  }

  if (text.includes('contact') || text.includes('mail') || text.includes('aide') || text.includes('support')) {
    return 'Pour une question precise, le plus simple est d ecrire a LYSMA Solutions. Le bouton de contact prepare un email.'
  }

  return "Nous pouvons vous orienter sur le suivi atelier, le pointage, les rapports ou l'usage general de LIVO. Pour une demande precise, vous pouvez aussi ecrire a LYSMA."
}

function createConversationId() {
  const storageKey = 'livoChatboxConversationId'
  const existing = typeof window !== 'undefined' ? window.sessionStorage.getItem(storageKey) : null
  if (existing) return existing

  const id = `livo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(storageKey, id)
  }

  return id
}

function logChatExchange(conversationId: string, userPrompt: string, assistantResponse: string) {
  fetch('/api/chatbox/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversationId,
      userPrompt,
      assistantResponse,
      metadata: getChatboxPageMetadata(),
    }),
    keepalive: true,
  }).catch(() => undefined)
}

export function LivoChatbox() {
  const conversationIdRef = useRef(createConversationId())
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour, nous pouvons vous orienter sur LIVO App et ses principales fonctions atelier.',
    },
  ])
  const hasUserMessage = messages.some((message) => message.role === 'user')

  function ask(message: string) {
    const cleanMessage = message.trim()
    if (!cleanMessage) return
    const answer = getAnswer(cleanMessage)

    void logChatExchange(conversationIdRef.current, cleanMessage, answer)

    setMessages((current) => [
      ...current,
      { role: 'user', content: cleanMessage },
      { role: 'assistant', content: answer },
    ])
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    ask(String(formData.get('question') || ''))
    form.reset()
  }

  return (
    <div className={styles.chatbox}>
      {open ? (
        <section className={styles.panel} aria-label="Chatbox LIVO">
          <header className={styles.header}>
            <div>
              <strong>LIVO Assistant</strong>
              <span>Message libre</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fermer la chatbox">
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className={styles.messages}>
            {messages.map((message, index) => (
              <p key={`${message.role}-${index}`} className={`${styles.message} ${styles[message.role]}`}>
                {message.content}
              </p>
            ))}
          </div>

          <p className={styles.notice}>
            Les échanges avec l'assistant peuvent être enregistrés pour le support et l'amélioration de l'expérience.
            Ils ne sont pas vendus ni utilisés à des fins publicitaires.
          </p>

          {!hasUserMessage ? (
            <div className={styles.preMessages} aria-label="Pre-messages disponibles">
              <span>Pre-messages</span>
              <div className={styles.quickReplies}>
                {quickReplies.map((reply) => (
                  <button key={reply} type="button" onClick={() => ask(reply)}>
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <form className={styles.form} onSubmit={submit}>
            <input name="question" placeholder="Votre question" maxLength={260} />
            <button type="submit" aria-label="Envoyer la question">
              <PaperPlaneTilt size={18} weight="bold" aria-hidden="true" />
            </button>
          </form>

          <a className={styles.mailLink} href={mailUrl}>
            Ecrire a LYSMA
          </a>
        </section>
      ) : null}

      <button
        className={styles.bubble}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? 'Fermer la chatbox' : 'Ouvrir la chatbox'}
      >
        <ChatCircleText size={25} weight="duotone" aria-hidden="true" />
      </button>
    </div>
  )
}
