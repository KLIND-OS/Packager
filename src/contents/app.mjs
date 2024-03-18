export default function getApp({ appname, hidden, defaultWindowName }) {
  return `
// (remove after development)
// Note:
// If you want to use any NodeJS package that you downloaded in the installation use LowLevelApi.NodePackages.get("package") instead of require("package")
// Also, if you want to use Linux applications that you installed during app installation, you need to use them from Bash. Use LowLevelApi.child_process.exec("command")

class _${appname}Public {
  static key;
}

class ${appname}App {
  app;
  functions = {
    printHello: () => {
      control.notify(this.app.info.name, "Hello!")
    }
  }
  windowNames = {
    MAIN: "${defaultWindowName}",
  }
  contents = {
    MAIN: \`<h1>Hello!</h1><button onclick="ClList[_${appname}Public.key].functions.printHello()">Hello</button>\`
  }

  mainOpen() {
    console.log("App opened!")
  }

  constructor(key) {
    _${appname}Public.key = key;
    this.app = new App({
      name: "${appname}",
      hidden: ${hidden == "Ano" ? "true" : "false"},
    })

    this.mainOpen = this.mainOpen.bind(this);

    this.app.createWindow({
      name: this.windowNames.MAIN,
      buttons: {
        close: () => {},
        mini: () => {},
      },
      onStart: this.mainOpen,
      content: this.contents.MAIN,
      defaultWindow: true,
    })


    // CSS styly
    const styles = new JSSElement("", undefined, [
      new JSSElement(
        \`.\${this.app.windowParser.parseClass(this.windowNames.MAIN)}\`,
        new JSSStyles([
          new JSSStyle("color", "black"),
        ]),
        [
          new JSSElement(
            \`button\`,
            new JSSStyles([new JSSStyle("height", "50px")]),
          ),
        ],
      ),
    ]);
    const compiledStyles = JSSCompiler.compile(styles);
    JSSCompiler.add(compiledStyles);
  }
}

ClassConstructor.add(${appname}App);
`.trim();
}
