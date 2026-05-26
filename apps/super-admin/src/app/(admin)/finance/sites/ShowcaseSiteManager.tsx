'use client'

import type { ShowcaseSiteFinanceView } from '@/lib/finance'
import { formatEuro } from '@/lib/finance'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from '../page.module.css'

const emptyForm = {
  siteName: '',
  clientName: '',
  clientCompany: '',
  publicLabel: 'Abonnement LYSMA - maintenance site vitrine',
  creationStandardPriceHT: '349',
  creationSoldHT: '0',
  creationStatus: 'CREATION_OFFERTE',
  maintenanceMonthlyHT: '19',
  maintenanceStatus: 'MAINTENANCE_PAYANTE',
  domainCostHT: '0',
  workspaceCostHT: '0',
  otherMonthlyCostsHT: '0',
  internalNotes: '',
  sageCustomerId: '',
  officialInvoiceNumber: '',
  officialPdfUrl: '',
  electronicInvoiceStatus: 'A_PREPARER',
  platformProvider: '',
  platformInvoiceId: '',
  paymentStatus: 'EN_ATTENTE',
}

type FormState = typeof emptyForm

export function ShowcaseSiteManager({ sites }: { sites: ShowcaseSiteFinanceView[] }) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  function update(name: keyof FormState, value: string) {
    setForm((state) => ({ ...state, [name]: value }))
  }

  function edit(site: ShowcaseSiteFinanceView) {
    setEditingId(site.id)
    setForm({
      siteName: site.siteName,
      clientName: site.clientName,
      clientCompany: site.clientCompany ?? '',
      publicLabel: site.publicLabel,
      creationStandardPriceHT: String(site.creationStandardPriceHT),
      creationSoldHT: String(site.creationSoldHT),
      creationStatus: site.creationStatus,
      maintenanceMonthlyHT: String(site.maintenanceMonthlyHT),
      maintenanceStatus: site.maintenanceStatus,
      domainCostHT: String(site.domainCostHT),
      workspaceCostHT: String(site.workspaceCostHT),
      otherMonthlyCostsHT: String(site.otherMonthlyCostsHT),
      internalNotes: site.internalNotes ?? '',
      sageCustomerId: site.sageCustomerId ?? '',
      officialInvoiceNumber: site.officialInvoiceNumber ?? '',
      officialPdfUrl: site.officialPdfUrl ?? '',
      electronicInvoiceStatus: site.electronicInvoiceStatus as FormState['electronicInvoiceStatus'],
      platformProvider: site.platformProvider ?? '',
      platformInvoiceId: site.platformInvoiceId ?? '',
      paymentStatus: site.paymentStatus as FormState['paymentStatus'],
    })
  }

  function reset() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    const res = await fetch(editingId ? `/api/finance/showcase-sites/${editingId}` : '/api/finance/showcase-sites', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setBusy(false)
    if (!res.ok) {
      alert("Impossible d'enregistrer ce site vitrine.")
      return
    }
    reset()
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer le suivi financier de ce site vitrine ?')) return
    setBusy(true)
    const res = await fetch(`/api/finance/showcase-sites/${id}`, { method: 'DELETE' })
    setBusy(false)
    if (!res.ok) {
      alert('Suppression impossible.')
      return
    }
    router.refresh()
  }

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.panelTitle}>// site_vitrine_formulaire</span>
            <p>Vue client simple, detail interne LYSMA complet.</p>
          </div>
        </div>
        <form className={`${styles.panelBody} ${styles.formGrid}`} onSubmit={submit}>
          <Field label="Site" value={form.siteName} onChange={(value) => update('siteName', value)} />
          <Field label="Client" value={form.clientName} onChange={(value) => update('clientName', value)} />
          <Field label="Societe" value={form.clientCompany} onChange={(value) => update('clientCompany', value)} required={false} />
          <Field label="Ligne client" value={form.publicLabel} onChange={(value) => update('publicLabel', value)} />
          <Field label="Creation standard HT" value={form.creationStandardPriceHT} onChange={(value) => update('creationStandardPriceHT', value)} type="number" />
          <Field label="Creation vendue HT" value={form.creationSoldHT} onChange={(value) => update('creationSoldHT', value)} type="number" />
          <Select label="Statut creation" value={form.creationStatus} onChange={(value) => update('creationStatus', value)} options={['CREATION_FACTUREE', 'CREATION_OFFERTE']} />
          <Field label="Maintenance HT / mois" value={form.maintenanceMonthlyHT} onChange={(value) => update('maintenanceMonthlyHT', value)} type="number" />
          <Select label="Statut maintenance" value={form.maintenanceStatus} onChange={(value) => update('maintenanceStatus', value)} options={['ABONNEMENT_ACTIF', 'MAINTENANCE_OFFERTE', 'MAINTENANCE_PAYANTE']} />
          <Field label="Domaine HT / an" value={form.domainCostHT} onChange={(value) => update('domainCostHT', value)} type="number" />
          <Field label="Workspace HT / mois" value={form.workspaceCostHT} onChange={(value) => update('workspaceCostHT', value)} type="number" />
          <Field label="Autres couts HT / mois" value={form.otherMonthlyCostsHT} onChange={(value) => update('otherMonthlyCostsHT', value)} type="number" />
          <Select label="Facture electronique" value={form.electronicInvoiceStatus} onChange={(value) => update('electronicInvoiceStatus', value)} options={['NON_CONCERNE', 'A_PREPARER', 'EN_ATTENTE', 'TRANSMISE', 'REJETEE', 'ACCEPTEE']} />
          <Select label="Paiement" value={form.paymentStatus} onChange={(value) => update('paymentStatus', value)} options={['EN_ATTENTE', 'PAYE', 'ECHOUE', 'REMBOURSE', 'ANNULE']} />
          <Field label="Numero officiel" value={form.officialInvoiceNumber} onChange={(value) => update('officialInvoiceNumber', value)} required={false} />
          <Field label="PDF officiel" value={form.officialPdfUrl} onChange={(value) => update('officialPdfUrl', value)} required={false} />
          <label className={styles.full}>
            Detail interne
            <textarea value={form.internalNotes} onChange={(event) => update('internalNotes', event.target.value)} />
          </label>
          <div className={`${styles.formActions} ${styles.full}`}>
            {editingId && <button type="button" className={styles.secondaryAction} onClick={reset}>Annuler</button>}
            <button className={styles.primaryAction} disabled={busy}>{busy ? 'Enregistrement...' : editingId ? 'Modifier le site' : 'Ajouter le site'}</button>
          </div>
        </form>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.panelTitle}>// sites_vitrines_finance</span>
            <p>{sites.length > 0 ? `${sites.length} site(s) suivi(s).` : 'Aucun site vitrine enregistre.'}</p>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>site</th>
              <th>vue client</th>
              <th>creation</th>
              <th>maintenance</th>
              <th>couts internes</th>
              <th>marge mensuelle</th>
              <th>conformite</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => {
              const costs = site.domainCostHT / 12 + site.workspaceCostHT + site.otherMonthlyCostsHT
              const revenue = site.maintenanceStatus === 'MAINTENANCE_PAYANTE' || site.maintenanceStatus === 'ABONNEMENT_ACTIF' ? site.maintenanceMonthlyHT : 0
              return (
                <tr key={site.id}>
                  <td><span className={styles.mainText}>{site.siteName}</span><span className={styles.muted}>{site.clientCompany ?? site.clientName}</span></td>
                  <td><span className={styles.mainText}>{site.publicLabel}</span><span className={styles.muted}>Facture client simple</span></td>
                  <td>{site.creationStatus === 'CREATION_OFFERTE' ? 'Offerte' : formatEuro(site.creationSoldHT)}<span className={styles.muted}>Standard : {formatEuro(site.creationStandardPriceHT)}</span></td>
                  <td>{site.maintenanceStatus === 'MAINTENANCE_OFFERTE' ? 'Offerte' : `${formatEuro(site.maintenanceMonthlyHT)} / mois`}</td>
                  <td>{formatEuro(costs)} / mois</td>
                  <td className={revenue - costs >= 0 ? styles.green : styles.red}>{formatEuro(revenue - costs)} / mois</td>
                  <td><span className={styles.tag}>{site.electronicInvoiceStatus}</span><span className={styles.muted}>{site.paymentStatus}</span></td>
                  <td>
                    <div className={styles.heroActions}>
                      <button className={styles.smallButton} type="button" onClick={() => edit(site)}>Modifier</button>
                      <button className={styles.dangerAction} type="button" onClick={() => remove(site.id)}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {sites.length === 0 && <tr><td colSpan={8} className={styles.empty}>Aucun site vitrine enregistre</td></tr>}
          </tbody>
        </table>
      </section>
    </>
  )
}

function Field({ label, value, onChange, type = 'text', required = true }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label>
      {label}
      <input type={type} value={value} step={type === 'number' ? '0.01' : undefined} required={required} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

