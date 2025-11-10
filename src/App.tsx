import { useEffect, useState } from "react";
import type { ClipboardEntry } from "./types";

export default function App() {
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_ENTRIES" }, (res) => {
      if (res?.entries) setEntries(res.entries);
    });
  }, []);

  const filtered = entries.filter((e) =>
    e.text.toLowerCase().includes(query.toLowerCase())
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error(e);
    }
  };

  const remove = (id: string) => {
    chrome.runtime.sendMessage({ type: "REMOVE_ENTRY", id }, () => {
      setEntries((prev) => prev.filter((x) => x.id !== id));
    });
  };

  const togglePin = (entry: ClipboardEntry) => {
    const updated = { ...entry, pinned: !entry.pinned };
    chrome.runtime.sendMessage({ type: "UPDATE_ENTRY", entry: updated }, () => {
      setEntries((prev) =>
        prev.map((x) => (x.id === entry.id ? updated : x))
      );
    });
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      <input
        type="text"
        placeholder="Search clipboard..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <div className="overflow-y-auto max-h-[400px]">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center mt-4">No entries</p>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.id}
              className="flex justify-between items-start gap-2 p-2 mb-1 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              <div className="flex-1 overflow-hidden">
                <p className="whitespace-pre-wrap break-words">{entry.text}</p>
                <span className="text-xs text-gray-500">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => copyToClipboard(entry.text)}
                  className="text-green-400 hover:text-green-500"
                >
                  📋
                </button>
                <button
                  onClick={() => togglePin(entry)}
                  className="text-yellow-400 hover:text-yellow-500"
                >
                  {entry.pinned ? "📌" : "📍"}
                </button>
                <button
                  onClick={() => remove(entry.id)}
                  className="text-red-400 hover:text-red-500"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
