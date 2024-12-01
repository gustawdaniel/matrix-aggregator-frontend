import type { AiSummaryTicker } from "~/types/AiSummaryTicker";

export interface AiSummaryWithTickers {
  summary: string;
  tickers: AiSummaryTicker[];
}