import Console from "../scripts/cli/console.mjs";
import timeout from "../scripts/timeout.mjs";
import selectRun from "./select.mjs";
import compile from "./compile.mjs";
import moveToDev from "./moveToDev.mjs";
import path from "path";
import process from "process";

export default async function run() {
  Console.success("Projekt nalezen!");
  Console.info("Načítám informace o projektu.");

  await timeout(200);

  const { answer } = await selectRun();

  if (answer == "Vykompilovat aplikaci do produkce") {
    await compile();
    Console.info(
      "Vykompilovaná aplikace se nachází zde: " +
        path.join(process.cwd(), "dist", "compiled.kapk"),
    );
  } else {
    await compile(async () => {
      await moveToDev();
    });
  }
}
