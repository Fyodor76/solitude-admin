import { PLATFORM_IMAGES_UPLOAD } from '../constants'

/** Собирает файлы из серии вызовов beforeUpload (antd вызывает на каждый файл) в один батч. */
export function createFileBatchScheduler(
  onBatch: (files: File[]) => void,
  delayMs = PLATFORM_IMAGES_UPLOAD.BATCH_SCHEDULE_MS
) {
  let timer: ReturnType<typeof setTimeout> | undefined

  return (fileList: File[]) => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      timer = undefined
      onBatch([...fileList])
    }, delayMs)
  }
}
