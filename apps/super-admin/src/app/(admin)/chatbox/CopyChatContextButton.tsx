'use client'

import { useState } from 'react'
import styles from './page.module.css'

export function CopyChatContextButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button className={styles.copyButton} type="button" onClick={copy}>
      {copied ? 'copie' : 'copier pour Codex'}
    </button>
  )
}
