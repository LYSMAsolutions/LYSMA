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

    return { data: { logs, sourceCounts, qualityCounts, total }, error: null }
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
          <input name="q" defaultValue={query.q ?? ''} placeholder="chercher question, reponse, email..." />
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
            logs.map((log) => (
              <article key={log.id} className={styles.chatCard}>
                <header className={styles.chatHeader}>
                  <div>
                    <strong>{log.source}</strong>
                    <span>{log.conversationId ?? 'conversation inconnue'}</span>
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

                {(log.qualityNotes || log.metadata) && (
                  <footer className={styles.cardFooter}>
                    {log.qualityNotes && <p>{log.qualityNotes}</p>}
                    {log.metadata && <pre>{formatJson(log.metadata)}</pre>}
                  </footer>
                )}
              </article>
            ))
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
