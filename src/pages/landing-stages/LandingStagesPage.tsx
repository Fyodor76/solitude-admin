import { useMemo, useState } from 'react'

import {
  useCreateLandingStageMutation,
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
import { Button, Empty, Image, Popconfirm, Space, Spin, Switch, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { LandingStageFormValues, LandingStageModal } from './components/LandingStageModal'
import './LandingStagesPage.scss'

export function LandingStagesPage() {
  const { openNotification } = useNotificationHandler()
  const { data, isLoading, isFetching, refetch } = useGetAllLandingStagesQuery()
  const [createStage, { isLoading: isCreating }] = useCreateLandingStageMutation()
  const [updateStage, { isLoading: isUpdating }] = useUpdateLandingStageMutation()
  const [deleteStage] = useDeleteLandingStageMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<LandingStage | null>(null)

  const stages = data?.data ?? []

  const openCreate = () => {
    setModalMode('create')
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (stage: LandingStage) => {
    setModalMode('edit')
    setEditing(stage)
    setModalOpen(true)
  }

  const handleSubmit = async (values: LandingStageFormValues) => {
    try {
      if (modalMode === 'create') {
        await createStage(values).unwrap()
        openNotification('success', ['Стейдж создан'])
      } else if (editing) {
        await updateStage({ id: editing.id, data: values }).unwrap()
        openNotification('success', ['Стейдж обновлён'])
      }
      setModalOpen(false)
    } catch {
      openNotification('error', ['Не удалось сохранить стейдж'])
    }
  }

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

  const columns: ColumnsType<LandingStage> = useMemo(
    () => [
      {
        title: 'Desktop',
        dataIndex: 'imageDesktop',
        width: 120,
        render: (value: string) => {
          const src = resolveMediaUrl(value)
          return src ? (
            <Image src={src} width={72} height={48} style={{ objectFit: 'cover' }} />
          ) : (
            '—'
          )
        },
      },
      {
        title: 'Mobile',
        dataIndex: 'imageMobile',
        width: 120,
        render: (value: string) => {
          const src = resolveMediaUrl(value)
          return src ? (
            <Image src={src} width={48} height={72} style={{ objectFit: 'cover' }} />
          ) : (
            '—'
          )
        },
      },
      {
        title: 'Порядок',
        dataIndex: 'sortOrder',
        width: 90,
      },
      {
        title: 'Статус',
        dataIndex: 'isActive',
        width: 130,
        render: (isActive: boolean, record) => (
          <Space>
            <Switch
              checked={isActive}
              size="small"
              onChange={checked => void handleToggleActive(record, checked)}
            />
            <Tag color={isActive ? 'green' : 'default'}>{isActive ? 'Активен' : 'Выкл'}</Tag>
          </Space>
        ),
      },
      {
        title: 'Alt',
        dataIndex: 'alt',
        ellipsis: true,
        render: (value: string | null) => value || '—',
      },
      {
        title: '',
        key: 'actions',
        width: 100,
        render: (_, record) => (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
              aria-label="Редактировать"
            />
            <Popconfirm
              title="Удалить стейдж?"
              okText="Удалить"
              cancelText="Отмена"
              onConfirm={() => void handleDelete(record.id)}
            >
              <Button type="text" danger icon={<DeleteOutlined />} aria-label="Удалить" />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    []
  )

  return (
    <Container className="landing-stages-page admin-page">
      <PageHeader
        title="Стейджи главной"
        subtitle="Картинки первого экрана. Если слайдов больше одного — на витрине будет слайдер."
        actions={
          <Space>
            <Button loading={isFetching} onClick={() => void refetch()}>
              Обновить
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Создать
            </Button>
          </Space>
        }
      />

      {isLoading ? (
        <div className="landing-stages-page__loading">
          <Spin />
        </div>
      ) : stages.length === 0 ? (
        <Empty description="Пока нет стейджей" />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={stages}
          pagination={false}
          scroll={{ x: 800 }}
        />
      )}

      <LandingStageModal
        open={modalOpen}
        mode={modalMode}
        initial={editing}
        confirmLoading={isCreating || isUpdating}
        onCancel={() => setModalOpen(false)}
        onSubmit={values => void handleSubmit(values)}
      />
    </Container>
  )
}
