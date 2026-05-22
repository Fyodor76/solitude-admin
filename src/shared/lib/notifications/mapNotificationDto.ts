import type { AdminNotificationDto } from '@/shared/lib/api/admin-notifications/types'

import type { AdminNotificationItem } from './types'

export function mapAdminNotificationDto(dto: AdminNotificationDto): AdminNotificationItem {
  return {
    id: String(dto.id),
    kind: dto.type,
    title: dto.title,
    description: dto.body?.trim() || 'Новое уведомление',
    href: dto.href,
    createdAt: dto.updatedAt || dto.createdAt,
    readAt: dto.readAt,
    sourceId: dto.sourceId,
    payload: dto.payload,
  }
}
