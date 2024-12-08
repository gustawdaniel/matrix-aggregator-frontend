import { expect, test } from "vitest";
import { analyzeAiSummary } from "./analyzeAiSummary";

const summarySimple = `Japanese PM Shigeru Ishiba will lead a fragile minority government amid rising tensions and economic challenges.

[
  {"code": "TSLA","name":"Tesla", "move": "down", "reason": "trade tension concerns with U.S."},
  {"code": "TOYOF","name":"Toyota", "move":"down", "reason": "potential trade measures by Trump"},
  {"code": "SNE", "name":"Sony", "move": "down", "reason": "economic uncertainty"}
]`;

test("router clears article content", () => {
  expect(analyzeAiSummary(summarySimple)).toStrictEqual({
    summary:
      "Japanese PM Shigeru Ishiba will lead a fragile minority government amid rising tensions and economic challenges.",
    tickers: [
      {
        code: "TSLA",
        name: "Tesla",
        move: "down",
        reason: "trade tension concerns with U.S.",
      },
      {
        code: "TOYOF",
        name: "Toyota",
        move: "down",
        reason: "potential trade measures by Trump",
      },
      {
        code: "SNE",
        name: "Sony",
        move: "down",
        reason: "economic uncertainty",
      },
    ],
  });
});

const summaryWithQuotations = `The COP29 climate summit in Azerbaijan begins amid concerns over U.S. disengagement under Trump and heightened demands for climate finance from developing nations.

\`\`json
[
  {"code": "XOM", "name": "Exxon Mobil", "move": "down", "reason": "potential impact from global climate change policies"},
  {"code": "COP", "name": "COP28", "move": "up", "reason": "increased focus on climate financing soliciting investment"},
  {"code": "BP", "name": "BP", "move": "down", "reason": "risk of reduced fossil fuel reliance amid new climate agreements"}
]
\`\`
`;

test("router clears article content", () => {
  expect(analyzeAiSummary(summaryWithQuotations)).toStrictEqual({
    summary:
      "The COP29 climate summit in Azerbaijan begins amid concerns over U.S. disengagement under Trump and heightened demands for climate finance from developing nations.",
    tickers: [
      {
        code: "XOM",
        name: "Exxon Mobil",
        move: "down",
        reason: "potential impact from global climate change policies",
      },
      {
        code: "COP",
        name: "COP28",
        move: "up",
        reason: "increased focus on climate financing soliciting investment",
      },
      {
        code: "BP",
        name: "BP",
        move: "down",
        reason:
          "risk of reduced fossil fuel reliance amid new climate agreements",
      },
    ],
  });
});

const summaryWith3Quotations = `"""
The article reports on the assassination of UnitedHealth CEO Brian Thompson in a targeted attack in New York City, raising concerns about implications for the company amid ongoing operational challenges.

[
  {"code": "UNH", "name": "UnitedHealth Group Incorporated", "move": "down", "reason": "The assassination of the CEO may lead to uncertainty and operational disruptions, negatively impacting stock performance."}
]
"""
`;

test("router clears article content", () => {
  expect(analyzeAiSummary(summaryWith3Quotations)).toStrictEqual({
    summary:
      "The article reports on the assassination of UnitedHealth CEO Brian Thompson in a targeted attack in New York City, raising concerns about implications for the company amid ongoing operational challenges.",
    tickers: [
      {
        code: "UNH",
        name: "UnitedHealth Group Incorporated",
        move: "down",
        reason: "The assassination of the CEO may lead to uncertainty and operational disruptions, negatively impacting stock performance.",
      },
    ],
  });
});