export default function getStylesContent() {
  return `
export default function styles() {
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
  `.trim();
}
