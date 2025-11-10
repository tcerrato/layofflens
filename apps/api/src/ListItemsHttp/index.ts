import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableClient } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";

const TABLE_NAME = "layoffitems";
const ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT_NAME;

// TEMPORARY SIMPLIFIED VERSION FOR TESTING MANAGED IDENTITY
// TODO: Restore original code after confirming managed identity works

// ORIGINAL CODE (COMMENTED OUT FOR TESTING):
/*
// Import with error handling
let getItemsForDays: any;
try {
  const storageModule = require("../Shared/storage");
  getItemsForDays = storageModule.getItemsForDays;
} catch (importError: any) {
  console.error("Failed to import storage module:", importError?.message || String(importError));
  // We'll handle this in the handler
}

export async function listItemsHttp(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    context.log("ListItemsHttp called");
    
    // Check if storage module loaded
    if (!getItemsForDays) {
      context.error("Storage module not loaded");
      return {
        status: 500,
        jsonBody: { error: "Storage module failed to load" },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
    const daysParam = request.query.get("days");
    const limitParam = request.query.get("limit");
    const pageParam = request.query.get("page");
    
    context.log("Query params:", { daysParam, limitParam, pageParam });
    
    let items: any[];
    
    try {
      // If days is specified, use it; otherwise get most recent items (default limit for archive)
      if (daysParam) {
        const days = parseInt(daysParam, 10);
        if (isNaN(days) || days < 1) {
          return {
            status: 400,
            jsonBody: { error: "Invalid days parameter. Must be a positive integer." },
          };
        }
        context.log("Fetching items for days:", days);
        items = await getItemsForDays(days);
      } else {
        // No days parameter = get most recent items (default to 500 most recent for archive)
        // Items are already sorted by date (newest first) in getItemsForDays
        context.log("Fetching all items");
        const allItems = await getItemsForDays();
        const defaultArchiveLimit = 500; // Show most recent 500 items by default
        items = allItems.slice(0, defaultArchiveLimit);
      }
      context.log("Fetched items count:", items.length);
    } catch (storageError: any) {
      context.error("Storage error:", storageError);
      throw new Error(`Storage operation failed: ${storageError?.message || String(storageError)}`);
    }
    
    // Apply limit if specified (for Current feed)
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit) && limit > 0) {
        items = items.slice(0, limit);
      }
    }
    
    // Pagination for archive (only when page param is explicitly set)
    const pageSize = 50;
    let paginatedItems = items;
    let totalPages = 1;
    let currentPage = 1;
    
    if (pageParam && !limitParam) {
      // Only paginate if page param is explicitly set (archive mode)
      currentPage = parseInt(pageParam, 10);
      if (!isNaN(currentPage) && currentPage > 0) {
        totalPages = Math.ceil(items.length / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        paginatedItems = items.slice(startIndex, endIndex);
      }
    } else if (!limitParam) {
      // If no page param and no limit, return all items (for frontend filtering)
      totalPages = Math.ceil(items.length / pageSize);
      // Return all items, but include pagination metadata
      paginatedItems = items;
    }

    return {
      status: 200,
      jsonBody: limitParam ? paginatedItems : {
        items: paginatedItems,
        pagination: {
          currentPage: pageParam ? currentPage : 1,
          totalPages,
          pageSize,
          totalItems: items.length,
        },
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error: any) {
    const errorMessage = error?.message || String(error) || "Unknown error";
    const errorStack = error?.stack || "";
    context.error("Error listing items:", errorMessage, errorStack);
    context.log("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return {
      status: 500,
      jsonBody: { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorStack : undefined
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
*/

// SIMPLIFIED TEST VERSION
export async function listItemsHttp(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    context.log("ListItemsHttp (simplified) called");
    
    if (!ACCOUNT) {
      throw new Error("AZURE_STORAGE_ACCOUNT_NAME is missing");
    }

    context.log("Creating TableClient with managed identity");
    const endpoint = `https://${ACCOUNT}.table.core.windows.net`;
    const client = new TableClient(endpoint, TABLE_NAME, new DefaultAzureCredential());

    context.log("Ensuring table exists");
    // Optional: ensure table exists (ignore 409 conflict)
    await client.createTable().catch(() => {
      context.log("Table already exists or creation failed (ignoring)");
    });

    const limit = Number(request.query.get("limit") || 50);
    context.log("Fetching items with limit:", limit);
    
    const iter = client.listEntities({ queryOptions: { top: limit } });
    const items: any[] = [];
    
    for await (const e of iter) {
      items.push(e);
    }

    context.log("Successfully fetched", items.length, "items");

    return {
      status: 200,
      jsonBody: items,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (err: any) {
    context.error("ListItemsHttp failed:", err?.message);
    context.error("Error stack:", err?.stack || "");
    return {
      status: 500,
      jsonBody: { 
        error: err?.message || "Internal error",
        stack: process.env.NODE_ENV === "development" ? err?.stack : undefined
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}

// Function registration
app.http("ListItemsHttp", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (request: HttpRequest, context: InvocationContext) => {
    try {
      context.log("Handler wrapper called, method:", request.method);
      
      // Handle OPTIONS preflight request
      if (request.method === "OPTIONS") {
        context.log("Handling OPTIONS request");
        return {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        };
      }
      
      context.log("Calling listItemsHttp function");
      return await listItemsHttp(request, context);
    } catch (handlerError: any) {
      const errorMsg = handlerError?.message || String(handlerError);
      const errorStack = handlerError?.stack || "";
      context.error("Handler wrapper error:", errorMsg);
      context.error("Handler error stack:", errorStack);
      return {
        status: 500,
        jsonBody: { 
          error: errorMsg,
          type: "handler_wrapper_error",
          stack: process.env.NODE_ENV === "development" ? errorStack : undefined
        },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  },
});

