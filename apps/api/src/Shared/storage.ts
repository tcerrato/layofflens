import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

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
}

let tableClient: TableClient | null = null;

export function getTableClient(): TableClient {
  if (tableClient) {
    return tableClient;
  }

  const connectionString =
    process.env.AZURE_STORAGE_CONNECTION_STRING ||
    "UseDevelopmentStorage=true";

  if (connectionString.includes("UseDevelopmentStorage")) {
    // Local development with Azurite
    const accountName = "devstoreaccount1";
    const accountKey = "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";
    const credential = new AzureNamedKeyCredential(accountName, accountKey);
    const serviceUrl = "http://127.0.0.1:10002/devstoreaccount1";
    tableClient = new TableClient(serviceUrl, TABLE_NAME, credential, {
      allowInsecureConnection: true,
    });
  } else {
    // Production Azure Storage
    const accountNameMatch = connectionString.match(/AccountName=([^;]+)/);
    const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/);
    
    if (!accountNameMatch || !accountKeyMatch) {
      throw new Error("Invalid Azure Storage connection string");
    }

    const accountName = accountNameMatch[1];
    const accountKey = accountKeyMatch[1];
    const credential = new AzureNamedKeyCredential(accountName, accountKey);
    const serviceUrl = `https://${accountName}.table.core.windows.net`;
    tableClient = new TableClient(serviceUrl, TABLE_NAME, credential, {
      allowInsecureConnection: false,
    });
  }

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

export async function getItemsForDays(days: number): Promise<FeedItem[]> {
  await ensureTableExists();
  const client = getTableClient();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const partitionKey = cutoffDate.toISOString().split("T")[0].replace(/-/g, "");

  const items: FeedItem[] = [];
  const entities = client.listEntities<FeedItem>();

  for await (const entity of entities) {
    const itemDate = new Date(entity.date);
    if (itemDate >= cutoffDate) {
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

