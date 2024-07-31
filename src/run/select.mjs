import inquirer from "inquirer";

export default async function selectRun() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "answer",
      message: "Vyberte možnost:",
      choices: [
        "Compile the app and move it to KLIND OS Developers",
        "Compile the app to production",
      ],
    },
  ]);
  return answers;
}
