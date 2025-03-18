
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    // Try alternative approach for Electron
    if (window.electronAPI) {
      try {
        await window.electronAPI.writeClipboard(text);
        return true;
      } catch (electronErr) {
        console.error('Failed to copy via Electron:', electronErr);
        return false;
      }
    }
    return false;
  }
}
