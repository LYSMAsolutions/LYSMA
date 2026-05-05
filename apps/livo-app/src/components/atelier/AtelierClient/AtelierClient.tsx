'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { Plus } from '@phosphor-icons/react'
import { NouvelleFiche } from '@/components/atelier/NouvelleFiche/NouvelleFiche'

type Props = {
  garageId: string
  children: React.ReactNode
}

export function AtelierClient({ garageId, children }: Props) {
  const [modal, setModal] = useState(false)
  const router = useRouter()

  function handleCreated() {
    setModal(false)
    router.refresh()
  }

  return (
    <>
      {children}

      {modal && (
        <NouvelleFiche
          garageId={garageId}
          onClose={() => setModal(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  )
}

export function AtelierActionButton({ garageId }: { garageId: string }) {
  const [modal, setModal] = useState(false)
  const router = useRouter()

  return (
    <>
      <Button variant="primary" size="sm" icon={<Plus />} onClick={() => setModal(true)}>
        Nouvelle fiche
      </Button>
      {modal && (
        <NouvelleFiche
          garageId={garageId}
          onClose={() => setModal(false)}
          onCreated={() => { setModal(false); router.refresh() }}
        />
      )}
    </>
  )
}