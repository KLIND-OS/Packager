export default function getPressContent() {
  return `
export default function press(button) {
  // Increment private state by one.
  // All private states (states defined just for specific window) should be saved
  // as dataset of some object inside of that window. For example the specific
  // button, the root or the window.
  let clicked = parseInt(button.dataset.clicked);
  clicked++;
  button.dataset.clicked = clicked;
  button.textContent = \`Stisknuto: \${clicked}\`;
}
  `.trim();
}
