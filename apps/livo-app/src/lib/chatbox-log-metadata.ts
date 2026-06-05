const cleanMetadataText = (value: unknown, maxLength: number) =>
  typeof value === 'string'
    ? value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
    : ''

const metadataRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null

export function buildChatboxLogMetadata(value: unknown, base: Record<string, unknown>) {
  const input = metadataRecord(value)
  const page = metadataRecord(input?.page)
  const path = cleanMetadataText(page?.path, 180)
  const url = cleanMetadataText(page?.url, 500)
  const title = cleanMetadataText(page?.title, 180)
  const referrer = cleanMetadataText(page?.referrer, 500)

  return {
    ...base,
    ...(path || url || title || referrer
      ? {
          page: {
            ...(path ? { path } : {}),
            ...(url ? { url } : {}),
            ...(title ? { title } : {}),
            ...(referrer ? { referrer } : {}),
          },
        }
      : {}),
  }
}
