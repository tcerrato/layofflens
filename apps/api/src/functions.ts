// Main entry point - imports all functions so they register at startup
// This file MUST be executed when the module loads for Azure Functions v4 programming model
// CRITICAL: This top-level code MUST run for functions to register
console.log("🔵 functions.ts module is being loaded...");

// Guard to ensure this only runs once even if loaded multiple times
if (!(global as any).__layofflens_functions_loaded) {
  (global as any).__layofflens_functions_loaded = true;
  
  console.log("=== LayoffLens Functions: Starting registration ===");
  
  try {
    // Load .env file first
    require("./load-env");
    console.log("✅ Environment variables loaded");
    
    // Import all function handlers - this registers them with the app
    // These must be synchronous requires to register at startup
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
  } catch (initError: any) {
    console.error("❌ Failed to initialize functions:", initError?.message || String(initError));
    console.error("Stack:", initError?.stack || "");
    throw initError; // Re-throw to prevent silent failures
  }
} else {
  console.log("=== LayoffLens Functions: Already loaded (skipping re-registration) ===");
}

// CRITICAL: Export something to ensure this module is evaluated
// This ensures the top-level code above executes
export {};
