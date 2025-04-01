import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchTodos, 
  addNewTodo,
} from '@/store/features/todo/todo-actions';
import { selectAllTodos, removeCompletedTodos } from '@/store/features/todo/todo-slice';
import { TodoItem } from '@/components/todo-item/todo-item';
import { todoService } from '@/api/todo.service';

import './styles.css';

export const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectAllTodos);
  const loading = useAppSelector((state) => state.todos.loading);
  const error = useAppSelector((state) => state.todos.error);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  
  
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);
  
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      dispatch(addNewTodo(newTodoTitle.trim()));
      setNewTodoTitle('');
    }
  };
  
  const handleDeleteTodo = async (id: string) => {
    try {
      const success = await todoService.deleteTodo(id);
      if (success) {
        // Перезагрузим задачи после успешного удаления
        dispatch(fetchTodos());
      }
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    }
  };
  
  const handleClearCompleted = () => {
    dispatch(removeCompletedTodos());
  };
  
  // Группировка задач по статусу
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  
  if (loading) return <div className="loading">Загрузка задач...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  
  return (
    <div className="todo-list-container">
      <h1>Список задач</h1>
      
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Добавить новую задачу..."
        />
        <button type="submit">Добавить</button>
      </form>
      
      <div className="todo-stats">
        <span>Всего: {todos.length}</span>
        <span>Активные: {activeTodos.length}</span>
        <span>Завершенные: {completedTodos.length}</span>
      </div>
      
      <div className="todo-list">
        <h2>Активные задачи</h2>
        {activeTodos.length === 0 ? (
          <p className="empty-list">Нет активных задач</p>
        ) : (
          activeTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todoData={todo}
              onDelete={handleDeleteTodo}
            />
          ))
        )}
        
        <h2>Завершенные задачи</h2>
        {completedTodos.length === 0 ? (
          <p className="empty-list">Нет завершенных задач</p>
        ) : (
          <>
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todoData={todo}
                onDelete={handleDeleteTodo}
              />
            ))}
            <button 
              onClick={handleClearCompleted}
              className="clear-completed"
            >
              Очистить завершенные
            </button>
          </>
        )}
      </div>
    </div>
  );
};