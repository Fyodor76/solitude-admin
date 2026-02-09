import React from 'react'

import {
  useCreateCategoryMutation,
  useDeactivateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
  useGetChildCategoriesQuery,
  useGetCollectionsQuery,
  useUpdateCategoryByIdMutation,
} from './apiCategories'

const TestApiCategories = () => {
  const testId = 'f4ac5f29-7852-4f54-89ee-863912dca7ad'
  const testSlug = 'test-slug-nadya1768980105143'
  const idPoloByDelete = 'a800a583-3e54-4ad6-b535-89d2c6da3378' //по этому id, name:'Поло' удаление не произошло из за того, что в ней есть товары.
  const idUpdate = 'a8f8dd1f-22e9-45cd-bf94-eff8b1f64f6b'
  const parentId = 'cb5e9494-6c01-4079-bd72-d0f802797f74'
  const [create] = useCreateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [deactivate] = useDeactivateCategoryMutation()
  const [update] = useUpdateCategoryByIdMutation()
  const { data: children } = useGetChildCategoriesQuery(parentId)
  const { data: categories, isLoading: isGetCatLoading } = useGetCategoriesQuery()
  const { data: category } = useGetCategoryByIdQuery(testId)
  const { data: categoryBySlug } = useGetCategoryBySlugQuery(testSlug)
  //const {data: collections,error:errorCollections}=useGetCollectionsQuery()

  const handleCreate = async () => {
    try {
      const newCategory = await create({
        name: 'Моя тестовая категория',
        slug: 'test-slug-nadya' + Date.now(),
        description: 'тестовое описание',
        parentId: null,
        imageId: null,
        sortOrder: 0,
        type: 'category',
      }).unwrap()
    } catch (error) {
      console.error('Ошибка создания категории...', error)
    }
  }

  const getAllCategories = () => {
    const result = categories?.data
  }
  getAllCategories()

  const deleteCat = async () => {
    try {
      const result = await deleteCategory('9b554218-f27d-4d97-a7d9-bafeb1eaec4f')
    } catch (error) {
      console.error('Удаление не получилось(((')
    }
  }

  const deactivateCategory = async () => {
    try {
      const result = await deactivate(idPoloByDelete)
    } catch (error) {
      console.error(' Ошибка деактивации:', error)
    }
  }

  const updateCategory = async () => {
    try {
      const newChild = await update({
        id: idUpdate,
        data: {
          description: 'existing-description',
          imageId: '123-test',
          name: 'Надины футболки',
          parentId: null,
          slug: 't-shorts',
          sortOrder: 0,
          type: 'category',
        },
      }).unwrap()
    } catch (error) {
      console.error(' Ошибка обновления:', error)
    }
  }
  const createChild = async () => {
    try {
      const newCategory = await create({
        name: 'Child к моей тестовой категории',
        slug: 'test-slug-nadya' + Date.now(),
        description: 'тестовое описание',
        parentId: parentId,
        imageId: null,
        sortOrder: 0,
        type: 'category',
      }).unwrap()
    } catch (error) {
      console.error('Ошибка создания категории...', error)
    }
  }
  return (
    <div
      style={{
        border: '2px solid #e34761',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '5px',
        fontSize: '18px',
      }}
    >
      <h2>Тестовые запросы api для Категорий</h2>
      <button
        style={{ fontSize: '18px', border: '2px solid black', color: 'red', width: '50%' }}
        onClick={handleCreate}
      >
        Создать категорию
      </button>
      {isGetCatLoading ? (
        <p>Загрузка категорий, ждите...</p>
      ) : (
        categories?.data && (
          <div>
            <p style={{ color: 'red' }}>Категории:{categories.data.length} штук</p>
            <ul>
              {categories.data.map(cat => (
                <li key={cat.id}>{cat.name}</li>
              ))}
            </ul>
          </div>
        )
      )}

      {category?.data && (
        <div>
          <p style={{ color: 'red' }}>Получить категорию по id:</p>
          <p>{category.data.name}</p>
          <p>Дата: {category.data.updatedAt}</p>
        </div>
      )}

      {categoryBySlug?.data && (
        <p>
          <p style={{ color: 'red' }}>Получить категорию по Slug:</p>
          <p>{categoryBySlug.data.name}</p>
          <p>Дата: {categoryBySlug.data.updatedAt}</p>
        </p>
      )}

      <button
        style={{ fontSize: '18px', border: '2px solid black', color: 'red', width: '50%' }}
        onClick={deleteCat}
      >
        Удалить категорию
      </button>

      <button
        style={{ fontSize: '18px', border: '2px solid black', color: 'red', width: '50%' }}
        onClick={deactivateCategory}
      >
        Деактивировать категорию
      </button>

      <button
        style={{ fontSize: '18px', border: '2px solid black', color: 'red', width: '50%' }}
        onClick={updateCategory}
      >
        Обновить категорию
      </button>

      <button
        style={{ fontSize: '18px', border: '2px solid black', color: 'red', width: '50%' }}
        onClick={createChild}
      >
        Создать child к категории
      </button>

      {children?.data && (
        <div>
          <p style={{ color: 'red' }}> Показываю детей категории по id </p>
          <ul>
            {children.data.map(child => (
              <li key={child.id}>
                {child.name},{child.id}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default TestApiCategories
