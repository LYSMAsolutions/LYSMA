'use client'

import { useState } from 'react'
import styles from './page.module.css'

export function SiteDeployButton({ siteId }: { siteId: string }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function deploy() {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/sites/${siteId}/deploy`, { method: 'POST' })
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setMessage(data?.error ?? 'deploiement impossible')
        return
      }

      setMessage('deploiement lance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.deployWrap}>
      <button className={styles.deployBtn} type="button" onClick={deploy} disabled={loading}>
        {loading ? 'deploiement...' : 'deployer_vercel'}
      </button>
      {message ? <span>{message}</span> : null}
    </div>
  )
}
