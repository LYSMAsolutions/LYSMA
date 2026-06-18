'use client'

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import styles from './page.module.css'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

type MemoryItem = {
  id: string
  humanSummary: string
  category: string
  type: string
  sensitivity: string
  confidence: number
  status: string
  validated: boolean
  updatedAt: string
}

type HypothesisItem = {
  id: string
  summary: string
  sensitivity: string
  confidence: number
  status: string
  createdAt: string
  updatedAt: string
}

type MemoryUpdate = {
  id: string
  kind: 'memory' | 'hypothesis'
  summary: string
  memoryType: 'fact' | 'preference' | 'decision' | 'hypothesis'
  sensitivity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  status: string
  validated: boolean
  createdAt: string
  updatedAt: string
  created: boolean
}

type Props = {
  initialMessages: ChatMessage[]
  initialMemories: MemoryItem[]
  initialHypotheses: HypothesisItem[]
  configuredModel: string
  stats: {
    totalMessages: number
    pendingMemories: number
    pendingHypotheses: number
    activeDecisions: number
  }
}

type AiStatus = 'checking' | 'online' | 'missing-model' | 'configuration' | 'offline'

const welcomeMessage: ChatMessage = {
  id: 'echo-welcome',
  role: 'assistant',
  content:
    'Je suis ECHO. Je peux t’aider à clarifier, structurer et garder le cap. Que veux-tu explorer maintenant ?',
  createdAt: new Date(0).toISOString(),
}

function createTemporaryMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `temp-${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  }
}

export function EchoClient({
  initialMessages,
  initialMemories,
  initialHypotheses,
  configuredModel,
  stats,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages.length > 0 ? initialMessages : [welcomeMessage],
  )
  const [memories, setMemories] = useState(initialMemories)
  const [hypotheses, setHypotheses] = useState(initialHypotheses)
  const [pendingHypothesisCount, setPendingHypothesisCount] = useState(
    stats.pendingHypotheses,
  )
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiStatus, setAiStatus] = useState<AiStatus>('checking')
  const [activeProvider, setActiveProvider] = useState('IA')
  const [activeModel, setActiveModel] = useState(configuredModel)
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetch('/api/echo/status', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('status')
        const data = (await response.json()) as {
          online: boolean
          provider?: string
          model?: string
          modelAvailable: boolean
          errorCode?: string
        }
        setActiveProvider(data.provider || 'IA')
        setActiveModel(data.model || configuredModel)
        setAiStatus(
          data.errorCode === 'configuration'
            ? 'configuration'
            : !data.online
              ? 'offline'
              : data.modelAvailable
                ? 'online'
                : 'missing-model',
        )
      })
      .catch(() => setAiStatus('offline'))
  }, [configuredModel])

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isLoading])

  async function sendMessage() {
    const content = input.trim()
    if (!content || isLoading) return

    const history = messages
      .filter((message) => message.id !== welcomeMessage.id)
      .slice(-20)
      .map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      }))

    const userMessage = createTemporaryMessage('user', content)
    setMessages((current) => [...current, userMessage])
    setInput('')
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/echo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history }),
      })
      const data = (await response.json().catch(() => ({}))) as {
        reply?: string
        error?: string
        assistantMessageId?: string
        createdAt?: string
        memoryUpdate?: MemoryUpdate | null
      }

      if (!response.ok || !data.reply) {
        throw new Error(data.error || 'ECHO n’a pas pu répondre.')
      }

      setMessages((current) => [
        ...current,
        {
          id: data.assistantMessageId || `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply!,
          createdAt: data.createdAt || new Date().toISOString(),
        },
      ])

      if (data.memoryUpdate?.kind === 'memory') {
        const update = data.memoryUpdate
        setMemories((current) => [
          {
            id: update.id,
            humanSummary: update.summary,
            category: 'conversation',
            type: update.memoryType,
            sensitivity: update.sensitivity,
            confidence: update.confidence,
            status: update.status,
            validated: update.validated,
            updatedAt: update.updatedAt,
          },
          ...current.filter((memory) => memory.id !== update.id),
        ])
      }

      if (data.memoryUpdate?.kind === 'hypothesis') {
        const update = data.memoryUpdate
        setHypotheses((current) => [
          {
            id: update.id,
            summary: update.summary,
            sensitivity: update.sensitivity,
            confidence: update.confidence,
            status: update.status,
            createdAt: update.createdAt,
            updatedAt: update.updatedAt,
          },
          ...current.filter((hypothesis) => hypothesis.id !== update.id),
        ])
        if (update.created && update.status === 'en_attente') {
          setPendingHypothesisCount((current) => current + 1)
        }
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Erreur inconnue pendant l’appel à ECHO.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void sendMessage()
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  async function reviewMemory(id: string, action: 'validate' | 'reject') {
    setReviewingId(id)
    setError(null)

    try {
      const response = await fetch(`/api/echo/memory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = (await response.json().catch(() => ({}))) as {
        error?: string
        memory?: { status: string; validated: boolean }
      }

      if (!response.ok || !data.memory) {
        throw new Error(data.error || 'La mémoire n’a pas pu être mise à jour.')
      }

      setMemories((current) =>
        current.map((memory) =>
          memory.id === id
            ? {
                ...memory,
                status: data.memory!.status,
                validated: data.memory!.validated,
              }
            : memory,
        ),
      )
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Erreur pendant la validation de la mémoire.',
      )
    } finally {
      setReviewingId(null)
    }
  }

  const statusLabel = {
    checking: 'vérification',
    online: 'en ligne',
    'missing-model': 'modèle absent',
    configuration: 'non configuré',
    offline: 'hors ligne',
  }[aiStatus]

  const pendingMemories = memories.filter((memory) => memory.status === 'en_validation')
  const recentMemoryItems = [
    ...memories.map((memory) => ({
      id: memory.id,
      kind: 'memory' as const,
      summary: memory.humanSummary,
      memoryType: memory.type,
      confidence: memory.confidence,
      status: memory.status,
      updatedAt: memory.updatedAt,
    })),
    ...hypotheses.map((hypothesis) => ({
      id: hypothesis.id,
      kind: 'hypothesis' as const,
      summary: hypothesis.summary,
      memoryType: 'hypothesis',
      confidence: hypothesis.confidence,
      status: hypothesis.status,
      updatedAt: hypothesis.updatedAt,
    })),
  ]
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
    .slice(0, 12)

  return (
    <div className={styles.workspace}>
      <section className={styles.chatPanel}>
        <header className={styles.chatHeader}>
          <div>
            <span className={styles.eyebrow}>IA PERSONNELLE PRIVÉE</span>
            <h1>ECHO</h1>
            <p>Mémoire centrale, conversation privée et contexte LYSMA.</p>
          </div>
          <div className={styles.runtime}>
            <span className={styles.statusDot} data-status={aiStatus} />
            <div>
              <strong>{statusLabel}</strong>
              <small>{activeProvider} · {activeModel}</small>
            </div>
          </div>
        </header>

        <div ref={listRef} className={styles.messages} aria-live="polite">
          {messages.map((message) => (
            <article
              key={message.id}
              className={message.role === 'user' ? styles.userMessage : styles.echoMessage}
            >
              <div className={styles.messageMeta}>
                <span>{message.role === 'user' ? 'Mathieu' : 'ECHO'}</span>
                {message.id !== welcomeMessage.id && (
                  <time>
                    {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                )}
              </div>
              <p>{message.content}</p>
            </article>
          ))}

          {isLoading && (
            <div className={styles.thinking}>
              <span />
              <span />
              <span />
              ECHO réfléchit
            </div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.composer} onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            placeholder="Écris à ECHO..."
            rows={3}
            maxLength={4000}
            disabled={isLoading}
          />
          <div className={styles.composerFooter}>
            <span>{input.length}/4000 · Entrée pour envoyer</span>
            <button type="submit" disabled={isLoading || input.trim().length === 0}>
              Envoyer
            </button>
          </div>
        </form>
      </section>

      <aside className={styles.contextPanel}>
        <section className={styles.stats}>
          <div>
            <span>messages</span>
            <strong>{stats.totalMessages}</strong>
          </div>
          <div>
            <span>à valider</span>
            <strong>{pendingMemories.length}</strong>
          </div>
          <div>
            <span>hypothèses</span>
            <strong>{pendingHypothesisCount}</strong>
          </div>
          <div>
            <span>décisions</span>
            <strong>{stats.activeDecisions}</strong>
          </div>
        </section>

        <section className={styles.memorySection}>
          <header>
            <div>
              <span className={styles.eyebrow}>MÉMOIRE PROTÉGÉE</span>
              <h2>À valider</h2>
            </div>
            <span className={styles.counter}>{pendingMemories.length}</span>
          </header>

          <div className={styles.memoryList}>
            {pendingMemories.map((memory) => (
              <article key={memory.id} className={styles.memoryCard}>
                <div className={styles.memoryTags}>
                  <span>{memory.type}</span>
                  <span>{Math.round(memory.confidence * 100)}%</span>
                </div>
                <p>{memory.humanSummary}</p>
                <div className={styles.memoryActions}>
                  <button
                    type="button"
                    onClick={() => void reviewMemory(memory.id, 'reject')}
                    disabled={reviewingId === memory.id}
                    className={styles.rejectButton}
                  >
                    Rejeter
                  </button>
                  <button
                    type="button"
                    onClick={() => void reviewMemory(memory.id, 'validate')}
                    disabled={reviewingId === memory.id}
                    className={styles.validateButton}
                  >
                    Valider
                  </button>
                </div>
              </article>
            ))}
            {pendingMemories.length === 0 && (
              <p className={styles.empty}>Aucune mémoire sensible en attente.</p>
            )}
          </div>
        </section>

        <section className={styles.memorySection}>
          <header>
            <div>
              <span className={styles.eyebrow}>CONTEXTE ACTIF</span>
              <h2>Mémoires récentes</h2>
            </div>
          </header>
          <div className={styles.knownList}>
            {recentMemoryItems.map((memory) => (
              <article key={`${memory.kind}-${memory.id}`}>
                <div className={styles.recentMeta}>
                  <span data-status={memory.status}>{memory.memoryType}</span>
                  <span>{Math.round(memory.confidence * 100)}%</span>
                  <time dateTime={memory.updatedAt}>
                    {new Date(memory.updatedAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </time>
                </div>
                <p>{memory.summary}</p>
              </article>
            ))}
            {recentMemoryItems.length === 0 && (
              <p className={styles.empty}>La mémoire structurée est encore vide.</p>
            )}
          </div>
        </section>
      </aside>
    </div>
  )
}
