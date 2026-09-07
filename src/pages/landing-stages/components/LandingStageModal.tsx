import { useEffect, useState } from 'react'

import type { LandingStage } from '@/shared/lib/api/landing-stages/types'
import { Form, Input, InputNumber, Modal, Switch } from 'antd'

import { StageImageField } from './StageImageField'

export interface LandingStageFormValues {
  imageDesktop: string
  imageMobile: string
  alt?: string
  sortOrder: number
  isActive: boolean
}

interface LandingStageModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initial?: LandingStage | null
  confirmLoading?: boolean
  onCancel: () => void
  onSubmit: (values: LandingStageFormValues) => void
}

export function LandingStageModal({
  open,
  mode,
  initial,
  confirmLoading,
  onCancel,
  onSubmit,
}: LandingStageModalProps) {
  const [imageDesktop, setImageDesktop] = useState<string | null>(null)
  const [imageMobile, setImageMobile] = useState<string | null>(null)
  const [alt, setAlt] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!open) return
    setImageDesktop(initial?.imageDesktop ?? null)
    setImageMobile(initial?.imageMobile ?? null)
    setAlt(initial?.alt ?? '')
    setSortOrder(initial?.sortOrder ?? 0)
    setIsActive(initial?.isActive ?? true)
  }, [open, initial])

  const handleOk = () => {
    if (!imageDesktop || !imageMobile) return
    onSubmit({
      imageDesktop,
      imageMobile,
      alt: alt.trim() || undefined,
      sortOrder,
      isActive,
    })
  }

  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Новый стейдж' : 'Редактирование стейджа'}
      okText={mode === 'create' ? 'Создать' : 'Сохранить'}
      cancelText="Отмена"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      okButtonProps={{ disabled: !imageDesktop || !imageMobile }}
      destroyOnClose
      width={560}
    >
      <Form layout="vertical" className="landing-stages-modal">
        <StageImageField label="Desktop" fileId={imageDesktop} onChange={setImageDesktop} />
        <StageImageField label="Mobile" fileId={imageMobile} onChange={setImageMobile} />
        <Form.Item label="Alt">
          <Input
            value={alt}
            onChange={event => setAlt(event.target.value)}
            placeholder="Описание изображения"
          />
        </Form.Item>
        <Form.Item label="Порядок">
          <InputNumber
            value={sortOrder}
            onChange={value => setSortOrder(typeof value === 'number' ? value : 0)}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Активен">
          <Switch checked={isActive} onChange={setIsActive} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
