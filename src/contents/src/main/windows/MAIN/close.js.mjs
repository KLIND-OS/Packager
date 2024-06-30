export default function getMainClose() {
  return `
export default function mainClose(win) {
  // Clear interval when window closed.
  clearInterval(win.dataset.interval);
}
  `.trim();
}
