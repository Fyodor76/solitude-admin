import { ChangeEvent, FormEvent } from 'react'

import { Checkbox, Form, Input } from 'antd'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { CustomButton } from '../custom-button/CustomButton'
import '../custom-form/CustomForm.scss'
import { configFormType } from './types'

interface CustomFormProps<T extends Record<string, string>> {
  formData: T
  configForm: configFormType
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onFinish: () => void
}

export const CustomForm = <T extends Record<string, string>>({
  formData,
  configForm,
  onChange,
  onFinish,
}: CustomFormProps<T>) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onFinish()
  }

  return (
    <Form className={configForm.className} onSubmitCapture={handleSubmit}>
      {configForm.innerTitle && <p className="card-title">{configForm.innerTitle}</p>}

      {configForm.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className={classNames('form-section', section.className)}>
          {section.fields.map((field, fieldIndex) => (
            <div key={fieldIndex}>
              {field.typeField === 'input' && (
                <Input
                  type={field.type}
                  size={field.size}
                  placeholder={field.placeholder}
                  name={field.name}
                  onChange={e => onChange(e)}
                  value={formData[field.name]}
                />
              )}

              {field.typeField === 'checkbox' && <Checkbox>{field.children}</Checkbox>}

              {field.typeField === 'button' && (
                <CustomButton
                  size={field.size}
                  type={field.type}
                  block={field.block}
                  onClick={onFinish}
                >
                  {field.children}
                </CustomButton>
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
