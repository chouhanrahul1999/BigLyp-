"use client";

import { useState } from "react";
import type { Task, TaskStatus } from "@/types";
import { api } from "@/lib/api";

type Props = {
  onClose: () => void;
  onCreate: (task: Task) => void;
  token: string;
};

export default function CreateTaskModal({ onClose, onCreate, token }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const task = await api.tasks.create(token, {
        title,
        description: description || undefined,
        status,
        dueDate: dueDate ? Math.floor(new Date(dueDate).getTime() / 1000) : undefined,
      });
      onCreate(task);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-[#0f1117] border border-[#2a2d3a] text-white placeholder:text-slate-600 h-11 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a1c28] border border-[#2a2d3a] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">New Task</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="text-slate-400 text-sm block mb-2">Title</label>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-2">Description <span className="text-slate-600">(optional)</span></label>
            <textarea
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#0f1117] border border-[#2a2d3a] text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#0f1117] border border-[#2a2d3a] text-white h-11 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] cursor-pointer"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">Due Date <span className="text-slate-600">(optional)</span></label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#0f1117] border border-[#2a2d3a] text-slate-300 h-11 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 bg-transparent border border-[#2a2d3a] text-slate-300 hover:bg-slate-700/30 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
