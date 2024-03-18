import chalk from "chalk";

export default class Console {
  static stdin = console;

  static success(msg) {
    this.stdin.log(chalk.green("Success: ") + msg);
  }
  static error(msg) {
    this.stdin.log(chalk.red("Error: ") + msg);
  }
  static info(msg) {
    this.stdin.log(chalk.cyan("Info: ") + msg);
  }
  static newline() {
    this.stdin.log();
  }
  static clear() {
    this.stdin.clear();
  }
}
