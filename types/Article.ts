import type { ArticleMetadata } from "~/types/ArticleMetadata";
import type { TagAssignment } from "~/types/Tag";
import type { Source } from "~/types/Source";
import type { AiSummaryTicker } from "~/types/AiSummaryTicker";

export interface Article {
  markdown: string;
  metadata: ArticleMetadata;
  html: string;
  tags?: TagAssignment[];
  source: Source
  summary?: string; // AI generated summary
  rawSummaries?: string[]; // AI generated summary
  tickers?: AiSummaryTicker[]
}
