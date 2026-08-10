import { useEffect, useMemo, useState } from 'react'

import { DeleteOutlined, HolderOutlined } from '@ant-design/icons'
import { Button, Image } from 'antd'
import { Reorder, useDragControls } from 'framer-motion'

import '../product-create/ProductCreate.scss'

export type VariationPhotoItem = {
  fileId: string
  url: string
  variationId: string
  variationName: string
}

type ProductVariationPhotosGalleryProps = {
  items: VariationPhotoItem[]
  showcaseFileIds: string[]
  onShowcaseChange: (next: string[]) => void
  onRemove: (item: VariationPhotoItem) => void
}

function buildDisplayOrder(
  items: VariationPhotoItem[],
  showcaseFileIds: string[]
): VariationPhotoItem[] {
  const byId = new Map(items.map(item => [item.fileId, item]))
  const showcaseOrdered = showcaseFileIds
    .map(id => byId.get(id))
    .filter((item): item is VariationPhotoItem => Boolean(item))
  const rest = items.filter(item => !showcaseFileIds.includes(item.fileId))
  return [...showcaseOrdered, ...rest]
}

function VariationPhotoCard({
  item,
  index,
  isShowcase,
  onToggleShowcase,
  onRemove,
}: {
  item: VariationPhotoItem
  index: number
  isShowcase: boolean
  onToggleShowcase: (fileId: string) => void
  onRemove: (item: VariationPhotoItem) => void
}) {
  const controls = useDragControls()

  return (
    <Reorder.Item
      value={item}
      as="div"
      className={[
        'product-create-images__item',
        'product-create-images__item--sortable',
        isShowcase ? 'product-create-images__item--showcase' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      dragListener={false}
      dragControls={controls}
      whileDrag={{
        scale: 1.06,
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
        zIndex: 3,
        cursor: 'grabbing',
      }}
      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
    >
      <button
        type="button"
        className="product-create-images__drag-handle"
        aria-label={`Перетащить фото ${index + 1}`}
        onPointerDown={event => controls.start(event)}
      >
        <HolderOutlined />
      </button>
      <Image
        src={item.url}
        alt=""
        width={96}
        height={96}
        style={{ objectFit: 'cover' }}
        preview={{ mask: 'Просмотр' }}
      />
      <div className="product-create-images__actions">
        {isShowcase ? (
          <button
            type="button"
            className="product-create-images__badge product-create-images__badge--showcase"
            onClick={() => onToggleShowcase(item.fileId)}
          >
            На витрине
          </button>
        ) : (
          <Button
            type="default"
            size="small"
            className="product-create-images__action-btn"
            onClick={() => onToggleShowcase(item.fileId)}
          >
            На витрине
          </Button>
        )}
      </div>
      <Button
        type="text"
        danger
        size="small"
        className="product-create-images__remove"
        icon={<DeleteOutlined />}
        onClick={() => onRemove(item)}
        aria-label="Удалить фото"
      />
    </Reorder.Item>
  )
}

/** Все фото вариаций: DnD порядка витрины + toggle «На витрине» + удаление. */
export function ProductVariationPhotosGallery({
  items,
  showcaseFileIds,
  onShowcaseChange,
  onRemove,
}: ProductVariationPhotosGalleryProps) {
  const showcaseSet = useMemo(() => new Set(showcaseFileIds), [showcaseFileIds])
  const [orderedItems, setOrderedItems] = useState<VariationPhotoItem[]>(() =>
    buildDisplayOrder(items, showcaseFileIds)
  )

  useEffect(() => {
    setOrderedItems(buildDisplayOrder(items, showcaseFileIds))
  }, [items, showcaseFileIds])

  const handleReorder = (next: VariationPhotoItem[]) => {
    setOrderedItems(next)
    onShowcaseChange(next.filter(item => showcaseSet.has(item.fileId)).map(item => item.fileId))
  }

  const handleToggleShowcase = (fileId: string) => {
    if (showcaseSet.has(fileId)) {
      onShowcaseChange(showcaseFileIds.filter(id => id !== fileId))
      return
    }
    onShowcaseChange([...showcaseFileIds, fileId])
  }

  if (!items.length) {
    return (
      <p className="product-detail__variations-empty">
        У вариаций пока нет фото. Загрузите их в редактировании вариации.
      </p>
    )
  }

  return (
    <div className="product-create-images product-variation-photos">
      <Reorder.Group
        axis="x"
        values={orderedItems}
        onReorder={handleReorder}
        as="div"
        className="product-create-images__list product-create-images__list--wrap"
      >
        {orderedItems.map((item, index) => (
          <VariationPhotoCard
            key={item.fileId}
            item={item}
            index={index}
            isShowcase={showcaseSet.has(item.fileId)}
            onToggleShowcase={handleToggleShowcase}
            onRemove={onRemove}
          />
        ))}
      </Reorder.Group>
    </div>
  )
}
