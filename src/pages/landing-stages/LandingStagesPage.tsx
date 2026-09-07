import { useMemo } from 'react'

import {
  useDeleteLandingStageMutation,
  useGetAllLandingStagesQuery,
} from '@/shared/lib/api/landing-stages/LandingStages'
import type { LandingStage } from '@/shared/lib/api/landing-stages/types'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Empty, Modal, Space, Spin, Tag } from 'antd'
import { Link } from 'react-router-dom'

import './LandingStagesPage.scss'

function StageThumb({ stage }: { stage: LandingStage }) {
  const desktop = resolveMediaUrl(stage.imageDesktop)
  const mobile = resolveMediaUrl(stage.imageMobile)

  return (
    <div className="landing-stages-page__thumbs">
      {desktop ? (
        <img src={desktop} alt="" className="landing-stages-page__thumb" />
      ) : (
        <div className="landing-stages-page__thumb-placeholder" />
      )}
      {mobile ? (
        <img
          src={mobile}
          alt=""
          className="landing-stages-page__thumb landing-stages-page__thumb--mobile"
        />
      ) : (
        <div className="landing-stages-page__thumb-placeholder landing-stages-page__thumb-placeholder--mobile" />
      )}
    </div>
  )
}

function StageRow({
  stage,
  index,
  isDeleting,
  onDelete,
}: {
  stage: LandingStage
  index: number
  isDeleting: boolean
  onDelete: (stage: LandingStage) => void
}) {
  const title = `Стейдж ${index + 1}`
  const alt = stage.alt?.trim() || '—'

  return (
    <li className="landing-stages-page__row">
      <StageThumb stage={stage} />

      <div className="landing-stages-page__name">
        <Link to={`/landing-stages/${stage.id}/edit`}>{title}</Link>
      </div>

      <span className="landing-stages-page__cell landing-stages-page__cell--alt" title={alt}>
        {alt}
      </span>

      <span className="landing-stages-page__cell">{stage.sortOrder}</span>

      <div className="landing-stages-page__status">
        <Tag color={stage.isActive ? 'green' : 'default'}>
          {stage.isActive ? 'Активен' : 'Выкл'}
        </Tag>
      </div>

      <Space size={4} className="landing-stages-page__actions">
        <Link to={`/landing-stages/${stage.id}/edit`}>
          <Button type="link">Открыть</Button>
        </Link>
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          aria-label={`Удалить ${title}`}
          loading={isDeleting}
          onClick={() => onDelete(stage)}
        />
      </Space>
    </li>
  )
}

export function LandingStagesPage() {
  const { openNotification, contextHolder } = useNotificationHandler()
  const { data, isLoading, isFetching, refetch } = useGetAllLandingStagesQuery()
  const [deleteStage, { isLoading: isDeleting }] = useDeleteLandingStageMutation()

  const stages = useMemo(() => data?.data ?? [], [data?.data])

  const handleDelete = (stage: LandingStage) => {
    Modal.confirm({
      title: 'Удалить стейдж?',
      content: 'Восстановить будет невозможно.',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteStage(stage.id).unwrap()
          openNotification('success', ['Стейдж удалён'])
        } catch {
          openNotification('error', ['Не удалось удалить стейдж'])
          throw new Error('delete failed')
        }
      },
    })
  }

  return (
    <Container className="landing-stages-page admin-page">
      {contextHolder}
      <PageHeader
        title="Стейджи главной"
        actions={
          <Space>
            <Button loading={isFetching} onClick={() => void refetch()}>
              Обновить
            </Button>
            <Link to="/landing-stages/create">
              <Button type="primary">Создать</Button>
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
            <Button type="primary">Создать</Button>
          </Link>
        </Empty>
      ) : (
        <div className="landing-stages-page__list-wrap">
          <div className="landing-stages-page__list-head">
            <span />
            <span>Стейдж</span>
            <span>Alt</span>
            <span>Порядок</span>
            <span>Статус</span>
            <span />
          </div>
          <ul className="landing-stages-page__list">
            {stages.map((stage, index) => (
              <StageRow
                key={stage.id}
                stage={stage}
                index={index}
                isDeleting={isDeleting}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      )}
    </Container>
  )
}
