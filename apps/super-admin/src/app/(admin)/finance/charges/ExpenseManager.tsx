'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import styles from '../page.module.css'
import type { ExpenseView } from '@/lib/finance'

const emptyForm = {
  name: '',
  provider: '',
  category: 'LOGICIEL',
  relatedTool: 'GLOBAL',
  amountHT: '0',
  vatAmount: '0',
  amountTTC: '0',
  frequency: 'MENSUEL',
  startDate: new Date().toISOString().slice(0, 10),
  renewalDate: '',
  paymentMethod: '',
  status: 'ACTIF',
  notes: '',
}

type FormState = typeof emptyForm

export function ExpenseManager({ expenses }: { expenses: ExpenseView[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [busy, setBusy] = useState(false)

  const currentLabel = useMemo(() => editingId ? 'Modifier la charge' : 'Ajouter une charge', [editingId])

  function update(name: keyof FormState, value: string) {
    setForm((state) => ({ ...state, [name]: value }))
  }

  function edit(expense: ExpenseView) {
    setEditingId(expense.id)
    setForm({
      name: expense.name,
      provider: expense.provider,
      category: expense.category,
      relatedTool: expense.relatedTool,
      amountHT: String(expense.amountHT),
      vatAmount: String(expense.vatAmount),
      amountTTC: String(expense.amountTTC),
      frequency: expense.frequency,
      startDate: expense.startDate.toISOString().slice(0, 10),
      renewalDate: expense.renewalDate ? expense.renewalDate.toISOString().slice(0, 10) : '',
      paymentMethod: expense.paymentMethod ?? '',
      status: expense.status,
      notes: expense.notes ?? '',
    })
  }

  function reset() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    const url = editingId ? `/api/finance/expenses/${editingId}` : '/api/finance/expenses'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setBusy(false)
    if (!res.ok) {
      alert("Impossible d'enregistrer cette charge.")
      return
    }
    reset()
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cette charge LYSMA ?')) return
    setBusy(true)
    const res = await fetch(`/api/finance/expenses/${id}`, { method: 'DELETE' })
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
            <span className={styles.panelTitle}>// charge_formulaire</span>
            <p>{currentLabel} : hebergement, IA, domaines, logiciels, API, comptabilite.</p>
          </div>
        </div>
        <form className={`${styles.panelBody} ${styles.formGrid}`} onSubmit={submit}>
          <Field label="Nom" value={form.name} onChange={(value) => update('name', value)} />
          <Field label="Fournisseur" value={form.provider} onChange={(value) => update('provider', value)} />
          <Select label="Categorie" value={form.category} onChange={(value) => update('category', value)} options={['HEBERGEMENT', 'DOMAINE', 'IA', 'COMPTABILITE', 'PAIEMENT', 'LOGICIEL', 'API', 'MATERIEL', 'AUTRE']} />
          <Select label="Outil lie" value={form.relatedTool} onChange={(value) => update('relatedTool', value)} options={['GLOBAL', 'LIVO', 'PMA', 'TRANSPORT', 'AUTRE']} />
          <Field label="Montant HT" value={form.amountHT} onChange={(value) => update('amountHT', value)} type="number" />
          <Field label="TVA" value={form.vatAmount} onChange={(value) => update('vatAmount', value)} type="number" />
          <Field label="Montant TTC" value={form.amountTTC} onChange={(value) => update('amountTTC', value)} type="number" />
          <Select label="Frequence" value={form.frequency} onChange={(value) => update('frequency', value)} options={['MENSUEL', 'ANNUEL', 'PONCTUEL']} />
          <Field label="Date de debut" value={form.startDate} onChange={(value) => update('startDate', value)} type="date" />
          <Field label="Renouvellement" value={form.renewalDate} onChange={(value) => update('renewalDate', value)} type="date" />
          <Field label="Moyen paiement" value={form.paymentMethod} onChange={(value) => update('paymentMethod', value)} />
          <Select label="Statut" value={form.status} onChange={(value) => update('status', value)} options={['ACTIF', 'ARRETE', 'A_VERIFIER']} />
          <label className={styles.full}>
            Commentaire
            <textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} />
          </label>
          <div className={`${styles.formActions} ${styles.full}`}>
            {editingId && <button type="button" className={styles.secondaryAction} onClick={reset}>Annuler</button>}
            <button type="submit" className={styles.primaryAction} disabled={busy}>{busy ? 'Enregistrement...' : currentLabel}</button>
          </div>
        </form>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.panelTitle}>// charges_lysma</span>
            <p>{expenses.length} charge{expenses.length > 1 ? 's' : ''} suivie{expenses.length > 1 ? 's' : ''}.</p>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>charge</th>
              <th>categorie</th>
              <th>outil</th>
              <th>HT</th>
              <th>TTC</th>
              <th>frequence</th>
              <th>renouvellement</th>
              <th>statut</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td><span className={styles.mainText}>{expense.name}</span><span className={styles.muted}>{expense.provider}</span></td>
                <td>{expense.category}</td>
                <td><span className={styles.tag}>{expense.relatedTool}</span></td>
                <td>{expense.amountHT.toFixed(2)} EUR</td>
                <td>{expense.amountTTC.toFixed(2)} EUR</td>
                <td>{expense.frequency.toLowerCase()}</td>
                <td>{expense.renewalDate ? expense.renewalDate.toLocaleDateString('fr-FR') : '-'}</td>
                <td>{expense.status.toLowerCase()}</td>
                <td>
                  <div className={styles.heroActions}>
                    <button className={styles.smallButton} type="button" onClick={() => edit(expense)}>Modifier</button>
                    <button className={styles.dangerAction} type="button" onClick={() => remove(expense.id)}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && <tr><td colSpan={9} className={styles.empty}>// aucune charge enregistree</td></tr>}
          </tbody>
        </table>
      </section>
    </>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label>
      {label}
      <input type={type} value={value} step={type === 'number' ? '0.01' : undefined} required={label !== 'Renouvellement' && label !== 'Moyen paiement'} onChange={(event) => onChange(event.target.value)} />
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
