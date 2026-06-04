import { getProtectedDashboardData } from "../../../lib/protected-dashboard";

const subscriptionStatusLabel = {
  active: "Actif",
  trialing: "Essai",
  past_due: "Paiement en retard",
  canceled: "Annulé",
  none: "Non configuré",
};

export default async function DashboardSubscriptionPage() {
  const data = await getProtectedDashboardData();

  return (
    <section className="dashboard-grid">
      <article className="dashboard-card">
        <span>Abonnement</span>
        <h2>{data.site.plan}</h2>
        <p>Statut : {subscriptionStatusLabel[data.subscription.status]}</p>
        <p className="dashboard-muted">
          La facturation Stripe n’est pas branchée en V1.1.
        </p>
      </article>
      <article className="dashboard-card">
        <span>Stripe futur</span>
        <h2>Paiement et factures</h2>
        <p>
          Cette page préparera le paiement carte, l’abonnement mensuel, le portail client et les
          webhooks vérifiés.
        </p>
      </article>
      <article className="dashboard-card dashboard-card-wide">
        <span>Données techniques préparées</span>
        <ul className="dashboard-list">
          <li>
            <strong>Stripe customer</strong>
            <p>{data.subscription.stripeCustomerId ?? "En attente de branchement"}</p>
          </li>
          <li>
            <strong>Stripe subscription</strong>
            <p>{data.subscription.stripeSubscriptionId ?? "En attente de branchement"}</p>
          </li>
          <li>
            <strong>Prochaine facturation</strong>
            <p>{data.subscription.nextBillingDate ?? "Non configurée"}</p>
          </li>
        </ul>
      </article>
    </section>
  );
}
