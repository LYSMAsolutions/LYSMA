import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { fetchPmaAccountRequests, fetchPmaCustomers, getPmaBaseUrl } from '@/lib/pma-api'
import PmaApproveButton from './PmaApproveButton'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function PmaPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const [requestsResult, customersResult] = await Promise.all([
    fetchPmaAccountRequests(),
    fetchPmaCustomers(),
  ])

  const pendingRequests = requestsResult.requests.filter((request) => request.status === 'new')
  const processedRequests = requestsResult.requests.filter((request) => request.status !== 'new')
  const activeCustomers = customersResult.customers.filter((customer) => customer.status === 'active')

  return (
    <main className={styles.page}>
      <div className={styles.termHeader}>
        <span className={styles.termPrompt}>admin@lysma</span>
        <span className={styles.termCmd}> $ pma --requests --customers</span>
      </div>

      <section className={styles.hero}>
        <div>
          <span className={styles.kicker}>portail-pma</span>
          <h1>Centre de controle PMA</h1>
          <p>
            Demandes d'ouverture, clients LYSMA et acces distributeurs. Source : {getPmaBaseUrl()}
          </p>
        </div>
        <a className={styles.openTool} href={getPmaBaseUrl()} target="_blank" rel="noreferrer">
          ouvrir outil
        </a>
      </section>

      <section className={styles.kpis}>
        <div><span>demandes</span><strong>{requestsResult.requests.length}</strong><small>{pendingRequests.length} nouvelles</small></div>
        <div><span>clients pma</span><strong>{customersResult.customers.length}</strong><small>{activeCustomers.length} actifs</small></div>
        <div><span>traitees</span><strong>{processedRequests.length}</strong><small>demandes archivees</small></div>
      </section>

      {requestsResult.error || customersResult.error ? (
        <section className={styles.warning}>
          <strong>PMA indisponible ou incomplet</strong>
          <span>{requestsResult.error || customersResult.error}</span>
        </section>
      ) : null}

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span>// demandes_ouverture</span>
          <span>{pendingRequests.length} en attente</span>
        </div>

        <div className={styles.requestList}>
          {pendingRequests.map((request) => (
            <article key={request.id} className={styles.requestCard}>
              <div className={styles.requestMain}>
                <div>
                  <span className={styles.status}>{request.priority}</span>
                  <h2>{request.company || 'societe inconnue'}</h2>
                  <p>{request.sender || 'contact non renseigne'} - {request.email}</p>
                </div>
                <time>{new Date(request.createdAt).toLocaleDateString('fr-FR')}</time>
              </div>

              <dl className={styles.meta}>
                <div><dt>telephone</dt><dd>{request.phone || '-'}</dd></div>
                <div><dt>source</dt><dd>{request.sourceTool}</dd></div>
                <div><dt>statut</dt><dd>{request.status}</dd></div>
              </dl>

              {request.message ? <p className={styles.message}>{request.message}</p> : null}

              <PmaApproveButton requestId={request.id} email={request.email} company={request.company} />
            </article>
          ))}

          {!pendingRequests.length ? (
            <div className={styles.empty}>// aucune demande d'ouverture en attente</div>
          ) : null}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span>// clients_pma</span>
          <span>{customersResult.customers.length} comptes</span>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>societe</th>
              <th>contact</th>
              <th>email</th>
              <th>statut</th>
              <th>cree</th>
            </tr>
          </thead>
          <tbody>
            {customersResult.customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.company_name}</td>
                <td>{`${customer.contact_first_name || ''} ${customer.contact_last_name || ''}`.trim() || '-'}</td>
                <td>{customer.email}</td>
                <td>{customer.status}</td>
                <td>{new Date(customer.created_at).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
            {!customersResult.customers.length ? (
              <tr><td colSpan={5} className={styles.empty}>// aucun client PMA</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </main>
  )
}
