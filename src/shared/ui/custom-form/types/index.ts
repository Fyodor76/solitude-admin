import { ReactNode } from 'react'

interface InputField {
  name: string
  typeField: 'input'
  size?: 'small' | 'middle' | 'large'
  placeholder?: string
  type?: string
}

interface BtnField {
  size?: 'small' | 'middle' | 'large'
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text'
  block?: boolean
  typeField: 'button'
  children?: ReactNode
}

interface CheckboxField {
  children?: ReactNode
  typeField: 'checkbox'
}

interface LinkField {
  link: string
  children?: ReactNode
  typeField: 'link'
}

export interface configFormType {
  title: string
  innerTitle: string
  subtitle: string
  className?: string
  sections: SectionType[]
}

interface SectionType {
  fields: (InputField | BtnField | CheckboxField | LinkField)[]
  className?: string
}
