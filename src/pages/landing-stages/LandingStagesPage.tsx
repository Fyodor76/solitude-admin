import { useMemo } from 'react'

import {
  useDeleteLandingStageMutation,
  useGetAllLandingStagesQuery,
  useUpdateLandingStageMutation,
} from '@/shared/lib/api/landing-stages/LandingStages'
import type { LandingStage } from '@/shared/lib/api/landing-stages/types'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Empty, Popconfirm, Space, Spin, Switch, Tag } from 'antd'
import { Link } from 'react-router-dom'

import './LandingStagesPage.scss'

function StageThumb({ fileId, className }: { fileId: string; className: string }) {
  const src = resolveMediaUrl(fileId)
  if (!src) {
    return <div className={`${className} ${className}--empty`} />
  }
  return <img src={src} alt="" className={className} />
}

export function LandingStagesPage() {
  const { openNotification, contextHolder } = useNotificationHandler()
  const { data, isLoading, isFetching, refetch } = useGetAllLandingStagesQuery()
  const [updateStage] = useUpdateLandingStageMutation()
  const [deleteStage] = useDeleteLandingStageMutation()

  const stages = useMemo(() => data?.data ?? [], [data?.data])

  const handleDelete = async (id: string) => {
    try {
      await deleteStage(id).unwrap()
      openNotification('success', ['Стейдж удалён'])
    } catch {
      openNotification('error', ['Не удалось удалить стейдж'])
    }
  }

  const handleToggleActive = async (stage: LandingStage, isActive: boolean) => {
    try {
      await updateStage({ id: stage.id, data: { isActive } }).unwrap()
    } catch {
      openNotification('error', ['Не удалось обновить статус'])
    }
  }

  return (
    <Container className="landing-stages-page admin-page">
      {contextHolder}
      <PageHeader
        title="Стейджи главной"
        subtitle="Картинки первого экрана. Если слайдов больше одного — на витрине будет слайдер."
        actions={
          <Space>
            <Button loading={isFetching} onClick={() => void refetch()}>
              Обновить
            </Button>
            <Link to="/landing-stages/create">
              <Button type="primary" icon={<PlusOutlined />}>
                Создать
              </Button>
            </Link>
          </Space>
        }
      />

      {isLoading ? (
        <div className="landing-stages-page__loading">
          <Spin />
        </div>
      ) : stages.length === 0 ? (
        <Empty
          className="landing-stages-page__empty"
          description="Пока нет стейджей"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link to="/landing-stages/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Создать первый
            </Button>
          </Link>
        </Empty>
      ) : (
        <div className="landing-stages-page__list-wrap">
          <div className="landing-stages-page__list-head">
            <span>Превью</span>
            <span>Порядок</span>
            <span>Статус</span>
            <span>Alt</span>
            <span>Действия</span>
          </div>
          <ul className="landing-stages-page__list">
            {stages.map(stage => (
              <li key={stage.id} className="landing-stages-page__row">
                <div className="landing-stages-page__previews">
                  <StageThumb
                    fileId={stage.imageDesktop}
                    className="landing-stages-page__thumb-desktop"
                  />
                  <StageThumb
                    fileId={stage.imageMobile}
                    className="landing-stages-page__thumb-mobile"
                  />
                </div>

                <div className="landing-stages-page__order">
                  <span className="landing-stages-page__order-value">{stage.sortOrder}</span>
                </div>

                <div className="landing-stages-page__status">
                  <Switch
                    checked={stage.isActive}
                    size="small"
                    onChange={checked => void handleToggleActive(stage, checked)}
                  />
                  <Tag color={stage.isActive ? 'green' : 'default'}>
                    {stage.isActive ? 'Активен' : 'Выкл'}
                  </Tag>
                </div>

                <div className="landing-stages-page__alt" title={stage.alt ?? undefined}>
                  {stage.alt || '—'}
                </div>

                <div className="landing-stages-page__actions">
                  <Link to={`/landing-stages/${stage.id}/edit`}>
                    <Button type="text" icon={<EditOutlined />} aria-label="Редактировать" />
                  </Link>
                  <Popconfirm
                    title="Удалить стейдж?"
                    okText="Удалить"
                    cancelText="Отмена"
                    onConfirm={() => void handleDelete(stage.id)}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} aria-label="Удалить" />
                  </Popconfirm>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  )
}
