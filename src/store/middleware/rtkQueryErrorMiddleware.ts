import { isFulfilled, isRejectedWithValue } from '@reduxjs/toolkit'
import type { Middleware, UnknownAction } from '@reduxjs/toolkit'

import { addNotification } from '../slices/notificationsSlice'

const ignoredEndpoints = new Set(['refresh'])

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

      const messagesWithErrors = Object.values(action.payload.error).reduce<string[]>(
        (acc, cur) => {
          cur.titles.forEach(title => {
            acc.push(title)
          })

          return acc
        },
        []
      )

      messagesWithErrors.forEach(textError => {
        dispatch(
          addNotification({
            type: 'error',
            message: textError,
            duration: 5,
          })
        )
      })
    }

    if (isRtkQueryFulfilledAction(action)) {
      const endpointName = action.meta.arg.endpointName

      if (!includeEndpoints.has(endpointName)) {
        return next(action)
      }

      dispatch(
        addNotification({
          type: 'success',
          message: action.payload.message,
          duration: 3,
        })
      )
    }

    return next(action)
  }
