import type { Task, TaskStatus } from "@/types";

type Props = {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
};

const statusStyles: Record<TaskStatus, string> = {
  "todo": "bg-slate-700/50 text-slate-300",
  "in-progress": "bg-yellow-500/10 text-yellow-400",
  "done": "bg-green-500/10 text-green-400",
};

const statusLabels: Record<TaskStatus, string> = {
  "todo": "Todo",
  "in-progress": "In Progress",
  "done": "Done",
};

export default function TaskCard({ task, onStatusChange, onDelete }: Props) {
  return (
    <div className="bg-[#1a1c28] border border-[#2a2d3a] rounded-xl p-4 flex flex-col gap-3 hover:border-slate-600/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-white text-sm leading-snug">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusStyles[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-slate-400 leading-relaxed">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="text-xs text-slate-500">
          Due: {new Date(task.dueDate * 1000).toLocaleDateString()}
        </p>
      )}

      <div className="flex items-center justify-between mt-1 pt-3 border-t border-[#2a2d3a]">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="text-xs bg-[#0f1117] border border-[#2a2d3a] text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#6366f1] cursor-pointer"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button
          onClick={() => onDelete(task.id)}
          className="text-xs text-slate-500 hover:text-red-400 font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
