import { useEffect, useMemo, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import { useGetAllProductAttributesQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  useCreateProductMutation,
  useCreateStockBulkMutation,
} from '@/shared/lib/api/products/Products'
import { useGetSizeChartByCategoryIdQuery } from '@/shared/lib/api/size-charts/SizeCharts'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Alert, Button, Space, Steps } from 'antd'
import { useNavigate } from 'react-router-dom'

import { StepAttributes } from './components/StepAttributes'
import { StepProductBasics } from './components/StepProductBasics'
import { StepStock } from './components/StepStock'
import { StepVariations } from './components/StepVariations'
import { STEP_LABELS } from './constants'
import { useProductCreateWizard } from './hooks/useProductCreateWizard'
import './ProductCreate.scss'
import { WizardStep } from './types'

export default function ProductCreatePage() {
  const navigate = useNavigate()
  const { openNotification, contextHolder } = useNotificationHandler()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data: categoriesResponse } = useGetCategoriesTreeQuery()
  const { data: attributesResponse } = useGetAllProductAttributesQuery()

  const attributes = attributesResponse?.data || []
  const colorAttributes = useMemo(
    () => attributes.filter(item => item.type === 'color'),
    [attributes]
  )

  const wizard = useProductCreateWizard(colorAttributes)

  const {
    data: sizeChartResponse,
    isFetching: isSizeChartLoading,
    isError: isSizeChartMissing,
  } = useGetSizeChartByCategoryIdQuery(wizard.state.basics.categoryId, {
    skip: !wizard.state.basics.categoryId,
  })

  const sizeChart = sizeChartResponse?.data
  const sizeParameters = sizeChart?.sizeParameters || []

  const sizeCodeById = useMemo(() => {
    const map: Record<string, string> = {}
    for (const size of sizeParameters) {
      if (!size.id) continue
      map[size.id] = size.internationalSize || size.russianSize || 'SIZE'
    }
    return map
  }, [sizeParameters])

  useEffect(() => {
    wizard.setSizeCodeById(sizeCodeById)
  }, [sizeCodeById, wizard.setSizeCodeById])

  const [createProduct, { isLoading: isCreatingProduct }] = useCreateProductMutation()
  const [createStockBulk, { isLoading: isCreatingStock }] = useCreateStockBulkMutation()

  const isSubmitting = isCreatingProduct || isCreatingStock

  const handleSubmit = async () => {
    setSubmitError(null)

    if (!wizard.canEnterStep(3)) {
      openNotification('error', ['Заполните предыдущие шаги'])
      return
    }

    try {
      const payload = wizard.buildCreatePayload()
      const created = await createProduct(payload).unwrap()
      const product = created.data

      const variationIdBySlug = new Map(
        (product.variations || []).map(item => [item.slug, item.id] as const)
      )

      const stockItems = wizard.state.stockRows
        .map(row => {
          const draft = wizard.state.variations.find(item => item.key === row.variationKey)
          if (!draft) return null
          const variationId = variationIdBySlug.get(draft.slug)
          if (!variationId) return null

          return {
            productId: product.id,
            variationId,
            sizeId: row.sizeId,
            sku: row.sku || undefined,
            quantity: Number(row.quantity) || 0,
          }
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))

      if (stockItems.length) {
        await createStockBulk({ items: stockItems }).unwrap()
      }

      wizard.clearDraft()
      openNotification('success', [
        `Товар «${product.name}» создан`,
        stockItems.length ? `Сток: ${stockItems.length} позиций` : 'Сток не создан (нет размеров)',
      ])
      navigate('/products')
    } catch (error: any) {
      const message =
        error?.data?.error || error?.error || error?.message || 'Не удалось создать товар'
      const text = Array.isArray(message) ? message.join(', ') : String(message)
      setSubmitError(text)
      openNotification('error', [text])
    }
  }

  const stepItems = ([0, 1, 2, 3] as WizardStep[]).map(step => ({
    title: STEP_LABELS[step],
    disabled: !(step <= wizard.state.maxReachedStep || wizard.canEnterStep(step)),
  }))

  return (
    <Container>
      {contextHolder}
      <div className="product-create">
        <PageHeader
          title="Создание товара"
          subtitle={
            wizard.hasDraft
              ? 'Черновик сохраняется автоматически и восстановится после перезагрузки'
              : 'Заполните шаги — прогресс сохранится как черновик'
          }
          actions={
            wizard.hasDraft ? (
              <Button
                danger
                onClick={() => {
                  wizard.clearDraft()
                  openNotification('info', ['Черновик очищен'])
                }}
              >
                Сбросить черновик
              </Button>
            ) : undefined
          }
        />

        <Steps
          current={wizard.state.step}
          items={stepItems}
          onChange={value => wizard.goToStep(value as WizardStep)}
          className="product-create__steps"
        />

        <div className="product-create__body">
          {wizard.state.step === 0 && (
            <StepProductBasics
              value={wizard.state.basics}
              categories={categoriesResponse?.data || []}
              onChange={wizard.updateBasics}
            />
          )}

          {wizard.state.step === 1 && (
            <StepVariations
              variations={wizard.state.variations}
              colorOptions={wizard.colorOptions}
              onAdd={wizard.addVariation}
              onChange={wizard.updateVariation}
              onRemove={wizard.removeVariation}
            />
          )}

          {wizard.state.step === 2 && (
            <StepAttributes
              attributes={attributes}
              sizeParameters={sizeParameters}
              sizeChartName={sizeChart?.name}
              sizeChartMissing={Boolean(wizard.state.basics.categoryId) && isSizeChartMissing}
              selections={wizard.state.attributeSelections}
              selectedSizeIds={wizard.state.selectedSizeIds}
              onAddAttribute={wizard.addAttributeSelection}
              onAttributeChange={wizard.setAttributeSelection}
              onRemoveAttribute={wizard.removeAttributeSelection}
              onSizesChange={wizard.setSelectedSizeIds}
            />
          )}

          {wizard.state.step === 3 && (
            <StepStock
              rows={wizard.state.stockRows}
              variations={wizard.state.variations}
              sizeParameters={sizeParameters}
              onChange={wizard.updateStockRow}
            />
          )}
        </div>

        {isSizeChartLoading && wizard.state.step === 2 ? (
          <Alert type="info" showIcon message="Загружаем размерную сетку категории..." />
        ) : null}

        {submitError ? <Alert type="error" showIcon message={submitError} /> : null}

        <div className="product-create__footer">
          <Space>
            <Button disabled={wizard.state.step === 0 || isSubmitting} onClick={wizard.prevStep}>
              Назад
            </Button>
            {wizard.state.step < 3 ? (
              <Button
                type="primary"
                disabled={!wizard.canEnterStep((wizard.state.step + 1) as WizardStep)}
                onClick={wizard.nextStep}
              >
                Далее
              </Button>
            ) : (
              <Button type="primary" loading={isSubmitting} onClick={handleSubmit}>
                Создать товар
              </Button>
            )}
          </Space>
        </div>
      </div>
    </Container>
  )
}
