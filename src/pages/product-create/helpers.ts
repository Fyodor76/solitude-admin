import { BaseCategoryTree } from '@/shared/lib/api/categories/types'

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .split('')
    .map(char => CYRILLIC_TO_LATIN[char] ?? char)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function buildSku(...parts: Array<string | null | undefined>): string {
  return parts
    .map(part => slugify(part || '').toUpperCase())
    .filter(Boolean)
    .join('-')
}

/** Предложить slug из названия. */
export function suggestSlugFromName(name: string): string {
  return slugify(name)
}

/** Предложить SKU из названия. */
export function suggestSkuFromName(name: string): string {
  return buildSku(name)
}

/**
 * Если поле ещё пустое или совпадает с авто-версией от старого названия —
 * подставить новое предложение. Иначе оставить ручной ввод.
 * Для форм редактирования товара/вариации предпочтительнее явный lock по onChange поля.
 */
export function syncDerivedFromName(
  current: string | undefined | null,
  previousName: string,
  nextName: string,
  derive: (name: string) => string
): string {
  const nextDerived = derive(nextName)
  if (!nextDerived) return (current || '').trim()

  const currentTrimmed = (current || '').trim()
  const previousDerived = derive(previousName)

  if (!currentTrimmed || currentTrimmed === previousDerived) {
    return nextDerived
  }

  return currentTrimmed
}

export function parseImagesText(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean)
}

export function createDraftKey(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function flattenCategoryOptions(
  nodes: BaseCategoryTree[],
  depth = 0
): Array<{ label: string; value: string }> {
  const options: Array<{ label: string; value: string }> = []

  for (const node of nodes) {
    const prefix = depth > 0 ? `${'—'.repeat(depth)} ` : ''
    options.push({
      label: `${prefix}${node.name}`,
      value: node.id,
    })

    if (node.children?.length) {
      options.push(...flattenCategoryOptions(node.children, depth + 1))
    }
  }

  return options
}
