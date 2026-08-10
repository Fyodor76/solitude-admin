import Icon from '@/shared/ui/icons/Icon'

const SizeChartEmpty = () => {
  return (
    <>
      <div className="size-chart-select-empty-container">
        <h2 className="empty-table">Информация о таблице размеров</h2>
        <div className="information">
          <Icon className="information-icon" name="layoutOptions" color="#505253"></Icon>
          <h3 className="information-title">Категория не выбрана</h3>
          <span className="information-info">
            Выберете категорию, чтобы увидеть информацию о таблице размеров
          </span>
        </div>
      </div>
      <div className="size-chart-select-empty-container">
        <h2 className="empty-table">Таблица размеров</h2>
        <div className="information">
          <Icon className="information-icon" name="tables" color="#505253"></Icon>
          <h3 className="information-title">Таблица размеров не отображается</h3>
          <span className="information-info">
            Выберете категорию, чтобы посмотреть и редактировать таблицу размеров
          </span>
        </div>
      </div>{' '}
    </>
  )
}

export default SizeChartEmpty
