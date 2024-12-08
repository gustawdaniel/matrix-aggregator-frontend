import { AiSummaryWithTickers } from "~/types/AiSummaryWithTickers";

export function analyzeAiSummary(summary: string): AiSummaryWithTickers {
    summary = summary.trim();

    if(summary.startsWith(`"""`) && summary.endsWith(`"""`)) {
        summary = summary.slice(3, -3).trim();
    }
    const parts = summary.split('\n').filter((line) => !line.startsWith(`\``)).join('\n').split('\n\n');
    const summaryText = parts[0];

    const tickers = JSON.parse(parts[1]);
    return { summary: summaryText, tickers };
}