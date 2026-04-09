import React from 'react'

import Icon from '@/shared/ui/icons/Icon'

interface CategoryTitleProps {
  name: string
  onEdit: () => void
  onDelete: () => void
  onCreate: () => void
}
const CategoryTitle = React.memo(
  ({ name, onEdit, onDelete, onCreate }: CategoryTitleProps) => {
    console.log(`Render CategoryTitle: ${name}`) // ← уже есть
    return (
      <div className="category">
        <span>{name}</span>
        <div className="btn-category">
          <button className="btn-edit" onClick={onEdit}>
            <Icon name="editing" color="#1a1a1a" />
          </button>
          <button className="btn-delete" onClick={onDelete}>
            <Icon name="delete" color="#1a1a1a" />
          </button>
          <button className="btn-add" onClick={onCreate}>
            <Icon color="#1a1a1a" name="add" />
          </button>
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    const isEqual =
      prevProps.name === nextProps.name &&
      prevProps.onEdit === nextProps.onEdit &&
      prevProps.onDelete === nextProps.onDelete &&
      prevProps.onCreate === nextProps.onCreate
    console.log(`CategoryTitle ${prevProps.name} isEqual:`, isEqual)
    return isEqual
  }
)

CategoryTitle.displayName = 'CategoryTitle'

export default CategoryTitle
