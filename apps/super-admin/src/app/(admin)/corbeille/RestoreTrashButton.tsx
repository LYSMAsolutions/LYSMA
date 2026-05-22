'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './page.module.css'

type Props = {
  outil: string
  type: string
  id: string
}

export function RestoreTrashButton({ outil, type, id }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function restore() {
    setLoading(true)
    try {
      const apiRoot = outil === 'portail-pma' ? 'pma' : 'livo'
      const res = await fetch(`/api/${apiRoot}/trash/${type}/${id}/restore`, {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        alert(data?.error ?? 'Restauration impossible')
        return
      }

      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button className={styles.restoreBtn} type="button" onClick={restore} disabled={loading}>
      {loading ? 'restauration...' : 'restaurer'}
    </button>
  )
}
