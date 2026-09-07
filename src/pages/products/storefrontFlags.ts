export function landingEnabled(isActive?: boolean, showOnLanding?: boolean): boolean {
  return isActive === true && showOnLanding === true
}

export function aggregateStorefrontFlags(
  variations: Array<{ isActive?: boolean; showOnLanding?: boolean }>
): { isActive: boolean; showOnLanding: boolean } {
  return {
    isActive: variations.some(item => item.isActive === true),
    showOnLanding: variations.some(item => landingEnabled(item.isActive, item.showOnLanding)),
  }
}
