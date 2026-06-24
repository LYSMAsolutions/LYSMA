import { prisma } from '@/lib/prisma'
import { PageHeader, Card, Badge, Table, Thead, Tbody, Th, Td, EmptyRow } from '@/components/ui'

export const dynamic = 'force-dynamic'

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ outil?: string; action?: string; statut?: string }>
}) {
  const params = await searchParams
  const logs = await prisma.auditLog.findMany({
    where: {
      outil: params.outil || undefined,
      action: params.action || undefined,
      statut: params.statut || undefined,
    },
    orderBy: { createdAt: 'desc' },
    take: 120,
  })

  return (
    <main>
      <PageHeader
        title="Journal d'activité"
        description="Historique des actions sensibles : publication, restauration, accès, messages, erreurs et modifications."
      />

      <Card>
        <Table>
          <Thead>
            <tr>
              <Th>Date</Th>
              <Th>Outil</Th>
              <Th>Action</Th>
              <Th>Cible</Th>
              <Th>Acteur</Th>
              <Th>Résumé</Th>
            </tr>
          </Thead>
          <Tbody>
            {logs.length === 0 ? (
              <EmptyRow colSpan={6} message="Aucune action auditée." />
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <Td>{formatDate(log.createdAt)}</Td>
                  <Td>
                    <Badge>{log.outil}</Badge>
                  </Td>
                  <Td>
                    <Badge variant={log.statut === 'ERROR' ? 'error' : 'success'}>
                      {log.action}
                    </Badge>
                  </Td>
                  <Td>
                    <div>{log.cibleType}</div>
                    {log.cibleId && <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>{log.cibleId}</div>}
                  </Td>
                  <Td>{log.acteurEmail ?? log.acteurId ?? 'système'}</Td>
                  <Td>
                    <div>{log.resume ?? '—'}</div>
                    {log.erreur && <div style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>{log.erreur}</div>}
                  </Td>
                </tr>
              ))
            )}
          </Tbody>
        </Table>
      </Card>
    </main>
  )
}
