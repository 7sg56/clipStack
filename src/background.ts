import { addEntry, getEntries, setEntries } from "./storage";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "CLIPBOARD_COPIED") {
    addEntry(msg.text);
  } else if (msg.type === "GET_ENTRIES") {
    getEntries().then((entries) => sendResponse({ entries }));
    return true;
  } else if (msg.type === "REMOVE_ENTRY") {
    getEntries().then((entries) => {
      const updated = entries.filter((e) => e.id !== msg.id);
      setEntries(updated).then(() => sendResponse({ ok: true }));
    });
    return true;
  } else if (msg.type === "UPDATE_ENTRY") {
    getEntries().then((entries) => {
      const idx = entries.findIndex((e) => e.id === msg.entry.id);
      if (idx !== -1) entries[idx] = msg.entry;
      setEntries(entries).then(() => sendResponse({ ok: true }));
    });
    return true;
  }
});
