import type { Task, TaskStatus } from "@/types";

type Props = {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
};

const statusColors: Record<TaskStatus, string> = {
  "todo": "bg-gray-100 text-gray-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  "done": "bg-green-100 text-green-700",
};

export default function TaskCard({ task, onStatusChange, onDelete }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="text-xs text-gray-400">
          Due: {new Date(task.dueDate * 1000).toLocaleDateString()}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button
          onClick={() => onDelete(task.id)}
          className="text-sm text-red-500 hover:text-red-700 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
