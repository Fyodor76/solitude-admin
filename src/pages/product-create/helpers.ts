import { BaseCategoryTree } from '@/shared/lib/api/categories/types'

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9а-яё\-]/gi, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
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
