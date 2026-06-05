function pluralRu(count: number, one: string, few: string, many: string): string {
  const n = Math.abs(count) % 100
  const n1 = n % 10

  if (n > 10 && n < 20) {
    return many
  }

  if (n1 === 1) {
    return one
  }

  if (n1 >= 2 && n1 <= 4) {
    return few
  }

  return many
}

export function formatUnreadCount(count: number): string {
  const word = pluralRu(count, 'непрочитанное', 'непрочитанных', 'непрочитанных')
  return `${count} ${word}`
}
