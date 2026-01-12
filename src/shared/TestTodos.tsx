import React, { useState } from 'react'

import { useAppDispatch, useAppSelector } from '../store/hook'
import { addTodo, removeTodo, toggleTodo } from '../store/slices/testSlice'

const TestTodos = () => {
  const dispatch = useAppDispatch()
  const todos = useAppSelector(state => state.todos.todos)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleAdd = () => {
    if (!title.trim()) return

    dispatch(
      addTodo({
        id: Date.now().toString(),
        title,
        description: description,
        completed: false,
      })
    )

    setTitle('')
    setDescription('')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>ToDo List</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Новая задача"
          style={{ marginRight: '10px', padding: '8px' }}
        />

        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Новая описание"
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button onClick={handleAdd}>Добавить</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              padding: '15px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }}
                >
                  {todo.title}
                </span>

                {todo.description && (
                  <div
                    style={{
                      marginTop: '5px',
                      color: '#666',
                      fontSize: '14px',
                    }}
                  >
                    📝 {todo.description}
                  </div>
                )}
              </div>

              <div></div>

              <button onClick={() => dispatch(toggleTodo(todo.id))} style={{ marginRight: '5px' }}>
                {todo.completed ? '✅' : '❌'}
              </button>
              <button onClick={() => dispatch(removeTodo(todo.id))}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TestTodos
