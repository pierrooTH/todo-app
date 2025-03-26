import { apiClient } from './api.service'
import { type Todo, type CreateTodoDto, type UpdateTodoDto } from '../models/todo.model'

export const TodoService = {
  async getAllTodos(): Promise<Todo[]> {
    const response = await apiClient.get<Todo[]>('/todos')
    return response.data
  },

  async getTodoById(id: string): Promise<Todo> {
    const response = await apiClient.get<Todo>(`/todos/${id}`)
    return response.data
  },

  async createTodo(todo: CreateTodoDto): Promise<Todo> {
    const response = await apiClient.post<Todo>('/todos', todo)
    return response.data
  },

  async updateTodo(id: string, todo: UpdateTodoDto): Promise<Todo> {
    const response = await apiClient.patch<Todo>(`/todos/${id}`, todo)
    return response.data
  },

  async deleteTodo(id: string): Promise<void> {
    await apiClient.delete(`/todos/${id}`)
  },
}
