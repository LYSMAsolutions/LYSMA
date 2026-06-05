'use client'

import { useState } from 'react'
import { Check, Copy } from '@phosphor-icons/react'
import styles from './page.module.css'

type SupportDataCopyButtonProps = {
  payload: string
}

export function SupportDataCopyButton({ payload }: SupportDataCopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copyPayload() {
    await navigator.clipboard.writeText(payload)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button type="button" className={styles.copyButton} onClick={copyPayload}>
      {copied ? <Check size={16} weight="bold" aria-hidden /> : <Copy size={16} weight="bold" aria-hidden />}
      <span>{copied ? 'Copié' : 'Copier le registre JSON'}</span>
    </button>
  )
}
