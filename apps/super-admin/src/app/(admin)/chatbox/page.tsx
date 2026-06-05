import Link from 'next/link'
import { Prisma, type ChatQuality } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

const QUALITIES: ChatQuality[] = ['UNKNOWN', 'GOOD', 'BAD']

type Search = {
  source?: string
  quality?: string
  q?: string
}

type ChatboxData = {
  logs: Awaited<ReturnType<typeof getLogs>>
  conversationLogs: Awaited<ReturnType<typeof getConversationLogs>>
  sourceCounts: Array<{ source: string; _count: { source: number } }>
  qualityCounts: Array<{ quality: ChatQuality; _count: { quality: number } }>
  total: number
}

function isQuality(value?: string): value is ChatQuality {
  return Boolean(value && QUALITIES.includes(value as ChatQuality))
}

function buildQuery(params: Search) {
  const source = params.source?.trim() || undefined
  const quality = isQuality(params.quality) ? params.quality : undefined
  const q = params.q?.trim() || undefined
  const where: Prisma.ChatLogWhereInput = {
    source,
    quality,
    OR: q
      ? [
          { userPrompt: { contains: q, mode: 'insensitive' } },
          { assistantResponse: { contains: q, mode: 'insensitive' } },
          { userName: { contains: q, mode: 'insensitive' } },
          { userEmail: { contains: q, mode: 'insensitive' } },
          { conversationId: { contains: q, mode: 'insensitive' } },
        ]
      : undefined,
  }

  return { where, source, quality, q }
}

async function getLogs(where: Prisma.ChatLogWhereInput) {
  return prisma.chatLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 120,
  })
}

async function getConversationLogs(logs: Awaited<ReturnType<typeof getLogs>>) {
  const pairs = new Map<string, { source: string; conversationId: string }>()

  for (const log of logs) {
    if (!log.conversationId || !getDuplicateOf(log.metadata)) continue
    pairs.set(conversationKey(log.source, log.conversationId), {
      source: log.source,
      conversationId: log.conversationId,
    })
  }

  const lookup = Array.from(pairs.values()).slice(0, 30)
  if (lookup.length === 0) return []

  return prisma.chatLog.findMany({
    where: {
      OR: lookup.map((item) => ({
        source: item.source,
        conversationId: item.conversationId,
      })),
    },
    orderBy: { createdAt: 'asc' },
    take: 800,
  })
}

async function loadData(where: Prisma.ChatLogWhereInput): Promise<{ data: ChatboxData | null; error: string | null }> {
  try {
    const [logs, sourceCounts, qualityCounts, total] = await Promise.all([
      getLogs(where),
      prisma.chatLog.groupBy({
        by: ['source'],
        _count: { source: true },
        orderBy: { _count: { source: 'desc' } },
      }),
      prisma.chatLog.groupBy({
        by: ['quality'],
        _count: { quality: true },
      }),
      prisma.chatLog.count(),
    ])
    const conversationLogs = await getConversationLogs(logs)

    return { data: { logs, conversationLogs, sourceCounts, qualityCounts, total }, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Lecture des logs chatbox impossible',
    }
  }
}

export default async function ChatboxPage({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const params = await searchParams
  const query = buildQuery(params)
  const { data, error } = await loadData(query.where)

  const logs = data?.logs ?? []
  const sourceCount = data?.sourceCounts.length ?? 0
  const qualityMap = new Map(data?.qualityCounts.map((item) => [item.quality, item._count.quality]) ?? [])
  const conversationMap = buildConversationMap(data?.conversationLogs ?? [])

  return (
    <main className={styles.page}>
      <div className={styles.termHeader}>
        <span className={styles.termPrompt}>root@lysma</span>
        <span>:</span>
        <span className={styles.termCmd}>~/chatbox</span>
      </div>

      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>conversations IA</span>
          <h1>Chatbox</h1>
          <p>Questions utilisateurs, reponses assistant, qualite et contexte par chatbox.</p>
        </div>
        <div className={styles.statGrid}>
          <Stat label="logs_total" value={data?.total ?? 0} />
          <Stat label="sources" value={sourceCount} />
          <Stat label="a_revoir" value={(qualityMap.get('UNKNOWN') ?? 0) + (qualityMap.get('BAD') ?? 0)} tone="yellow" />
        </div>
      </section>

      <section className={styles.filters}>
        <div className={styles.filterGroup}>
          <span>source</span>
          <Link className={!query.source ? styles.activeFilter : styles.filterLink} href="/chatbox">toutes</Link>
          {data?.sourceCounts.map((item) => (
            <Link
              key={item.source}
              className={query.source === item.source ? styles.activeFilter : styles.filterLink}
              href={filterHref({ ...params, source: item.source })}
            >
              {item.source}
              <em>{item._count.source}</em>
            </Link>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <span>qualite</span>
          <Link className={!query.quality ? styles.activeFilter : styles.filterLink} href={filterHref({ ...params, quality: undefined })}>toutes</Link>
          {QUALITIES.map((quality) => (
            <Link
              key={quality}
              className={query.quality === quality ? styles.activeFilter : styles.filterLink}
              href={filterHref({ ...params, quality })}
            >
              {quality.toLowerCase()}
              <em>{qualityMap.get(quality) ?? 0}</em>
            </Link>
          ))}
        </div>
        <form className={styles.searchForm} action="/chatbox">
          {query.source && <input type="hidden" name="source" value={query.source} />}
          {query.quality && <input type="hidden" name="quality" value={query.quality} />}
          <input name="q" defaultValue={query.q ?? ''} placeholder="chercher question, reponse, email, conversation..." />
          <button type="submit">chercher</button>
        </form>
      </section>

      {error ? (
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>// configuration</span>
            <span className={styles.panelMeta}>table chat_logs indisponible</span>
          </div>
          <div className={styles.empty}>
            Impossible de lire les logs chatbox. Verifie que le schema Prisma a ete pousse en base.
            <code>{error}</code>
          </div>
        </section>
      ) : (
        <section className={styles.grid}>
          {logs.length === 0 ? (
            <div className={styles.emptyCard}>Aucun log chatbox pour ces filtres.</div>
          ) : (
            logs.map((log) => {
              const duplicateOf = getDuplicateOf(log.metadata)
              const conversationLogs = log.conversationId
                ? conversationMap.get(conversationKey(log.source, log.conversationId)) ?? []
                : []

              return (
                <article key={log.id} className={styles.chatCard}>
                  <header className={styles.chatHeader}>
                    <div>
                      <strong>{log.source}</strong>
                      <span>{log.conversationId ?? 'conversation inconnue'}</span>
                      {log.conversationId && (
                        <Link
                          className={styles.threadLink}
                          href={filterHref({ source: log.source, q: log.conversationId })}
                        >
                          voir le fil
                        </Link>
                      )}
                    </div>
                    <div className={styles.chatMeta}>
                      <span className={qualityClass(log.quality)}>{log.quality.toLowerCase()}</span>
                      <time>{formatDate(log.createdAt)}</time>
                    </div>
                  </header>

                  <div className={styles.identity}>
                    <span>{log.userName || 'utilisateur anonyme'}</span>
                    <span>{log.userEmail || 'email absent'}</span>
                  </div>

                  <div className={styles.exchange}>
                    <div className={styles.messageBlock}>
                      <span>question</span>
                      <p>{log.userPrompt}</p>
                    </div>
                    <div className={styles.messageBlock}>
                      <span>reponse</span>
                      <p>{log.assistantResponse || 'Aucune reponse enregistree.'}</p>
                    </div>
                  </div>

                  {duplicateOf && conversationLogs.length > 0 && (
                    <ConversationThread
                      logs={conversationLogs}
                      currentId={log.id}
                      duplicateOf={duplicateOf}
                    />
                  )}

                  {(log.qualityNotes || log.metadata) && (
                    <footer className={styles.cardFooter}>
                      {log.qualityNotes && <p>{log.qualityNotes}</p>}
                      {log.metadata && <pre>{formatJson(log.metadata)}</pre>}
                    </footer>
                  )}
                </article>
              )
            })
          )}
        </section>
      )}
    </main>
  )
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: 'yellow' }) {
  return (
    <div className={styles.statCard}>
      <span>{label}</span>
      <strong className={tone ? styles[tone] : undefined}>{value}</strong>
    </div>
  )
}

function filterHref(params: Search) {
  const search = new URLSearchParams()
  if (params.source) search.set('source', params.source)
  if (params.quality) search.set('quality', params.quality)
  if (params.q) search.set('q', params.q)
  const suffix = search.toString()
  return suffix ? `/chatbox?${suffix}` : '/chatbox'
}

function qualityClass(quality: ChatQuality) {
  if (quality === 'GOOD') return styles.good
  if (quality === 'BAD') return styles.bad
  return styles.unknown
}

function ConversationThread({
  logs,
  currentId,
  duplicateOf,
}: {
  logs: Awaited<ReturnType<typeof getLogs>>
  currentId: string
  duplicateOf: string
}) {
  const originalIndex = logs.findIndex((log) => log.id === duplicateOf)

  return (
    <section className={styles.threadPanel}>
      <div className={styles.threadHeader}>
        <div>
          <span>fil complet de cette conversation</span>
          <strong>{logs.length} echange{logs.length > 1 ? 's' : ''}</strong>
        </div>
        {originalIndex >= 0 && (
          <em>reponse deja donnee au message #{originalIndex + 1}</em>
        )}
      </div>

      <ol className={styles.timeline}>
        {logs.map((log, index) => {
          const isOriginal = log.id === duplicateOf
          const isCurrent = log.id === currentId
          const itemClass = [
            styles.timelineItem,
            isOriginal ? styles.originalItem : '',
            isCurrent ? styles.currentItem : '',
          ].filter(Boolean).join(' ')

          return (
            <li key={log.id} className={itemClass}>
              <div className={styles.timelineTop}>
                <span>#{index + 1}</span>
                <time>{formatDate(log.createdAt)}</time>
                {isOriginal && <em>reponse originale</em>}
                {isCurrent && <em>doublon detecte</em>}
              </div>
              <div className={styles.timelineExchange}>
                <div className={styles.timelineMessage}>
                  <b>question</b>
                  <p>{log.userPrompt}</p>
                </div>
                <div className={styles.timelineMessage}>
                  <b>reponse</b>
                  <p>{log.assistantResponse || 'Aucune reponse enregistree.'}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function buildConversationMap(logs: Awaited<ReturnType<typeof getConversationLogs>>) {
  const map = new Map<string, Awaited<ReturnType<typeof getLogs>>>()

  for (const log of logs) {
    if (!log.conversationId) continue
    const key = conversationKey(log.source, log.conversationId)
    const current = map.get(key) ?? []
    current.push(log)
    map.set(key, current)
  }

  return map
}

function conversationKey(source: string, conversationId: string) {
  return `${source}\u0000${conversationId}`
}

function getDuplicateOf(metadata: Prisma.JsonValue | null) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null
  const flags = metadata.flags
  if (!flags || typeof flags !== 'object' || Array.isArray(flags)) return null
  return typeof flags.duplicateOf === 'string' ? flags.duplicateOf : null
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

function formatJson(value: Prisma.JsonValue) {
  return JSON.stringify(value, null, 2)
}
