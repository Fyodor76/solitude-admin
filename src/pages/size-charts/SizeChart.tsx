import { useEffect, useMemo, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import { useGetSizeChartByCategoryIdQuery } from '@/shared/lib/api/size-charts/SizeCharts'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { useModal } from '@/shared/lib/hooks/useModal'
import { useSizeChartActions } from '@/shared/lib/hooks/useSizeChartActions'
import { useSizeParameterActions } from '@/shared/lib/hooks/useSizeParameterActions'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Spin } from 'antd'
import { useSearchParams } from 'react-router-dom'

import { CDN_URL } from '@/app/constans/url'

import { MODES } from '../categories/const/constans'
import ChoosingCategory from './components/ChoosingCategory'
import SizeChartButtons from './components/SizeChartButtons'
import SizeChartCreate from './components/SizeChartCreate'
import SizeChartEmpty from './components/SizeChartEmpty'
import SizeChartMainInfo from './components/SizeChartMainInfo'
import { INITIAL_DATA } from './constans/const'
import { getAllCategories } from './helpers/SizeChartHelper'
import { useHandleSizeCharts } from './hooks/useHandleSizeCharts'
import { useSizeParameters } from './hooks/useSizeParameters'
import SizeChartModal from './size-charts-modal/SizeChartModal'
import SizeParameters from './size-parameters/SizeParameters'
import './SizeChart.scss'

const SizeChart = () => {
  const editModal = useModal()
  const addSizeModal = useModal()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryIdFromUrl = searchParams.get('categoryId')
  const [formSizeChart, setFormSizeChart] = useState<SizeChartRequest>(() => ({
    ...INITIAL_DATA,
    categoryId: categoryIdFromUrl || '',
  }))
  const [selectedSizeToAdd, setSelectedSizeToAdd] = useState<string | null>(null)
  const [changedRows, setChangedRows] = useState<Record<string, boolean>>({})
  const [uploadImg, setUploadImg] = useState<imgUpload | null>(null)

  const { data: categoriesTreeData } = useGetCategoriesTreeQuery()
  const { createNewSizeChart, updateSizeChartData, deleteSizeChartData } = useSizeChartActions()
  const { createParameter, deleteParameter } = useSizeParameterActions()

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

  const {
    handleCreateSizeChart,
    onSaveAllChanges,
    deleteSizeChart,
    handleCancel,
    handleSizeChartChange,
    handleCreateSizeChartSubmit,
    deleteSize,
    createNewSizeParameter,
  } = useHandleSizeCharts({
    formSizeChart,
    parameters,
    deleteIds,
    sizeChartId,
    editModal,
    sizeChart,
    selectedSizeToAdd,
    addParameter,
    createParameter,
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
    createNewSizeChart,
    removeParameter,
    recalculateOrder,
  })
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
      setFormSizeChart(sizeChart)
      setParameters([...(sizeChart?.sizeParameters || [])])
    } else {
      setFormSizeChart(prev => ({
        ...INITIAL_DATA,
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

  return (
    <div className="size-chart-wrapper">
      <Container className="size-chart-page admin-page">
        <PageHeader title="Управление таблицами размеров" />
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
            {!isFetching && formSizeChart?.id && (
              <>
                <SizeChartMainInfo
                  isEdit={isEdit}
                  sizeChart={formSizeChart}
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
            {!isFetching && !formSizeChart?.id && (
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
      </Container>
    </div>
  )
}

export default SizeChart
