import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TodoDTO } from './types/todo.dto';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Локальное хранилище для эмулированных изменений
let emulatedTodos: TodoDTO[] = [];

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query<TodoDTO[], void>({
      query: () => '',
      transformResponse: async (response: TodoDTO[]) => {
        if (emulatedTodos.length === 0) {
          emulatedTodos = response;
        }
        return emulatedTodos;
      },
      providesTags: ['Todos'],
    }),
    createTodo: builder.mutation<TodoDTO, string>({
      query: (title) => ({
        url: '',
        method: 'POST',
        body: {
          title,
          completed: false,
          userId: 1,
        },
      }),
      transformResponse: (response: TodoDTO) => {
        emulatedTodos = [...emulatedTodos, response];
        return response;
      },
      invalidatesTags: ['Todos'],
    }),
    updateTodoStatus: builder.mutation<TodoDTO, { id: string; completed: boolean }>({
      query: ({ id, completed }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: { completed },
      }),
      transformResponse: (response: TodoDTO) => {
        emulatedTodos = emulatedTodos.map(todo =>
          todo.id === response.id ? response : todo
        );
        return response;
      },
      invalidatesTags: ['Todos'],
    }),
    deleteTodo: builder.mutation<string, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (_, __, id) => {
        emulatedTodos = emulatedTodos.filter(todo => todo.id !== id);
        return id;
      },
      invalidatesTags: ['Todos'],
    }),
    deleteCompletedTodos: builder.mutation<string[], void>({
      queryFn: async () => {
        const completedIds = emulatedTodos
          .filter(todo => todo.completed)
          .map(todo => todo.id);
        
        await Promise.all(
          completedIds.map(id => 
            fetch(`${API_URL}/${id}`, { method: 'DELETE' })
          )
        );
        
        emulatedTodos = emulatedTodos.filter(todo => !todo.completed);
        return { data: completedIds };
      },
      invalidatesTags: ['Todos'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoStatusMutation,
  useDeleteTodoMutation,
  useDeleteCompletedTodosMutation,
} = todoApi; 