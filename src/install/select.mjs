import inquirer from "inquirer";

export default async function select() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "appname",
      message: "Zadejte název aplikace:",
    },
    {
      type: "list",
      name: "hidden",
      message: "Má být aplikace schovaná ze startu?",
      choices: ["Ano", "Ne"],
    },
    {
      type: "input",
      name: "defaultWindowName",
      message: "Zadejte název výchozího okna:",
    },
    {
      type: "input",
      name: "nodejsLibraries",
      message:
        "Zadejte NodeJS knihovny které chcete importovat: (nechte prázdné pokud nechcete NodeJS knihovny)",
    },
    {
      type: "input",
      name: "linuxPrograms",
      message:
        "Zadejte linuxové programy které chcete importovat: (nechte prázdné pokud nechcete linuxové programy)",
    },
  ]);
  return answers;
}
