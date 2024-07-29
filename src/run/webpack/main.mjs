import { webpack } from "webpack";
import path from "path";
import Console from "../../scripts/cli/console.mjs";
import fs from "fs";
import { minify } from "terser";

export default async function compileMain() {
  console.log("\n----------Webpack----------");

  const config = {
    entry: path.resolve("src", "index.js"),
    output: {
      filename: "main_bundle.js",
      path: path.resolve("dist"),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
        },
      ],
    },
    mode: "production",
    optimization: {
      minimize: false,
      minimizer: [],
    },
  };

  const compiler = webpack(config);

  try {
    const stats = await new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
          reject(err ? err : stats.toJson().errors);
        } else {
          resolve(stats);
        }
      });
    });

    console.log(
      stats.toString({
        chunks: false,
        colors: true,
      }),
    );

    Console.success("MAIN byl vykompilován.");
    console.log("----------Webpack----------\n");
    const bundle = await fs.promises.readFile(
      path.resolve("dist", "main_bundle.js"),
      { encoding: "utf8" },
    );

    await fs.promises.unlink(path.resolve("dist", "main_bundle.js"));
    compiler.close((closeErr) => {
      if (closeErr) {
        console.error(closeErr);
      }
    });

    return (await minify(bundle)).code;
  } catch (error) {
    console.error(error);
  }
}
