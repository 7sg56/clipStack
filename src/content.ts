document.addEventListener("copy", () => {
    const text = document.getSelection()?.toString()?.trim();
    if (text) chrome.runtime.sendMessage({ type: "CLIPBOARD_COPIED", text });
  });
  