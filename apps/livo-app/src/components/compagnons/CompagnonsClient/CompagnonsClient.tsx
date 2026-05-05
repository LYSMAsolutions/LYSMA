'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { Plus } from '@phosphor-icons/react'
import { AjouterCompagnon } from '@/components/compagnons/AjouterCompagnon/AjouterCompagnon'

type Props = {
  garageId: string
  children: React.ReactNode
}

export function CompagnonsClient({ garageId, children }: Props) {
  const router = useRouter()
  const [modal, setModal] = useState(false)

  return (
    <>
      {children}
      {modal && (
        <AjouterCompagnon
          garageId={garageId}
          onClose={() => setModal(false)}
          onCreated={() => { setModal(false); router.refresh() }}
        />
      )}
    </>
  )
}

export function CompagnonsActionButton({ garageId }: { garageId: string }) {
  const [modal, setModal] = useState(false)
  const router = useRouter()

  return (
    <>
      <Button variant="primary" size="sm" icon={<Plus />} onClick={() => setModal(true)}>
        Ajouter
      </Button>
      {modal && (
        <AjouterCompagnon
          garageId={garageId}
          onClose={() => setModal(false)}
          onCreated={() => { setModal(false); router.refresh() }}
        />
      )}
    </>
  )
}
