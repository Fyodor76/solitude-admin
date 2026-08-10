import {
  useCreateSizeChartMutation,
  useDeleteSizeChartByIdMutation,
  useUpdateSizeChartByIdMutation,
} from '../api/size-charts/SizeCharts'
import { SizeChartRequest } from '../api/size-charts/types'

export const useSizeChartActions = () => {
  const [deleteSizeChartById] = useDeleteSizeChartByIdMutation()
  const [updateSizeChart] = useUpdateSizeChartByIdMutation()
  const [createSizeChart] = useCreateSizeChartMutation()

  const createNewSizeChart = async (data: SizeChartRequest) => {
    try {
      const result = await createSizeChart(data).unwrap()
      console.log('✅ Таблица размеров создана, обновляем данные...')

      return result
    } catch (error) {
      console.log('Ошибка создания таблицы категории!', error)
      throw error
    }
  }
  const updateSizeChartData = async (id: string, data: Partial<SizeChartRequest>) => {
    try {
      const result = await updateSizeChart({ id, data }).unwrap()
      console.log('✅ Таблица размеров обновлена')
      return result
    } catch (error) {
      console.log('Ошибка обновления таблицы!', error)
      throw error
    }
  }

  const deleteSizeChartData = async (id: string | undefined) => {
    if (!id) return

    try {
      const result = await deleteSizeChartById(id).unwrap()
      console.log('✅ Таблица размеров удалена')

      return result
    } catch (error) {
      console.log('Ошибка удаления таблицы!', error)
      throw error
    }
  }
  return {
    deleteSizeChartData,
    createNewSizeChart,
    updateSizeChartData,
  }
}
