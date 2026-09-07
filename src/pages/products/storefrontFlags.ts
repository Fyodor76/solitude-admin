export function aggregateStorefrontFlags(
  variations: Array<{ isActive?: boolean; showOnLanding?: boolean }>
): { isActive: boolean; showOnLanding: boolean } {
  return {
    isActive: variations.some(item => item.isActive === true),
    showOnLanding: variations.some(item => item.showOnLanding === true),
  }
}
