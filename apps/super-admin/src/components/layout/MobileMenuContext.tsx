'use client'

import { createContext, useContext, useState } from 'react'

type MobileMenuCtx = {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const MobileMenuContext = createContext<MobileMenuCtx>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
})

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <MobileMenuContext.Provider
      value={{ isOpen, toggle: () => setIsOpen(v => !v), close: () => setIsOpen(false) }}
    >
      {children}
    </MobileMenuContext.Provider>
  )
}

export function useMobileMenu() {
  return useContext(MobileMenuContext)
}
