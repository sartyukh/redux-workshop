import React, { useState, useMemo } from 'react';
import { Todo, TodoDTO } from '../../store/types/todo.types';
import { useAppDispatch } from '@/store/hooks';
import { updateTodoStatus } from '@/store/features/todo/todo-actions';
import './styles.css';

interface TodoItemProps {
  todoData: TodoDTO;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todoData, onDelete }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todoData.title);
  
  // Создаем объект Todo из DTO для использования методов класса
  const todo = useMemo(() => new Todo(todoData), [todoData]);
  
  const handleToggleStatus = () => {
    // Изменяем статус, используя модель Todo
    const updatedTodo = todo.clone();
    updatedTodo.toggle();
    
    dispatch(updateTodoStatus({ 
      id: todo.id, 
      completed: updatedTodo.completed 
    }));
  };
  
  // Используем методы модели Todo
  const formattedDate = todo.formatCreatedDate();
  
  // Определим, просрочена ли задача (если она создана более 7 дней назад)
  const overdue = todo.isOverdue(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  
  return (
    <div className={`todo-item ${todoData.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
      <input
        type="checkbox"
        checked={todoData.completed}
        onChange={handleToggleStatus}
      />
      
      <div className="todo-details">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <span 
            className="todo-title"
            onClick={() => setIsEditing(true)}
          >
            {todoData.title}
          </span>
        )}
        
        <span className="todo-date">
          Создано: {formattedDate}
        </span>
      </div>
      
      <button 
        className="delete-btn"
        onClick={() => onDelete(todoData.id)}
      >
        Удалить
      </button>
    </div>
  );
}; 