import { createAsyncThunk } from "@reduxjs/toolkit";
import { Todo } from "../../types/todo.types";
import { RootState } from "@/store/redux";
import { todoService } from "@/api/todo.service";

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    const todos = await todoService.fetchAll();
    // Преобразуем объекты Todo в DTO перед сохранением в Redux
    return todos.map(todo => todo.toDTO());
  }
);

export const addNewTodo = createAsyncThunk(
  'todos/addNewTodo',
  async (title: string) => {
    const newTodo = new Todo({
      title,
      completed: false,
      createdAt: new Date(),
      userId: 'current-user'
    });
    
    const createdTodo = await todoService.createTodo(newTodo);
    // Возвращаем DTO вместо объекта Todo
    return createdTodo.toDTO();
  }
);

export const updateTodoStatus = createAsyncThunk(
  'todos/updateTodoStatus',
  async ({ id, completed }: { id: string; completed: boolean }, { getState }) => {
    const state = getState() as RootState;
    const existingTodo = state.todos.entities[id];
    
    if (!existingTodo) {
      throw new Error('Задача не найдена');
    }
    
    // Создаем модель из существующего объекта
    const todo = new Todo(existingTodo);
    todo.completed = completed;
    
    const updatedTodo = await todoService.updateTodo(todo);
    // Возвращаем DTO вместо объекта Todo
    return updatedTodo.toDTO();
  }
);
