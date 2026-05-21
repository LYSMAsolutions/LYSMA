'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PencilSimple, X } from '@phosphor-icons/react'
import { Button, Input } from '@/components/ui'
import { formatImmat, formatNom, formatPrenom } from '@/lib/formatters'
import styles from './VehicleEditForm.module.css'

type Props = {
  vehiculeId: string
  immatriculation: string | null
  clientNom: string
  clientPrenom: string | null
}

export function VehicleEditForm({
  vehiculeId,
  immatriculation,
  clientNom,
  clientPrenom,
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [immat, setImmat] = useState(immatriculation ?? '')
  const [nom, setNom] = useState(clientNom)
  const [prenom, setPrenom] = useState(clientPrenom ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!nom.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/vehicules/${vehiculeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          immatriculation: immat,
          clientNom: nom,
          clientPrenom: prenom,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Mise a jour impossible')
        return
      }

      setOpen(false)
      router.refresh()
    } catch {
      setError('Mise a jour impossible')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="secondary" size="sm" icon={<PencilSimple />} onClick={() => setOpen(true)}>
        Modifier
      </Button>

      {open && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <h2 className={styles.title}>Modifier le vehicule</h2>
              <button className={styles.close} onClick={() => setOpen(false)} aria-label="Fermer">
                <X size={18} />
              </button>
            </div>

            <div className={styles.body}>
              <div className={styles.fields}>
                <Input
                  label="Immatriculation"
                  value={immat}
                  onChange={(e) => setImmat(formatImmat(e.target.value))}
                />
                <Input
                  label="Nom du client"
                  value={nom}
                  onChange={(e) => setNom(formatNom(e.target.value))}
                  required
                />
                <Input
                  label="Prenom du client"
                  value={prenom}
                  onChange={(e) => setPrenom(formatPrenom(e.target.value))}
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
            </div>

            <div className={styles.footer}>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button size="sm" loading={loading} onClick={submit}>
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
