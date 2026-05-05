'use client'

import { useState } from 'react'
import { FilePdf } from '@phosphor-icons/react'
import { Button } from '@/components/ui'

type Props = {
  url: string
  filename?: string
  label?: string
  size?: 'sm' | 'md'
}

export function PDFDownloadButton({ url, filename, label = 'Télécharger PDF', size = 'sm' }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Erreur génération PDF')
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename ?? 'document.pdf'
      a.click()
      URL.revokeObjectURL(blobUrl)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="secondary"
      size={size}
      icon={<FilePdf weight="fill" />}
      loading={loading}
      onClick={handleDownload}
    >
      {label}
    </Button>
  )
}
