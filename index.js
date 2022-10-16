#! /usr/bin/env node

/**
 * Package:     @bitsoft-network/debug
 * Repository:  @bitsoft-network/debug-cli
 * Author:      Leevi Halme <leevi@bitsoft.network> (https://leevihal.me)
 */

import { createSpinner } from "nanospinner";
import chalk from "chalk";
import * as platform from "platform";
import { promises as fs } from "fs";

// Create init spinner
const spinner = createSpinner(
  `${chalk.bgHex("#304164")(
    " @bitsoft-network/debug "
  )} - Detecting environment`
).start();

// Dependencies array mapper
const mapper = object =>
  Object.keys(object)
    .map(dep => dep + ` (${object[dep]})`)
    .join(", ");

// Detect environment
const detectEnvironment = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get package.json
      const file = await fs.readFile("package.json");
      const pkg = JSON.parse(file);

      // Resolve spinner
      spinner.success();

      // Create other spinners
      const name = chalk.hex("#304164").bold(pkg.name);
      const plat = platform.default.toString();
      const env = `Running ${name} v${pkg.version} on ${plat}`;
      const depCount = Object.keys(pkg.dependencies).length;
      const deps = `Found ${depCount} dependencies: ${mapper(
        pkg.dependencies
      )}`;
      createSpinner(env).success();
      createSpinner(deps).success();

      // Resolve promise
      return resolve();
    } catch (error) {
      // If this error was due missing package.json
      if (error.code === "ENOENT") {
        spinner.error();
        createSpinner(
          "Failed to parse package.json. Make sure to run this tool on the root directory."
        ).error();
        return resolve();
      }

      console.error("ERROR:", error);
      spinner.error();
      return reject(error);
    }
  });
};

// Await top-level (NodeJS >= v.14.8)
await detectEnvironment();
