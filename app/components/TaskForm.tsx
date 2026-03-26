"use client";

import { useState } from "react";

export default function TaskForm({
  clientId,
  onSuccess,
  onCancel,
}: {
  clientId: number;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Compliance");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !dueDate) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          due_date: dueDate,
          priority,
          client_id: clientId,
        }),
      });

      if (!res.ok) throw new Error("Failed to create task");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Q1 Tax Filing"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed notes about the task..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="category-suggestions"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <datalist id="category-suggestions">
            <option value="Compliance" />
            <option value="Tax" />
            <option value="Audit" />
            <option value="HR" />
            <option value="Legal" />
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {submitting ? "Saving..." : "Save Task"}
        </button>
      </div>
    </form>
  );
}
