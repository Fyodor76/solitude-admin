export const PAGE_SIZE = 24
export const PLATFORM_IMAGES_FOLDER = ''

export const PLATFORM_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif'
export const PLATFORM_IMAGE_ACCEPT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
] as const

/** Максимум файлов за одну пакетную загрузку */
export const PLATFORM_IMAGE_MAX_BATCH = 50

export const PLATFORM_IMAGES_UPLOAD = {
  /** Сбор файлов из серии beforeUpload (antd) */
  BATCH_SCHEDULE_MS: 80,
  /** Скрыть превью после завершения загрузки */
  QUEUE_CLEAR_MS: 1800,
  MODAL_WIDTH_PX: 520,
  NAME_MAX_LENGTH: 255,
} as const

export const PLATFORM_IMAGES_COPY = {
  dropTitle: 'Перетащите фото сюда',
  dropHint:
    'или нажмите, чтобы выбрать файлы. Загрузка на сервер — по кнопке ниже (JPEG, PNG, WebP, GIF, до 50 шт.)',
  dropUploading: 'Загружаем изображения…',
  queueTitle: 'Выбрано для загрузки',
  queueUpload: 'Загрузить выбранные фото',
  queueClear: 'Очистить список',
  queueRemoveAria: 'Убрать из списка',
} as const

export const PLATFORM_IMAGE_SORT_OPTIONS = [
  { value: 'date:desc', label: 'По дате: сначала новые' },
  { value: 'date:asc', label: 'По дате: сначала старые' },
  { value: 'size:desc', label: 'По размеру: сначала большие' },
  { value: 'size:asc', label: 'По размеру: сначала маленькие' },
  { value: 'name:asc', label: 'По названию: А-Я' },
  { value: 'name:desc', label: 'По названию: Я-А' },
] as const
