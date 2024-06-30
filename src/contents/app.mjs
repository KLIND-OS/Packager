export default function getApp({ appname, hidden, defaultWindowName }) {
  return `
// Note (remove after development):
//
// If you want to use any NodeJS package that you downloaded in the
// installation use \`LowLevelApi.NodePackages.get("package")\` instead of \`require("package")\`
// Also, if you want to use Linux applications that you installed during app
// installation, you need to use them from Bash. Use \`LowLevelApi.child_process.exec("command")\`

// The app is passed to ClassConstructor that constructs and creates the app.
ClassConstructor.add(
  // We use private class to prevent any issues with other applications.
  // All of the variables will be global, this is not sandboxed!
  // Please don't create global variables, it may cause issues.
  class {
    // Save the app class and the key to access this private class from outside.
    app;
    key;

    // Here we define global states.
    globalStates = {
      openedTimes: 0,
    };

    // I recommend to create object called utils where you will save utility functions.
    utils = {
      notify: (data) => control.notify(this.app.info.name, data),
    };

    // Here we put functions that will be executed by the user, for example on click.
    functions = {
      printHello: () => {
        // Create notification.
        this.utils.notify("Hello!");
      },
      press: (button) => {
        // Increment private state by one.
        // All private states (states defined just for specific window) should be saved
        // as dataset of some object inside of that window. For example the specific
        // button, the root or the window.
        let clicked = parseInt(button.dataset.clicked);
        clicked++;
        button.dataset.clicked = clicked;
        button.textContent = \`Stisknuto: \${clicked}\`;
      },
      openSecond: () => {
        windows.open(this.app.windowParser.parseName(this.windowNames.SECOND));
      },
    };

    // Here we define the name of the windows. This will be used later to add styles
    // and other things. That's why we put it in the variable.
    windowNames = {
      MAIN: "${defaultWindowName}",
      SECOND: "${defaultWindowName}-2",
    };

    // Here we save all functions that are executed when user opens specific window.
    open = {
      MAIN: (win) => {
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
      },
    };

    // Here we save all functions that are executed when user closes specific window.
    close = {
      MAIN: (win) => {
        // Clear interval when window closed.
        clearInterval(win.dataset.interval);
      },
    };

    // Here the app is created.
    constructor(key) {
      // Save the key
      this.key = key;

      // Create the app
      // Make sure that the name propery is the same as the name inside file \`name.txt\`
      // Otherwise the assets will not be loaded properly.
      this.app = new App({
        name: "${appname}",
        hidden: ${hidden == "Ano" ? "true" : "false"},
      });

      // Create MAIN window.
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
            key,
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

      // CSS styles
      const styles = new JSSElement("", undefined, [
        new JSSElement(
          \`.\${this.app.windowParser.parseClass(this.windowNames.MAIN)}\`,
          new JSSStyles([new JSSStyle("color", "black")]),
          [
            new JSSElement(
              \`button\`,
              new JSSStyles([
                new JSSStyle("height", "50px"),
                new JSSStyle("width", "100px"),
              ]),
            ),
          ],
        ),
      ]);
      const compiledStyles = JSSCompiler.compile(styles);
      JSSCompiler.add(compiledStyles);
    }
  },
);
`.trim();
}
