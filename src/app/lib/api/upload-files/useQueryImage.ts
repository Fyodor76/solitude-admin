import { useLazyGetFileUrlByIdQuery } from './upload-files'

export const useGetFileUrlById = () => {
  const [trigger, query] = useLazyGetFileUrlByIdQuery()
  return {
    getUrlById: trigger,
    ...query,
  }
}
