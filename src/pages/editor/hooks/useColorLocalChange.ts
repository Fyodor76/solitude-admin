import { ColorWithStatus, FormEditorType } from '../types'

interface useColorLocalChangeProps {
  formEditor: FormEditorType
  handleInput: (v: any, field: keyof FormEditorType) => void
}
const useColorLocalChange = ({ formEditor, handleInput }: useColorLocalChangeProps) => {
  const localUpdatedColor = <K extends keyof ColorWithStatus>(
    colorId: string,
    field: K,
    value: ColorWithStatus[K]
  ) => {
    const updatedColors =
      formEditor?.colors?.map(color => {
        if (!color) return color
        return color.id === colorId ? { ...color, [field]: value } : color
      }) || []
    handleInput(updatedColors, 'colors')
  }

  const localDeletedColor = (colorId: string) => {
    const newColors = formEditor?.colors?.filter(color => color.id !== colorId) || []
    handleInput(newColors, 'colors')
  }

  const localAddNewColor = () => {}
  const handleToggleStatus = (colorId: string) => {
    const updatedColors =
      formEditor?.colors?.map(color =>
        color.id === colorId ? { ...color, isActive: !color.isActive } : color
      ) || []
    handleInput(updatedColors, 'colors')
  }

  return { localUpdatedColor, localDeletedColor, localAddNewColor, handleToggleStatus }
}

export default useColorLocalChange
