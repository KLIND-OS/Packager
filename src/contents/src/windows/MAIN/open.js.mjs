export default function getMainOpen() {
  return `
export default function mainOpen(win) {
  const el = win.querySelector("#num");
  const interval = setInterval(() => {
    // Increment private variable by one every second.
    let num = parseInt(el.dataset.num);

    num++;
    el.dataset.num = num;

    el.innerText = num;
  }, 1000);

  // Save the interval id to dataset of the window.
  // This is needed to clear the interval when window is closed.
  win.dataset.interval = interval;
}
  `.trim();
}
