export interface ErrorsProps {
  name?: string
  slug?: string
  type?: string
  sortOrder?: string
}
export interface ErrorsValueProps {
  value?: string
  displayName?: string
  hexCode?: string
}

export interface RowErrorsProps {
  [id: string]: {
    value?: string
    displayName?: string
    hexCode?: string
  }
}
