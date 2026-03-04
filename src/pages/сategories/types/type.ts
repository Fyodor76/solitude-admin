import React from 'react'

import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'

export interface CategoryToAntTree {
  key: string
  title: React.ReactNode
  children: CategoryToAntTree[]
}
