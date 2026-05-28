import { useMemo, useState } from 'react'

import {
  useGetFormSubmissionsQuery,
  useMarkFormSubmissionProcessedMutation,
  useMarkFormSubmissionRejectedMutation,
} from '@/shared/lib/api/form-submissions/formSubmissionsApi'
import type {
  FormSubmissionDto,
  FormSubmissionStatus,
} from '@/shared/lib/api/form-submissions/types'
import { message } from 'antd'

import { CALLBACK_FORM_TYPE, FORM_SUBMISSION_STATUS_LABEL } from '../constants'

type StatusFilter = FormSubmissionStatus | 'all'

export type CallbackFormPendingAction = {
  id: string
  action: 'process' | 'reject'
}

export function useCallbackFormSubmissionsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [pendingAction, setPendingAction] = useState<CallbackFormPendingAction | null>(null)

  const { data, isLoading, isFetching, refetch } = useGetFormSubmissionsQuery()
  const [markProcessed] = useMarkFormSubmissionProcessedMutation()
  const [markRejected] = useMarkFormSubmissionRejectedMutation()

  const callbackSubmissions = useMemo(() => {
    const items = data?.data ?? []
    return items
      .filter(item => item.formType === CALLBACK_FORM_TYPE)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [data?.data])

  const filteredSubmissions = useMemo(() => {
    if (statusFilter === 'all') {
      return callbackSubmissions
    }
    return callbackSubmissions.filter(item => item.status === statusFilter)
  }, [callbackSubmissions, statusFilter])

  const statusCounts = useMemo(() => {
    return callbackSubmissions.reduce(
      (acc, item) => {
        acc[item.status] += 1
        return acc
      },
      { new: 0, processed: 0, rejected: 0 } as Record<FormSubmissionStatus, number>
    )
  }, [callbackSubmissions])

  const updateStatus = async (id: string, action: 'process' | 'reject'): Promise<void> => {
    setPendingAction({ id, action })
    try {
      if (action === 'process') {
        await markProcessed(id).unwrap()
        message.success('Заявка отмечена как обработанная')
      } else {
        await markRejected(id).unwrap()
        message.success('Заявка отклонена')
      }
    } catch {
      message.error('Не удалось обновить статус заявки')
    } finally {
      setPendingAction(null)
    }
  }

  const subtitle = `Всего заявок: ${callbackSubmissions.length}`

  const emptyDescription =
    statusFilter === 'all'
      ? 'Пока нет заявок с формы обратной связи'
      : `Нет заявок со статусом «${FORM_SUBMISSION_STATUS_LABEL[statusFilter]}»`

  return {
    totalCount: callbackSubmissions.length,
    submissions: filteredSubmissions as FormSubmissionDto[],
    isLoading,
    isFetching,
    statusFilter,
    setStatusFilter,
    statusCounts,
    subtitle,
    emptyDescription,
    pendingAction,
    updateStatus,
    refetch,
  }
}
