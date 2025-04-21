import { Suspense, use } from 'react';
import { TodoItem } from './todo-item/todo-item';
import { todoService } from '@/api/todo.service';

import { useDeleteTodoMutation, useUpdateTodoStatusMutation } from '@/api/todo.api';

const TodoDetails = ({ id }: { id: string }) => {
  const todo = use(todoService.getById(id));
  
  return (
    <div className="todo-details">
      <h3>Детали задачи</h3>
      <p>ID: {todo.id}</p>
      <p>Заголовок: {todo.title}</p>
      <p>Статус: {todo.completed ? 'Завершено' : 'Активно'}</p>
    </div>
  );
};

const TodoList = () => {
  const todos = use(todoService.fetchAll());
  const [updateTodoStatus] = useUpdateTodoStatusMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateTodoStatus({ id, completed });
  };
  
  const handleDelete = (id: string) => {
    deleteTodo(id);
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="todo-list">
      <h2>{`Активные задачи (${activeTodos.length})`}</h2>
      {activeTodos.map(todo => (
        <div key={todo.id} className="todo-item">
          <TodoItem todoData={todo} onToggleComplete={handleToggleComplete} onDelete={handleDelete} />
          <Suspense fallback={<div>Загрузка деталей...</div>}>
            <TodoDetails id={todo.id} />
          </Suspense>
        </div>
      ))}
      
      <h2>Завершенные задачи</h2>
      {completedTodos.map(todo => (
        <div key={todo.id} className="todo-item">
          <TodoItem todoData={todo} onToggleComplete={() => {}} onDelete={() => {}} />
          <Suspense fallback={<div>Загрузка деталей...</div>}>
            <TodoDetails id={todo.id} />
          </Suspense>
        </div>
      ))}
    </div>
  );
};

export const TodoListWithSuspense = () => {
  return (
    <div className="todo-app">
      <h1>Список задач с Suspense</h1>
      <Suspense fallback={<div className="loading">Загрузка списка задач...</div>}>
        <TodoList />
      </Suspense>
    </div>
  );
}; 