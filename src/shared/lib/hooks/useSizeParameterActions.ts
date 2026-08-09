import {
  useCreateSizeParameterBySizeChartIdMutation,
  useDeleteSizeParameterByIdMutation,
} from '../api/size-parameters/SizeParameters'
import { SizeParameter } from '../api/size-parameters/type'

export const useSizeParameterActions = () => {
  const [createNewParameter] = useCreateSizeParameterBySizeChartIdMutation()
  const [deleteSizeParameter] = useDeleteSizeParameterByIdMutation()
  const createParameter = async (sizeChartId: string, data: SizeParameter) => {
    try {
      const result = await createNewParameter({
        data,
        sizeChartId,
      }).unwrap()
      console.log('✅ Параметр размера создан')
      return result
    } catch (error) {
      console.log('Ошибка создания параметра!', error)
      throw error
    }
  }

  const deleteParameter = async (id: string) => {
    try {
      await deleteSizeParameter(id).unwrap()
      console.log(`✅ Параметр размера удалён: ${id}`)
    } catch (error) {
      console.error(`Ошибка удаления параметра ${id}:`, error)
      throw error
    }
  }
  return {
    createParameter,
    deleteParameter,
  }
}
