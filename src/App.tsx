import { useEffect, useState } from "react";
import { MdContentCopy, MdDelete } from "react-icons/md";
import { BsPinAngleFill, BsPinAngle } from "react-icons/bs";
import type { ClipboardEntry } from "./types";

export default function App() {
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);
  const [query, setQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_ENTRIES" }, (res) => {
      if (chrome.runtime.lastError) {
        console.error("ClipStack: Failed to get entries:", chrome.runtime.lastError);
        return;
      }
      if (res?.entries) setEntries(res.entries);
    });
  }, []);

  const filtered = entries
    .filter((e) => e.text.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      // Pinned items first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Then by timestamp (newest first)
      return b.timestamp - a.timestamp;
    });

  const copyToClipboard = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error(err);
    }
  };

  const remove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({ type: "REMOVE_ENTRY", id }, () => {
      if (chrome.runtime.lastError) {
        console.error("ClipStack: Failed to remove entry:", chrome.runtime.lastError);
        return;
      }
      setEntries((prev) => prev.filter((x) => x.id !== id));
    });
  };

  const togglePin = (entry: ClipboardEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...entry, pinned: !entry.pinned };
    chrome.runtime.sendMessage({ type: "UPDATE_ENTRY", entry: updated }, () => {
      if (chrome.runtime.lastError) {
        console.error("ClipStack: Failed to update entry:", chrome.runtime.lastError);
        return;
      }
      setEntries((prev) =>
        prev.map((x) => (x.id === entry.id ? updated : x))
      );
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <div className="px-2 py-2 border-b border-gray-800/50 bg-black/40 backdrop-blur-sm">
        <input
          type="text"
          placeholder="Search clipboard..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-2.5 py-2 text-sm rounded-lg bg-white/5 border border-gray-800 text-gray-100 placeholder-gray-600 hover:bg-white/10 focus:bg-white/10 focus:ring-1 focus:ring-gray-700 focus:border-gray-700 outline-none transition-all"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto px-1.5 py-1.5">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center text-sm py-8 font-light">
            {query ? "No matching entries" : "No clipboard history yet"}
          </p>
        ) : (
          <div className="space-y-1">
            {filtered.map((entry) => {
              const isExpanded = expandedIds.has(entry.id);
              const shouldTruncate = entry.text.length > 70;
              
              return (
                <div
                  key={entry.id}
                  onClick={() => shouldTruncate && toggleExpand(entry.id)}
                  className={`group flex items-start gap-2 px-2.5 py-2 bg-white/[0.02] hover:bg-white/[0.06] border border-transparent hover:border-gray-800/50 rounded-lg transition-all duration-200 ${
                    shouldTruncate ? "cursor-pointer" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] text-gray-200 break-words leading-relaxed font-light ${
                      !isExpanded && shouldTruncate ? "line-clamp-1" : ""
                    }`}>
                      {entry.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-gray-600 font-mono">
                        {new Date(entry.timestamp).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {shouldTruncate && (
                        <span className="text-[10px] text-blue-500 font-medium">
                          {isExpanded ? "show less" : "show more"}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-0.5 flex-shrink-0 ${
                    entry.pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  } transition-opacity`}>
                    <button
                      onClick={(e) => copyToClipboard(entry.text, e)}
                      className="p-1 text-gray-400 hover:text-green-400 hover:bg-white/5 rounded transition-all"
                      title="Copy"
                    >
                      <MdContentCopy size={14} />
                    </button>
                    <button
                      onClick={(e) => togglePin(entry, e)}
                      className={`p-1 ${
                        entry.pinned ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"
                      } hover:bg-white/5 rounded transition-all`}
                      title={entry.pinned ? "Unpin" : "Pin"}
                    >
                      {entry.pinned ? <BsPinAngleFill size={14} /> : <BsPinAngle size={14} />}
                    </button>
                    <button
                      onClick={(e) => remove(entry.id, e)}
                      className="p-1 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded transition-all"
                      title="Delete"
                    >
                      <MdDelete size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
