import { useEffect, useMemo, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import { useGetSizeChartByCategoryIdQuery } from '@/shared/lib/api/size-charts/SizeCharts'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { SizeParameter } from '@/shared/lib/api/size-parameters/type'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { useModal } from '@/shared/lib/hooks/useModal'
import { useSizeChartActions } from '@/shared/lib/hooks/useSizeChartActions'
import { useSizeParameterAction } from '@/shared/lib/hooks/useSizeParameterAction'
import { Spin } from 'antd'
import { useSearchParams } from 'react-router-dom'

import { CDN_URL } from '@/app/constans/url'

import { MODES } from '../categories/const/constans'
import { ALL_RU_SIZES, DEFAULT_MEASUREMENTS } from '../size-parameters/constans/const'
import SizeParameters from '../size-parameters/SizeParameters'
import ChoosingCategory from './components/ChoosingCategory'
import SizeChartButtons from './components/SizeChartButtons'
import SizeChartCreate from './components/SizeChartCreate'
import SizeChartEmpty from './components/SizeChartEmpty'
import SizeChartMainInfo from './components/SizeChartMainInfo'
import { initialData } from './constans/const'
import {
  hasAnyData,
  isValidateParemeters,
  prepareResetData,
  prepareUpdateData,
} from './helpers/SizeChartHelper'
import { getAllCategories } from './helpers/SizeChartHelper'
import { useSizeParameters } from './hooks/useSizeParameters'
import SizeChartModal from './size-charts-modal/SizeChartModal'
import './SizeChart.scss'

const SizeChart = () => {
  const editModal = useModal()
  const addSizeModal = useModal()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryIdFromUrl = searchParams.get('categoryId')
  const [formSizeChart, setFormSizeChart] = useState<SizeChartRequest>(() => ({
    ...initialData,
    categoryId: categoryIdFromUrl || '',
  }))
  const [selectedSizeToAdd, setSelectedSizeToAdd] = useState<string | null>(null)
  const [changedRows, setChangedRows] = useState<Record<string, boolean>>({})
  const [uploadImg, setUploadImg] = useState<imgUpload | null>(null)

  const { data: categoriesTreeData } = useGetCategoriesTreeQuery()
  const { createNewSizeChart, updateSizeChartData, deleteSizeChartData } = useSizeChartActions()
  const { createParameter, deleteParameter } = useSizeParameterAction()

  const {
    data: sizeChartResponse,
    isFetching,
    refetch,
  } = useGetSizeChartByCategoryIdQuery(formSizeChart.categoryId || '', {
    skip: !formSizeChart.categoryId,
  })

  const sizeChart =
    sizeChartResponse?.data?.categoryId === formSizeChart.categoryId
      ? sizeChartResponse?.data
      : null
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

  const mode = editModal.mode
  const isCreate = mode === MODES.CREATE
  const isEdit = mode === MODES.EDIT
  const imageUrl = formSizeChart.imageId ? `${CDN_URL}/${formSizeChart.imageId}` : null
  const dataParameters = sizeChart?.sizeParameters

  useEffect(() => {
    if (formSizeChart.categoryId) {
      setSearchParams({ categoryId: formSizeChart.categoryId })
    } else {
      setSearchParams({})
    }
  }, [formSizeChart.categoryId, setParameters])

  useEffect(() => {
    if (sizeChart?.id) {
      console.log('Данные с сервера - imageId:', sizeChart.imageId)
      setFormSizeChart(sizeChart)
      setParameters([...(sizeChart?.sizeParameters || [])])
    } else {
      setFormSizeChart(prev => ({
        ...initialData,
        categoryId: prev.categoryId,
        id: undefined,
      }))
      setParameters([])
    }
  }, [sizeChart?.id, setParameters])

  const allCategories = useMemo(() => {
    if (!categoriesTreeData?.data) return []
    return getAllCategories(categoriesTreeData.data)
  }, [categoriesTreeData])

  const handleCreateSizeChart = () => {
    if (!formSizeChart.categoryId) {
      alert('Выберете категорию!')
      return
    }
    setUploadImg(null)
    setFormSizeChart({
      ...initialData,
      categoryId: formSizeChart.categoryId,
      imageId: sizeChart?.imageId || '' || null,
    })
    editModal.setMode(MODES.CREATE)
    editModal.onOpen()
  }

  const handleCreateSizeChartSubmit = async (data: SizeChartRequest) => {
    try {
      const result = await createNewSizeChart(data)
      await refetch()
      setFormSizeChart(result.data)
      editModal.onClose()
      alert('✅ Таблица размеров создана!')
    } catch (error) {
      alert('Ошибка создания таблицы размеров')
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
      const result = await createParameter(sizeChartId, newSize)
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
      if (id) await deleteSizeChartData(id)
      setFormSizeChart({
        ...initialData,
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
          await deleteParameter(id)
          console.log(`Удалён размер с id: ${id}`)
        } catch (error) {
          console.error(`Ошибка удаления размера ${id}:`, error)
        }
      }

      await updateSizeChartData(sizeChartId, prepareUpdateData(data, parameters))
      await refetch()
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
    if (sizeChart) {
      setFormSizeChart(prev => ({
        ...prev,
        ...prepareResetData(sizeChart),
      }))
    }
    setParameters(sizeChart?.sizeParameters || [])
    setChangedRows({})
    setSelectedSizeToAdd(null)
  }

  return (
    <div className="size-chart-wrapper">
      <div className="size-chart-container-in-wrapper">
        <div className="size-chart-header">
          <h1 className="size-chart-title"> Управление таблицами размеров</h1>
        </div>
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
                  sizeChart={sizeChart}
                  formSizeChart={formSizeChart}
                  imageUrl={imageUrl}
                  handleSizeChartChange={handleSizeChartChange}
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
          createNewSizeChart={handleCreateSizeChartSubmit}
        />
      </div>
    </div>
  )
}

export default SizeChart
