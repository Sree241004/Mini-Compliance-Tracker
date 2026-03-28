"use client";

import { useEffect, useState } from "react";

type Client = {
  id: number;
  company_name: string;
  country: string;
  entity_type: string;
};

export default function ClientList({
  selectedClientId,
  onSelectClient,
}: {
  selectedClientId: number | null;
  onSelectClient: (id: number) => void;
}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then(async (res) => {
        if (!res.ok) throw new Error("Server error: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setClients(data);
        } else {
          setClients([]);
          console.error("API returned error:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load clients:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-800">Clients</h2>
      </div>
      
      {loading ? (
        <div className="p-5 text-gray-500 text-sm animate-pulse">Loading clients...</div>
      ) : clients.length === 0 ? (
        <div className="p-5 text-gray-500 text-sm">No clients found.</div>
      ) : (
        <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {clients.map((client) => (
            <li key={client.id}>
              <button
                onClick={() => onSelectClient(client.id)}
                className={`w-full text-left px-5 py-4 hover:bg-indigo-50 transition-colors focus:outline-none focus:bg-indigo-50 ${
                  selectedClientId === client.id ? "bg-indigo-50 border-l-4 border-indigo-500 pl-4" : "border-l-4 border-transparent"
                }`}
              >
                <div className="font-medium text-gray-900">{client.company_name}</div>
                <div className="text-xs text-gray-500 mt-1 flex gap-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded shadow-sm">{client.country}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded shadow-sm">{client.entity_type}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
