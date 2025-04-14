import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TodoDTO } from './types/todo.dto';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

const TODOS_QUERY_KEY = ['todos'];

let emulatedTodos: TodoDTO[] = [];

export const useTodos = () => {
  return useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: async () => {
      // При первом запросе, загружаем задачи из API
      if (emulatedTodos.length === 0) {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке задач');
        }
        emulatedTodos = await response.json();
      }
      return await new Promise<TodoDTO[]>((resolve) => {
        setTimeout(() => {
          resolve(emulatedTodos);
        }, 200);
      });
    },
  });
};

export function useTodo(id: string) {
  return useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Ошибка при загрузке задачи');
      }
      return response.json() as Promise<TodoDTO>;
    },
    enabled: !!id,
  });
}

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          title,
          completed: false,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (!response.ok) {
        throw new Error('Ошибка при создании задачи');
      }
      const newTodo = await response.json();
      emulatedTodos = [...emulatedTodos, newTodo];
      return newTodo;
    },
    onSuccess: (newTodo) => {
      queryClient.setQueryData(TODOS_QUERY_KEY, (oldData: TodoDTO[] = []) => [...oldData, newTodo]);
    },
  });
};

export const useUpdateTodoStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (!response.ok) {
        throw new Error('Ошибка при обновлении задачи');
      }
      const updatedTodo = await response.json();
      emulatedTodos = emulatedTodos.map(todo =>
        todo.id === id ? updatedTodo : todo
      );
      return updatedTodo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Ошибка при удалении задачи');
      }
      emulatedTodos = emulatedTodos.filter(todo => todo.id !== id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
};

export const useDeleteCompletedTodos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const completedIds = emulatedTodos
        .filter(todo => todo.completed)
        .map(todo => todo.id);
      
      await Promise.all(
        completedIds.map(id => 
          fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        )
      );
      
      emulatedTodos = emulatedTodos.filter(todo => !todo.completed);
      return completedIds;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
}; 