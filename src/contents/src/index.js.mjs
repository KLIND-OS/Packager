export default function getApp({ appname, hidden }) {
  return `
import styles from "./styles/main";
import { windowNames, addWindows } from "./windows/windows";
import press from "./functions/press";

// Note (remove after development):
//
// If you want to use any NodeJS package that you downloaded in the
// installation use \`LowLevelApi.NodePackages.get("package")\` instead of \`require("package")\`
// Also, if you want to use Linux applications that you installed during app
// installation, you need to use them from Bash. Use \`LowLevelApi.child_process.exec("command")\`

// The app is passed to ClassConstructor that constructs and creates the app.
ClassConstructor.add(
  // We use private class to prevent any issues with other applications.
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

    // Here we define the name of the windows. This will be used later to add styles
    // and other things. That's why we put it in the variable.
    windowNames = windowNames;

    // Here we put functions that will be executed by the user, for example on click.
    functions = {
      printHello: () => {
        // Create notification.
        this.utils.notify("Hello!");
      },
      openSecond: () => {
        windows.open(this.app.windowParser.parseName(this.windowNames.SECOND));
      },
      press,
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

      // Create windows.
      addWindows.bind(this)();

      // CSS styles
      styles.bind(this)();
    }
  },
);`.trim();
}
