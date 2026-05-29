import { Dispatch, SetStateAction } from 'react'

import { MODES } from '@/pages/categories/const/constans'
import { ApiResponse } from '@/shared/lib/api/baseApi'
import { deleteResponse, SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { EditableSizeParameter, SizeParameter } from '@/shared/lib/api/size-parameters/type'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { message } from 'antd'

import { SizeChartResponse } from '@/app/types/size-chart'

import { INITIAL_DATA } from '../constans/const'
import {
  hasAnyData,
  isValidateParemeters,
  prepareResetData,
  prepareUpdateData,
} from '../helpers/SizeChartHelper'
import { ALL_RU_SIZES, DEFAULT_MEASUREMENTS } from '../size-parameters/constans/const'

interface useHandleSizeChartsProps {
  formSizeChart: SizeChartRequest
  parameters: EditableSizeParameter[]
  deleteIds: string[]
  sizeChartId?: string
  sizeChart: SizeChartResponse | null | undefined
  selectedSizeToAdd: string | null
  createParameter: (
    sizeChartId: string,
    data: SizeParameter
  ) => Promise<ApiResponse<SizeParameter, any>>
  addParameter: (parameter: EditableSizeParameter) => void
  setFormSizeChart: Dispatch<SetStateAction<SizeChartRequest>>
  setParameters: Dispatch<SetStateAction<EditableSizeParameter[]>>
  setDeleteIds: Dispatch<SetStateAction<string[]>>
  setUploadImg: Dispatch<SetStateAction<imgUpload | null>>
  setChangedRows: Dispatch<SetStateAction<Record<string, boolean>>>
  setSelectedSizeToAdd: Dispatch<SetStateAction<string | null>>
  refetch: () => void
  deleteParameter: (id: string) => Promise<void>
  createNewSizeChart: (data: SizeChartRequest) => Promise<ApiResponse<SizeChartRequest, any>>
  updateSizeChartData: (
    id: string,
    data: Partial<SizeChartRequest>
  ) => Promise<ApiResponse<SizeChartRequest, any>>
  deleteSizeChartData: (id: string) => Promise<ApiResponse<deleteResponse, any> | undefined>
  removeParameter: (id: string) => void
  recalculateOrder: () => void
  editModal: {
    mode: string
    setMode: (mode: string) => void
    onOpen: () => void
    onClose: () => void
  }
}

export const useHandleSizeCharts = ({
  formSizeChart,
  parameters,
  deleteIds,
  sizeChartId,
  editModal,
  sizeChart,
  selectedSizeToAdd,
  addParameter,
  createParameter,
  createNewSizeChart,
  setFormSizeChart,
  setParameters,
  refetch,
  setDeleteIds,
  setUploadImg,
  setChangedRows,
  setSelectedSizeToAdd,
  deleteParameter,
  updateSizeChartData,
  deleteSizeChartData,
  removeParameter,
  recalculateOrder,
}: useHandleSizeChartsProps) => {
  const clearChanges = () => {
    setChangedRows({})
  }

  const handleCreateSizeChart = () => {
    if (!formSizeChart.categoryId) {
      message.warning('Выберете категорию!')
      return
    }
    setUploadImg(null)
    setFormSizeChart({
      ...INITIAL_DATA,
      categoryId: formSizeChart.categoryId,
      imageId: sizeChart?.imageId || '' || null,
    })
    editModal.setMode(MODES.CREATE)
    editModal.onOpen()
  }

  const handleCancel = () => {
    if (sizeChart) {
      setFormSizeChart(prev => ({
        ...prev,
        ...prepareResetData(sizeChart),
      }))
      setParameters(sizeChart.sizeParameters || [])
    } else {
      setFormSizeChart(prev => ({
        ...INITIAL_DATA,
        categoryId: prev.categoryId,
      }))
      setParameters([])
    }
    setChangedRows({})
    setSelectedSizeToAdd(null)
  }

  const onSaveAllChanges = async (data: Partial<SizeChartRequest>) => {
    if (!sizeChartId) {
      message.warning('Нет таблицы для сохранения')
      return
    }
    const hasData = hasAnyData(parameters, formSizeChart)
    if (!hasData) {
      message.warning('Нет данных для сохранения')
      return
    }
    const hasInvalid = isValidateParemeters(parameters)
    if (hasInvalid) {
      message.error(
        'Есть некорректные значения! Проверьте длину (20-150 см) и обхват груди (40-200 см)'
      )
      return
    }
    try {
      if (deleteIds.length > 0) {
        await Promise.all(
          deleteIds.map(id =>
            deleteParameter(id).catch(error =>
              console.error(`Ошибка удаления размера ${id}:`, error)
            )
          )
        )
        console.log(`✅ Удалено ${deleteIds.length} параметров`)
      }

      await updateSizeChartData(sizeChartId, prepareUpdateData(data, parameters))
      message.success('✅ Изменения сохранены!')
      refetch()
      clearChanges()
      setDeleteIds([])
    } catch (error) {
      console.log('Ошибка соханения изменений в таблице...')
    }
  }

  const deleteSizeChart = async (id: string | undefined) => {
    const isConfirmed = confirm('Удалить таблицу с размерами?')
    if (!isConfirmed) return
    try {
      if (id) await deleteSizeChartData(id)
      setFormSizeChart({
        ...INITIAL_DATA,
        categoryId: formSizeChart.categoryId,
      })
      setParameters([])
      setSelectedSizeToAdd(null)
      refetch()
      console.log('Удаление прошло успешно!')
    } catch (error) {
      console.log('Ошибка удаления таблицы!', error)
    }
  }

  const handleSizeChartChange = (field: keyof SizeChartRequest, value: string) => {
    setFormSizeChart(prev => {
      return {
        ...prev,
        [field]: value,
      }
    })
  }

  const handleCreateSizeChartSubmit = async (data: SizeChartRequest) => {
    try {
      const result = await createNewSizeChart(data)
      await refetch()
      setFormSizeChart(result.data)
      editModal.onClose()
      message.success('✅ Таблица размеров создана!')
    } catch (error) {
      message.error('Ошибка создания таблицы размеров')
    }
  }
  const deleteSize = (id: string | undefined) => {
    if (!id) {
      return
    }
    const sizeToDelete = parameters.find(p => p.id === id)
    const isConfirmed = confirm(`Удалить размер "${sizeToDelete?.internationalSize}"?`)
    if (!isConfirmed) return
    removeParameter(id)
    recalculateOrder()
  }

  const createNewSizeParameter = async () => {
    if (!selectedSizeToAdd) {
      message.warning('Выберите размер для добавления!')
      return
    }

    if (!sizeChartId) {
      console.error('Нет таблицы размеров')
      return
    }
    const newSize: SizeParameter = {
      internationalSize: selectedSizeToAdd,
      russianSize: ALL_RU_SIZES[selectedSizeToAdd],
      lengthCm: DEFAULT_MEASUREMENTS[selectedSizeToAdd].lengthCm,
      chestCircumferenceCm: DEFAULT_MEASUREMENTS[selectedSizeToAdd].chestCircumferenceCm,
      order: (parameters?.length || 0) + 1,
    }
    try {
      const result = await createParameter(sizeChartId, newSize)
      addParameter(result.data)
      recalculateOrder()
      setSelectedSizeToAdd(null)
      console.log('Создала новый размер!')
    } catch (error) {
      console.log('Ошибка создания параметра таблицы!', error)
    }
  }

  return {
    handleCreateSizeChart,
    onSaveAllChanges,
    deleteSizeChart,
    handleCancel,
    clearChanges,
    handleSizeChartChange,
    handleCreateSizeChartSubmit,
    deleteSize,
    createNewSizeParameter,
  }
}
