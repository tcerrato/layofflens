// Load .env file for local development
// This file is imported at the top of function entry points
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load .env file if it exists (for local development)
// When compiled, this file is in dist/, so we need to look in the parent directory
const apiDir = __dirname.includes(path.sep + "dist" + path.sep) || __dirname.endsWith(path.sep + "dist")
  ? path.join(__dirname, "..")
  : __dirname;
const envPath = path.join(apiDir, ".env");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

