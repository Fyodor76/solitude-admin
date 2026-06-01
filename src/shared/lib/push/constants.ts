export const ADMIN_PUSH_PROMPT_DISMISSED_KEY = 'admin-push-prompt-dismissed'
export const ADMIN_PUSH_SUBSCRIBED_KEY = 'admin-push-subscribed'

export const ADMIN_PUSH_COPY = {
  TITLE: 'Push-уведомления',
  DESCRIPTION:
    'Получайте на телефон сообщения из поддержки и другие события админки, даже когда приложение закрыто.',
  ENABLE: 'Включить',
  LATER: 'Позже',
  ENABLED: 'Push-уведомления включены',
  DENIED: 'Разрешите уведомления в настройках браузера',
  UNSUPPORTED: 'Push недоступен в этом браузере',
  ERROR: 'Не удалось включить push-уведомления',
} as const

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

export function serializePushSubscription(subscription: PushSubscription) {
  const json = subscription.toJSON()
  const endpoint = json.endpoint
  const p256dh = json.keys?.p256dh
  const auth = json.keys?.auth

  if (!endpoint || !p256dh || !auth) {
    throw new Error('Invalid push subscription payload')
  }

  return {
    endpoint,
    keys: { p256dh, auth },
  }
}
