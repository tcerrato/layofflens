import { FeedItem } from "./storage";

export function calculateScore(item: FeedItem, now: Date = new Date()): number {
  let score = 0;

  const itemDate = new Date(item.date);
  const hoursSincePublish = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60);

  const freshnessScore = Math.max(0, 100 - hoursSincePublish * 2);
  score += freshnessScore * 0.4;

  const relevanceKeywords = [
    "layoff",
    "layoffs",
    "job cuts",
    "unemployment",
    "hiring freeze",
    "downsizing",
    "redundancy",
    "furlough",
    "AI automation",
    "job market",
  ];

  const titleLower = item.title.toLowerCase();
  const snippetLower = item.snippet.toLowerCase();
  const text = `${titleLower} ${snippetLower}`;

  let relevanceScore = 0;
  for (const keyword of relevanceKeywords) {
    if (text.includes(keyword.toLowerCase())) {
      relevanceScore += 10;
    }
  }
  relevanceScore = Math.min(100, relevanceScore);
  score += relevanceScore * 0.6;

  return Math.round(score);
}

