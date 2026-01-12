import { ReactNode } from 'react'

import { Button, Checkbox, Form, Input } from 'antd'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import '../custom-form/CustomForm.scss'

interface CustomFormProps {
  configForm: configFormType
}

interface configFormType {
  title: string
  innerTitle: string
  subtitle: string
  className?: string
  sections: SectionType[]
}

interface SectionType {
  fields: FieldType[]
  className?: string
}

interface FieldType {
  typeField: 'input' | 'button' | 'checkbox' | 'link'
  size?: 'small' | 'middle' | 'large'
  placeholder?: string
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text'
  children?: ReactNode | string
  link?: string
  className?: string
  block?: boolean
}

export const CustomForm = ({ configForm }: CustomFormProps) => {
  return (
    <Form className={configForm.className}>
      {configForm.innerTitle && <p className="card-title">{configForm.innerTitle}</p>}

      {configForm.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className={classNames('form-section', section.className)}>
          {section.fields.map((field, fieldIndex) => (
            <div key={fieldIndex} className={field.className}>
              {field.typeField === 'input' && (
                <Input size={field.size} placeholder={field.placeholder} />
              )}

              {field.typeField === 'checkbox' && <Checkbox>{field.children}</Checkbox>}

              {field.typeField === 'button' && (
                <Button size={field.size} type={field.type} block={field.block}>
                  {field.children}
                </Button>
              )}

              {field.typeField === 'link' && (
                <div>
                  <Link to={field.link || '#'}>{field.children}</Link>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </Form>
  )
}
