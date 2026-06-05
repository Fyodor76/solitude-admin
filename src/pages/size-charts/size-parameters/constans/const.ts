export const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export const ALL_RU_SIZES: Record<string, string> = {
  XS: '40-42',
  S: '42-44',
  M: '44-46',
  L: '46-48',
  XL: '48-50',
  XXL: '50-52',
  XXXL: '52-54',
}

export const FIELDS = {
  LENGTH_CM: 'lengthCm',
  CHEST_CIRCUMFERENCE_CM: 'chestCircumferenceCm',
  INTERNATIONAL_SIZE: 'internationalSize',
  RUSSIAN_SIZE: 'russianSize',
  ORDER: 'order',
} as const

export const DEFAULT_MEASUREMENTS: Record<
  string,
  { lengthCm: number; chestCircumferenceCm: number }
> = {
  XS: { lengthCm: 64, chestCircumferenceCm: 86 },
  S: { lengthCm: 68, chestCircumferenceCm: 90 },
  M: { lengthCm: 70, chestCircumferenceCm: 94 },
  L: { lengthCm: 72, chestCircumferenceCm: 98 },
  XL: { lengthCm: 74, chestCircumferenceCm: 102 },
  XXL: { lengthCm: 76, chestCircumferenceCm: 106 },
  XXXL: { lengthCm: 78, chestCircumferenceCm: 110 },
}

export const MIN_LENGTH = 20
export const MAX_LENGTH = 150
export const MIN_CHEST = 40
export const MAX_CHEST = 200

export const VALIDATION_MESSAGES = {
  length: `Длина должна быть от ${MIN_LENGTH} до ${MAX_LENGTH} см`,
  chest: `Обхват груди должен быть от ${MIN_CHEST} до ${MAX_CHEST} см`,
}
