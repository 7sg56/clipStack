import { useEffect, useState } from "react";
import { MdContentCopy, MdDelete } from "react-icons/md";
import { BsPinAngleFill, BsPinAngle } from "react-icons/bs";
import { HiSun, HiMoon } from "react-icons/hi";
import type { ClipboardEntry } from "./types";

export default function App() {
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);
  const [query, setQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Load entries
    chrome.runtime.sendMessage({ type: "GET_ENTRIES" }, (res) => {
      if (chrome.runtime.lastError) {
        console.error("ClipStack: Failed to get entries:", chrome.runtime.lastError);
        return;
      }
      if (res?.entries) setEntries(res.entries);
    });

    // Load theme preference
    chrome.storage.local.get(["theme"], (res) => {
      if (res.theme) setTheme(res.theme);
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    chrome.storage.local.set({ theme: newTheme });
  };

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

  const isDark = theme === "dark";

  return (
    <div className={`flex flex-col h-full ${
      isDark ? "bg-[#0a0a0a]" : "bg-gray-50"
    }`}>
      <div className={`px-2 py-2 border-b ${
        isDark ? "border-gray-800/50 bg-black/40" : "border-gray-200 bg-white/60"
      } backdrop-blur-sm`}>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search clipboard..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`flex-1 px-2.5 py-2 text-sm rounded-lg border outline-none transition-all ${
              isDark
                ? "bg-white/5 border-gray-800 text-gray-100 placeholder-gray-600 hover:bg-white/10 focus:bg-white/10 focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            }`}
          />
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all ${
              isDark
                ? "text-gray-400 hover:text-yellow-400 hover:bg-white/5"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            }`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <HiSun size={18} /> : <HiMoon size={18} />}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-1.5 py-1.5">
        {filtered.length === 0 ? (
          <p className={`text-center text-sm py-8 font-light ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}>
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
                  className={`group flex items-start gap-2 px-2.5 py-2 border rounded-lg transition-all duration-200 ${
                    shouldTruncate ? "cursor-pointer" : ""
                  } ${
                    isDark
                      ? "bg-white/[0.02] hover:bg-white/[0.06] border-transparent hover:border-gray-800/50"
                      : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] break-words leading-relaxed font-light ${
                      !isExpanded && shouldTruncate ? "line-clamp-1" : ""
                    } ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                      {entry.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-mono ${
                        isDark ? "text-gray-600" : "text-gray-500"
                      }`}>
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
                      className={`p-1 rounded transition-all ${
                        isDark
                          ? "text-gray-400 hover:text-green-400 hover:bg-white/5"
                          : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                      }`}
                      title="Copy"
                    >
                      <MdContentCopy size={14} />
                    </button>
                    <button
                      onClick={(e) => togglePin(entry, e)}
                      className={`p-1 rounded transition-all ${
                        entry.pinned
                          ? isDark ? "text-yellow-400" : "text-yellow-600"
                          : isDark
                            ? "text-gray-400 hover:text-yellow-400 hover:bg-white/5"
                            : "text-gray-500 hover:text-yellow-600 hover:bg-yellow-50"
                      }`}
                      title={entry.pinned ? "Unpin" : "Pin"}
                    >
                      {entry.pinned ? <BsPinAngleFill size={14} /> : <BsPinAngle size={14} />}
                    </button>
                    <button
                      onClick={(e) => remove(entry.id, e)}
                      className={`p-1 rounded transition-all ${
                        isDark
                          ? "text-gray-400 hover:text-red-400 hover:bg-white/5"
                          : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                      }`}
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
