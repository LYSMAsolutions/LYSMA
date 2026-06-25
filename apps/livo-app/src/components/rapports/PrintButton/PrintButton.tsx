'use client'

import { Button } from '@/components/ui'
import { Printer } from '@phosphor-icons/react'

export function PrintButton() {
  return (
    <Button
      variant="secondary"
      size="sm"
      icon={<Printer />}
      onClick={() => window.print()}
    >
      Imprimer
    </Button>
  )
}
