import { useEffect, useMemo, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import {
  useCreateSizeChartMutation,
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
import { Button, Select, Space } from 'antd'
import { span } from 'framer-motion/client'

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
import { initialData } from './const'
import './SizeChart.scss'
import SizeChartModal from './SizeChartModal'

const SizeChart = () => {
  const editModal = useModal()

  const [createSizeChart] = useCreateSizeChartMutation()
  const { data: categoriesTreeData } = useGetCategoriesTreeQuery()
  const [createNewParameter] = useCreateSizeParameterBySizeChartIdMutation()
  const [deleteSizeParameter] = useDeleteSizeParameterByIdMutation()
  const [updateSizeChart] = useUpdateSizeChartByIdMutation()

  const [formSizeChart, setFormSizeChart] = useState<SizeChartRequest>(initialData)
  const [editParameter, setEditParameter] = useState<EditableSizeParameter[]>([])
  const [selectedSizeToAdd, setSelectedSizeToAdd] = useState<string | null>(null)
  const [changedRows, setChangedRows] = useState<Record<string, boolean>>({})
  const { isFetching, currentData, refetch } = useGetSizeChartByCategoryIdQuery(
    formSizeChart.categoryId || '',
    {
      skip: !formSizeChart.categoryId,
    }
  )
  const [uploadImg, setUploadImg] = useState<imgUpload | null>(null)

  const mode = editModal.mode
  const isCreate = mode === MODES.CREATE
  const isEdit = mode === MODES.EDIT
  const imageUrl = isEdit && formSizeChart.imageId ? `${CDN_URL}/${formSizeChart.imageId}` : null

  const dataParameters = currentData?.data?.sizeParameters
  const sizeChartId = currentData?.data?.id

  useEffect(() => {
    if (currentData?.data) {
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

  const handleEditSizeChart = () => {
    if (formSizeChart) {
      editModal.setMode(MODES.EDIT)
      editModal.onOpen(formSizeChart)
    }
  }
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

  const reOrderParameter = (array: EditableSizeParameter[]): EditableSizeParameter[] => {
    const newArr = array.map((el, index) => {
      return {
        ...el,
        order: index + 1,
      }
    })
    return newArr
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
      setEditParameter(reOrderParameter(newParameters))
      setSelectedSizeToAdd(null)
      console.log('Создала новый размер!')
    } catch (error) {
      console.log('Ошибка создания параметра таблицы!', error)
    }
  }

  const deleteSize = async (id: string | undefined) => {
    const sizeToDelete = editParameter.find(p => p.id === id)
    const isConfirmed = confirm(`Удалить размер "${sizeToDelete?.internationalSize}"?`)
    if (!isConfirmed) return

    try {
      if (sizeToDelete?.id) await deleteSizeParameter(sizeToDelete.id).unwrap()

      const newParameters = editParameter.filter(p => {
        return p.id !== id && p.tempId !== id
      })
      setEditParameter(reOrderParameter(newParameters))
      refetch()
      console.log('Удаление прошло успешно!')
    } catch (error) {
      console.log('Ошибка удаления размера...', error)
    }
  }

  const clearChanges = () => {
    setChangedRows({})
  }

  const onSaveAllChanges = async (data: Partial<SizeChartRequest>) => {
    if (!sizeChartId) {
      console.error('Нет таблицы для сохранения')
      return
    }
    if (editParameter.length === 0) {
      alert('Нет данных для сохранения')
      return
    }
    const hasInvalid = editParameter.some(
      p =>
        p.lengthCm < MIN_LENGTH ||
        p.lengthCm > MAX_LENGTH ||
        p.chestCircumferenceCm < MIN_CHEST ||
        p.chestCircumferenceCm > MAX_CHEST
    )

    if (hasInvalid) {
      alert('Есть некорректные значения! Проверьте длину (20-150 см) и обхват груди (40-200 см)')
      return // Не сохраняем, если есть ошибки
    }
    try {
      await updateSizeChart({
        id: sizeChartId,
        data: {
          name: data.name,
          description: data.description,
          imageId: data.imageId,
          productType: data.productType,

          sizeParameters: editParameter.map(p => ({
            id: p.id,
            internationalSize: p.internationalSize,
            russianSize: p.russianSize,
            lengthCm: Number(p.lengthCm),
            chestCircumferenceCm: Number(p.chestCircumferenceCm),
            order: Number(p.order),
          })),
        },
      }).unwrap()
      alert('✅ Изменения сохранены!')
      clearChanges()
    } catch (error) {
      console.log('Ошибка соханения изменений в таблице...')
    }
  }

  return (
    <div className="size-chart-wrapper">
      <div className="size-chart-container-in-wrapper">
        <h1 className="size-chart-title"> Управление таблицами размеров</h1>
        <div className="size-chart-select-container">
          <span className="size-chart-select-container-title">Выберете категорию</span>
          <div className="change-category">
            <Select
              className="size-chart-select"
              value={formSizeChart.categoryId || undefined}
              placeholder="Выберете категорию"
              onChange={value => {
                setFormSizeChart({
                  ...initialData,
                  categoryId: value,
                })
                setEditParameter([])
                setSelectedSizeToAdd(null)
              }}
              allowClear
            >
              {allCategories &&
                allCategories.map(cat => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
            </Select>
            {formSizeChart.categoryId && (
              <span className="changeCategoryName">
                Выбрано:{' '}
                <span className="category-name-change">
                  {allCategories.find(cat => cat.id === formSizeChart.categoryId)?.name}
                </span>
              </span>
            )}
          </div>
          {!formSizeChart.categoryId && (
            <span className="size-chart-select-label">
              Выберете категорию, чтобы посмотреть или редактировать таблицу размеров
            </span>
          )}
        </div>
        {formSizeChart.categoryId && (
          <div className="size-chart-table-container">
            {isFetching && <span> Загружаю таблицу! Ждите...</span>}

            {!isFetching && currentData?.data?.id && (
              <>
                <span className="size-charts-parameters-title">Управление размерами</span>
                <div className="size-charts-parameters">
                  <div className="btn-and-size-chart">
                    <div className="size-chart">
                      <span> Название: {currentData.data.name}</span>
                      <span>Описание: {currentData.data.description}</span>
                      <span>Замеры: {currentData.data.metricsText}</span>
                      {imageUrl && <img src={imageUrl} alt="Size-chart preview" />}
                    </div>
                    <Button onClick={handleEditSizeChart}>
                      <Icon name="editing" width="18px"></Icon>
                    </Button>
                  </div>
                  <SizeParameters
                    dataParameters={dataParameters}
                    editParameter={editParameter}
                    selectedSizeToAdd={selectedSizeToAdd}
                    changedRows={changedRows}
                    setChangedRows={setChangedRows}
                    setSelectedSizeToAdd={setSelectedSizeToAdd}
                    setEditParameter={setEditParameter}
                    deleteSize={deleteSize}
                    createNewSizeParameter={createNewSizeParameter}
                  />
                  <Space style={{ marginTop: 16, marginBottom: 16 }}>
                    <Button onClick={() => onSaveAllChanges(currentData.data)} type="primary">
                      Сохранить изменения
                    </Button>
                  </Space>
                </div>
              </>
            )}

            {!isFetching && !currentData?.data.id && (
              <>
                <div className="size-chart-select-empty-container">
                  <h2 className="empty-table">Информация о таблице размеров</h2>
                  <div className="information">
                    <h3 className="information-title">Категория не выбрана</h3>
                    <span className="information-info">
                      Выберете категорию, чтобы увидеть информацию о таблице размеров
                    </span>
                  </div>
                </div>
                <div className="size-chart-select-empty-container">
                  <h2 className="empty-table">Таблица размеров</h2>
                  <div className="information">
                    <h3 className="information-title">Таблица размеров не отображается</h3>
                    <span className="information-info">
                      Выберете категорию, чтобы посмотреть и редактировать таблицу размеров
                    </span>
                  </div>
                </div>
              </>
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
          setUploadImg={setUploadImg}
          setFormSizeChart={setFormSizeChart}
          onClose={editModal.onClose}
          saveAllChanges={onSaveAllChanges}
          setModes={editModal.setMode}
          createNewSizeChart={createNewSizeChart}
        />
      </div>
    </div>
  )
}

export default SizeChart
