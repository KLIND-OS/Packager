import Console from "../scripts/cli/console.mjs";
import JSZip from "jszip";
import inquirer from "inquirer";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import process from "process";
const fsPromises = fs.promises;

export default async function compile(callback = () => {}) {
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
      "https://backend.jzitnik.dev/klindos/latestVersion",
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

  const zip = new JSZip();

  const namePath = path.join(process.cwd(), "name.txt");
  const installPath = path.join(process.cwd(), "install.js");
  const scriptPath = path.join(process.cwd(), "app.js");
  const imagePath = path.join(process.cwd(), "assets", "logo.png");
  const appdataPath = path.join(process.cwd(), "assets", "custom");

  zip.file("version.txt", version);

  if (fs.existsSync(namePath)) {
    zip.file("name.txt", fs.readFileSync(namePath));
  } else {
    Console.error("Vyžadovaný soubor nebyl nalezen: name.txt");
    process.exit(1);
  }

  if (fs.existsSync(installPath)) {
    zip.file("install.js", fs.readFileSync(installPath));
  } else {
    Console.error("Vyžadovaný soubor nebyl nalezen: install.js");
    process.exit(1);
  }

  if (fs.existsSync(scriptPath)) {
    zip.file("script.js", fs.readFileSync(scriptPath));
  } else {
    Console.error("Vyžadovaný soubor nebyl nalezen: app.js");
    process.exit(1);
  }

  if (fs.existsSync(imagePath)) {
    zip.file("image.png", fs.readFileSync(imagePath));
  } else {
    Console.error("Vyžadovaný soubor nebyl nalezen: logo.png");
    process.exit(1);
  }

  function addFilesToZip(zip, folderPath, zipFolderPath = "appdata") {
    const folder = zip.folder(zipFolderPath);
    fs.readdirSync(folderPath).forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        addFilesToZip(folder, filePath, file);
      } else {
        folder.file(file, fs.readFileSync(filePath));
      }
    });
  }
  if (fs.existsSync(appdataPath)) {
    addFilesToZip(zip, appdataPath);
  } else {
    console.error("Vyžadovaná složka nebyla nalezena: appdata");
    process.exit(1);
  }

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
