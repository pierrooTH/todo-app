import { TodoStatus } from './todo-status.enum'

export interface Todo {
  _id?: string
  title: string
  description?: string
  status: TodoStatus
}

export interface CreateTodoDto {
  title: string
  description?: string
  status?: TodoStatus
}

export interface UpdateTodoDto {
  title?: string
  description?: string
  status?: TodoStatus
}
