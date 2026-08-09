import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'

import { INITIAL_BASICS } from '../constants'
import {
  clearProductCreateDraft,
  hasProductCreateDraftContent,
  loadProductCreateDraft,
  saveProductCreateDraft,
} from '../draftStorage'
import { buildSku, createDraftKey, slugify } from '../helpers'
import {
  DraftVariation,
  ProductBasicsForm,
  ProductCreateWizardState,
  StockDraftRow,
  WizardStep,
} from '../types'

function isBasicsValid(basics: ProductBasicsForm): boolean {
  return Boolean(
    basics.name.trim() &&
    basics.categoryId &&
    basics.brand.trim() &&
    basics.material.trim() &&
    basics.price !== null &&
    basics.price > 0
  )
}

function isVariationsValid(variations: DraftVariation[]): boolean {
  if (!variations.length) return false

  return variations.every(
    item =>
      item.name.trim() &&
      item.colorId &&
      item.slug.trim() &&
      item.sku.trim() &&
      item.price !== null &&
      item.price > 0
  )
}

export function useProductCreateWizard(colorAttributes: ProductAttributeResponse[]) {
  const sizeCodeByIdRef = useRef<Record<string, string>>({})
  const [state, setState] = useState<ProductCreateWizardState>(() => {
    return (
      loadProductCreateDraft() || {
        step: 0,
        maxReachedStep: 0,
        basics: { ...INITIAL_BASICS },
        variations: [],
        attributeSelections: [],
        selectedSizeIds: [],
        stockRows: [],
      }
    )
  })

  useEffect(() => {
    if (!hasProductCreateDraftContent(state)) {
      clearProductCreateDraft()
      return
    }
    saveProductCreateDraft(state)
  }, [state])

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasProductCreateDraftContent(state)) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [state])

  const setSizeCodeById = useCallback((sizeCodeById: Record<string, string>) => {
    sizeCodeByIdRef.current = sizeCodeById
  }, [])

  const colorOptions = useMemo(
    () =>
      colorAttributes.flatMap(attr =>
        (attr.values || [])
          .filter(value => value.isActive !== false)
          .map(value => ({
            label: value.displayName || value.value,
            value: value.id,
            attributeId: attr.id,
          }))
      ),
    [colorAttributes]
  )

  const canEnterStep = useCallback(
    (target: WizardStep): boolean => {
      if (target === 0) return true
      if (target === 1) return isBasicsValid(state.basics)
      if (target === 2) return isBasicsValid(state.basics) && isVariationsValid(state.variations)
      if (target === 3) {
        return isBasicsValid(state.basics) && isVariationsValid(state.variations)
      }
      return false
    },
    [state.basics, state.variations]
  )

  const goToStep = useCallback(
    (target: WizardStep) => {
      setState(prev => {
        const unlocked = target <= prev.maxReachedStep || canEnterStep(target)
        if (!unlocked) {
          return prev
        }

        return {
          ...prev,
          step: target,
          maxReachedStep: Math.max(prev.maxReachedStep, target) as WizardStep,
        }
      })
    },
    [canEnterStep]
  )

  const updateBasics = useCallback((patch: Partial<ProductBasicsForm>) => {
    setState(prev => {
      const nextBasics = { ...prev.basics, ...patch }
      if (patch.name !== undefined) {
        const previousAutoSlug = slugify(prev.basics.name)
        const slugIsAuto = !prev.basics.slug.trim() || prev.basics.slug === previousAutoSlug
        if (slugIsAuto) {
          nextBasics.slug = slugify(patch.name)
        }
      }
      return { ...prev, basics: nextBasics }
    })
  }, [])

  const addVariation = useCallback(() => {
    setState(prev => {
      const index = prev.variations.length + 1
      const baseName = prev.basics.name.trim() || 'variation'
      const baseSlug = prev.basics.slug.trim() || slugify(baseName) || 'item'
      const next: DraftVariation = {
        key: createDraftKey('var'),
        name: `${baseName} ${index}`,
        slug: `${baseSlug}-${index}`,
        sku: buildSku(baseSlug, String(index)),
        price: prev.basics.price,
        comparePrice: null,
        colorId: colorOptions[0]?.value || '',
        description: '',
        mainImage: null,
        images: [],
      }
      return { ...prev, variations: [...prev.variations, next] }
    })
  }, [colorOptions])

  const updateVariation = useCallback((key: string, patch: Partial<DraftVariation>) => {
    setState(prev => ({
      ...prev,
      variations: prev.variations.map(item => {
        if (item.key !== key) return item
        const next = { ...item, ...patch }
        if (patch.name !== undefined) {
          const previousAutoSlug = slugify(item.name)
          const slugIsAuto = !item.slug.trim() || item.slug === previousAutoSlug
          if (slugIsAuto) {
            next.slug = slugify(patch.name)
          }

          const previousAutoSku = buildSku(slugify(item.name))
          const skuIsAuto = !item.sku.trim() || item.sku === previousAutoSku
          if (skuIsAuto) {
            next.sku = buildSku(slugify(patch.name))
          }
        }
        return next
      }),
    }))
  }, [])

  const removeVariation = useCallback((key: string) => {
    setState(prev => ({
      ...prev,
      variations: prev.variations.filter(item => item.key !== key),
      stockRows: prev.stockRows.filter(row => row.variationKey !== key),
    }))
  }, [])

  const addAttributeSelection = useCallback((attributeId: string) => {
    setState(prev => {
      if (prev.attributeSelections.some(item => item.attributeId === attributeId)) {
        return prev
      }
      return {
        ...prev,
        attributeSelections: [...prev.attributeSelections, { attributeId, valueIds: [] }],
      }
    })
  }, [])

  const setAttributeSelection = useCallback((attributeId: string, valueIds: string[]) => {
    setState(prev => ({
      ...prev,
      attributeSelections: prev.attributeSelections.map(item =>
        item.attributeId === attributeId ? { ...item, valueIds } : item
      ),
    }))
  }, [])

  const removeAttributeSelection = useCallback((attributeId: string) => {
    setState(prev => ({
      ...prev,
      attributeSelections: prev.attributeSelections.filter(
        item => item.attributeId !== attributeId
      ),
    }))
  }, [])

  const setSelectedSizeIds = useCallback((sizeIds: string[]) => {
    setState(prev => ({ ...prev, selectedSizeIds: sizeIds }))
  }, [])

  const rebuildStockRows = useCallback(() => {
    setState(prev => {
      const nextRows: StockDraftRow[] = []

      for (const variation of prev.variations) {
        for (const sizeId of prev.selectedSizeIds) {
          const key = `${variation.key}:${sizeId}`
          const existing = prev.stockRows.find(row => row.key === key)
          const sizeCode = sizeCodeByIdRef.current[sizeId] || 'SIZE'
          nextRows.push({
            key,
            variationKey: variation.key,
            sizeId,
            quantity: existing?.quantity ?? 0,
            sku: buildSku(variation.sku, sizeCode),
          })
        }
      }

      return { ...prev, stockRows: nextRows }
    })
  }, [])

  useEffect(() => {
    if (state.step === 3) {
      rebuildStockRows()
    }
  }, [rebuildStockRows, state.selectedSizeIds, state.step, state.variations])

  const updateStockRow = useCallback((key: string, patch: Partial<StockDraftRow>) => {
    setState(prev => ({
      ...prev,
      stockRows: prev.stockRows.map(row => (row.key === key ? { ...row, ...patch } : row)),
    }))
  }, [])

  const nextStep = useCallback(() => {
    const next = Math.min(3, state.step + 1) as WizardStep
    if (canEnterStep(next)) {
      goToStep(next)
    }
  }, [canEnterStep, goToStep, state.step])

  const prevStep = useCallback(() => {
    goToStep(Math.max(0, state.step - 1) as WizardStep)
  }, [goToStep, state.step])

  const buildCreatePayload = useCallback(() => {
    const variations = state.variations.map(item => ({
      productId: '00000000-0000-0000-0000-000000000000',
      colorId: item.colorId,
      name: item.name.trim(),
      slug: item.slug.trim(),
      sku: item.sku.trim(),
      price: Number(item.price),
      comparePrice: item.comparePrice ?? undefined,
      description: item.description.trim() || undefined,
      mainImage: item.mainImage?.fileId,
      images: item.images.map(image => image.fileId),
      attributes: [],
    }))

    // Фото только у вариаций; на товар кладём превью первой для каталога/SEO.
    const firstVariationImages = variations[0]?.images ?? []
    const firstMain = variations[0]?.mainImage
    const productImages = firstVariationImages.length
      ? firstVariationImages
      : firstMain
        ? [firstMain]
        : []

    return {
      name: state.basics.name.trim(),
      slug: state.basics.slug.trim() || undefined,
      description: state.basics.description.trim() || undefined,
      price: Number(state.basics.price),
      images: productImages,
      categoryId: state.basics.categoryId,
      brand: state.basics.brand.trim(),
      material: state.basics.material.trim(),
      isActive: state.basics.isActive,
      isFeatured: state.basics.isFeatured,
      modelParameters: state.basics.modelParameters.trim() || undefined,
      attributes: state.attributeSelections
        .filter(item => item.valueIds.length > 0)
        .map(item => ({
          attributeId: item.attributeId,
          valueIds: item.valueIds,
        })),
      variations,
    }
  }, [state])

  const clearDraft = useCallback(() => {
    clearProductCreateDraft()
    setState({
      step: 0,
      maxReachedStep: 0,
      basics: { ...INITIAL_BASICS },
      variations: [],
      attributeSelections: [],
      selectedSizeIds: [],
      stockRows: [],
    })
  }, [])

  return {
    state,
    colorOptions,
    canEnterStep,
    goToStep,
    nextStep,
    prevStep,
    updateBasics,
    addVariation,
    updateVariation,
    removeVariation,
    addAttributeSelection,
    setAttributeSelection,
    removeAttributeSelection,
    setSelectedSizeIds,
    setSizeCodeById,
    updateStockRow,
    rebuildStockRows,
    buildCreatePayload,
    clearDraft,
    hasDraft: hasProductCreateDraftContent(state),
    isBasicsValid: isBasicsValid(state.basics),
    isVariationsValid: isVariationsValid(state.variations),
  }
}
