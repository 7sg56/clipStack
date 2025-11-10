// storage.ts
import type { ClipboardEntry } from "./types";

const STORAGE_KEY = "clip_entries";

export async function getEntries(): Promise<ClipboardEntry[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (res) => {
      resolve(res[STORAGE_KEY] || []);
    });
  });
}

export async function setEntries(entries: ClipboardEntry[]): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: entries }, resolve);
  });
}

export async function addEntry(text: string) {
  const entries = await getEntries();
  const newEntry: ClipboardEntry = {
    id: crypto.randomUUID(),
    text,
    timestamp: Date.now(),
  };
  entries.unshift(newEntry);
  await setEntries(entries.slice(0, 200));
}
