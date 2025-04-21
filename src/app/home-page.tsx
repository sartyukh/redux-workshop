import React, { useState } from 'react';
import { TodoItem } from '@/components/todo-item/todo-item';
import { TodoDTO } from '@/api/types/todo.dto';
import {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoStatusMutation,
  useDeleteTodoMutation,
  useDeleteCompletedTodosMutation,
} from '@/api/todo.api';
import './styles.css';

export const HomePage: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  
  const { data: todos = [], isLoading, error } = useGetTodosQuery();
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  const [updateTodoStatus] = useUpdateTodoStatusMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [deleteCompletedTodos, { isLoading: isDeletingCompleted }] = useDeleteCompletedTodosMutation();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      createTodo(newTodoTitle.trim());
      setNewTodoTitle('');
    }
  };
  
  const handleToggleComplete = (id: string, completed: boolean) => {
    updateTodoStatus({ id, completed });
  };
  
  const handleDelete = (id: string) => {
    deleteTodo(id);
  };

  const handleDeleteCompleted = () => {
    deleteCompletedTodos();
  };
  
  const completedTodos = todos.filter((todo: TodoDTO) => todo.completed);
  const activeTodos = todos.filter((todo: TodoDTO) => !todo.completed);
  
  const totalTodos = todos.length;
  const completedCount = completedTodos.length;
  const activeCount = activeTodos.length;
  
  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }
  
  if (error) {
    return <div className="error">Ошибка: {'error' in error ? error.error : 'Неизвестная ошибка'}</div>;
  }
  
  return (
    <div className="todo-app">
      <h1>Список задач</h1>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Добавить новую задачу..."
          disabled={isCreating}
        />
        <button type="submit" disabled={isCreating}>
          {isCreating ? 'Добавление...' : 'Добавить'}
        </button>
      </form>
      
      <div className="todo-stats">
        <p>Всего задач: {totalTodos}</p>
        <p>Активных: {activeCount}</p>
        <p>Завершенных: {completedCount}</p>
        {completedCount > 0 && (
          <button 
            onClick={handleDeleteCompleted}
            disabled={isDeletingCompleted}
          >
            {isDeletingCompleted ? 'Удаление...' : 'Удалить завершенные'}
          </button>
        )}
      </div>
      
      <div className="todo-list">
        <h2>Активные задачи</h2>
        {activeTodos.map((todo: TodoDTO) => (
          <TodoItem 
            key={todo.id} 
            todoData={todo}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
          />
        ))}
        
        <h2>Завершенные задачи</h2>
        {completedTodos.map((todo: TodoDTO) => (
          <TodoItem 
            key={todo.id} 
            todoData={todo}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};