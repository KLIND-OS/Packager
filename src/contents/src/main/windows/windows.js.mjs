export default function getWindows({ defaultWindowName }) {
  return `
export const windowNames = {
  MAIN: "${defaultWindowName}",
  SECOND: "${defaultWindowName}-2",
};

export function addWindows() {
  this.app.createWindow({
    name: this.windowNames.MAIN,
    buttons: {
      close: this.close.MAIN.bind(this),
      mini: () => {},
    },
    onStart: this.open.MAIN.bind(this),
    defaultWindow: true,

    // We select what HTML should be used for this window. KLIND OS uses
    // Handlebars as a template engine. More info in documentation.
    content: "pages/main.html",
    // Here we pass props to the template engine.
    passProps: () => {
      return {
        opened: ++this.globalStates.openedTimes,
        key: this.key,
      };
    },
  });

  this.app.createWindow({
    name: this.windowNames.SECOND,
    buttons: {
      close: () => {},
      mini: () => {},
    },
    content: "pages/second.html",
  });
}
  `.trim();
}
