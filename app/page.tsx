"use client";

import { useState } from "react";
import ClientList from "./components/ClientList";
import TaskList from "./components/TaskList";

export default function Home() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [refreshTasks, setRefreshTasks] = useState(0);

  const handleTaskAdded = () => {
    setRefreshTasks((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          LedgersCFO Mini Compliance Tracker
        </h1>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar: Clients */}
        <aside className="w-full md:w-1/3 lg:w-1/4">
          <ClientList
            selectedClientId={selectedClientId}
            onSelectClient={setSelectedClientId}
          />
        </aside>

        {/* Main Content: Tasks */}
        <section className="flex-1">
          {selectedClientId ? (
            <TaskList
              clientId={selectedClientId}
              key={refreshTasks}
              onTaskAdded={handleTaskAdded}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center border-t-4 border-indigo-400">
              <h2 className="text-xl font-medium text-gray-700 mb-2">
                No Client Selected
              </h2>
              <p className="text-gray-500">
                Please select a client from the sidebar to view and manage their
                compliance tasks.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
