import { Todo, TodoDTO } from '../store/types/todo.types';

export class TodoService {
  private baseUrl = 'https://jsonplaceholder.typicode.com/todos';
  
  async fetchAll(): Promise<Todo[]> {
    try {
      const response = await fetch(this.baseUrl);
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const data: TodoDTO[] = await response.json();
      
      // Конвертация DTO в модели Todo
      return data.map(todoDTO => Todo.fromDTO({
        ...todoDTO,
        // Добавляем недостающие поля, так как jsonplaceholder не возвращает все нужные поля
        createdAt: todoDTO.createdAt || new Date().toISOString(),
        userId: todoDTO.userId || 'user-1'
      }));
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error);
      throw error;
    }
  }
  
  async createTodo(todo: Todo): Promise<Todo> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo.toDTO())
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const data: TodoDTO = await response.json();
      
      // Возвращаем новый объект Todo, созданный из DTO
      return Todo.fromDTO(data);
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      throw error;
    }
  }
  
  async updateTodo(todo: Todo): Promise<Todo> {
    try {
      const response = await fetch(`${this.baseUrl}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo.toDTO())
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const data: TodoDTO = await response.json();
      
      // Возвращаем обновленный объект Todo
      return Todo.fromDTO(data);
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
      throw error;
    }
  }
  
  async deleteTodo(todoId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${todoId}`, {
        method: 'DELETE'
      });
      
      return response.ok;
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
      throw error;
    }
  }
}

export const todoService = new TodoService();