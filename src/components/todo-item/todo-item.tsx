import React, { useState } from 'react';
import { Todo } from '@/store/types/todo.types';
import './styles.css';

interface TodoItemProps {
  todoData: Todo;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ 
  todoData, 
  onToggleComplete, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todoData.title);
  
  const handleToggleStatus = () => {
    onToggleComplete(todoData.id, !todoData.completed);
  };
  
  const handleDelete = () => {
    onDelete(todoData.id);
  };
  
  return (
    <div className={`todo-item ${todoData.completed ? 'completed' : ''}`}>
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
          Создано: {new Date(todoData.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <button 
        className="delete-btn"
        onClick={handleDelete}
      >
        Удалить
      </button>
    </div>
  );
}; 