import './ColorSwatches.scss'
import { isLightHex, resolveColorHex } from './resolveColorHex'

const MAX_VISIBLE = 6
const MIN_COLORS_TO_SHOW = 2

export type ColorSwatchItem = {
  id: string
  hexCode?: string | null
  value?: string | null
  displayName?: string | null
  slug?: string | null
}

export type ColorDotSize = 'sm' | 'md' | 'lg'

type ColorDotProps = {
  color: ColorSwatchItem | { hexCode?: string | null; displayName?: string | null }
  size?: ColorDotSize
  className?: string
  title?: string
}

/** Один кружок цвета — для таблиц и списков. */
export function ColorDot({ color, size = 'sm', className, title }: ColorDotProps) {
  const hex = resolveColorHex(color)
  const light = isLightHex(hex)
  const label = title || ('displayName' in color ? color.displayName : undefined) || hex || 'Цвет'

  return (
    <span
      className={[
        'color-swatches__dot',
        size !== 'sm' ? `color-swatches__dot--${size}` : '',
        light ? 'color-swatches__dot--light' : '',
        !hex ? 'color-swatches__dot--empty' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={hex ? { backgroundColor: hex } : undefined}
      title={label || undefined}
      aria-label={label || 'Цвет'}
    />
  )
}

type ColorSwatchesProps = {
  colors?: ColorSwatchItem[] | null
  className?: string
  /** Показывать даже один цвет (по умолчанию скрываем, если меньше 2) */
  showSingle?: boolean
  maxVisible?: number
  size?: ColorDotSize
}

/** Ряд цветовых кружков (порт с лендинга). */
export function ColorSwatches({
  colors,
  className,
  showSingle = false,
  maxVisible = MAX_VISIBLE,
  size = 'sm',
}: ColorSwatchesProps) {
  if (!colors?.length) {
    return null
  }

  if (!showSingle && colors.length < MIN_COLORS_TO_SHOW) {
    return null
  }

  const visible = colors.slice(0, maxVisible)
  const rest = colors.length - visible.length

  return (
    <ul
      className={['color-swatches', className].filter(Boolean).join(' ')}
      aria-label={`Доступно цветов: ${colors.length}`}
    >
      {visible.map(color => (
        <li key={color.id} className="color-swatches__item">
          <ColorDot color={color} size={size} />
        </li>
      ))}
      {rest > 0 ? (
        <li className="color-swatches__more" aria-label={`Ещё ${rest}`}>
          +{rest}
        </li>
      ) : null}
    </ul>
  )
}
