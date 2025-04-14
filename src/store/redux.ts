import { configureStore } from '@reduxjs/toolkit'
import todoSlice from './features/todo/todo-slice'
import { todoApi } from '@/api/todo.api';
const store = configureStore({ 
    reducer: {
        todos: todoSlice,
        [todoApi.reducerPath]: todoApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(todoApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;