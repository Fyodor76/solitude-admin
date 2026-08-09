import { useCallback, useEffect, useMemo, useState } from 'react'

import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'

import { INITIAL_BASICS } from '../constants'
import { createDraftKey, parseImagesText, slugify } from '../helpers'
import {
  AttributeSelection,
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
  const [state, setState] = useState<ProductCreateWizardState>({
    step: 0,
    maxReachedStep: 0,
    basics: INITIAL_BASICS,
    variations: [],
    attributeSelections: [],
    selectedSizeIds: [],
    stockRows: [],
  })

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
        return (
          isBasicsValid(state.basics) &&
          isVariationsValid(state.variations) &&
          state.selectedSizeIds.length > 0
        )
      }
      return false
    },
    [state.basics, state.selectedSizeIds.length, state.variations]
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
      if (patch.name !== undefined && !prev.basics.slug.trim()) {
        nextBasics.slug = slugify(patch.name)
      }
      return { ...prev, basics: nextBasics }
    })
  }, [])

  const addVariation = useCallback(() => {
    setState(prev => {
      const index = prev.variations.length + 1
      const baseName = prev.basics.name.trim() || 'variation'
      const next: DraftVariation = {
        key: createDraftKey('var'),
        name: `${baseName} ${index}`,
        slug: slugify(`${prev.basics.slug || baseName}-${index}`),
        sku: `${slugify(prev.basics.slug || baseName) || 'sku'}-${index}`.toUpperCase(),
        price: prev.basics.price,
        comparePrice: null,
        colorId: colorOptions[0]?.value || '',
        description: '',
        mainImage: '',
        imagesText: '',
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
        if (patch.name !== undefined && !item.slug.trim()) {
          next.slug = slugify(patch.name)
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

  const setAttributeSelection = useCallback((attributeId: string, valueIds: string[]) => {
    setState(prev => {
      const without = prev.attributeSelections.filter(item => item.attributeId !== attributeId)
      const nextSelections: AttributeSelection[] = valueIds.length
        ? [...without, { attributeId, valueIds }]
        : without
      return { ...prev, attributeSelections: nextSelections }
    })
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
          nextRows.push({
            key,
            variationKey: variation.key,
            sizeId,
            quantity: existing?.quantity ?? 0,
            sku:
              existing?.sku ||
              `${variation.sku}-${sizeId.slice(0, 4)}`.toUpperCase().replace(/[^A-Z0-9\-]/g, ''),
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
    const images = parseImagesText(state.basics.imagesText)

    return {
      name: state.basics.name.trim(),
      slug: state.basics.slug.trim() || undefined,
      description: state.basics.description.trim() || undefined,
      price: Number(state.basics.price),
      images,
      categoryId: state.basics.categoryId,
      brand: state.basics.brand.trim(),
      material: state.basics.material.trim(),
      isActive: state.basics.isActive,
      isFeatured: state.basics.isFeatured,
      modelParameters: state.basics.modelParameters.trim() || undefined,
      attributes: state.attributeSelections.map(item => ({
        attributeId: item.attributeId,
        valueIds: item.valueIds,
      })),
      variations: state.variations.map(item => ({
        productId: '00000000-0000-0000-0000-000000000000',
        colorId: item.colorId,
        name: item.name.trim(),
        slug: item.slug.trim(),
        sku: item.sku.trim(),
        price: Number(item.price),
        comparePrice: item.comparePrice ?? undefined,
        description: item.description.trim() || undefined,
        mainImage: item.mainImage.trim() || undefined,
        images: parseImagesText(item.imagesText),
      })),
    }
  }, [state])

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
    setAttributeSelection,
    setSelectedSizeIds,
    updateStockRow,
    rebuildStockRows,
    buildCreatePayload,
    isBasicsValid: isBasicsValid(state.basics),
    isVariationsValid: isVariationsValid(state.variations),
  }
}
