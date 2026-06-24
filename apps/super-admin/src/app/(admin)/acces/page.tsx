import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { PageHeader, Card, Badge, Table, Thead, Tbody, Th, Td, EmptyRow } from '@/components/ui'

export default async function AccesPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const acces = await prisma.acces.findMany({
    include: { client: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <main>
      <PageHeader
        title="Accès & Clés"
        description={`${acces.length} accès générés`}
      />

      <Card>
        <Table>
          <Thead>
            <tr>
              <Th>Email</Th>
              <Th>Client</Th>
              <Th>Mot de passe temp.</Th>
              <Th>Actif</Th>
              <Th>1ère connexion</Th>
              <Th>Créé</Th>
            </tr>
          </Thead>
          <Tbody>
            {acces.length === 0 ? (
              <EmptyRow colSpan={6} message="Aucun accès généré." />
            ) : (
              acces.map((a) => (
                <tr key={a.id}>
                  <Td>{a.email}</Td>
                  <Td>
                    <a href={`/clients/${a.clientId}`} style={{ color: 'var(--color-blue-electric)' }}>
                      {a.client.nom}
                    </a>
                  </Td>
                  <Td>
                    {a.motDePasseTemp
                      ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{a.motDePasseTemp}</span>
                      : <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
                  </Td>
                  <Td>
                    <Badge variant={a.actif ? 'success' : 'error'}>
                      {a.actif ? 'Actif' : 'Inactif'}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge variant={a.premiereConnexion ? 'success' : 'warning'}>
                      {a.premiereConnexion ? 'Oui' : 'Non'}
                    </Badge>
                  </Td>
                  <Td>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                    </span>
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
