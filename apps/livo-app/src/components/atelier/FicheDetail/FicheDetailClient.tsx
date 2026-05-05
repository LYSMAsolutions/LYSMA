'use client'

import { useState } from 'react'
import { FilePdf } from '@phosphor-icons/react'
import { Button } from '@/components/ui'

type Props = {
  ficheId: string
  numero: string
}

export function FicheDetailClient({ ficheId, numero }: Props) {
  const [loading, setLoading] = useState(false)

  async function downloadPDF() {
    setLoading(true)
    try {
      const res = await fetch(`/api/pdf/fiche/${ficheId}`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${numero}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      console.error('Erreur PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      icon={<FilePdf weight="fill" />}
      loading={loading}
      onClick={downloadPDF}
    >
      Imprimer la fiche
    </Button>
  )
}
