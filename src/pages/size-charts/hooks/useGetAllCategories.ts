import { useMemo } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'

import { getAllCategories } from '../helpers/SizeChartHelper'

export const useAllCategories = () => {
  const { data: categoriesTreeData, isLoading, error } = useGetCategoriesTreeQuery()

  const categories = useMemo(() => {
    if (!categoriesTreeData?.data) return []
    return getAllCategories(categoriesTreeData.data)
  }, [categoriesTreeData])

  return {
    categories,
    isLoading,
    error,
  }
}
