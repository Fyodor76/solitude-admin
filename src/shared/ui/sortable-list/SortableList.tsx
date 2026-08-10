import { createContext, ReactNode, useContext } from 'react'

import { HolderOutlined } from '@ant-design/icons'
import { type DragControls, Reorder, useDragControls } from 'framer-motion'

import './SortableList.scss'

export type SortableEntity = {
  id: string
}

type SortableItemContextValue = {
  controls: DragControls
  disabled: boolean
}

const SortableItemContext = createContext<SortableItemContextValue | null>(null)

type SortableListProps<T extends SortableEntity> = {
  values: T[]
  onReorder: (next: T[]) => void
  className?: string
  axis?: 'x' | 'y'
  children: ReactNode
}

/** Обёртка над framer-motion Reorder.Group — как на странице Товары. */
export function SortableList<T extends SortableEntity>({
  values,
  onReorder,
  className,
  axis = 'y',
  children,
}: SortableListProps<T>) {
  return (
    <Reorder.Group
      as="ul"
      axis={axis}
      values={values}
      onReorder={onReorder}
      className={['sortable-list', className].filter(Boolean).join(' ')}
    >
      {children}
    </Reorder.Group>
  )
}

type SortableItemProps<T extends SortableEntity> = {
  value: T
  className?: string
  disabled?: boolean
  onDragEnd?: () => void
  children: ReactNode
}

export function SortableItem<T extends SortableEntity>({
  value,
  className,
  disabled = false,
  onDragEnd,
  children,
}: SortableItemProps<T>) {
  const controls = useDragControls()

  return (
    <SortableItemContext.Provider value={{ controls, disabled }}>
      <Reorder.Item
        value={value}
        id={value.id}
        as="li"
        className={['sortable-list__item', className].filter(Boolean).join(' ')}
        dragListener={false}
        dragControls={controls}
        drag={!disabled}
        onDragEnd={onDragEnd}
        whileDrag={{
          scale: 1.01,
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
          zIndex: 2,
          cursor: 'grabbing',
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
      >
        {children}
      </Reorder.Item>
    </SortableItemContext.Provider>
  )
}

type SortableDragHandleProps = {
  ariaLabel?: string
  className?: string
}

/** Ручка перетаскивания. Работает только внутри SortableItem. */
export function SortableDragHandle({
  ariaLabel = 'Перетащить',
  className,
}: SortableDragHandleProps) {
  const ctx = useContext(SortableItemContext)

  if (!ctx || ctx.disabled) {
    return <span className={['sortable-list__drag-spacer', className].filter(Boolean).join(' ')} />
  }

  return (
    <button
      type="button"
      className={['sortable-list__drag-handle', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      onPointerDown={event => ctx.controls.start(event)}
    >
      <HolderOutlined />
    </button>
  )
}
