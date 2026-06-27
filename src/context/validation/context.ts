import { createContext } from 'react'

import { ValidationContextValue } from './types'

export const ValidationContext = createContext<ValidationContextValue | null>(null)
