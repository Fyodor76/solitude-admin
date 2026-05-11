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
import { initialData } from './const'
import SizeChartModal from './size-charts-modal/SizeChartModal'
import './SizeChart.scss'

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
    setEditParameter(reOrderParameter(newParameters))
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
              placement="bottomLeft"
              showSearch={{
                filterOption: (input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
            >
              {allCategories &&
                allCategories.map(cat => (
                  <Select.Option key={cat.id} value={cat.id} label={cat.name}>
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
        {!formSizeChart.id && !formSizeChart.categoryId && (
          <>
            <div className="size-chart-select-empty-container">
              <h2 className="empty-table">Информация о таблице размеров</h2>
              <div className="information">
                <Icon className="information-icon" name="layoutOptions" color="#505253"></Icon>
                <h3 className="information-title">Категория не выбрана</h3>
                <span className="information-info">
                  Выберете категорию, чтобы увидеть информацию о таблице размеров
                </span>
              </div>
            </div>
            <div className="size-chart-select-empty-container">
              <h2 className="empty-table">Таблица размеров</h2>
              <div className="information">
                <Icon className="information-icon" name="tables" color="#505253"></Icon>
                <h3 className="information-title">Таблица размеров не отображается</h3>
                <span className="information-info">
                  Выберете категорию, чтобы посмотреть и редактировать таблицу размеров
                </span>
              </div>
            </div>{' '}
          </>
        )}

        {formSizeChart.categoryId && (
          <div className="size-chart-table-container">
            {isFetching && !currentData?.data?.id && (
              <div className="spin-centered-size">
                <Spin size="large" />
              </div>
            )}
            {!isFetching && currentData?.data?.id && (
              <>
                <div className="size-chart-select-empty-container">
                  <h2 className="empty-table">Информация о таблице размеров</h2>
                  <div className="main-info">
                    <div className="size-chart">
                      <span className="size-chart-title-text">Название</span>
                      <Input
                        className="size-chart-input"
                        value={formSizeChart.name}
                        onChange={e => handleSizeChartChange('name', e.target.value)}
                      ></Input>
                      <span className="size-chart-title-text">Замеры</span>
                      <Input
                        className="size-chart-input"
                        value={formSizeChart.metricsText}
                        onChange={e => handleSizeChartChange('metricsText', e.target.value)}
                      ></Input>
                      <span className="size-chart-title-text">Тип</span>
                      <Input
                        className="size-chart-input"
                        value={formSizeChart.productType}
                        onChange={e => handleSizeChartChange('productType', e.target.value)}
                      ></Input>
                    </div>
                    <div className="size-chart-description">
                      <span className="size-chart-title-text">Описание (необязательно)</span>
                      <TextArea
                        className="size-chart-input-description"
                        value={formSizeChart.description}
                        rows={10}
                        onChange={e => handleSizeChartChange('description', e.target.value)}
                      ></TextArea>
                    </div>
                    <div className="size-chart-img">
                      <span className="size-chart-title-text">
                        Изображение с инструкцией (необязательно)
                      </span>
                      <div className="size-chart-container-img">
                        <img
                          src={imageUrl || '/visily-image.png'}
                          alt="Size-chart preview"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            e.currentTarget.src = '/visily-image.png'
                          }}
                        />
                        <div className="image-edit-overlay">
                          <Icon
                            name="editing"
                            width="20px"
                            color="#505253"
                            onClick={() => {
                              const button = document.querySelector('.btn-upload-img-size')
                              ;(button as HTMLElement)?.click()
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'none' }}>
                        <BtnUploadImgForSizeChart
                          isEdit={isEdit}
                          formSizeChartCreate={formSizeChart}
                          setFormSizeChartCreate={setFormSizeChart}
                          setUploadImg={setUploadImg}
                        />
                      </div>

                      <div className="size-chart-text-container">
                        <span className="size-chart-title-text">
                          Рекомендуемый размер: 1200 x 800 px. Форматы: JPG,PNG, WEBP, до 5 МБ
                        </span>
                      </div>
                    </div>

                    <div className="size-chart-btn">
                      <Button
                        className="btn-save-size"
                        onClick={() => onSaveAllChanges(formSizeChart)}
                      >
                        <Icon name="save" width="24px" color="#414243"></Icon>
                      </Button>
                      <Button
                        onClick={() => deleteSizeChart(formSizeChart.id)}
                        className="btn-delete-size"
                      >
                        <Icon name="delete" width="24px" color="#505253"></Icon>
                      </Button>
                    </div>
                  </div>
                </div>

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
