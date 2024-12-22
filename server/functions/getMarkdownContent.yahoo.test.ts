import { expect, test } from "vitest";
import { getMarkdownContent } from "./getMarkdownContent";
import fs from "node:fs";

// Example HTML text
const html = fs.readFileSync('./test/fixtures/finance.yahoo.html', 'utf8');
const markdown = fs.readFileSync('./test/fixtures/finance.yahoo.md', 'utf8');

test('getMarkdownContent.yahoo', () => {
    expect(getMarkdownContent(html, 'finance.yahoo')).toBe(markdown);
});