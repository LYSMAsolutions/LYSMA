import { cn } from '@/lib/utils'
import styles from './Skeleton.module.css'

type SkeletonProps = {
  width?: string | number
  height?: string | number
  radius?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

export function Skeleton({ width, height, radius = 'md', className }: SkeletonProps) {
  return (
    <span
      className={cn(styles.skeleton, styles[radius], className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  )
}

/* ── Variantes prêtes à l'emploi ────────────────────────────── */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn(styles.textGroup, className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 ? '65%' : '100%'}
          className={styles.textLine}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn(styles.cardSkeleton, className)}>
      <div className={styles.cardSkeletonHeader}>
        <Skeleton width={36} height={36} radius="md" />
        <div className={styles.cardSkeletonHeaderText}>
          <Skeleton height={16} width="55%" />
          <Skeleton height={12} width="35%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  )
}

export function SkeletonMetric({ className }: { className?: string }) {
  return (
    <div className={cn(styles.metricSkeleton, className)}>
      <Skeleton height={12} width="45%" />
      <Skeleton height={36} width="70%" />
      <Skeleton height={10} width="30%" />
    </div>
  )
}
