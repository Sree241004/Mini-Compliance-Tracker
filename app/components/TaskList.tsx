"use client";

import { useEffect, useState, useMemo } from "react";
import TaskForm from "./TaskForm";

export type Task = {
  id: number;
  client_id: number;
  title: string;
  description: string;
  category: string;
  due_date: string;
  status: string;
  priority: string;
};

export default function TaskList({
  clientId,
  onTaskAdded,
}: {
  clientId: number;
  onTaskAdded: () => void;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const loadTasks = () => {
    setLoading(true);
    fetch(`/api/tasks?clientId=${clientId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Server error: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
          console.error("API returned error:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load tasks", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTasks();
  }, [clientId]);

  const toggleTaskStatus = async (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadTasks(); // reload the updated tasks
      }
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "Completed") return false;
    const due = new Date(dueDate);
    const today = new Date();
    // Neutralize time to compare dates safely
    due.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return due < today;
  };

  const uniqueCategories = useMemo(() => {
    const cats = tasks.map((t) => t.category);
    return ["All", ...Array.from(new Set(cats))];
  }, [tasks]);

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus !== "All" && t.status !== filterStatus) return false;
    if (filterCategory !== "All" && t.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-lg shadow p-5 border-t-4 border-indigo-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Compliance Tasks</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and track filings, audits, and compliance.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 flex items-center gap-2 rounded-md font-medium transition shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <TaskForm
            clientId={clientId}
            onSuccess={() => {
              setShowAddForm(false);
              loadTasks();
              onTaskAdded();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Filters */}
      {tasks.length > 0 && (
        <div className="flex flex-wrap gap-4 items-center px-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Task Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 animate-pulse">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">No tasks match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const overdue = isOverdue(task.due_date, task.status);
            return (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow-sm p-5 border-l-4 transition-all duration-300 relative group ${task.status === "Completed" ? "border-green-500 opacity-75" : overdue ? "border-red-500 ring-1 ring-red-100" : "border-yellow-400"}`}
              >
                {/* Overdue Badge */}
                {overdue && (
                  <span className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded shadow-sm animate-pulse">
                    OVERDUE
                  </span>
                )}
                
                <div className="mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {task.category}
                  </span>
                </div>
                
                <h3 className={`text-lg font-bold mt-2 ${task.status === "Completed" ? "text-gray-500 line-through" : "text-gray-900"}`}>
                  {task.title}
                </h3>
                
                <p className="text-gray-600 text-sm mt-2 line-clamp-2 min-h-[40px]">
                  {task.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs">Due Date</div>
                    <div className={`font-medium ${overdue ? "text-red-600 font-bold" : "text-gray-800"}`}>
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Priority</div>
                    <div className={`font-medium ${task.priority === "High" ? "text-orange-600" : task.priority === "Medium" ? "text-blue-600" : "text-gray-600"}`}>
                      {task.priority}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex justify-end">
                  <button
                    onClick={() => toggleTaskStatus(task.id, task.status)}
                    className={`text-sm font-medium px-4 py-2 rounded transition-colors ${task.status === "Completed" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                  >
                    {task.status === "Completed" ? "Mark Pending" : "Mark Completed"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
