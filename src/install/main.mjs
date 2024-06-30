import Console from "../scripts/cli/console.mjs";
import timeout from "../scripts/timeout.mjs";
import select from "./select.mjs";
import { promises } from "fs";
import path from "path";
import process from "process";
import fetch from "node-fetch";
const fs = promises;

import getMainIndexContent from "../contents/src/main/index.js.mjs";
import getInstallIndexContent from "../contents/src/install/index.js.mjs";
import getMainHtmlContent from "../contents/assets/custom/pages/main.html.mjs";
import getSecondHtmlContent from "../contents/assets/custom/pages/second.html.mjs";
import getPressContent from "../contents/src/main/functions/press.js.mjs";
import getStylesContent from "../contents/src/main/styles/main.js.mjs";
import getWindows from "../contents/src/main/windows/windows.js.mjs";
import getMainOpen from "../contents/src/main/windows/MAIN/open.js.mjs";
import getMainClose from "../contents/src/main/windows/MAIN/close.js.mjs";

export default async function install() {
  Console.info("Projekt nebyl nalezen! Vytvářím nový.");
  await timeout(500);
  const answers = await select();

  Console.clear();
  Console.info("Začínám vytváření projektu");

  await Promise.all([
    fs.mkdir(path.join(process.cwd(), "assets")),
    fs.writeFile(path.join(process.cwd(), "klindosapp.txt"), "true", {
      encoding: "utf8",
    }),
    fs.writeFile(path.join(process.cwd(), "name.txt"), answers.appname, {
      encoding: "utf8",
    }),
  ]);

  await fs.mkdir(path.join(process.cwd(), "assets", "custom"));
  await fs.mkdir(path.join(process.cwd(), "assets", "custom", "pages"));
  await fs.mkdir(path.join(process.cwd(), "src"));
  await fs.mkdir(path.join(process.cwd(), "src", "main"));
  await fs.mkdir(path.join(process.cwd(), "src", "install"));
  await fs.mkdir(path.join(process.cwd(), "src", "main", "functions"));
  await fs.mkdir(path.join(process.cwd(), "src", "main", "styles"));
  await fs.mkdir(path.join(process.cwd(), "src", "main", "windows"));
  await fs.mkdir(path.join(process.cwd(), "src", "main", "windows", "MAIN"));

  await Promise.all([
    fs.writeFile(
      path.join(process.cwd(), "assets", "custom", "pages", "main.html"),
      getMainHtmlContent(),
      {
        encoding: "utf8",
      },
    ),
    fs.writeFile(
      path.join(process.cwd(), "assets", "custom", "pages", "second.html"),
      getSecondHtmlContent(),
      {
        encoding: "utf8",
      },
    ),
    fs.writeFile(
      path.join(process.cwd(), "src", "install", "index.js"),
      getInstallIndexContent(answers),
      {
        encoding: "utf8",
      },
    ),
    fs.writeFile(
      path.join(process.cwd(), "src", "main", "index.js"),
      getMainIndexContent(answers),
      {
        encoding: "utf8",
      },
    ),
    fs.writeFile(
      path.join(process.cwd(), "src", "main", "functions", "press.js"),
      getPressContent(),
      {
        encoding: "utf8",
      },
    ),
    fs.writeFile(
      path.join(process.cwd(), "src", "main", "styles", "main.js"),
      getStylesContent(),
      {
        encoding: "utf8",
      },
    ),
    fs.writeFile(
      path.join(process.cwd(), "src", "main", "windows", "windows.js"),
      getWindows(answers),
      {
        encoding: "utf8",
      },
    ),
    fs.writeFile(
      path.join(process.cwd(), "src", "main", "windows", "MAIN", "open.js"),
      getMainOpen(),
      {
        encoding: "utf8",
      },
    ),
    fs.writeFile(
      path.join(process.cwd(), "src", "main", "windows", "MAIN", "close.js"),
      getMainClose(),
      {
        encoding: "utf8",
      },
    ),
  ]);

  const response = await fetch("https://klindos.jzitnik.dev/compiler/icon.png");
  const buffer = await response.arrayBuffer();
  const filePath = path.join(process.cwd(), "assets", "logo.png");

  await fs.writeFile(filePath, Buffer.from(buffer));

  await timeout(200);

  Console.success(
    "Projekt vytvořen! Spusťte tento script znovu pro více info.",
  );
}
