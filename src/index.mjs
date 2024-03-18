import printlogo from "./scripts/cli/logo.mjs";
import Console from "./scripts/cli/console.mjs";
import fs from "fs";
import install from "./install/main.mjs";
import path from "path";
import process from "process";
import main from "./run/main.mjs"

Console.clear();
printlogo();

try {
  var installed = fs.readFileSync(
    path.join(process.cwd(), "klindosapp.txt"),
    "utf8",
  );
} catch (err) {
  if (err.code == "ENOENT") var installed = "";
}

if (installed.trim() == "true") {
  main();
} else {
  install();
}
