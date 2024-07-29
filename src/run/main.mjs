import Console from "../scripts/cli/console.mjs";
import timeout from "../scripts/timeout.mjs";
import selectRun from "./select.mjs";
import compile from "./compile.mjs";
import moveToDev from "./moveToDev.mjs";
import path from "path";
import process from "process";

export default async function run() {
  Console.success("Project found!");
  Console.info("Loading info about the project.");

  await timeout(200);

  const { answer } = await selectRun();

  if (answer == "Compile the app to production") {
    await compile();
    Console.info(
      "The compiled app is located here: " +
        path.join(process.cwd(), "dist", "compiled.kapk"),
    );
  } else {
    await compile(async () => {
      await moveToDev();
    });
  }
}
