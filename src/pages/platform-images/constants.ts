export const PAGE_SIZE = 24
export const PLATFORM_IMAGES_FOLDER = ''

export const PLATFORM_IMAGE_SORT_OPTIONS = [
  { value: 'date:desc', label: 'По дате: сначала новые' },
  { value: 'date:asc', label: 'По дате: сначала старые' },
  { value: 'size:desc', label: 'По размеру: сначала большие' },
  { value: 'size:asc', label: 'По размеру: сначала маленькие' },
  { value: 'name:asc', label: 'По названию: А-Я' },
  { value: 'name:desc', label: 'По названию: Я-А' },
] as const
