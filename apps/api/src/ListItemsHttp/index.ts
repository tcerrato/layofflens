import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getItemsForDays } from "../Shared/storage";

export async function listItemsHttp(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const daysParam = request.query.get("days") || "1";
    const days = parseInt(daysParam, 10);

    if (isNaN(days) || days < 1) {
      return {
        status: 400,
        jsonBody: { error: "Invalid days parameter. Must be a positive integer." },
      };
    }

    const items = await getItemsForDays(days);

    return {
      status: 200,
      jsonBody: items,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error: any) {
    context.error("Error listing items:", error);
    return {
      status: 500,
      jsonBody: { error: error.message || "Internal server error" },
    };
  }
}

app.http("ListItemsHttp", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: listItemsHttp,
});

