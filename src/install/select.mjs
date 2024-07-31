import inquirer from "inquirer";

export default async function select() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "appname",
      message: "Select app name:",
    },
    {
      type: "list",
      name: "hidden",
      message: "Should this app be hidden in start?",
      choices: ["Yes", "No"],
      default: "Ne",
    },
    {
      type: "input",
      name: "defaultWindowName",
      message: "Enter name of the default window:",
    },
    {
      type: "input",
      name: "nodejsLibraries",
      message:
        "Enter node programs that your app will need: (seperate by space)",
    },
    {
      type: "input",
      name: "linuxPrograms",
      message:
        "Enter linux programs that your app will need: (seperate by space)",
    },
  ]);
  return answers;
}
