import { 
  createEntityAdapter,
  createSlice, 
  PayloadAction
} from '@reduxjs/toolkit';
import { TodoDTO, TodosState } from '@/store/types/todo.types';
import { RootState } from '@/store/redux';
import { addNewTodo, fetchTodos, updateTodoStatus } from './todo-actions';

export const todosAdapter = createEntityAdapter<TodoDTO, string>({
  selectId: (todo) => todo.id,
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
});

// Создаем начальное состояние
const initialState = todosAdapter.getInitialState<TodosState>({
  loading: false,
  error: null,
});

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Используем для локальных обновлений без обращения к API
    toggleTodoLocally: (state, action: PayloadAction<string>) => {
      const todoId = action.payload;
      const existingTodo = state.entities[todoId];
      
      if (existingTodo) {
        // Теперь мы работаем с DTO, поэтому просто инвертируем значение
        todosAdapter.updateOne(state, {
          id: todoId,
          changes: {
            completed: !existingTodo.completed
          }
        });
      }
    },
    
    removeCompletedTodos: (state) => {
      const completedIds = Object.values(state.entities)
        .filter(entity => entity && entity.completed)
        .map(entity => entity!.id);
      
      todosAdapter.removeMany(state, completedIds);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload теперь содержит массив TodoDTO
        todosAdapter.setAll(state, action.payload);
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Произошла ошибка';
      })
      .addCase(addNewTodo.fulfilled, (state, action) => {
        todosAdapter.addOne(state, action.payload);
      })
      .addCase(updateTodoStatus.fulfilled, (state, action) => {
        todosAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload
        });
      });
  }
});

export const {
  toggleTodoLocally,
  removeCompletedTodos
} = todosSlice.actions;

export const {
  selectAll: selectAllTodos,
  selectById: selectTodoById,
  selectIds: selectTodoIds,
  selectTotal: selectTotalTodos,
} = todosAdapter.getSelectors<RootState>(state => state.todos);

export default todosSlice.reducer;