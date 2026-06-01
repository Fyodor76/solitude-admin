import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  useGetAdminPushVapidPublicKeyQuery,
  useSubscribeAdminPushMutation,
} from '@/shared/lib/api/admin-push/adminPushApi'
import { addNotification } from '@/store/slices/notificationsSlice'

import { useAppDispatch } from '@/app/store/hook'

import {
  ADMIN_PUSH_COPY,
  ADMIN_PUSH_PROMPT_DISMISSED_KEY,
  ADMIN_PUSH_SUBSCRIBED_KEY,
  isPushSupported,
  serializePushSubscription,
  urlBase64ToUint8Array,
} from './constants'

type UseAdminPushSubscriptionOptions = {
  enabled?: boolean
}

export function useAdminPushSubscription(options?: UseAdminPushSubscriptionOptions) {
  const enabled = options?.enabled ?? true
  const dispatch = useAppDispatch()
  const supported = useMemo(() => isPushSupported(), [])
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    supported ? Notification.permission : 'denied'
  )
  const [isSubscribed, setIsSubscribed] = useState(
    () => localStorage.getItem(ADMIN_PUSH_SUBSCRIBED_KEY) === '1'
  )
  const [isWorking, setIsWorking] = useState(false)

  const { data: vapidResponse } = useGetAdminPushVapidPublicKeyQuery(undefined, {
    skip: !enabled || !supported,
  })
  const [subscribeAdminPush] = useSubscribeAdminPushMutation()

  const vapidPublicKey = vapidResponse?.data?.publicKey ?? null
  const pushEnabledOnServer = vapidResponse?.data?.enabled ?? false

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!supported || !vapidPublicKey || !pushEnabledOnServer) {
      return false
    }

    setIsWorking(true)

    try {
      const permissionResult = await Notification.requestPermission()
      setPermission(permissionResult)

      if (permissionResult !== 'granted') {
        dispatch(
          addNotification({
            type: 'warning',
            message: ADMIN_PUSH_COPY.DENIED,
            duration: 6,
          })
        )
        return false
      }

      const registration = await navigator.serviceWorker.ready
      let subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        })
      }

      await subscribeAdminPush(serializePushSubscription(subscription)).unwrap()

      localStorage.setItem(ADMIN_PUSH_SUBSCRIBED_KEY, '1')
      localStorage.removeItem(ADMIN_PUSH_PROMPT_DISMISSED_KEY)
      setIsSubscribed(true)

      dispatch(
        addNotification({
          type: 'success',
          message: ADMIN_PUSH_COPY.ENABLED,
          duration: 4,
        })
      )

      return true
    } catch {
      dispatch(
        addNotification({
          type: 'error',
          message: ADMIN_PUSH_COPY.ERROR,
          duration: 6,
        })
      )
      return false
    } finally {
      setIsWorking(false)
    }
  }, [dispatch, pushEnabledOnServer, subscribeAdminPush, supported, vapidPublicKey])

  useEffect(() => {
    if (!enabled || !supported || !pushEnabledOnServer || !vapidPublicKey) {
      return
    }

    if (Notification.permission !== 'granted') {
      return
    }

    let cancelled = false

    async function syncExistingSubscription() {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()

        if (cancelled || !subscription) {
          return
        }

        await subscribeAdminPush(serializePushSubscription(subscription)).unwrap()
        localStorage.setItem(ADMIN_PUSH_SUBSCRIBED_KEY, '1')
        setIsSubscribed(true)
      } catch {
        // ignore background sync errors
      }
    }

    void syncExistingSubscription()

    return () => {
      cancelled = true
    }
  }, [enabled, pushEnabledOnServer, subscribeAdminPush, supported, vapidPublicKey])

  return {
    supported,
    pushEnabledOnServer,
    permission,
    isSubscribed,
    isWorking,
    subscribe,
  }
}
