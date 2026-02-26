import React from 'react'

export interface CategoryToAntTree {
  key: string
  title: React.ReactNode
  children?: CategoryToAntTree[]
}
