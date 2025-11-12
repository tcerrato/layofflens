import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";

const TABLE_NAME = "layoffitems";

export interface FeedItem {
  partitionKey: string;
  rowKey: string;
  title: string;
  link: string;
  source: string;
  snippet: string;
  date: string;
  type: "news" | "video";
  tags: string; // Stored as JSON string for Azure Table Storage
  score: number;
  imageUrl?: string; // Optional image URL from Serper
  // Layoff tracking fields
  companyName?: string; // Company mentioned in layoff news
  layoffCount?: number; // Number of employees laid off
  sector?: string; // Industry sector (Tech, Finance, Retail, etc.)
}

let tableClient: TableClient | null = null;

export function getTableClient(): TableClient {
  if (tableClient) {
    return tableClient;
  }

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

  // Priority: Use connection string if provided (for local dev or legacy)
  if (connectionString) {
    if (connectionString.includes("UseDevelopmentStorage")) {
      // Local development with Azurite - use manual setup
      const devAccountName = "devstoreaccount1";
      const devAccountKey = "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";
      const credential = new AzureNamedKeyCredential(devAccountName, devAccountKey);
      const serviceUrl = "http://127.0.0.1:10002/devstoreaccount1";
      tableClient = new TableClient(serviceUrl, TABLE_NAME, credential, {
        allowInsecureConnection: true,
      });
    } else {
      // Production with connection string - use fromConnectionString helper
      tableClient = TableClient.fromConnectionString(connectionString, TABLE_NAME);
    }
    return tableClient;
  }

  // No connection string - use managed identity
  if (!accountName) {
    throw new Error("AZURE_STORAGE_ACCOUNT_NAME environment variable is required when using managed identity");
  }

  // Use managed identity for authentication
  const endpoint = `https://${accountName}.table.core.windows.net`;
  tableClient = new TableClient(endpoint, TABLE_NAME, new DefaultAzureCredential());
  
  return tableClient;
}

export async function ensureTableExists(): Promise<void> {
  const client = getTableClient();
  try {
    await client.createTable();
  } catch (error: any) {
    if (error.statusCode !== 409) {
      throw error;
    }
  }
}

export async function saveItem(item: FeedItem): Promise<void> {
  await ensureTableExists();
  const client = getTableClient();
  await client.upsertEntity(item, "Merge");
}

export async function getItemsForDays(days?: number): Promise<FeedItem[]> {
  await ensureTableExists();
  const client = getTableClient();

  const items: FeedItem[] = [];
  const entities = client.listEntities<FeedItem>();

  // If days is specified, filter by date; otherwise get all items
  let cutoffDate: Date | null = null;
  if (days && days > 0) {
    cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
  }

  for await (const entity of entities) {
    // If we have a cutoff date, filter by it; otherwise include all items
    if (!cutoffDate || new Date(entity.date) >= cutoffDate) {
      // Parse tags from JSON string if needed
      const item = {
        ...entity,
        tags: typeof entity.tags === 'string' ? entity.tags : JSON.stringify(entity.tags || [])
      };
      items.push(item);
    }
  }

  // Sort by date (newest first), then by score (highest first)
  return items.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateB !== dateA) {
      return dateB - dateA; // Newest first
    }
    return b.score - a.score; // Then by score
  });
}

/**
 * Delete items older than the specified number of days
 * @param retentionDays Number of days to keep (default: 90)
 * @returns Number of items deleted
 */
export async function cleanupOldItems(retentionDays: number = 90): Promise<number> {
  await ensureTableExists();
  const client = getTableClient();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  let deletedCount = 0;
  const entities = client.listEntities<FeedItem>();

  for await (const entity of entities) {
    const itemDate = new Date(entity.date);
    if (itemDate < cutoffDate) {
      try {
        await client.deleteEntity(entity.partitionKey, entity.rowKey);
        deletedCount++;
      } catch (error: any) {
        // Log error but continue with other deletions
        console.error(`Failed to delete entity ${entity.partitionKey}/${entity.rowKey}:`, error.message);
      }
    }
  }

  return deletedCount;
}

