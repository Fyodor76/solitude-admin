import { useEffect, useMemo, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import {
  useCreateSizeChartMutation,
  useDeleteSizeChartByIdMutation,
  useUpdateSizeChartByIdMutation,
} from '@/shared/lib/api/size-charts/SizeCharts'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import {
  useCreateSizeParameterBySizeChartIdMutation,
  useDeleteSizeParameterByIdMutation,
} from '@/shared/lib/api/size-parameters/SizeParameters'
import { SizeParameter } from '@/shared/lib/api/size-parameters/type'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { useModal } from '@/shared/lib/hooks/useModal'
import { Spin } from 'antd'

import { CDN_URL } from '@/app/constans/url'

import { MODES } from '../categories/const/constans'
import { ALL_RU_SIZES, DEFAULT_MEASUREMENTS } from '../size-parameters/const'
import SizeParameters from '../size-parameters/SizeParameters'
import ChoosingCategory from './components/ChoosingCategory'
import SizeChartButtons from './components/SizeChartButtons'
import SizeChartCreate from './components/SizeChartCreate'
import SizeChartEmpty from './components/SizeChartEmpty'
import SizeChartMainInfo from './components/SizeChartMainInfo'
import { initialData } from './const'
import { hasAnyData, isValidateParemeters, prepareUpdateData } from './helpers/SizeChartHelper'
import { getAllCategories } from './helpers/SizeChartHelper'
import { useSizeChartData } from './hooks/useSizeChartData'
import { useSizeParameters } from './hooks/useSizeParameters'
import SizeChartModal from './size-charts-modal/SizeChartModal'
import './SizeChart.scss'

const SizeChart = () => {
  const editModal = useModal()
  const addSizeModal = useModal()

  const [createSizeChart] = useCreateSizeChartMutation()
  const { data: categoriesTreeData } = useGetCategoriesTreeQuery()
  const [createNewParameter] = useCreateSizeParameterBySizeChartIdMutation()
  const [deleteSizeParameter] = useDeleteSizeParameterByIdMutation()
  const [updateSizeChart] = useUpdateSizeChartByIdMutation()

  const [formSizeChart, setFormSizeChart] = useState<SizeChartRequest>(initialData)

  const [selectedSizeToAdd, setSelectedSizeToAdd] = useState<string | null>(null)
  const [changedRows, setChangedRows] = useState<Record<string, boolean>>({})

  const { sizeChart, isFetching, refetch } = useSizeChartData(formSizeChart.categoryId || '')
  const [deleteSizeChartById] = useDeleteSizeChartByIdMutation()
  const [uploadImg, setUploadImg] = useState<imgUpload | null>(null)

  const mode = editModal.mode
  const isCreate = mode === MODES.CREATE
  const isEdit = mode === MODES.EDIT
  const imageUrl = formSizeChart.imageId ? `${CDN_URL}/${formSizeChart.imageId}` : null

  const dataParameters = sizeChart?.sizeParameters
  const sizeChartId = sizeChart?.id
  const {
    parameters,
    deleteIds,
    setParameters,
    addParameter,
    removeParameter,
    recalculateOrder,
    setDeleteIds,
  } = useSizeParameters(sizeChartId)

  useEffect(() => {
    if (sizeChart) {
      console.log('Данные с сервера - imageId:', sizeChart.imageId)
      setFormSizeChart(sizeChart)
      setParameters([...(sizeChart?.sizeParameters || [])])
    } else {
      setFormSizeChart(initialData)
      setParameters([])
    }
  }, [sizeChart])

  const allCategories = useMemo(() => {
    if (!categoriesTreeData?.data) return []
    return getAllCategories(categoriesTreeData.data)
  }, [categoriesTreeData])

  const handleCreateSizeChart = () => {
    if (!formSizeChart.categoryId) {
      alert('Выберете категорию!')
      return
    }
    setFormSizeChart({
      ...initialData,
      categoryId: formSizeChart.categoryId,
      imageId: sizeChart?.imageId || '' || null,
    })
    editModal.setMode(MODES.CREATE)
    editModal.onOpen()
  }
  const createNewSizeChart = async (data: SizeChartRequest) => {
    try {
      const result = await createSizeChart(data).unwrap()
      console.log('✅ Таблица размеров создана, обновляем данные...')
      refetch()
      setFormSizeChart({
        ...data,
        categoryId: formSizeChart.categoryId,
        imageId: formSizeChart.imageId || uploadImg?.fileId || null,
      })
      return result
    } catch (error) {
      console.log('Ошибка создания таблицы категории!', error)
      throw error
    }
  }

  const createNewSizeParameter = async () => {
    if (!selectedSizeToAdd) {
      alert('Выберите размер для добавления!')
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
      const result = await createNewParameter({
        data: newSize,
        sizeChartId: sizeChartId,
      }).unwrap()
      addParameter(result.data)
      recalculateOrder()
      setSelectedSizeToAdd(null)
      console.log('Создала новый размер!')
    } catch (error) {
      console.log('Ошибка создания параметра таблицы!', error)
    }
  }

  const deleteSizeChart = async (id: string | undefined) => {
    const isConfirmed = confirm('Удалить таблицу с размерами?')
    if (!isConfirmed) return
    try {
      if (id) await deleteSizeChartById(id).unwrap()
      setFormSizeChart({
        ...initialData,
        categoryId: formSizeChart.categoryId,
      })
      setParameters([])
      setSelectedSizeToAdd(null)
      console.log('Удаление прошло успешно!')
    } catch (error) {
      console.log('Ошибка удаления таблицы!', error)
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

  const clearChanges = () => {
    setChangedRows({})
  }

  const onSaveAllChanges = async (data: Partial<SizeChartRequest>) => {
    if (!sizeChartId) {
      alert('Нет таблицы для сохранения')
      return
    }
    const hasData = hasAnyData(parameters, formSizeChart)
    if (!hasData) {
      alert('Нет данных для сохранения')
      return
    }
    const hasInvalid = isValidateParemeters(parameters)
    if (hasInvalid) {
      alert('Есть некорректные значения! Проверьте длину (20-150 см) и обхват груди (40-200 см)')
      return
    }

    try {
      for (const id of deleteIds) {
        try {
          await deleteSizeParameter(id).unwrap()
          console.log(`Удалён размер с id: ${id}`)
        } catch (error) {
          console.error(`Ошибка удаления размера ${id}:`, error)
        }
      }

      await updateSizeChart({
        id: sizeChartId,
        data: prepareUpdateData(data, parameters),
      }).unwrap()

      alert('✅ Изменения сохранены!')
      clearChanges()
      setDeleteIds([])
    } catch (error) {
      console.log('Ошибка соханения изменений в таблице...')
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

  const handleCancel = () => {
    setFormSizeChart(prev => ({
      ...prev,
      name: sizeChart?.name || '',
      description: sizeChart?.description || '',
      metricsText: sizeChart?.metricsText || '',
      productType: sizeChart?.productType || '',
      imageId: sizeChart?.imageId || null,
    }))
    setParameters(sizeChart?.sizeParameters || [])
    setChangedRows({})
    setSelectedSizeToAdd(null)
  }

  return (
    <div className="size-chart-wrapper">
      <div className="size-chart-container-in-wrapper">
        <h1 className="size-chart-title"> Управление таблицами размеров</h1>
        <ChoosingCategory
          formSizeChart={formSizeChart}
          allCategories={allCategories}
          setFormSizeChart={setFormSizeChart}
          setEditParameter={setParameters}
          setSelectedSizeToAdd={setSelectedSizeToAdd}
        />
        {!formSizeChart.id && !formSizeChart.categoryId && <SizeChartEmpty />}

        {formSizeChart.categoryId && (
          <div className="size-chart-table-container">
            {isFetching && !sizeChart?.id && (
              <div className="spin-centered-size">
                <Spin size="large" />
              </div>
            )}
            {!isFetching && sizeChart?.id && (
              <>
                <SizeChartMainInfo
                  isEdit={isEdit}
                  formSizeChart={formSizeChart}
                  imageUrl={imageUrl}
                  handleSizeChartChange={handleSizeChartChange}
                  onSaveAllChanges={onSaveAllChanges}
                  deleteSizeChart={deleteSizeChart}
                  setFormSizeChart={setFormSizeChart}
                  setUploadImg={setUploadImg}
                />

                <div className="size-charts-parameters">
                  <SizeParameters
                    isOpen={addSizeModal.isOpen}
                    dataParameters={dataParameters}
                    editParameter={parameters}
                    selectedSizeToAdd={selectedSizeToAdd}
                    changedRows={changedRows}
                    onOpen={addSizeModal.onOpen}
                    onClose={addSizeModal.onClose}
                    setChangedRows={setChangedRows}
                    setSelectedSizeToAdd={setSelectedSizeToAdd}
                    setEditParameter={setParameters}
                    deleteSize={deleteSize}
                    createNewSizeParameter={createNewSizeParameter}
                  />
                </div>
                <SizeChartButtons
                  formSizeChart={formSizeChart}
                  handleCancel={handleCancel}
                  onSaveAllChanges={onSaveAllChanges}
                />
              </>
            )}
            {!isFetching && !sizeChart?.id && (
              <SizeChartCreate handleCreateSizeChart={handleCreateSizeChart} />
            )}
          </div>
        )}
        <SizeChartModal
          isCreated={isCreate}
          isEdit={isEdit}
          uploadImg={uploadImg}
          isOpen={editModal.isOpen}
          formSizeChart={formSizeChart}
          imageUrl={imageUrl}
          onClose={editModal.onClose}
          setUploadImg={setUploadImg}
          setFormSizeChart={setFormSizeChart}
          saveAllChanges={onSaveAllChanges}
          setModes={editModal.setMode}
          createNewSizeChart={createNewSizeChart}
        />
      </div>
    </div>
  )
}

export default SizeChart
