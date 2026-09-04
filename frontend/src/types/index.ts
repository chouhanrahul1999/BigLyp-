export type User = {
  id: string;
  name: string;
  email: string;
};

export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: number | null;
  createdAt: number;
  updatedAt: number;
};

export type AuthResponse = {
  token: string;
};

export type ApiError = {
  error: string;
};
