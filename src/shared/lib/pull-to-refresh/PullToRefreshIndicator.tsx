import './PullToRefreshIndicator.scss'

type PullToRefreshIndicatorProps = {
  pullDistance: number
  refreshing: boolean
}

export function PullToRefreshIndicator({ pullDistance, refreshing }: PullToRefreshIndicatorProps) {
  if (pullDistance <= 0 && !refreshing) {
    return null
  }

  const progress = Math.min(pullDistance / 72, 1)

  return (
    <div
      className="pull-to-refresh"
      style={{ height: `${Math.max(pullDistance, refreshing ? 48 : 0)}px` }}
      aria-hidden="true"
    >
      <span
        className="pull-to-refresh__spinner"
        style={{
          opacity: progress,
          transform: `scale(${0.6 + progress * 0.4}) rotate(${progress * 180}deg)`,
        }}
      />
    </div>
  )
}
