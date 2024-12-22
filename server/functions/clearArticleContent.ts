import { Source } from "~/types/Source";

export function clearArticleContent(content: string, source: Source) {
  // Clear article content

  const lines = content.split("\n");

  const cleanLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("Sign up [here.]")) {
      break;
    } else if (
      /[!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/.test(lines[i]) &&
      (lines[i].startsWith("![") || lines[i].startsWith("["))
    ) {
      // it id image or line
    } else {
      cleanLines.push(lines[i]);
    }
  }

  if (source === "reuters") {
    return cleanLines.join("\n").trim();
  } else if (source === "finance.yahoo") {
    let emptyCount = 0;
    const filteredLines = [];

    for (let line of cleanLines) {
      // skip trash content
      if (line.endsWith("via Getty Images") || line === "View Comments") {
        continue;
      }
      // remove more than 2 empty lines
      if (line.trim() === "") {
        emptyCount++;
        if (emptyCount > 2) {
          continue;
        }
      } else {
        emptyCount = 0;
      }
      // align bullet points
      if (line.startsWith("-   ")) {
        line = line.replace("-   ", "- ");
      }

      filteredLines.push(line);
    }

    return filteredLines.join("\n").trim();
  }

  return cleanLines.join("\n").trim();
}
