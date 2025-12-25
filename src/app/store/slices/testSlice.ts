import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
}
interface TodoState {
  todos: Todo[]
  loading: boolean
  error: string | null
}
const initialState: TodoState = {
  todos: [
    {
      id: '1',
      title: 'Изучить Redux Toolkit',
      description: 'Разобраться со слайсами и редюсерами',
      completed: false,
    },
    {
      id: '2',
      title: 'Создать тестовый слайс',
      description: 'Реализовать CRUD для сущности',
      completed: true,
    },
  ],
  loading: false,
  error: null,
}
const testSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      const newTodo: Todo = {
        ...action.payload,
        id: Date.now().toString(),
      }
      state.todos.push(newTodo)
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload)
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
  },
})

export const { addTodo, removeTodo, toggleTodo } = testSlice.actions
export default testSlice.reducer
