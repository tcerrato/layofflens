// Main entry point - imports all functions so they register at startup
// This file MUST be executed when the module loads for Azure Functions v4 programming model
// CRITICAL: This top-level code MUST run for functions to register
import { app } from "@azure/functions";

console.log("🔵 functions.ts module is being loaded...");

// Load .env file first
require("./load-env");
console.log("✅ Environment variables loaded");

// Import all function handlers - this registers them with the app
// These must be synchronous requires to register at startup
console.log("=== LayoffLens Functions: Starting registration ===");

console.log("Loading TestHttp...");
require("./TestHttp/index");
console.log("✅ TestHttp registered");

console.log("Loading ListItemsHttp...");
require("./ListItemsHttp/index");
console.log("✅ ListItemsHttp registered");

console.log("Loading FetchNowHttp...");
require("./FetchNowHttp/index");
console.log("✅ FetchNowHttp registered");

console.log("Loading FetchDailyTimer...");
require("./FetchDailyTimer/index");
console.log("✅ FetchDailyTimer registered");

console.log("=== LayoffLens Functions: All functions registered successfully ===");

// CRITICAL: Export app for Worker Indexing to discover functions
// This is required for Azure Flex Consumption
export default app;
