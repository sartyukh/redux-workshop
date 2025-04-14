import React, { useState } from 'react';
import { TodoItem } from '@/components/todo-item/todo-item';
import { useTodos, useCreateTodo, useUpdateTodoStatus, useDeleteTodo, useDeleteCompletedTodos } from '@/api/todo.hooks';
import { TodoDTO } from '@/api/types/todo.dto';
import './styles.css';

export const HomePage: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  
  const { data: todos = [], isLoading, error, isFetching } = useTodos();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodoStatus();
  const deleteTodo = useDeleteTodo();
  const deleteCompletedTodos = useDeleteCompletedTodos();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      createTodo.mutate(newTodoTitle.trim());
      setNewTodoTitle('');
    }
  };
  
  const handleToggleComplete = (id: string, completed: boolean) => {
    updateTodo.mutate({ id, completed });
  };
  
  const handleDelete = (id: string) => {
    deleteTodo.mutate(id);
  };

  const handleDeleteCompleted = () => {
    deleteCompletedTodos.mutate();
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
    return <div className="error">Ошибка: {error.message}</div>;
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
          disabled={createTodo.isPending}
        />
        <button type="submit" disabled={createTodo.isPending}>
          {createTodo.isPending ? 'Добавление...' : 'Добавить'}
        </button>
      </form>
      
      <div className="todo-stats">
        <p>Всего задач: {totalTodos}</p>
        <p>Активных: {activeCount}</p>
        <p>Завершенных: {completedCount}</p>
        {completedCount > 0 && (
          <button 
            onClick={handleDeleteCompleted}
            disabled={deleteCompletedTodos.isPending}
          >
            {deleteCompletedTodos.isPending ? 'Удаление...' : 'Удалить завершенные'}
          </button>
        )}
      </div>
      
      
      <div className="todo-list">
        <div>
          <div className="todo-list_header">
            <h2>Активные задачи</h2>
            {isFetching && <p>Загрузка...</p>}
          </div>
        {activeTodos.map((todo: TodoDTO) => (
            <TodoItem 
              key={todo.id} 
              todoData={todo}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
          />
        ))}
        </div>
        
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