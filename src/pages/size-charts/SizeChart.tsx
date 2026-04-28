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

import { CDN_URL } from '@/app/constans/url'

import { MODES } from '../categories/const/constans'
import { ALL_RU_SIZES, DEFAULT_MEASUREMENTS } from '../size-parameters/const'
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
      setFormSizeChart({
        categoryId: currentData.data.categoryId,
        name: currentData.data.name || '',
        description: currentData.data.description || '',
        imageId: currentData.data.imageId || '',
        productType: currentData.data.productType || '',
        metricsText: currentData.data.metricsText || 'A - длина\nB - грудь',
        sizeParameters: currentData.data.sizeParameters || [],
      })

      if (currentData.data.sizeParameters) {
        setEditParameter([...currentData.data.sizeParameters])
      }
    }
  }, [currentData])

  const handleEdit = () => {
    if (formSizeChart) {
      editModal.setMode(MODES.EDIT)
      editModal.onOpen(formSizeChart)
    }
  }
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
      refetch()
      setSelectedSizeToAdd(null)
      console.log('Создала новый размер!')
    } catch (error) {
      console.log('Ошибка создания параметра таблицы!', error)
    }
  }

  const deleteSize = async (index: number) => {
    const sizeToDelete = editParameter[index]
    const isConfirmed = confirm(`Удалить размер "${sizeToDelete.internationalSize}"?`)
    if (!isConfirmed) return

    try {
      if (sizeToDelete.id) await deleteSizeParameter(sizeToDelete.id).unwrap()

      const newParameters = editParameter.filter((_, i) => {
        return i !== index
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
      refetch()
    } catch (error) {
      console.log('Ошибка соханения изменений в таблице...')
    }
  }

  return (
    <div className="size-chart-wrapper">
      <span className="size-chart-title"> Управление размерами</span>
      <Select
        className="size-chart-select"
        value={formSizeChart.categoryId || undefined}
        placeholder="Выберете категорию"
        onChange={value => {
          setFormSizeChart({
            categoryId: value,
            name: '',
            description: '',
            imageId: '',
            productType: '',
            metricsText: 'A - длина\nB - грудь',
            sizeParameters: [],
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
          {' '}
          Выбрано: {allCategories.find(cat => cat.id === formSizeChart.categoryId)?.name}
        </span>
      )}

      {formSizeChart.categoryId && (
        <div className="size-chart-table-container">
          {isFetching && <span> Загружаю таблицу! Ждите...</span>}
          {!isFetching && currentData?.data?.id && (
            <>
              <span className="size-charts-parameters-title">Информация о таблице размеров</span>
              <div className="size-charts-parameters">
                <div className="btn-and-size-chart">
                  <div className="size-chart">
                    <span> Название: {currentData.data.name}</span>
                    <span>Описание: {currentData.data.description}</span>
                    <span>Замеры: {currentData.data.metricsText}</span>
                    {imageUrl && <img src={imageUrl} alt="Size-chart preview" />}
                  </div>
                  <Button onClick={handleEdit}>
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
            <div>
              <span>У данной категории еще нет таблицы размеров...</span>
              <Button type="default" className="size-chart-btn" onClick={handleCreateSizeChart}>
                Создать
              </Button>
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
        setUploadImg={setUploadImg}
        setFormSizeChart={setFormSizeChart}
        onClose={editModal.onClose}
        saveAllChanges={onSaveAllChanges}
        setModes={editModal.setMode}
        createNewSizeChart={createNewSizeChart}
      />
    </div>
  )
}

export default SizeChart
