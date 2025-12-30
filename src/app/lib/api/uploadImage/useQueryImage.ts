import { useLazyGetFileUrlForIdQuery } from './upload-files'

export const useGetFileUrlForId = () => {
  const [trigger, query] = useLazyGetFileUrlForIdQuery()
  return {
    getUrlForId: trigger,
    ...query,
  }
}
