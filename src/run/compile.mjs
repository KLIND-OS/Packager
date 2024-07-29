import Console from "../scripts/cli/console.mjs";
import JSZip from "jszip";
import inquirer from "inquirer";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import process from "process";
import compileMain from "./webpack/main.mjs";
const fsPromises = fs.promises;

export default async function compile(callback = () => {}) {
  const { answer } = await inquirer.prompt([
    {
      type: "list",
      name: "answer",
      message: "For what KLIND OS version is this app for?",
      choices: ["Newest version", "Select version manually"],
    },
  ]);

  if (answer == "Newest version") {
    const request = await fetch(
      "https://klindos.jzitnik.dev/api/latestversion",
    );
    const json = await request.json();
    var version = json.version;
  } else {
    var { version } = await inquirer.prompt([
      {
        type: "input",
        name: "version",
        message: "Select version: ",
      },
    ]);
  }

  Console.clear();
  Console.info("Starting to compile the app...");

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
  const imagePath = path.join(process.cwd(), "assets", "logo.png");
  const appdataPath = path.join(process.cwd(), "assets", "custom");
  const nodePackagesPath = path.join(process.cwd(), "node_packages.json");
  const linuxProgramsPath = path.join(process.cwd(), "linux_programs.json");

  zip.file("version.txt", version);

  if (fs.existsSync(namePath)) {
    zip.file("name.txt", fs.readFileSync(namePath));
  } else {
    Console.error("Required file was not found: name.txt");
    process.exit(1);
  }

  const script = await compileMain();
  if (script) {
    zip.file("script.js", script);
  } else {
    Console.error("Error while compiling MAIN.");
    process.exit(1);
  }

  if (fs.existsSync(imagePath)) {
    zip.file("image.png", fs.readFileSync(imagePath));
  } else {
    Console.error("Required file was not found: logo.png");
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
    console.error("Required folder was not found: appdata");
    process.exit(1);
  }
  if (fs.existsSync(nodePackagesPath)) {
    zip.file("node_packages.json", fs.readFileSync(nodePackagesPath));
  } else {
    Console.error("Required file was not found: node_packages.json");
    process.exit(1);
  }
  if (fs.existsSync(linuxProgramsPath)) {
    zip.file("linux_programs.json", fs.readFileSync(linuxProgramsPath));
  } else {
    Console.error("Required file was not found: linux_programs.json");
    process.exit(1);
  }

  zip
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(
      fs.createWriteStream(path.join(process.cwd(), "dist", "compiled.kapk")),
    )
    .on("finish", function () {
      Console.success("Compilation finished!");
      callback();
    });
}
