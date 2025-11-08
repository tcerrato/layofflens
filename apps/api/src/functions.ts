// Main entry point - imports all functions so they register at startup
// Guard to ensure this only runs once even if loaded multiple times
if (!(global as any).__layofflens_functions_loaded) {
  (global as any).__layofflens_functions_loaded = true;
  
  // Load .env file first
  require("./load-env");
  
  // Import all function handlers - this registers them with the app
  // These must be synchronous requires to register at startup
  require("./ListItemsHttp/index");
  require("./FetchNowHttp/index");
  require("./FetchDailyTimer/index");
}
