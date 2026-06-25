'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ChatCircleText, Flag, PaperPlaneTilt, X } from '@phosphor-icons/react'
import { getChatboxPageMetadata } from '@/lib/chatbox-page-metadata'
import { LIVO_PRICING } from '@/lib/pricing'
import styles from './LivoChatbox.module.css'

type ProblemType =
  | 'USER_REPORTED'
  | 'MISUNDERSTANDING'
  | 'LOST_CONTEXT'
  | 'USER_NEGATIVE_FEEDBACK'
  | 'DUPLICATE'

type Message = {
  role: 'assistant' | 'user'
  content: string
  reportPrompt?: string
  reportAnswer?: string
}

type UpdateNotice = {
  id: string
  userPrompt: string
  improvedResponse: string
}

const STORAGE_PREFIX = 'livo:chatbox:v3:livo-app'
const VISITOR_KEY = `${STORAGE_PREFIX}:visitorId`
const SESSION_KEY = `${STORAGE_PREFIX}:sessionId`
const CONVERSATION_KEY = `${STORAGE_PREFIX}:conversationId`
const OPT_OUT_KEY = `${STORAGE_PREFIX}:disabled`

const quickReplies = [
  'À quoi sert LIVO ?',
  'Conformité temps',
  'Ordres de réparation',
  'Pointage atelier',
  'Rentabilité',
  'Contacter LYSMA',
]

const mailUrl =
  'mailto:lysmasolutions@gmail.com?subject=Question%20LIVO%20App&body=Bonjour%20LYSMA%20Solutions%2C%0A%0ANous%20souhaitons%20vous%20poser%20une%20question%20sur%20LIVO%20App.%0A'

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(normalize(keyword)))
}

function avoidRepeatedAnswer(answer: string, history: { role: string; content: string }[]): string {
  const previousAnswers = new Set(
    history.filter((m) => m.role === 'assistant').map((m) => m.content)
  )
  if (!previousAnswers.has(answer)) return answer
  return "Je vous ai déjà donné ces éléments. Pour aller plus loin, écrivez directement à LYSMA Solutions — le bouton de contact ci-dessous prépare le message."
}

function getAnswer(message: string, history: { role: string; content: string }[] = []) {
  const text = normalize(message)

  if (hasAny(text, ['prix', 'tarif', 'combien', 'cout', 'coût', 'abonnement', 'mensuel', 'mois', 'euro'])) {
    return avoidRepeatedAnswer(`LIVO est à ${LIVO_PRICING.primaryPlan.priceMonthly} € / mois, compagnons illimités inclus. Vous bénéficiez de ${LIVO_PRICING.trialDays} jours d'essai gratuit sans engagement — accès complet dès l'inscription.`, history)
  }

  if (hasAny(text, ['essai', 'gratuit', 'tester', 'essayer', 'decouvrir', 'sans engagement', 'demo'])) {
    return avoidRepeatedAnswer(`Oui, LIVO propose ${LIVO_PRICING.trialDays} jours d'essai gratuit avec accès complet. Pas de carte bancaire requise pour démarrer. Vous pouvez tester toutes les fonctionnalités avec votre vrai atelier.`, history)
  }

  if (hasAny(text, ['installer', 'installation', 'commencer', 'demarrer', 'lancer', 'inscrire', 'inscription', 'connexion'])) {
    return avoidRepeatedAnswer("LIVO ne nécessite aucune installation. C'est une application web : vous vous connectez depuis n'importe quel navigateur, sur ordinateur, tablette ou smartphone. Vous créez votre garage, ajoutez vos compagnons et vous êtes opérationnel en quelques minutes.", history)
  }

  if (hasAny(text, ['telephone', 'smartphone', 'mobile', 'tablette', 'ipad', 'ordinateur', 'pc', 'appareil'])) {
    return avoidRepeatedAnswer("LIVO fonctionne sur tous les appareils sans installation : ordinateur, tablette et smartphone. Idéal pour les compagnons qui pointent depuis l'atelier sur une tablette, et le gérant qui consulte les indicateurs depuis son bureau ou son téléphone.", history)
  }

  if (hasAny(text, ['seul', 'petit garage', 'petite structure', 'mra', 'independant', 'artisan', 'solo'])) {
    return avoidRepeatedAnswer("LIVO est conçu pour les petits et moyens ateliers. Vous pouvez l'utiliser seul ou avec une équipe — le nombre de compagnons est illimité. L'outil reste simple et ne nécessite pas de formation longue.", history)
  }

  if (hasAny(text, ['fliquer', 'surveiller', 'surveillance', 'espionner', 'controle'])) {
    return avoidRepeatedAnswer("LIVO n'est pas un outil de surveillance individuelle. Il sert à comparer le temps passé en atelier avec le temps facturé, et à mieux piloter l'activité globale. Le pointage par véhicule doit être présenté comme un suivi d'atelier, pas un contrôle — la transparence avec l'équipe est essentielle.", history)
  }

  if (hasAny(text, ['legal', 'loi', 'conformite', 'inspection', 'prud', 'droit du travail'])) {
    const answer = "LIVO génère un historique horodaté des temps de travail par compagnon et par véhicule, consultable à tout moment. Pour être conforme, l'usage du pointage doit être annoncé à l'équipe et limité aux données utiles au pilotage de l'atelier."
    return avoidRepeatedAnswer(answer, history)
  }

  if (hasAny(text, ['document', 'texte', 'reference', 'loi', 'article', 'justificatif', 'preuve', 'cnil', 'rgpd', 'disposition'])) {
    return avoidRepeatedAnswer(
      "LIVO n'est pas un cabinet juridique et ne fournit pas de documents légaux. Pour les textes de référence sur le pointage atelier, vous pouvez consulter le Code du travail (articles L3171-1 et suivants sur le décompte du temps de travail) et les recommandations de la CNIL sur les dispositifs de contrôle. Un conseiller RH ou votre fédération professionnelle peut vous orienter précisément.",
      history
    )
  }

  if (hasAny(text, ['fiche', 'ordre de reparation', 'or externe', 'qr', 'integration', 'partenaire', 'logiciel', 'api'])) {
    return avoidRepeatedAnswer("LIVO gère les ordres de réparation internes et les OR externes — y compris via intégration QR avec vos logiciels partenaires. Chaque fiche regroupe le véhicule, le client, les travaux, les compagnons assignés et le suivi des temps.", history)
  }

  if (hasAny(text, ['ordre', 'reparation', 'vehicule', 'voiture', 'dossier', 'client'])) {
    return avoidRepeatedAnswer("Dans LIVO, chaque ordre de réparation regroupe le véhicule, le client, les travaux prévus, les compagnons affectés et le suivi des temps. Vous retrouvez toutes les informations d'un dossier en un clic, sans chercher dans plusieurs fichiers.", history)
  }

  if (hasAny(text, ['pointage', 'pointer', 'heure', 'temps passe', 'compagnon', 'technicien', 'mecanicien'])) {
    return avoidRepeatedAnswer("Le pointage LIVO fonctionne par véhicule : chaque compagnon indique sur quelle fiche il travaille. Vous voyez en temps réel qui fait quoi, combien de temps a été passé sur chaque OR et quel écart existe entre le temps prévu et le temps réel.", history)
  }

  if (hasAny(text, ['rentabilite', 'marge', 'rapport', 'indicateur', 'stat', 'kpi', 'bilan', 'analyse'])) {
    return avoidRepeatedAnswer("LIVO calcule automatiquement des indicateurs de rentabilité à partir des données de pointage : temps facturables, écarts atelier, activité par compagnon. Pas de tableaux complexes — des chiffres utiles pour prendre des décisions.", history)
  }

  if (hasAny(text, ['absence', 'conge', 'arret', 'maladie', 'rh', 'releve', 'mensuel', 'paie'])) {
    return avoidRepeatedAnswer("LIVO inclut un suivi des absences et des relevés mensuels de pointage par compagnon, exportables en PDF. Utile pour le suivi RH sans avoir à ressaisir les données dans un autre fichier.", history)
  }

  if (hasAny(text, ['sert', 'utilite', 'pourquoi', 'a quoi', 'livo'])) {
    return avoidRepeatedAnswer(`LIVO est un outil de gestion d'atelier automobile : ordres de réparation, pointage compagnons, suivi véhicules, rentabilité et relevés mensuels. Tout est centralisé à ${LIVO_PRICING.primaryPlan.priceMonthly} € / mois, sans installation, compagnons illimités.`, history)
  }

  if (hasAny(text, ['contact', 'mail', 'email', 'ecrire', 'support', 'aide', 'probleme', 'question'])) {
    return avoidRepeatedAnswer("Pour toute question ou problème, écrivez à LYSMA Solutions via le bouton de contact ci-dessous. Nous revenons vers vous rapidement.", history)
  }

  return "Je peux vous renseigner sur le pointage, les ordres de réparation, les rapports de rentabilité, le prix ou l'essai gratuit de LIVO. Posez votre question !"
}

function detectNegativeFeedback(message: string): ProblemType | null {
  const text = normalize(message)
  if (
    [
      'tu nas pas repondu',
      'tu n as pas repondu',
      'ce nest pas ma question',
      'ce n est pas ma question',
      'tu reponds a cote',
      'tu nas pas compris',
      'tu n as pas compris',
    ].some((phrase) => text.includes(phrase))
  ) {
    return 'MISUNDERSTANDING'
  }

  if (
    [
      'relis ma question',
      'ce nest pas ce que jai demande',
      'ce n est pas ce que j ai demande',
      'pourquoi tu me parles de ca',
    ].some((phrase) => text.includes(phrase))
  ) {
    return 'LOST_CONTEXT'
  }

  if (['cest faux', 'c est faux', 'nimporte quoi', 'n importe quoi'].some((phrase) => text.includes(phrase))) {
    return 'USER_NEGATIVE_FEEDBACK'
  }

  return null
}

function randomId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`
}

function readStorageId(storage: Storage | undefined, key: string, prefix: string) {
  if (!storage) return randomId(prefix)

  try {
    const existing = storage.getItem(key)
    if (existing) return existing
    const generated = randomId(prefix)
    storage.setItem(key, generated)
    return generated
  } catch {
    return randomId(prefix)
  }
}

function isStorageDisabled() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(OPT_OUT_KEY) === 'true'
}

function getVisitorId() {
  if (typeof window === 'undefined' || isStorageDisabled()) return null
  return readStorageId(window.localStorage, VISITOR_KEY, 'visitor')
}

function getSessionId() {
  if (typeof window === 'undefined' || isStorageDisabled()) return randomId('session')
  return readStorageId(window.sessionStorage, SESSION_KEY, 'session')
}

function getConversationId() {
  if (typeof window === 'undefined' || isStorageDisabled()) return randomId('conversation')
  return readStorageId(window.sessionStorage, CONVERSATION_KEY, 'conversation')
}

function getLastExchange(messages: Message[]) {
  for (let index = messages.length - 1; index >= 1; index -= 1) {
    const answer = messages[index]
    const question = messages[index - 1]
    if (answer.role === 'assistant' && question.role === 'user') {
      return { prompt: question.content, answer: answer.content }
    }
  }

  return null
}

export function LivoChatbox() {
  const visitorIdRef = useRef<string | null>(null)
  const sessionIdRef = useRef(getSessionId())
  const conversationIdRef = useRef(getConversationId())
  const [open, setOpen] = useState(false)
  const [visitorId, setVisitorId] = useState<string | null>(null)
  const [storageDisabled, setStorageDisabled] = useState(false)
  const [updates, setUpdates] = useState<UpdateNotice[]>([])
  const [hasUnreadUpdates, setHasUnreadUpdates] = useState(false)
  const [reportNotice, setReportNotice] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour. Posez votre question sur LIVO : pointage, ordres de réparation, conformité, rapports ou usage atelier.',
    },
  ])
  const hasUserMessage = messages.some((message) => message.role === 'user')

  useEffect(() => {
    const disabled = isStorageDisabled()
    const nextVisitorId = getVisitorId()
    visitorIdRef.current = nextVisitorId
    sessionIdRef.current = getSessionId()
    conversationIdRef.current = getConversationId()
    setVisitorId(nextVisitorId)
    setStorageDisabled(disabled)

    if (nextVisitorId) {
      void loadUpdates(nextVisitorId)
    }
  }, [])

  useEffect(() => {
    if (!open || !visitorIdRef.current || !hasUnreadUpdates || updates.length === 0) return

    setHasUnreadUpdates(false)
    updates.forEach((update) => {
      void fetch('/api/chatbox/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId: visitorIdRef.current, updateId: update.id }),
      }).catch(() => undefined)
    })
  }, [hasUnreadUpdates, open, updates])

  async function loadUpdates(nextVisitorId: string) {
    const response = await fetch(`/api/chatbox/updates?visitorId=${encodeURIComponent(nextVisitorId)}`).catch(() => null)
    if (!response?.ok) return
    const data = await response.json().catch(() => null) as { updates?: UpdateNotice[] } | null
    const unread = data?.updates ?? []
    setUpdates(unread)
    setHasUnreadUpdates(unread.length > 0)
  }

  function logChatExchange(input: {
    userPrompt: string
    assistantResponse: string
    quality?: 'UNKNOWN' | 'GOOD' | 'BAD'
    qualityNotes?: string
    problemType?: ProblemType
    metadata?: Record<string, unknown>
  }) {
    fetch('/api/chatbox/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: conversationIdRef.current,
        visitorId: visitorIdRef.current,
        sessionId: sessionIdRef.current,
        userPrompt: input.userPrompt,
        assistantResponse: input.assistantResponse,
        quality: input.quality,
        qualityNotes: input.qualityNotes,
        problemType: input.problemType,
        metadata: {
          ...getChatboxPageMetadata(),
          privacy: {
            visitorIdEnabled: Boolean(visitorIdRef.current),
            storageDisabled,
          },
          ...input.metadata,
        },
      }),
      keepalive: true,
    }).catch(() => undefined)
  }

  function ask(message: string) {
    const cleanMessage = message.trim()
    if (!cleanMessage) return

    setReportNotice(null)
    const problemType = detectNegativeFeedback(cleanMessage)

    if (problemType) {
      const previous = getLastExchange(messages)
      const answer = previous
        ? `D'accord, je reprends en partant de votre question précédente. ${getAnswer(previous.prompt)}`
        : "D'accord, je reprends. Ma réponse précédente n'était pas assez claire : pouvez-vous préciser le point à corriger ?"

      logChatExchange({
        userPrompt: cleanMessage,
        assistantResponse: previous?.answer ?? answer,
        quality: 'BAD',
        problemType,
        qualityNotes: "Signal d'incomprehension utilisateur depuis la chatbox.",
        metadata: previous ? { feedback: previous } : undefined,
      })

      setMessages((current) => [
        ...current,
        { role: 'user', content: cleanMessage },
        { role: 'assistant', content: answer },
      ])
      return
    }

    const answer = getAnswer(cleanMessage, messages)

    const previousAnswers = messages.filter((m) => m.role === 'assistant').map((m) => m.content)
    const isDuplicate = previousAnswers.includes(answer)

    logChatExchange({
      userPrompt: cleanMessage,
      assistantResponse: answer,
      quality: isDuplicate ? 'BAD' : 'UNKNOWN',
      problemType: isDuplicate ? 'DUPLICATE' : undefined,
      qualityNotes: isDuplicate ? 'Réponse identique à une réponse précédente dans la conversation.' : undefined,
    })

    setMessages((current) => [
      ...current,
      { role: 'user', content: cleanMessage },
      { role: 'assistant', content: answer, reportPrompt: cleanMessage, reportAnswer: answer },
    ])
  }

  function reportAnswer(prompt: string, answer: string) {
    logChatExchange({
      userPrompt: prompt,
      assistantResponse: answer,
      quality: 'BAD',
      problemType: 'USER_REPORTED',
      qualityNotes: 'Signalement utilisateur depuis la chatbox.',
      metadata: { report: { reportedAnswer: answer } },
    })
    setReportNotice('Merci, le retour a bien été transmis. Cela nous aide à améliorer les réponses.')
  }

  function disableConversationStorage() {
    try {
      window.localStorage.setItem(OPT_OUT_KEY, 'true')
      window.localStorage.removeItem(VISITOR_KEY)
      window.sessionStorage.removeItem(SESSION_KEY)
      window.sessionStorage.removeItem(CONVERSATION_KEY)
    } catch {
      // Local storage may be unavailable; keep the chat usable.
    }

    visitorIdRef.current = null
    sessionIdRef.current = randomId('session')
    conversationIdRef.current = randomId('conversation')
    setVisitorId(null)
    setUpdates([])
    setHasUnreadUpdates(false)
    setStorageDisabled(true)
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

          {updates.length > 0 ? (
            <div className={styles.updates}>
              <strong>Une réponse à votre question a été améliorée.</strong>
              {updates.map((update) => (
                <div key={update.id}>
                  <span>Question initiale</span>
                  <p>{update.userPrompt}</p>
                  <span>Nouvelle réponse</span>
                  <p>{update.improvedResponse}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className={styles.messages}>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={styles.messageRow}>
                <p className={`${styles.message} ${styles[message.role]}`}>
                  {message.content}
                </p>
                {message.role === 'assistant' && message.reportPrompt && message.reportAnswer ? (
                  <button type="button" className={styles.reportButton} onClick={() => reportAnswer(message.reportPrompt!, message.reportAnswer!)}>
                    <Flag size={13} aria-hidden="true" />
                    Signaler cette réponse
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {reportNotice ? <p className={styles.feedback}>{reportNotice}</p> : null}

          <p className={styles.notice}>
            Les échanges avec la chatbox peuvent être enregistrés afin d'améliorer la qualité des réponses.
            Un identifiant anonyme peut signaler une réponse améliorée sur ce site, sans usage publicitaire.
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

          <div className={styles.footerActions}>
            <a className={styles.mailLink} href={mailUrl}>
              Ecrire a LYSMA
            </a>
            <button type="button" onClick={disableConversationStorage} disabled={storageDisabled}>
              {visitorId ? 'Ne pas conserver ma conversation' : 'Conversation non conservée'}
            </button>
          </div>
        </section>
      ) : null}

      <button
        className={styles.bubble}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? 'Fermer la chatbox' : 'Ouvrir la chatbox'}
      >
        {hasUnreadUpdates && !open ? <span className={styles.badge} aria-hidden="true" /> : null}
        <ChatCircleText size={25} weight="duotone" aria-hidden="true" />
      </button>
    </div>
  )
}
