import { usePushNavigation } from './usePushNavigation'

/** Подключает навигацию из push-уведомлений к React Router. */
export function PushNavigationSync() {
  usePushNavigation()
  return null
}
