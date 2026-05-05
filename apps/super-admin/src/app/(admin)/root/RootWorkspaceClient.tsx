'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './page.module.css'

type Entry = {
  name: string
  path: string
  type: 'file' | 'dir'
  size: number
  updatedAt: string
}

type FileState = {
  path: string
  size: number
  updatedAt: string
  content: string
}

const START_PATH = ''

export function RootWorkspaceClient() {
  const [currentPath, setCurrentPath] = useState(START_PATH)
  const [entries, setEntries] = useState<Entry[]>([])
  const [file, setFile] = useState<FileState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const crumbs = useMemo(() => {
    if (!currentPath) return []
    const parts = currentPath.split('/').filter(Boolean)
    return parts.map((part, index) => ({
      label: part,
      path: parts.slice(0, index + 1).join('/'),
    }))
  }, [currentPath])

  useEffect(() => {
    loadDirectory(currentPath)
  }, [currentPath])

  async function loadDirectory(path: string) {
    setLoading(true)
    setError(null)
    setFile(null)

    const res = await fetch(`/api/root/tree?path=${encodeURIComponent(path)}`)
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Lecture impossible')
      setEntries([])
    } else {
      setEntries(data.entries)
    }

    setLoading(false)
  }

  async function openFile(path: string) {
    setLoading(true)
    setError(null)

    const res = await fetch(`/api/root/file?path=${encodeURIComponent(path)}`)
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Fichier non lisible')
      setFile(null)
    } else {
      setFile(data.file)
    }

    setLoading(false)
  }

  function goUp() {
    if (!currentPath) return
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    setCurrentPath(parts.join('/'))
  }

  return (
    <div className={styles.workspace}>
      <section className={styles.explorer}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>// explorer</span>
          <button className={styles.smallBtn} onClick={goUp} disabled={!currentPath}>
            ..
          </button>
        </div>

        <div className={styles.pathBar}>
          <button onClick={() => setCurrentPath('')} className={styles.crumb}>LYSMA</button>
          {crumbs.map((crumb) => (
            <button key={crumb.path} onClick={() => setCurrentPath(crumb.path)} className={styles.crumb}>
              / {crumb.label}
            </button>
          ))}
        </div>

        <div className={styles.fileList}>
          {entries.map((entry) => (
            <button
              key={entry.path}
              className={styles.entry}
              onClick={() => entry.type === 'dir' ? setCurrentPath(entry.path) : openFile(entry.path)}
            >
              <span className={styles.entryIcon}>{entry.type === 'dir' ? 'DIR' : 'TXT'}</span>
              <span className={styles.entryName}>{entry.name}</span>
              <span className={styles.entryMeta}>
                {entry.type === 'file' ? formatSize(entry.size) : ''}
              </span>
            </button>
          ))}
          {!loading && entries.length === 0 && (
            <div className={styles.empty}>// dossier vide</div>
          )}
        </div>
      </section>

      <section className={styles.viewer}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>{file ? file.path : '// aperçu'}</span>
          {loading && <span className={styles.loading}>loading</span>}
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {!error && file && (
          <pre className={styles.code}>{file.content}</pre>
        )}
        {!error && !file && (
          <div className={styles.placeholder}>
            Selectionne un fichier texte pour l'inspecter. L'édition sera branchée ensuite avec garde-fous.
          </div>
        )}
      </section>
    </div>
  )
}

function formatSize(size: number) {
  if (size < 1024) return `${size} o`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} Ko`
  return `${(size / 1024 / 1024).toFixed(1)} Mo`
}
