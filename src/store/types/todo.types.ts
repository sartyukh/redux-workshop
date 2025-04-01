export interface TodoDTO {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

export interface TodosState {
  loading: boolean;
  error: string | null;
}

export class Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  userId: string;

  constructor(data: Partial<Todo> | TodoDTO) {
    this.id = data.id || crypto.randomUUID();
    this.title = data.title || '';
    this.completed = !!data.completed;
    this.userId = data.userId || '';
    
    // Конвертация строки даты в объект Date
    if (data instanceof Todo) {
      this.createdAt = data.createdAt;
    } else if (typeof data.createdAt === 'string') {
      this.createdAt = new Date(data.createdAt);
    } else if (data.createdAt instanceof Date) {
      this.createdAt = data.createdAt;
    } else {
      this.createdAt = new Date();
    }
  }

  // Метод для конвертации в DTO для отправки на сервер
  toDTO(): TodoDTO {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
      createdAt: this.createdAt.toISOString(),
      userId: this.userId
    };
  }

  // Статический метод для создания Todo из DTO
  static fromDTO(dto: TodoDTO): Todo {
    return new Todo(dto);
  }

  // Вспомогательные методы для работы с Todo
  toggle(): void {
    this.completed = !this.completed;
  }

  isOverdue(deadline: Date): boolean {
    return !this.completed && this.createdAt < deadline;
  }

  formatCreatedDate(locale: string = 'ru-RU'): string {
    return this.createdAt.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Создание копии объекта
  clone(): Todo {
    return new Todo(this);
  }
}