import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Prisma, type ChatQuality } from '@/generated/prisma'
import { writeAuditLog } from '@/lib/audit'
import { buildChatboxInsights, getChatboxAnalyticsTags, type ChatboxInsights } from '@/lib/chatbox-analytics'
import { buildCodexContext, conversationKey, formatChatLogDate, getDuplicateOf } from '@/lib/chatbox-review'
import { prisma } from '@/lib/prisma'
import { CopyChatContextButton } from './CopyChatContextButton'
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
  analyticsLogs: Awaited<ReturnType<typeof getAnalyticsLogs>>
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

async function getAnalyticsLogs(where: Prisma.ChatLogWhereInput) {
  return prisma.chatLog.findMany({
    where,
    select: {
      userPrompt: true,
      metadata: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 1000,
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
    const [logs, analyticsLogs, sourceCounts, qualityCounts, total] = await Promise.all([
      getLogs(where),
      getAnalyticsLogs(where),
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

    return { data: { logs, analyticsLogs, conversationLogs, sourceCounts, qualityCounts, total }, error: null }
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
  const insights = buildChatboxInsights(data?.analyticsLogs ?? [])
  const conversationMap = buildConversationMap(data?.conversationLogs ?? [])
  const currentHref = filterHref(params)

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

      {!error && <InsightsPanel insights={insights} />}

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
              const supportMeta = [...chatSupportMeta(log.metadata), ...getChatboxAnalyticsTags(log.metadata)]

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
                    <time>{formatChatLogDate(log.createdAt)}</time>
                    </div>
                  </header>

                  <div className={styles.identity}>
                    <span>{log.userName || 'utilisateur anonyme'}</span>
                    <span>{log.userEmail || 'email absent'}</span>
                    {supportMeta.map((item) => (
                      <span key={item.label}>
                        <b>{item.label}</b>
                        {item.value}
                      </span>
                    ))}
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

                  {log.quality === 'BAD' && (
                    <div className={styles.reviewActions}>
                      <CopyChatContextButton text={buildCodexContext(log, conversationLogs, duplicateOf)} />
                      <form action={markChatLogImproved}>
                        <input type="hidden" name="id" value={log.id} />
                        <input type="hidden" name="returnTo" value={currentHref} />
                        <button type="submit">valider l'amelioration</button>
                      </form>
                    </div>
                  )}

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

function InsightsPanel({ insights }: { insights: ChatboxInsights }) {
  return (
    <section className={styles.insights}>
      <InsightCard title="questions frequentes" items={insights.topQuestions} />
      <InsightCard title="fonctionnalites demandees" items={insights.requestedFeatures} />
      <InsightCard title="pages chatbox" items={insights.chatPages} />
      <InsightCard title="mots-cles" items={insights.keywords} />
    </section>
  )
}

function InsightCard({ title, items }: { title: string; items: Array<{ label: string; count: number }> }) {
  return (
    <article className={styles.insightCard}>
      <header>
        <span>{title}</span>
        <strong>{items.reduce((total, item) => total + item.count, 0)}</strong>
      </header>
      {items.length > 0 ? (
        <ol className={styles.insightList}>
          {items.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <b>{item.count}</b>
            </li>
          ))}
        </ol>
      ) : (
        <p>Aucune donnee pour ces filtres.</p>
      )}
    </article>
  )
}

async function markChatLogImproved(formData: FormData) {
  'use server'

  const id = String(formData.get('id') ?? '').trim()
  const returnTo = safeReturnTo(String(formData.get('returnTo') ?? '/chatbox'))
  if (!id) redirect(returnTo)

  const current = await prisma.chatLog.findUnique({
    where: { id },
  })

  if (!current || current.quality !== 'BAD') {
    revalidatePath('/chatbox')
    redirect(returnTo)
  }

  const updated = await prisma.chatLog.update({
    where: { id },
    data: {
      quality: 'GOOD',
      qualityNotes: appendQualityNote(current.qualityNotes),
      metadata: markImprovedMetadata(current.metadata),
    },
  })

  await writeAuditLog({
    outil: current.source,
    cibleType: 'chat_log',
    cibleId: current.id,
    action: 'chatbox_log_improvement_validated',
    resume: current.userPrompt.slice(0, 180),
    avant: current,
    apres: updated,
  })

  revalidatePath('/chatbox')
  redirect(returnTo)
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

function metadataRecord(value: Prisma.JsonValue | null) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

function metadataString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function chatSupportMeta(value: Prisma.JsonValue | null) {
  const metadata = metadataRecord(value)
  return [
    { label: 'garage', value: metadataString(metadata.garageName) },
    { label: 'garageId', value: metadataString(metadata.garageId) },
    { label: 'userId', value: metadataString(metadata.userId) },
    { label: 'role', value: metadataString(metadata.userRole) },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value))
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
                <time>{formatChatLogDate(log.createdAt)}</time>
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

function appendQualityNote(value: string | null) {
  const note = `Amelioration validee le ${new Date().toISOString()}.`
  return [value, note].filter(Boolean).join('\n')
}

function markImprovedMetadata(value: Prisma.JsonValue | null) {
  const base: Record<string, unknown> = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : { value: value ?? null }
  const existingFlags = base.flags
  const flags = existingFlags && typeof existingFlags === 'object' && !Array.isArray(existingFlags)
    ? existingFlags as Record<string, unknown>
    : {}

  return {
    ...base,
    flags: {
      ...flags,
      improvementValidated: true,
      improvementValidatedAt: new Date().toISOString(),
    },
  } as Prisma.InputJsonValue
}

function safeReturnTo(value: string) {
  return value.startsWith('/chatbox') && !value.startsWith('//') ? value : '/chatbox'
}

function formatJson(value: Prisma.JsonValue) {
  return JSON.stringify(value, null, 2)
}
