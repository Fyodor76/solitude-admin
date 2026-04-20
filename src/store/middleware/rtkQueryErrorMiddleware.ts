import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'

import { addNotification } from '../slices/notificationsSlice'

const ignoredEndpoints = new Set(['refresh'])

type RtkQueryRejectedAction = {
  payload: {
    error: string[]
  }
  meta: {
    arg: {
      endpointName: string
    }
  }
}

const isRtkQueryRejectedAction = (action: unknown): action is RtkQueryRejectedAction =>
  isRejectedWithValue(action) &&
  typeof (action as RtkQueryRejectedAction).meta?.arg?.endpointName === 'string' &&
  Array.isArray((action as RtkQueryRejectedAction).payload?.error)

export const rtkQueryErrorMiddleware: Middleware =
  ({ dispatch }) =>
  next =>
  action => {
    if (isRtkQueryRejectedAction(action)) {
      const endpointName = action.meta.arg.endpointName

      if (ignoredEndpoints.has(endpointName)) {
        return next(action)
      }

      action.payload.error.forEach(err => {
        dispatch(
          addNotification({
            type: 'error',
            message: err,
          })
        )
      })
    }

    return next(action)
  }
