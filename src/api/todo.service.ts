import { Todo, TodoDTO } from '../store/types/todo.types';

// Кэш для хранения результатов запросов
const cache = new Map<string, any>();

let emulatedTodos: Todo[] = [];

export class TodoService {
  private baseUrl = 'https://jsonplaceholder.typicode.com/todos';
  
  async fetchAll(): Promise<Todo[]> {
    const cacheKey = 'todos';
    
    if (emulatedTodos.length > 0) {
      cache.set(cacheKey, emulatedTodos);
    }

    // Проверяем кэш
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    
    try {
      const response = await fetch(this.baseUrl);
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const data: TodoDTO[] = await response.json();
      
      // Конвертация DTO в модели Todo
      const todos = data.map(todoDTO => Todo.fromDTO({
        ...todoDTO,
        // Добавляем недостающие поля, так как jsonplaceholder не возвращает все нужные поля
        createdAt: todoDTO.createdAt || new Date().toISOString(),
        userId: todoDTO.userId || 'user-1'
      }));

      emulatedTodos = todos;
      
      // Сохраняем в кэш
      cache.set(cacheKey, emulatedTodos);
      
      return todos;
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Todo> {
    const cacheKey = `todo-${id}`;
    
    // Проверяем кэш
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    const response = await fetch(`${this.baseUrl}/${id}`);
    const data: TodoDTO = await response.json();
    const todo = Todo.fromDTO(data);
    
    // Сохраняем в кэш
    cache.set(cacheKey, todo);
    
    return todo;
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
      const newTodo = Todo.fromDTO(data);
      
      // Обновляем кэш
      const todos = await this.fetchAll();
      cache.set('todos', [...todos, newTodo]);
      cache.set(`todo-${newTodo.id}`, newTodo);
      
      return newTodo;
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
      const updatedTodo = Todo.fromDTO(data);
      
      // Обновляем кэш
      const todos = await this.fetchAll();
      cache.set('todos', todos.map(t => t.id === updatedTodo.id ? updatedTodo : t));
      cache.set(`todo-${updatedTodo.id}`, updatedTodo);
      
      return updatedTodo;
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
      
      if (response.ok) {
        // Обновляем кэш
        emulatedTodos = [...emulatedTodos.filter(t => t.id !== todoId)];
        const todos = await this.fetchAll();
        cache.set('todos', todos.filter(t => t.id !== todoId));
        cache.delete(`todo-${todoId}`);
      }
      
      return response.ok;
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
      throw error;
    }
  }
  
  // Метод для очистки кэша
  clearCache() {
    cache.clear();
  }
}

export const todoService = new TodoService();