import { Button, Input, Select, Space, Spin, Switch, Typography } from 'antd'

type StorePreviewControlsProps = {
  heatmap: boolean
  draft: string
  path: string
  pagesLoading: boolean
  trackedPagesCount: number
  trackedPageSelectOptions: Array<{ value: string; label: string }>
  onHeatmapChange: (value: boolean) => void
  onDraftChange: (value: string) => void
  onApplyDraft: () => void
  onPageSelect: (value: string) => void
  onRefreshIframe: () => void
  onReloadHeatmap: () => void
}

export function StorePreviewControls({
  heatmap,
  draft,
  path,
  pagesLoading,
  trackedPagesCount,
  trackedPageSelectOptions,
  onHeatmapChange,
  onDraftChange,
  onApplyDraft,
  onPageSelect,
  onRefreshIframe,
  onReloadHeatmap,
}: StorePreviewControlsProps) {
  return (
    <div className="storePreview__controls">
      <div className="storePreview__heatmapRow">
        <Space align="center">
          <Switch checked={heatmap} onChange={onHeatmapChange} />
          <Typography.Text>Показывать слой heatmap</Typography.Text>
        </Space>
      </div>

      <div className="storePreview__toolbar">
        <Typography.Text type="secondary" className="storePreview__toolbarLabel">
          Страницы из аналитики:
        </Typography.Text>
        {pagesLoading ? (
          <Spin size="small" />
        ) : (
          <Select
            showSearch
            className="storePreview__pageSelect"
            placeholder={
              trackedPagesCount > 0 ? 'Поиск и выбор страницы' : 'Нет отслеживаемых страниц'
            }
            notFoundContent={trackedPagesCount ? undefined : 'Пока нет данных'}
            loading={pagesLoading}
            disabled={trackedPagesCount === 0 && !path}
            options={trackedPageSelectOptions}
            value={trackedPageSelectOptions.length ? path : undefined}
            onChange={value => onPageSelect(String(value))}
            optionFilterProp="label"
            filterOption={(input, option) => {
              const label = String(option?.label ?? '')
              const value = String(option?.value ?? '')
              const query = input.trim().toLowerCase()
              return label.toLowerCase().includes(query) || value.toLowerCase().includes(query)
            }}
            virtual={trackedPageSelectOptions.length > 48}
            listHeight={320}
          />
        )}
      </div>

      <div className="storePreview__pathForm">
        <Input
          value={draft}
          onChange={event => onDraftChange(event.target.value)}
          onPressEnter={onApplyDraft}
          placeholder="/collection или полный URL solitude-store.ru"
          style={{ maxWidth: 480, minWidth: 200 }}
        />
        <Button type="primary" onClick={onApplyDraft}>
          Открыть
        </Button>
        <Button onClick={onRefreshIframe}>Обновить</Button>
        {heatmap ? <Button onClick={onReloadHeatmap}>Перезагрузить heatmap</Button> : null}
      </div>
    </div>
  )
}
