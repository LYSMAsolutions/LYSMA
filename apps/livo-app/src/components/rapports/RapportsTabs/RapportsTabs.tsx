'use client'

import { useState } from 'react'
import { ChartBar, CalendarCheck } from '@phosphor-icons/react'
import styles from './RapportsTabs.module.css'

type Props = {
  analytiques: React.ReactNode
  rh: React.ReactNode
}

export function RapportsTabs({ analytiques, rh }: Props) {
  const [tab, setTab] = useState<'analytiques' | 'rh'>('analytiques')

  return (
    <div>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'analytiques' ? styles.active : ''}`} onClick={() => setTab('analytiques')}>
          <ChartBar size={15} weight={tab === 'analytiques' ? 'fill' : 'regular'} />
          Analytiques
        </button>
        <button className={`${styles.tab} ${tab === 'rh' ? styles.active : ''}`} onClick={() => setTab('rh')}>
          <CalendarCheck size={15} weight={tab === 'rh' ? 'fill' : 'regular'} />
          RH & Absences
        </button>
      </div>
      <div className={styles.content}>
        {tab === 'analytiques' ? analytiques : rh}
      </div>
    </div>
  )
}
