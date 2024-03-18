import Console from "../scripts/cli/console.mjs";
import timeout from "../scripts/timeout.mjs";
import select from "./select.mjs";
import getMainContent from "../contents/app.mjs";
import getContentInstall from "../contents/install.mjs";
import { promises } from "fs";
const fs = promises;
import path from "path";
import process from "process";

export default async function install() {
  Console.info("Projekt nebyl nalezen! Vytvářím nový.");
  await timeout(500);
  const answers = await select();

  const content = getMainContent(answers);
  const installContent = getContentInstall(answers);

  Console.clear();
  Console.info("Začínám vytváření projektu");

  await timeout(700);

  await Promise.all([
    fs.mkdir(path.join(process.cwd(), "assets")),
    fs.writeFile(path.join(process.cwd(), "app.js"), content, {
      encoding: "utf8",
    }),
    fs.writeFile(path.join(process.cwd(), "install.js"), installContent, {
      encoding: "utf8",
    }),
    fs.writeFile(path.join(process.cwd(), "klindosapp.txt"), "true", {
      encoding: "utf8",
    }),
    fs.writeFile(path.join(process.cwd(), "name.txt"), answers.appname, {
      encoding: "utf8"
    })
  ]);

  // Download logo to assets folder

  Console.success(
    "Projekt vytvořen! Spusťte tento script znovu pro více info.",
  );
}
