import { useEffect, useMemo, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import {
  useCreateSizeChartMutation,
  useDeleteSizeChartByIdMutation,
  useGetSizeChartByCategoryIdQuery,
  useUpdateSizeChartByIdMutation,
} from '@/shared/lib/api/size-charts/SizeCharts'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import {
  useCreateSizeParameterBySizeChartIdMutation,
  useDeleteSizeParameterByIdMutation,
} from '@/shared/lib/api/size-parameters/SizeParameters'
import { EditableSizeParameter, SizeParameter } from '@/shared/lib/api/size-parameters/type'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { useModal } from '@/shared/lib/hooks/useModal'
import Icon from '@/shared/ui/icons/Icon'
import { Button, Input, Modal, Select, Space, Spin } from 'antd'

import { CDN_URL } from '@/app/constans/url'

import { MODES } from '../categories/const/constans'
import {
  ALL_RU_SIZES,
  DEFAULT_MEASUREMENTS,
  MAX_CHEST,
  MAX_LENGTH,
  MIN_CHEST,
  MIN_LENGTH,
} from '../size-parameters/const'
import SizeParameters from '../size-parameters/SizeParameters'
import BtnUploadImgForSizeChart from './BtnUploadImgForSizeChart'
import ChoosingCategory from './ChoosingCategory'
import { initialData } from './const'
import { hasAnyData, isValidateParemeters, prepareUpdateData } from './helpers/SizeChartHelper'
import SizeChartModal from './size-charts-modal/SizeChartModal'
import './SizeChart.scss'
import SizeChartEmpty from './SizeChartEmpty'
import SizeChartMainInfo from './SizeChartMainInfo'

const SizeChart = () => {
  const editModal = useModal()
  const addSizeModal = useModal()
  const { TextArea } = Input

  const [createSizeChart] = useCreateSizeChartMutation()
  const { data: categoriesTreeData } = useGetCategoriesTreeQuery()
  const [createNewParameter] = useCreateSizeParameterBySizeChartIdMutation()
  const [deleteSizeParameter] = useDeleteSizeParameterByIdMutation()
  const [updateSizeChart] = useUpdateSizeChartByIdMutation()

  const [formSizeChart, setFormSizeChart] = useState<SizeChartRequest>(initialData)
  const [editParameter, setEditParameter] = useState<EditableSizeParameter[]>([])
  const [selectedSizeToAdd, setSelectedSizeToAdd] = useState<string | null>(null)
  const [changedRows, setChangedRows] = useState<Record<string, boolean>>({})
  const [deleteSizeIds, setDeleteSizeIds] = useState<string[]>([])
  const { isFetching, currentData, refetch } = useGetSizeChartByCategoryIdQuery(
    formSizeChart.categoryId || '',
    {
      skip: !formSizeChart.categoryId,
    }
  )
  const [deleteSizeChartById] = useDeleteSizeChartByIdMutation()
  const [uploadImg, setUploadImg] = useState<imgUpload | null>(null)

  const mode = editModal.mode
  const isCreate = mode === MODES.CREATE
  const isEdit = mode === MODES.EDIT
  const imageUrl = formSizeChart.imageId ? `${CDN_URL}/${formSizeChart.imageId}` : null

  const dataParameters = currentData?.data?.sizeParameters
  const sizeChartId = currentData?.data?.id

  useEffect(() => {
    if (currentData?.data) {
      console.log('Данные с сервера - imageId:', currentData.data.imageId)
      setFormSizeChart(currentData.data)
      setEditParameter([...(currentData?.data?.sizeParameters || [])])
    } else {
      setFormSizeChart(initialData)
      setEditParameter([])
    }
  }, [currentData])

  const getAllCategories = (categories: BaseCategoryTree[]): BaseCategoryTree[] => {
    let result: BaseCategoryTree[] = []
    for (const category of categories) {
      result.push(category)
      if (category.children?.length) {
        result = [...result, ...getAllCategories(category.children)]
      }
    }
    return result
  }
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
      imageId: currentData?.data.imageId || '' || null,
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

  const recalculateOrder = (parameters: EditableSizeParameter[]): EditableSizeParameter[] => {
    return parameters.map((parameter, index) => {
      return {
        ...parameter,
        order: index + 1,
      }
    })
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
      order: (editParameter?.length || 0) + 1,
    }
    try {
      const result = await createNewParameter({
        data: newSize,
        sizeChartId: sizeChartId,
      }).unwrap()
      const newParameters = [...editParameter, result.data]
      setEditParameter(recalculateOrder(newParameters))
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
      setEditParameter([])
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
    const sizeToDelete = editParameter.find(p => p.id === id)

    const isConfirmed = confirm(`Удалить размер "${sizeToDelete?.internationalSize}"?`)
    if (!isConfirmed) return

    setDeleteSizeIds(prev => [...prev, id])
    const newParameters = editParameter.filter(p => {
      return p.id !== id
    })
    setEditParameter(recalculateOrder(newParameters))
  }

  const clearChanges = () => {
    setChangedRows({})
  }

  const onSaveAllChanges = async (data: Partial<SizeChartRequest>) => {
    if (!sizeChartId) {
      alert('Нет таблицы для сохранения')
      return
    }
    const hasData = hasAnyData(editParameter, formSizeChart)
    if (!hasData) {
      alert('Нет данных для сохранения')
      return
    }
    const hasInvalid = isValidateParemeters(editParameter)
    if (hasInvalid) {
      alert('Есть некорректные значения! Проверьте длину (20-150 см) и обхват груди (40-200 см)')
      return
    }

    try {
      for (const id of deleteSizeIds) {
        try {
          await deleteSizeParameter(id).unwrap()
          console.log(`Удалён размер с id: ${id}`)
        } catch (error) {
          console.error(`Ошибка удаления размера ${id}:`, error)
        }
      }

      await updateSizeChart({
        id: sizeChartId,
        data: prepareUpdateData(data, editParameter),
      }).unwrap()

      alert('✅ Изменения сохранены!')
      clearChanges()
      setDeleteSizeIds([])
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
      name: currentData?.data?.name || '',
      description: currentData?.data?.description || '',
      metricsText: currentData?.data?.metricsText || '',
      productType: currentData?.data?.productType || '',
      imageId: currentData?.data?.imageId || null,
    }))
    setEditParameter(currentData?.data?.sizeParameters || [])
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
          setEditParameter={setEditParameter}
          setSelectedSizeToAdd={setSelectedSizeToAdd}
        />
        {!formSizeChart.id && !formSizeChart.categoryId && <SizeChartEmpty />}

        {formSizeChart.categoryId && (
          <div className="size-chart-table-container">
            {isFetching && !currentData?.data?.id && (
              <div className="spin-centered-size">
                <Spin size="large" />
              </div>
            )}
            {!isFetching && currentData?.data?.id && (
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
                  <div className="btn-and-size-chart"></div>
                  <SizeParameters
                    isOpen={addSizeModal.isOpen}
                    dataParameters={dataParameters}
                    editParameter={editParameter}
                    selectedSizeToAdd={selectedSizeToAdd}
                    changedRows={changedRows}
                    onOpen={addSizeModal.onOpen}
                    onClose={addSizeModal.onClose}
                    setChangedRows={setChangedRows}
                    setSelectedSizeToAdd={setSelectedSizeToAdd}
                    setEditParameter={setEditParameter}
                    deleteSize={deleteSize}
                    createNewSizeParameter={createNewSizeParameter}
                  />
                </div>
                <Space
                  className="saveAndCancelBtn"
                  style={{
                    marginTop: 16,
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button onClick={handleCancel} className="cancelBtn" type="link">
                    Отмена
                  </Button>
                  <Button
                    className="saveBtn"
                    onClick={() => onSaveAllChanges(formSizeChart)}
                    type="primary"
                  >
                    Сохранить изменения
                  </Button>
                </Space>
              </>
            )}
            {!isFetching && !currentData?.data?.id && (
              <div className="size-chart-select-empty-container">
                <h2 className="empty-table">Информация о таблице размеров</h2>
                <div className="information">
                  <h3 className="information-title">У данной категории ещё нет таблицы размеров</h3>
                  <span className="information-info">Создайте таблицу с размерами</span>
                  <Button
                    onClick={handleCreateSizeChart}
                    className="information-btn"
                    type="default"
                  >
                    Создать
                  </Button>
                </div>
              </div>
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
