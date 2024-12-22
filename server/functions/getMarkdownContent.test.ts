import { expect, test } from "vitest";
import { getMarkdownContent } from "./getMarkdownContent";

// Example HTML text
const html = `
  <h1>Title</h1>
  <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
  <a href="https://example.com">Link</a>
`;

const markdown = `# Title

This is a paragraph with **bold** and _italic_ text.

[Link](https://example.com)`;

test('getMarkdownContent', () => {
    expect(getMarkdownContent(html, 'reuters')).toBe(markdown);
});