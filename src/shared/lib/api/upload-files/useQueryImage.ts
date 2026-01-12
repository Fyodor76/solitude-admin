import { useLazyGetFileUrlByIdQuery } from './uploadFiles'

export const useGetFileUrlById = () => {
  const [trigger, query] = useLazyGetFileUrlByIdQuery()
  return {
    getUrlById: trigger,
    ...query,
  }
}
