import fs from "fs";
import os from "os";
import path from "path";
import process from "process";
import Console from "../scripts/cli/console.mjs";

export default async function moveToDev() {
  Console.info("Moving app to KLIND OS Developers.");
  const usrfiles = path.join(os.homedir(), "usrfiles");

  if (!fs.existsSync(usrfiles)) {
    fs.mkdirSync(usrfiles);
  }

  fs.copyFileSync(
    path.join(process.cwd(), "dist", "compiled.kapk"),
    path.join(usrfiles, "compiled.kapk"),
  );

  await fs.promises.rm(path.join(process.cwd(), "dist"), {
    recursive: true,
  });

  Console.success("App was moved!");
}
