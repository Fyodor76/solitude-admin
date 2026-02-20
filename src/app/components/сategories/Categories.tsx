import React, { useEffect, useState } from 'react'

import { useGetCategoriesQuery } from '@/shared/lib/api/api-categories/apiCategories'
import { Tree } from 'antd'

import { buildCategoriesTree, transformToAntTree } from './categoryHelper'
import { CategoryToAntTree } from './type'

const Categories = () => {
  const { data: categoriesData, isLoading, error } = useGetCategoriesQuery()
  const [categories, setCategories] = useState<CategoryToAntTree[]>([])

  useEffect(() => {
    if (categoriesData) {
      const sympleTree = buildCategoriesTree(categoriesData.data)
      const antTree = transformToAntTree(sympleTree)
      setCategories(antTree)
    }
  }, [categoriesData])

  return (
    <div className="allCategories">
      {isLoading && <span>Загрузка...</span>}
      {error && <span>Ошибочка вышла...</span>}
      {categoriesData && <Tree treeData={categories} defaultExpandAll showLine></Tree>}
    </div>
  )
}

export default Categories
