import { message } from 'antd'

import { ColorWithStatus, FormEditorType } from '../types'

interface useColorLocalChangeProps {
  formEditor: FormEditorType
  handleInput: (v: any, field: keyof FormEditorType) => void
}
const useColorLocalChange = ({ formEditor, handleInput }: useColorLocalChangeProps) => {
  const localDeletedColor = (colorId: string) => {
    const newColors = formEditor?.colors?.filter(color => color.id !== colorId) || []
    handleInput(newColors, 'colors')
    const newVariants = formEditor?.variants?.filter(v => v.colorId !== colorId) || []
    handleInput(newVariants, 'variants')
  }

  const localAddNewColor = (colorIds: string[], colors: ColorWithStatus[]) => {
    const colorsToAdd = colorIds
      .map(id => colors.find(c => c.id === id))
      .filter((c): c is ColorWithStatus => c !== undefined)

    if (colorsToAdd.length === 0) {
      message.error('Цвет не найден')
      return
    }

    const existingIds = formEditor.colors?.map(c => c.id) || []
    const newColors = colorsToAdd.filter(c => !existingIds.includes(c.id))
    if (newColors.length === 0) {
      message.warning('Все выбранные цвета уже добавлены')
      return
    }

    const updatedColors = [...(formEditor.colors || []), ...newColors]
    handleInput(updatedColors, 'colors')

    const newVariant = newColors.map(color => ({
      colorId: color.id,
      variants: [
        {
          image: 'https://via.placeholder.com/150',
          title: 'Изображение',
          id: '',
          order: 0,
        },
      ],
    }))

    const newVariants = [...(formEditor.variants || []), ...newVariant]
    handleInput(newVariants, 'variants')
  }

  return { localDeletedColor, localAddNewColor }
}

export default useColorLocalChange
