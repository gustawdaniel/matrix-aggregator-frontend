import TurnDownService from 'turndown';
import { Source } from "~/types/Source";
import * as cheerio from "cheerio";
import assert from "node:assert/strict";

export function getMarkdownContent(html: string, source: Source): string {
  const turnDownService = new TurnDownService({
    headingStyle: 'atx',
    bulletListMarker: '-'
  });

  if(source === 'finance.yahoo') {
    const $ = cheerio.load(html);

    html = $('section.main .article .body').html() ?? '';
    assert.ok(html);
  }

  const markdown = turnDownService.turndown(html);

  // Trim all lines
  return `${markdown.split('\n')
    .map(line => line.trim())
    .join('\n')}`;
}