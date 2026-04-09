import React from 'react'

export interface CategoryToAntTree {
  key: string
  title: React.ReactNode
  children: CategoryToAntTree[]
}

export interface FormData {
  name: string
  slug?: string
  description: string
  parentId: string | null
  imageId: string | null
  sortOrder: number
  type?: string
}
