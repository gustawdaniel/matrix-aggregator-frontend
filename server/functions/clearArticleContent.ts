import { Source } from "~/types/Source";

export function clearArticleContent(content: string, source: Source) {
  // Clear article content

  const lines = content.split("\n");

  const cleanLines = [];

  for (let i = 0; i < lines.length; i++) {
    if(lines[i].startsWith('Sign up [here.]')) {
      break;
    }else if (/[!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/.test(lines[i]) && (lines[i].startsWith('![') || lines[i].startsWith('['))) {
      // it id image or line
    } else {
      cleanLines.push(lines[i]);
    }
  }
  return cleanLines.join("\n").trim();
}
