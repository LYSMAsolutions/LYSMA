'use client'

import { FormEvent, useState } from 'react'
import { ChatCircleText, PaperPlaneTilt, X } from '@phosphor-icons/react'
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

  if (text.includes('conformite') || text.includes('legal') || text.includes('inspection') || text.includes('prud')) {
    return 'LIVO aide a conserver un historique horodate et consultable des temps de travail. Une page dediee explique les enjeux de conformite du temps de travail.'
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

export function LivoChatbox() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour, nous pouvons vous orienter sur LIVO App et ses principales fonctions atelier.',
    },
  ])

  function ask(message: string) {
    const cleanMessage = message.trim()
    if (!cleanMessage) return

    setMessages((current) => [
      ...current,
      { role: 'user', content: cleanMessage },
      { role: 'assistant', content: getAnswer(cleanMessage) },
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
              <span>Reponses rapides</span>
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

          <div className={styles.quickReplies}>
            {quickReplies.map((reply) => (
              <button key={reply} type="button" onClick={() => ask(reply)}>
                {reply}
              </button>
            ))}
          </div>

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

      <button className={styles.bubble} type="button" onClick={() => setOpen(true)} aria-label="Ouvrir la chatbox">
        <ChatCircleText size={25} weight="duotone" aria-hidden="true" />
      </button>
    </div>
  )
}
