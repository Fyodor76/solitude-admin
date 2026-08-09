import { isFulfilled, isRejectedWithValue } from '@reduxjs/toolkit'
import type { Middleware, UnknownAction } from '@reduxjs/toolkit'

import { addNotification, clearNotifications } from '../slices/notificationsSlice'

const ignoredEndpoints = new Set(['refresh', 'getSizeChartByCategoryId'])

const includeEndpoints = new Set(['updateCategoryById', 'deleteCategory', 'createCategory'])

interface ValueError {
  id: string
  code: string
  titles: string[]
  params: Record<string, unknown>
}

type RtkQueryRejectedAction = UnknownAction & {
  payload: {
    error: Record<string, ValueError>
  }
  meta: {
    arg: {
      endpointName: string
    }
  }
}

type RtkQueryFulfilledAction = UnknownAction & {
  payload: {
    message: string
  }
  meta: {
    arg: {
      endpointName: string
    }
  }
}

const isRtkQueryRejectedAction = (action: unknown): action is RtkQueryRejectedAction =>
  isRejectedWithValue(action) &&
  typeof (action as RtkQueryRejectedAction).meta?.arg?.endpointName === 'string'

const isRtkQueryFulfilledAction = (action: unknown): action is RtkQueryFulfilledAction =>
  isFulfilled(action) &&
  typeof (action as RtkQueryFulfilledAction).meta?.arg?.endpointName === 'string' &&
  typeof (action as RtkQueryFulfilledAction).payload?.message === 'string'

export const rtkQueryErrorMiddleware: Middleware =
  ({ dispatch }) =>
  next =>
  action => {
    if (isRtkQueryRejectedAction(action)) {
      const endpointName = action.meta.arg.endpointName

      if (ignoredEndpoints.has(endpointName)) {
        return next(action)
      }

      const errorPayload = action.payload?.error
      if (!errorPayload || typeof errorPayload !== 'object') {
        return next(action)
      }

      const messagesWithErrors = Object.values(errorPayload).map<string[]>(err => err.titles)

      dispatch(clearNotifications())

      messagesWithErrors.forEach(messageError =>
        dispatch(
          addNotification({
            type: 'error',
            messages: messageError,
            duration: 5,
          })
        )
      )
    }

    if (isRtkQueryFulfilledAction(action)) {
      const endpointName = action.meta.arg.endpointName

      if (!includeEndpoints.has(endpointName)) {
        return next(action)
      }

      dispatch(
        addNotification({
          type: 'success',
          messages: [action.payload.message],
          duration: 3,
        })
      )
    }

    return next(action)
  }
