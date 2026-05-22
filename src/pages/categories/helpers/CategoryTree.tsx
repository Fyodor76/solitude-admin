import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { DownOutlined, RightOutlined } from '@ant-design/icons'

import CategoryTitle from './CategoryTitle'
import { collectExpandableIds, sortCategoryTree } from './categoryTreeHelper'
import './CategoryTreeHelper.scss'

interface CategoryTreeProps {
  categories: BaseCategoryTree[]
  onEdit: (id: string) => void
  onDelete: (id: string, imageId?: string, folder?: string) => void
  onCreate: (id?: string) => void
}

interface CategoryTreeNodeProps extends Omit<CategoryTreeProps, 'categories'> {
  category: BaseCategoryTree
  expandedIds: string[]
  isLast: boolean
  onToggle: (id: string) => void
}

const CategoryTreeNode = ({
  category,
  expandedIds,
  isLast,
  onToggle,
  onEdit,
  onDelete,
  onCreate,
}: CategoryTreeNodeProps) => {
  const hasChildren = category.children.length > 0
  const isExpanded = hasChildren && expandedIds.includes(category.id)

  return (
    <div
      className={[
        'category-tree-node',
        isLast ? 'category-tree-node--last' : '',
        hasChildren ? 'category-tree-node--branch' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className="category-tree-node__row"
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        {hasChildren ? (
          <button
            type="button"
            className={[
              'category-tree-node__toggle',
              isExpanded
                ? 'category-tree-node__toggle--expanded'
                : 'category-tree-node__toggle--collapsed',
            ].join(' ')}
            onClick={() => onToggle(category.id)}
            aria-label={isExpanded ? 'Collapse category' : 'Expand category'}
          >
            {isExpanded ? <DownOutlined /> : <RightOutlined />}
          </button>
        ) : (
          <span className="category-tree-node__toggle-placeholder" aria-hidden="true" />
        )}

        <CategoryTitle
          name={category.name}
          isActive={category.isActive}
          onEdit={() => onEdit(category.id)}
          onDelete={() => onDelete(category.id, category.imageId ?? undefined, 'products')}
          onCreate={() => onCreate(category.id)}
        />
      </div>

      {hasChildren && isExpanded ? (
        <div className="category-tree-node__children" role="group">
          {category.children.map((child, index) => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              expandedIds={expandedIds}
              isLast={index === category.children.length - 1}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onCreate={onCreate}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

const CategoryTree = ({ categories, onEdit, onDelete, onCreate }: CategoryTreeProps) => {
  const sortedCategories = useMemo(() => sortCategoryTree(categories), [categories])
  const expandableIds = useMemo(() => collectExpandableIds(sortedCategories), [sortedCategories])
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  useEffect(() => {
    const expandableSet = new Set(expandableIds)
    setExpandedIds(prev => prev.filter(id => expandableSet.has(id)))
  }, [expandableIds])

  const handleToggle = useCallback((id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(expandedId => expandedId !== id) : [...prev, id]
    )
  }, [])

  return (
    <div className="category-tree" role="tree" aria-label="Product categories">
      {sortedCategories.map((category, index) => (
        <CategoryTreeNode
          key={category.id}
          category={category}
          expandedIds={expandedIds}
          isLast={index === sortedCategories.length - 1}
          onToggle={handleToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onCreate={onCreate}
        />
      ))}
    </div>
  )
}

export default React.memo(CategoryTree)
