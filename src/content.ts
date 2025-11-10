document.addEventListener("copy", (e) => {
  let text = e.clipboardData?.getData("text/plain");
  
  if (!text) {
    text = document.getSelection()?.toString();
  }
  
  text = text?.trim();
  
  if (text) {
    chrome.runtime.sendMessage({ type: "CLIPBOARD_COPIED", text }, () => {
      if (chrome.runtime.lastError) {
        console.error("ClipStack: Failed to send message:", chrome.runtime.lastError);
      }
    });
  }
});
  