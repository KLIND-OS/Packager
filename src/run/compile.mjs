import Console from "../scripts/cli/console.mjs";
import JSZip from "jszip";
import inquirer from "inquirer";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import process from "process";
const fsPromises = fs.promises;

export default async function compile(callback) {
  const { answer } = await inquirer.prompt([
    {
      type: "list",
      name: "answer",
      message: "Pro jakou verzi je tato aplikace?",
      choices: ["Nejnovější verze", "Nastavit verzi manuálně"],
    },
  ]);

  if (answer == "Nejnovější verze") {
    const request = await fetch(
      "https://klindos.jzitnik.dev/klindos/latestVersion",
    );
    const json = await request.json();
    var version = json.version;
  } else {
    var { version } = await inquirer.prompt([
      {
        type: "input",
        name: "version",
        message: "Zadejte verzi: ",
      },
    ]);
  }

  Console.clear();
  Console.info("Začínám kompilovat aplikaci.");

  try {
    const stats = await fsPromises.stat(path.join(process.cwd(), "dist"));
    if (stats.isDirectory()) {
      await fsPromises.rm(path.join(process.cwd(), "dist"), {
        recursive: true,
      });
    }
  } catch {}

  // TODO: Add checking if all files are here

  const zip = new JSZip();
  zip.file("version.txt", version);
  zip.file("name.txt", fs.readFileSync(path.join(process.cwd(), "name.txt")));
  zip.file(
    "install.js",
    fs.readFileSync(path.join(process.cwd(), "install.js")),
  );
  zip.file("script.js", fs.readFileSync(path.join(process.cwd(), "app.js")));
  zip.file(
    "image.png",
    fs.readFileSync(path.join(process.cwd(), "assets", "logo.png")),
  );

  await fsPromises.mkdir(path.join(process.cwd(), "dist"));

  zip
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(
      fs.createWriteStream(path.join(process.cwd(), "dist", "compiled.kapk")),
    )
    .on("finish", function () {
      Console.success("Kompilace dokončena!");
      callback();
    });
}
