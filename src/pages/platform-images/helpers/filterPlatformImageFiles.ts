import { PLATFORM_IMAGE_ACCEPT_TYPES, PLATFORM_IMAGE_MAX_BATCH } from '../constants'

const EXTENSION_PATTERN = /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i

export function isPlatformImageFile(file: File): boolean {
  if (file.type && (PLATFORM_IMAGE_ACCEPT_TYPES as readonly string[]).includes(file.type)) {
    return true
  }

  return EXTENSION_PATTERN.test(file.name)
}

export function filterPlatformImageFiles(files: File[]): File[] {
  const unique = new Map<string, File>()

  for (const file of files) {
    if (!isPlatformImageFile(file)) {
      continue
    }

    const key = `${file.name}-${file.size}-${file.lastModified}`
    unique.set(key, file)
  }

  return [...unique.values()].slice(0, PLATFORM_IMAGE_MAX_BATCH)
}
