import inquirer from "inquirer";

export default async function selectRun() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "answer",
      message: "Vyberte možnost:",
      choices: [
        "Vykompilovat aplikaci a přesunout do KLIND OS Development",
        "Vykompilovat aplikaci do produkce",
      ],
    },
  ]);
  return answers;
}
