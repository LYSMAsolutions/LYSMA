import { Button, Badge, Card, CardHeader, CardBody, Input, Skeleton, SkeletonCard, SkeletonMetric } from '@/components/ui'
import { MagnifyingGlass, Plus, ArrowRight, Wrench, Warning, Check } from '@phosphor-icons/react/dist/ssr'
import styles from './page.module.css'

export default function DesignSystemPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>

        <header className={styles.header}>
          <h1 className={styles.title}>Livo-app — Design System</h1>
          <p className={styles.subtitle}>Composants UI · Phase 2</p>
        </header>

        {/* Buttons */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Buttons</h2>

          <div className={styles.row}>
            <Button variant="primary">Ouvrir l'atelier</Button>
            <Button variant="secondary">Annuler</Button>
            <Button variant="ghost">Voir plus</Button>
            <Button variant="danger">Supprimer</Button>
          </div>

          <div className={styles.row}>
            <Button size="sm" variant="primary">Small</Button>
            <Button size="md" variant="primary">Medium</Button>
            <Button size="lg" variant="primary">Large</Button>
            <Button size="xl" variant="primary">XL — Atelier</Button>
          </div>

          <div className={styles.row}>
            <Button variant="primary" icon={<Plus />}>Nouveau compagnon</Button>
            <Button variant="secondary" icon={<ArrowRight />} iconPosition="right">Continuer</Button>
            <Button variant="primary" loading>Chargement...</Button>
            <Button variant="secondary" disabled>Désactivé</Button>
          </div>
        </section>

        {/* Badges */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Badges</h2>
          <div className={styles.row}>
            <Badge variant="blue" dot>En cours</Badge>
            <Badge variant="success" dot>Terminé</Badge>
            <Badge variant="warning" dot>En attente</Badge>
            <Badge variant="error" dot>Annulé</Badge>
            <Badge variant="gold">Facturé</Badge>
            <Badge variant="cyan">Nouveau</Badge>
            <Badge variant="muted">Brouillon</Badge>
          </div>
        </section>

        {/* Inputs */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Inputs</h2>
          <div className={styles.grid2}>
            <Input label="Immatriculation" placeholder="AB-123-CD" />
            <Input label="Client" placeholder="Nom du client" />
            <Input
              label="Recherche"
              placeholder="Marque, modèle, immat..."
              iconLeft={<MagnifyingGlass />}
            />
            <Input
              label="Email"
              placeholder="contact@garage.fr"
              hint="Utilisé pour les notifications"
            />
            <Input
              label="Taux horaire"
              placeholder="0.00"
              error="Valeur requise"
            />
            <Input
              label="VIN"
              placeholder="VF1XXXXXXXXXXXXXX"
              inputSize="lg"
            />
          </div>
        </section>

        {/* Cards */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cards</h2>
          <div className={styles.grid3}>
            <Card>
              <CardHeader
                icon={<Wrench />}
                title="OR-2024-042"
                description="Peugeot 308 · AB-123-CD"
                action={<Badge variant="blue" dot>En cours</Badge>}
              />
              <CardBody>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Vidange + filtres + freins arrière
                </p>
              </CardBody>
            </Card>

            <Card variant="elevated" hoverable>
              <CardHeader
                icon={<Check />}
                title="OR-2024-041"
                description="Renault Clio · CD-456-EF"
                action={<Badge variant="success" dot>Terminé</Badge>}
              />
              <CardBody>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Révision complète 60 000 km
                </p>
              </CardBody>
            </Card>

            <Card variant="outlined">
              <CardHeader
                icon={<Warning />}
                title="OR-2024-040"
                description="BMW 320d · GH-789-IJ"
                action={<Badge variant="warning" dot>En attente</Badge>}
              />
              <CardBody>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  En attente pièces
                </p>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Skeletons */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Skeletons</h2>
          <div className={styles.grid3}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonMetric />
          </div>
        </section>

      </div>
    </main>
  )
}
