import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import {
  Car,
  ClipboardText,
  Database,
  IdentificationBadge,
  ShieldCheck,
  Timer,
  Users,
} from '@phosphor-icons/react/dist/ssr'
import { Header } from '@/components/layout/Header'
import { auth } from '@/lib/auth'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { prisma } from '@/lib/prisma'
import { SupportDataCopyButton } from './SupportDataCopyButton'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Données support - LIVO',
}

type SupportRow = {
  id: string
  primary: string
  secondary?: string
  meta?: string
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const shortDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

function iso(value?: Date | null) {
  return value ? value.toISOString() : null
}

function dateText(value?: Date | null) {
  return value ? dateFormatter.format(value) : 'Non renseigné'
}

function shortDateText(value?: Date | null) {
  return value ? shortDateFormatter.format(value) : 'Non renseigné'
}

function moneyOrHours(value: unknown) {
  return value === null || value === undefined ? null : Number(value)
}

function fullName(input: { prenom?: string | null; nom?: string | null }) {
  return [input.prenom, input.nom].filter(Boolean).join(' ').trim() || 'Sans nom'
}

function compact(values: Array<string | null | undefined | false>) {
  return values.filter(Boolean).join(' - ')
}

export default async function DonneesSupportPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/connexion')

  const garage = await getPrimaryGarageForUser(session.user.id)
  if (!garage) redirect('/dashboard')

  const [
    user,
    garageDetails,
    compagnons,
    vehicules,
    fiches,
    externalWorkOrders,
    pointagesFiche,
    externalPointages,
    pointagesJour,
    pointagesFicheTotal,
    externalPointagesTotal,
    pointagesJourTotal,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        actif: true,
        emailVerified: true,
        emailVerifiedAt: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.garage.findUnique({
      where: { id: garage.id },
      select: {
        id: true,
        nom: true,
        adresse: true,
        ville: true,
        codePostal: true,
        telephone: true,
        email: true,
        siret: true,
        statutJour: true,
        actif: true,
        abonnementActif: true,
        trialEndsAt: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.compagnon.findMany({
      where: { garageId: garage.id },
      select: {
        id: true,
        nom: true,
        prenom: true,
        matricule: true,
        poste: true,
        heuresContrat: true,
        dateEntree: true,
        dateSortie: true,
        actif: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { nom: true, prenom: true, email: true } },
      },
      orderBy: [{ actif: 'desc' }, { nom: 'asc' }, { prenom: 'asc' }],
    }),
    prisma.vehicule.findMany({
      where: { garageId: garage.id },
      select: {
        id: true,
        immatriculation: true,
        marque: true,
        modele: true,
        vin: true,
        annee: true,
        clientNom: true,
        clientPrenom: true,
        clientTel: true,
        clientEmail: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.ficheTravaux.findMany({
      where: { garageId: garage.id },
      select: {
        id: true,
        numero: true,
        statut: true,
        travaux: true,
        tempsFacture: true,
        tempsReel: true,
        tauxApplique: true,
        montantHT: true,
        dateOuverture: true,
        dateFermeture: true,
        vehiculeId: true,
        vehicule: {
          select: {
            immatriculation: true,
            marque: true,
            modele: true,
            clientNom: true,
            clientPrenom: true,
          },
        },
        _count: { select: { pointagesFiche: true } },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.externalWorkOrder.findMany({
      where: { garageId: garage.id },
      select: {
        id: true,
        source: true,
        externalNumber: true,
        sourceSoftware: true,
        clientName: true,
        vehicleLabel: true,
        immatriculation: true,
        vin: true,
        operation: true,
        soldHours: true,
        soldAmountHT: true,
        tauxApplique: true,
        tauxLibelle: true,
        tauxHoraire: true,
        status: true,
        openedAt: true,
        closedAt: true,
        assignedCompagnonId: true,
        _count: { select: { pointages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.pointageFiche.findMany({
      where: { fiche: { garageId: garage.id } },
      select: {
        id: true,
        ficheId: true,
        compagnonId: true,
        statut: true,
        debutAt: true,
        finAt: true,
        dureeMinutes: true,
        fiche: { select: { numero: true } },
        compagnon: {
          select: {
            nom: true,
            prenom: true,
            user: { select: { nom: true, prenom: true } },
          },
        },
      },
      orderBy: { debutAt: 'desc' },
      take: 300,
    }),
    prisma.externalWorkOrderPointage.findMany({
      where: { externalWorkOrder: { garageId: garage.id } },
      select: {
        id: true,
        externalWorkOrderId: true,
        compagnonId: true,
        statut: true,
        debutAt: true,
        finAt: true,
        dureeMinutes: true,
        externalWorkOrder: { select: { externalNumber: true } },
        compagnon: {
          select: {
            nom: true,
            prenom: true,
            user: { select: { nom: true, prenom: true } },
          },
        },
      },
      orderBy: { debutAt: 'desc' },
      take: 300,
    }),
    prisma.pointageJour.findMany({
      where: { compagnon: { garageId: garage.id } },
      select: {
        id: true,
        compagnonId: true,
        date: true,
        statutActuel: true,
        heureArrivee: true,
        heureDepart: true,
        dureeMinutes: true,
        compagnon: {
          select: {
            nom: true,
            prenom: true,
            user: { select: { nom: true, prenom: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
      take: 300,
    }),
    prisma.pointageFiche.count({ where: { fiche: { garageId: garage.id } } }),
    prisma.externalWorkOrderPointage.count({ where: { externalWorkOrder: { garageId: garage.id } } }),
    prisma.pointageJour.count({ where: { compagnon: { garageId: garage.id } } }),
  ])

  if (!user || !garageDetails) redirect('/dashboard')

  const supportData = {
    generatedAt: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      actif: user.actif,
      emailVerifiedAt: iso(user.emailVerifiedAt ?? user.emailVerified),
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: iso(user.createdAt),
      updatedAt: iso(user.updatedAt),
    },
    garage: {
      ...garageDetails,
      trialEndsAt: iso(garageDetails.trialEndsAt),
      createdAt: iso(garageDetails.createdAt),
      updatedAt: iso(garageDetails.updatedAt),
    },
    counts: {
      compagnons: compagnons.length,
      vehicules: vehicules.length,
      fiches: fiches.length,
      externalWorkOrders: externalWorkOrders.length,
      pointagesFiche: pointagesFicheTotal,
      externalPointages: externalPointagesTotal,
      pointagesJour: pointagesJourTotal,
    },
    limits: {
      pointagesFicheDisplayed: pointagesFiche.length,
      externalPointagesDisplayed: externalPointages.length,
      pointagesJourDisplayed: pointagesJour.length,
    },
    compagnons: compagnons.map((compagnon) => ({
      id: compagnon.id,
      nom: compagnon.user?.nom ?? compagnon.nom,
      prenom: compagnon.user?.prenom ?? compagnon.prenom,
      email: compagnon.user?.email ?? null,
      matricule: compagnon.matricule,
      poste: compagnon.poste,
      heuresContrat: Number(compagnon.heuresContrat),
      dateEntree: iso(compagnon.dateEntree),
      dateSortie: iso(compagnon.dateSortie),
      actif: compagnon.actif,
      userId: compagnon.userId,
      createdAt: iso(compagnon.createdAt),
      updatedAt: iso(compagnon.updatedAt),
    })),
    vehicules: vehicules.map((vehicule) => ({
      ...vehicule,
      createdAt: iso(vehicule.createdAt),
      updatedAt: iso(vehicule.updatedAt),
    })),
    fiches: fiches.map((fiche) => ({
      id: fiche.id,
      numero: fiche.numero,
      statut: fiche.statut,
      travaux: fiche.travaux,
      tempsFacture: moneyOrHours(fiche.tempsFacture),
      tempsReel: moneyOrHours(fiche.tempsReel),
      tauxApplique: fiche.tauxApplique,
      montantHT: moneyOrHours(fiche.montantHT),
      dateOuverture: iso(fiche.dateOuverture),
      dateFermeture: iso(fiche.dateFermeture),
      vehiculeId: fiche.vehiculeId,
      vehicule: fiche.vehicule,
      pointagesCount: fiche._count.pointagesFiche,
    })),
    externalWorkOrders: externalWorkOrders.map((order) => ({
      id: order.id,
      source: order.source,
      externalNumber: order.externalNumber,
      sourceSoftware: order.sourceSoftware,
      clientName: order.clientName,
      vehicleLabel: order.vehicleLabel,
      immatriculation: order.immatriculation,
      vin: order.vin,
      operation: order.operation,
      soldHours: moneyOrHours(order.soldHours),
      soldAmountHT: moneyOrHours(order.soldAmountHT),
      tauxApplique: order.tauxApplique,
      tauxLibelle: order.tauxLibelle,
      tauxHoraire: moneyOrHours(order.tauxHoraire),
      status: order.status,
      openedAt: iso(order.openedAt),
      closedAt: iso(order.closedAt),
      assignedCompagnonId: order.assignedCompagnonId,
      pointagesCount: order._count.pointages,
    })),
    recentPointages: {
      fiches: pointagesFiche.map((pointage) => ({
        id: pointage.id,
        ficheId: pointage.ficheId,
        ficheNumero: pointage.fiche.numero,
        compagnonId: pointage.compagnonId,
        compagnonNom: fullName(pointage.compagnon.user ?? pointage.compagnon),
        statut: pointage.statut,
        debutAt: iso(pointage.debutAt),
        finAt: iso(pointage.finAt),
        dureeMinutes: pointage.dureeMinutes,
      })),
      externalWorkOrders: externalPointages.map((pointage) => ({
        id: pointage.id,
        externalWorkOrderId: pointage.externalWorkOrderId,
        externalNumber: pointage.externalWorkOrder.externalNumber,
        compagnonId: pointage.compagnonId,
        compagnonNom: fullName(pointage.compagnon.user ?? pointage.compagnon),
        statut: pointage.statut,
        debutAt: iso(pointage.debutAt),
        finAt: iso(pointage.finAt),
        dureeMinutes: pointage.dureeMinutes,
      })),
      jours: pointagesJour.map((pointage) => ({
        id: pointage.id,
        compagnonId: pointage.compagnonId,
        compagnonNom: fullName(pointage.compagnon.user ?? pointage.compagnon),
        date: iso(pointage.date),
        statutActuel: pointage.statutActuel,
        heureArrivee: iso(pointage.heureArrivee),
        heureDepart: iso(pointage.heureDepart),
        dureeMinutes: pointage.dureeMinutes,
      })),
    },
  }

  const identityRows: SupportRow[] = [
    {
      id: user.id,
      primary: 'Utilisateur connecté',
      secondary: `${fullName(user)} - ${user.email}`,
      meta: compact([user.role, user.twoFactorEnabled && 'double authentification active']),
    },
    {
      id: garageDetails.id,
      primary: garageDetails.nom,
      secondary: compact([garageDetails.email, garageDetails.telephone, garageDetails.siret && `SIRET ${garageDetails.siret}`]),
      meta: `ownerId: ${garageDetails.ownerId}`,
    },
  ]

  const compagnonRows: SupportRow[] = compagnons.map((compagnon) => ({
    id: compagnon.id,
    primary: fullName(compagnon.user ?? compagnon),
    secondary: compact([compagnon.poste, compagnon.matricule && `matricule ${compagnon.matricule}`, compagnon.actif ? 'actif' : 'inactif']),
    meta: compact([compagnon.userId && `userId: ${compagnon.userId}`, `entrée: ${shortDateText(compagnon.dateEntree)}`]),
  }))

  const vehiculeRows: SupportRow[] = vehicules.map((vehicule) => ({
    id: vehicule.id,
    primary: compact([vehicule.marque, vehicule.modele, vehicule.immatriculation]),
    secondary: compact([fullName({ prenom: vehicule.clientPrenom, nom: vehicule.clientNom }), vehicule.clientTel, vehicule.clientEmail]),
    meta: compact([vehicule.vin && `VIN ${vehicule.vin}`, `maj: ${dateText(vehicule.updatedAt)}`]),
  }))

  const ficheRows: SupportRow[] = fiches.map((fiche) => ({
    id: fiche.id,
    primary: fiche.numero,
    secondary: compact([
      fiche.statut,
      compact([fiche.vehicule.marque, fiche.vehicule.modele, fiche.vehicule.immatriculation]),
      fullName({ prenom: fiche.vehicule.clientPrenom, nom: fiche.vehicule.clientNom }),
    ]),
    meta: compact([
      `vehiculeId: ${fiche.vehiculeId}`,
      `${fiche._count.pointagesFiche} pointage(s)`,
      `ouverture: ${dateText(fiche.dateOuverture)}`,
    ]),
  }))

  const externalRows: SupportRow[] = externalWorkOrders.map((order) => ({
    id: order.id,
    primary: order.externalNumber,
    secondary: compact([order.status, order.clientName, order.vehicleLabel, order.immatriculation]),
    meta: compact([
      `source: ${order.source}`,
      order.sourceSoftware,
      order.assignedCompagnonId && `compagnon affecté: ${order.assignedCompagnonId}`,
      `${order._count.pointages} pointage(s)`,
    ]),
  }))

  const recentPointageRows: SupportRow[] = [
    ...pointagesFiche.map((pointage) => ({
      id: pointage.id,
      primary: `Fiche ${pointage.fiche.numero}`,
      secondary: compact([pointage.statut, fullName(pointage.compagnon.user ?? pointage.compagnon), dateText(pointage.debutAt)]),
      meta: compact([`ficheId: ${pointage.ficheId}`, `compagnonId: ${pointage.compagnonId}`, pointage.dureeMinutes != null && `${pointage.dureeMinutes} min`]),
    })),
    ...externalPointages.map((pointage) => ({
      id: pointage.id,
      primary: `OR ${pointage.externalWorkOrder.externalNumber}`,
      secondary: compact([pointage.statut, fullName(pointage.compagnon.user ?? pointage.compagnon), dateText(pointage.debutAt)]),
      meta: compact([`externalWorkOrderId: ${pointage.externalWorkOrderId}`, `compagnonId: ${pointage.compagnonId}`, pointage.dureeMinutes != null && `${pointage.dureeMinutes} min`]),
    })),
    ...pointagesJour.map((pointage) => ({
      id: pointage.id,
      primary: `Journée ${shortDateText(pointage.date)}`,
      secondary: compact([pointage.statutActuel, fullName(pointage.compagnon.user ?? pointage.compagnon)]),
      meta: compact([`compagnonId: ${pointage.compagnonId}`, pointage.dureeMinutes != null && `${pointage.dureeMinutes} min`]),
    })),
  ].slice(0, 300)

  return (
    <>
      <Header title="Données support" description="Identifiants internes visibles uniquement dans votre espace connecté." />
      <main className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.heroIcon}>
            <ShieldCheck weight="duotone" />
          </div>
          <div>
            <span className={styles.eyebrow}>registre privé</span>
            <h2>Support, Supabase et intégrations futures</h2>
            <p>
              Cette page rassemble les identifiants utiles pour retrouver une donnée, traiter une demande de support
              ou préparer une connexion avec un autre outil. Aucun mot de passe, PIN, secret API ou token n'est affiché.
            </p>
          </div>
          <SupportDataCopyButton payload={JSON.stringify(supportData, null, 2)} />
        </section>

        <section className={styles.stats}>
          <StatCard icon={<IdentificationBadge weight="duotone" />} label="Utilisateur" value={user.id} />
          <StatCard icon={<Database weight="duotone" />} label="Garage" value={garageDetails.id} />
          <StatCard icon={<Users weight="duotone" />} label="Compagnons" value={String(compagnons.length)} />
          <StatCard icon={<ClipboardText weight="duotone" />} label="Fiches" value={String(fiches.length)} />
          <StatCard icon={<Car weight="duotone" />} label="OR externes" value={String(externalWorkOrders.length)} />
          <StatCard icon={<Timer weight="duotone" />} label="Pointages" value={String(pointagesFicheTotal + externalPointagesTotal + pointagesJourTotal)} />
        </section>

        <IdSection
          title="Identité"
          description="Utilisateur connecté et garage rattaché à la session."
          rows={identityRows}
          empty="Aucune identité disponible."
        />

        <IdSection
          title="Compagnons"
          description="IDs compagnons et, quand ils existent, IDs des comptes utilisateur liés."
          rows={compagnonRows}
          empty="Aucun compagnon enregistré."
        />

        <IdSection
          title="Véhicules"
          description="IDs véhicules et informations client utiles pour retrouver un dossier."
          rows={vehiculeRows}
          empty="Aucun véhicule enregistré."
        />

        <IdSection
          title="Fiches de travail"
          description="Toutes les fiches internes du garage, avec leur véhicule et leur statut."
          rows={ficheRows}
          empty="Aucune fiche de travail enregistrée."
        />

        <IdSection
          title="OR externes"
          description="Ordres de réparation importés par API/QR ou saisis manuellement en secours."
          rows={externalRows}
          empty="Aucun OR externe enregistré."
        />

        <IdSection
          title="Pointages récents"
          description="Derniers pointages affichés pour garder la page lisible. Le registre JSON précise les totaux complets."
          rows={recentPointageRows}
          empty="Aucun pointage enregistré."
        />
      </main>
    </>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <article className={styles.statCard}>
      <span className={styles.statIcon}>{icon}</span>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function IdSection({
  title,
  description,
  rows,
  empty,
}: {
  title: string
  description: string
  rows: SupportRow[]
  empty: string
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span>{rows.length}</span>
      </div>

      {rows.length === 0 ? (
        <p className={styles.empty}>{empty}</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Identifiant</th>
                <th>Libellé</th>
                <th>Contexte</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${title}-${row.id}`}>
                  <td><code>{row.id}</code></td>
                  <td>
                    <strong>{row.primary}</strong>
                    {row.secondary && <span>{row.secondary}</span>}
                  </td>
                  <td>{row.meta || 'Non renseigné'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
