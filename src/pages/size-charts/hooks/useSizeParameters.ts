import { useCallback, useState } from 'react'

import { EditableSizeParameter } from '@/shared/lib/api/size-parameters/type'

export const useSizeParameters = (sizeChartId?: string) => {
  const [parameters, setParameters] = useState<EditableSizeParameter[]>([])
  const [deleteIds, setDeleteIds] = useState<string[]>([])

  const addParameter = useCallback((newParameter: EditableSizeParameter) => {
    setParameters(prev => [...prev, newParameter])
  }, [])
  const removeParameter = useCallback((id: string) => {
    setDeleteIds(prev => [...prev, id])
    setParameters(prev => prev.filter(p => p.id !== id))
  }, [])

  const recalculateOrder = useCallback(() => {
    setParameters(prev =>
      prev.map((parameter, index) => ({
        ...parameter,
        order: index + 1,
      }))
    )
  }, [])

  const clearParameters = useCallback(() => {
    setParameters([])
    setDeleteIds([])
  }, [])

  return {
    parameters,
    deleteIds,
    setDeleteIds,
    setParameters,
    addParameter,
    removeParameter,
    recalculateOrder,
    clearParameters,
  }
}
