'use client'

import { signOut } from 'next-auth/react'
import { SignOut } from '@phosphor-icons/react'
import styles from './SignOutButton.module.css'

export function SignOutButton() {
  return (
    <button
      className={styles.signOut}
      onClick={() => signOut({ callbackUrl: '/connexion' })}
      aria-label="Se déconnecter"
    >
      <SignOut />
    </button>
  )
}