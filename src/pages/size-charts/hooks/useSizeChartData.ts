import { useGetSizeChartByCategoryIdQuery } from '@/shared/lib/api/size-charts/SizeCharts'

export const useSizeChartData = (categoryId: string) => {
  const { data, isFetching, refetch } = useGetSizeChartByCategoryIdQuery(categoryId, {
    skip: !categoryId,
  })

  return { sizeChart: data?.data, isFetching, refetch }
}
