import { useEffect, useState } from 'react'

import {
  useCreateLandingStageMutation,
  useGetLandingStageByIdQuery,
  useUpdateLandingStageMutation,
} from '@/shared/lib/api/landing-stages/LandingStages'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Button, Form, Input, InputNumber, Space, Spin, Switch } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { StageImageField } from './components/StageImageField'
import './LandingStageEditorPage.scss'

type LandingStageEditorMode = 'create' | 'edit'

interface LandingStageEditorPageProps {
  mode: LandingStageEditorMode
}

export function LandingStageEditorPage({ mode }: LandingStageEditorPageProps) {
  const navigate = useNavigate()
  const { stageId = '' } = useParams<{ stageId: string }>()
  const { openNotification, contextHolder } = useNotificationHandler()

  const isEdit = mode === 'edit'
  const {
    data: stageResponse,
    isLoading: isStageLoading,
    isError,
  } = useGetLandingStageByIdQuery(stageId, { skip: !isEdit || !stageId })
  const [createStage, { isLoading: isCreating }] = useCreateLandingStageMutation()
  const [updateStage, { isLoading: isUpdating }] = useUpdateLandingStageMutation()

  const [imageDesktop, setImageDesktop] = useState<string | null>(null)
  const [imageMobile, setImageMobile] = useState<string | null>(null)
  const [alt, setAlt] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const stage = stageResponse?.data
  const isSaving = isCreating || isUpdating

  useEffect(() => {
    if (!stage || !isEdit) return
    setImageDesktop(stage.imageDesktop)
    setImageMobile(stage.imageMobile)
    setAlt(stage.alt ?? '')
    setSortOrder(stage.sortOrder ?? 0)
    setIsActive(stage.isActive ?? true)
  }, [stage, isEdit])

  const handleSubmit = async () => {
    if (!imageDesktop || !imageMobile) {
      openNotification('error', ['Загрузите desktop и mobile изображения'])
      return
    }

    const payload = {
      imageDesktop,
      imageMobile,
      alt: alt.trim() || null,
      sortOrder,
      isActive,
    }

    try {
      if (isEdit) {
        await updateStage({ id: stageId, data: payload }).unwrap()
        openNotification('success', ['Стейдж обновлён'])
      } else {
        await createStage(payload).unwrap()
        openNotification('success', ['Стейдж создан'])
      }
      navigate('/landing-stages')
    } catch {
      openNotification('error', ['Не удалось сохранить стейдж'])
    }
  }

  if (isEdit && isStageLoading) {
    return (
      <Container className="landing-stage-editor admin-page">
        {contextHolder}
        <div className="landing-stage-editor__loading">
          <Spin />
        </div>
      </Container>
    )
  }

  if (isEdit && (isError || !stage)) {
    return (
      <Container className="landing-stage-editor admin-page">
        {contextHolder}
        <PageHeader title="Стейдж не найден" />
        <Link to="/landing-stages">
          <Button type="primary">К списку</Button>
        </Link>
      </Container>
    )
  }

  return (
    <Container className="landing-stage-editor admin-page">
      {contextHolder}
      <PageHeader
        title={isEdit ? 'Редактирование стейджа' : 'Новый стейдж'}
        actions={
          <Space>
            <Button onClick={() => navigate('/landing-stages')}>К списку</Button>
            <Button
              type="primary"
              loading={isSaving}
              disabled={!imageDesktop || !imageMobile}
              onClick={() => void handleSubmit()}
            >
              Сохранить
            </Button>
          </Space>
        }
      />

      <section className="landing-stage-editor__section">
        <Form layout="vertical" className="landing-stage-editor__form">
          <div className="landing-stage-editor__images">
            <StageImageField
              label="Десктоп"
              hint="Горизонтальный кадр"
              variant="desktop"
              fileId={imageDesktop}
              onChange={setImageDesktop}
            />
            <StageImageField
              label="Мобильный"
              hint="Вертикальный кадр"
              variant="mobile"
              fileId={imageMobile}
              onChange={setImageMobile}
            />
          </div>

          <div className="landing-stage-editor__fields">
            <Form.Item label="Alt-текст" className="landing-stage-editor__alt">
              <Input
                value={alt}
                onChange={event => setAlt(event.target.value)}
                placeholder="Краткое описание"
                maxLength={120}
              />
            </Form.Item>
            <Form.Item label="Порядок" className="landing-stage-editor__order">
              <InputNumber
                value={sortOrder}
                onChange={value => setSortOrder(typeof value === 'number' ? value : 0)}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label="Активен" className="landing-stage-editor__active">
              <Switch checked={isActive} onChange={setIsActive} />
            </Form.Item>
          </div>
        </Form>
      </section>

      <div className="landing-stage-editor__footer">
        <Button onClick={() => navigate('/landing-stages')}>Отмена</Button>
        <Button
          type="primary"
          loading={isSaving}
          disabled={!imageDesktop || !imageMobile}
          onClick={() => void handleSubmit()}
        >
          Сохранить
        </Button>
      </div>
    </Container>
  )
}

export function LandingStageCreatePage() {
  return <LandingStageEditorPage mode="create" />
}

export function LandingStageEditPage() {
  return <LandingStageEditorPage mode="edit" />
}
