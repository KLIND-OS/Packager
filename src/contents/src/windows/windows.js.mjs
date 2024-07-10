export default function getWindows({ defaultWindowName }) {
  return `
import mainClose from "./MAIN/close";
import mainOpen from "./MAIN/open";

export const windowNames = {
  MAIN: "${defaultWindowName}",
  SECOND: "${defaultWindowName}-2",
};

export function addWindows() {
  this.app.createWindow({
    name: this.windowNames.MAIN,
    buttons: {
      close: mainClose.bind(this),
      mini: () => {},
    },
    onStart: mainOpen.bind(this),
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
