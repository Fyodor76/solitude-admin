export type HeatmapClick = {
  xPath: string
  x_percent: string | number
  y_percent: string | number
  value: number
}

export type TrackedPageSummary = {
  id: string
  externalPageId: string
  lastSeenUri: string | null
  lastSeenAt: string | null
  createdAt: string
}
