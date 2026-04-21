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

export const DEFAULT_MEASUREMENTS: Record<
  string,
  { lengthCm: number; chestCircumferenceCm: number }
> = {
  XS: { lengthCm: 64, chestCircumferenceCm: 84 - 88 },
  S: { lengthCm: 68, chestCircumferenceCm: 88 - 92 },
  M: { lengthCm: 70, chestCircumferenceCm: 92 - 96 },
  L: { lengthCm: 72, chestCircumferenceCm: 96 - 100 },
  XL: { lengthCm: 74, chestCircumferenceCm: 100 - 104 },
  XXL: { lengthCm: 76, chestCircumferenceCm: 104 - 108 },
  XXXL: { lengthCm: 78, chestCircumferenceCm: 108 - 112 },
}
