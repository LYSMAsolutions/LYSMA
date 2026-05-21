'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from '@phosphor-icons/react'
import { Button } from '@/components/ui'
import { NouvelleFiche } from './NouvelleFiche'

type Props = {
  garageId: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
}

export function DashboardNewFicheButton({
  garageId,
  variant = 'primary',
  size = 'sm',
  label = 'Nouvelle fiche',
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant={variant} size={size} icon={<Plus />} onClick={() => setOpen(true)}>
        {label}
      </Button>

      {open && (
        <NouvelleFiche
          garageId={garageId}
          onClose={() => setOpen(false)}
          onCreated={() => {
            setOpen(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}
