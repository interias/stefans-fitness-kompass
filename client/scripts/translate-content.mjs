import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const clientRoot = process.cwd();
const repositoryRoot = path.resolve(clientRoot, "..");
const sourceDocsRoot = path.join(repositoryRoot, "docs");
const sourceDisclaimer = path.join(repositoryRoot, "DISCLAIMER.md");
const targetRoot = path.join(clientRoot, "content");
const cachePath = path.join(repositoryRoot, "temp", "translation-cache.json");
const chapterFilePattern = /^\d{2}-.+\.md$/;

const targets = {
  en: {
    googleLocale: "en",
    disclaimerTitle: "Disclaimer",
    titles: {
      "00-warum-gesund-sein.md": "00 Why Be Healthy?",
      "01-kurzfassung.md": "01 Summary",
      "02-quellenbewertung.md": "02 Source Evaluation",
      "03-gewohnheiten-alltag.md": "03 Habits, Daily Life, and Weekly Check",
      "04-tracking.md": "04 Tracking and Measurement",
      "05-ernaehrung.md": "05 Nutrition",
      "06-diaetphase.md": "06 Diet Phase",
      "07-massephase.md": "07 Mass Phase",
      "08-krafttraining.md": "08 Strength Training",
      "09-biomechanik-uebungsauswahl.md": "09 Biomechanics and Exercise Selection",
      "10-ausdauertraining.md": "10 Endurance Training",
      "11-gesundheit-schlaf.md": "11 Health and Sleep",
      "12-langlebigkeit-risiken.md": "12 Longevity and Risk Factors",
      "13-youtube-coachquellen.md": "13 YouTube and Coach Sources",
      "14-fazit.md": "14 Conclusion",
      "15-quellen.md": "15 Sources",
      "16-ueber-dieses-dokument.md": "16 About This Document",
    },
  },
  zh: {
    googleLocale: "zh-CN",
    disclaimerTitle: "免责声明",
    titles: {
      "00-warum-gesund-sein.md": "00 为什么要健康？",
      "01-kurzfassung.md": "01 摘要",
      "02-quellenbewertung.md": "02 来源评估",
      "03-gewohnheiten-alltag.md": "03 习惯、日常生活和每周检查",
      "04-tracking.md": "04 追踪与测量",
      "05-ernaehrung.md": "05 营养",
      "06-diaetphase.md": "06 减脂阶段",
      "07-massephase.md": "07 增肌阶段",
      "08-krafttraining.md": "08 力量训练",
      "09-biomechanik-uebungsauswahl.md": "09 生物力学与动作选择",
      "10-ausdauertraining.md": "10 耐力训练",
      "11-gesundheit-schlaf.md": "11 健康与睡眠",
      "12-langlebigkeit-risiken.md": "12 长寿与风险因素",
      "13-youtube-coachquellen.md": "13 YouTube 与教练来源",
      "14-fazit.md": "14 总结",
      "15-quellen.md": "15 来源",
      "16-ueber-dieses-dokument.md": "16 关于本文档",
    },
  },
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readCache() {
  try {
    return JSON.parse(await readFile(cachePath, "utf8"));
  } catch {
    return {};
  }
}

async function writeCache(cache) {
  await mkdir(path.dirname(cachePath), { recursive: true });
  await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
}

function hasLetters(value) {
  return /[A-Za-zÄÖÜäöüß\u00c0-\u024f]/.test(value);
}

async function translatePlainText(text, target, cache) {
  if (!hasLetters(text)) {
    return text;
  }

  const key = `${target.googleLocale}\n${text}`;
  if (cache[key]) {
    return cache[key];
  }

  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "de");
  url.searchParams.set("tl", target.googleLocale);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const translated = data[0].map((entry) => entry[0]).join("");
      cache[key] = translated;
      await sleep(80);
      return translated;
    } catch (error) {
      if (attempt === 4) {
        throw error;
      }

      await sleep(500 * attempt);
    }
  }

  return text;
}

function protect(value, fileName, target) {
  const tokens = [];
  let protectedValue = value;

  const addToken = (replacement) => {
    const token = `9876543210${tokens.length}0123456789`;
    tokens.push({ replacement, token });
    return token;
  };

  protectedValue = protectedValue.replace(/!\[[^\]]*]\([^)]+\)/g, (match) => addToken(match));
  protectedValue = protectedValue.replace(/\[([^\]]+)]\(([^)]+)\)/g, (match, _label, href) => {
    const normalizedHref = href.split("#")[0].split("?")[0].replace(/\\/g, "/").split("/").pop();

    if (normalizedHref && target.titles[normalizedHref]) {
      return addToken(`[${target.titles[normalizedHref]}](${href})`);
    }

    return addToken(match);
  });
  protectedValue = protectedValue.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, (match) => addToken(match));
  protectedValue = protectedValue.replace(/`[^`]+`/g, (match) => addToken(match));
  protectedValue = protectedValue.replace(/\$[^$\n]+\$/g, (match) => addToken(match));
  protectedValue = protectedValue.replace(/https?:\/\/[^\s)]+/g, (match) => addToken(match));

  return {
    restore(translated) {
      return tokens.reduce((current, { replacement, token }) => current.replaceAll(token, replacement), translated);
    },
    value: protectedValue,
  };
}

function splitTableRow(line) {
  const hasLeadingPipe = line.trimStart().startsWith("|");
  const hasTrailingPipe = line.trimEnd().endsWith("|");
  const parts = line.split("|");
  const start = hasLeadingPipe ? 1 : 0;
  const end = hasTrailingPipe ? parts.length - 1 : parts.length;

  return {
    cells: parts.slice(start, end),
    hasLeadingPipe,
    hasTrailingPipe,
    prefix: parts.slice(0, start).join("|"),
    suffix: parts.slice(end).join("|"),
  };
}

async function translateSegment(value, fileName, target, cache) {
  if (!value.trim() || !hasLetters(value)) {
    return value;
  }

  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const core = value.slice(leading.length, value.length - trailing.length);
  const protectedSegment = protect(core, fileName, target);
  const translated = await translatePlainText(protectedSegment.value, target, cache);

  return `${leading}${protectedSegment.restore(translated)}${trailing}`;
}

async function translateLine(line, fileName, target, cache) {
  if (!line.trim()) {
    return line;
  }

  if (/^\s*```/.test(line) || /^\s*---+\s*$/.test(line)) {
    return line;
  }

  if (/<img\b/i.test(line) || /^\s*<\/?[a-z][^>]*>\s*$/i.test(line) || /^\s*!\[[^\]]*]\([^)]+\)\s*$/.test(line)) {
    return line;
  }

  if (/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line)) {
    return line;
  }

  const headingMatch = line.match(/^(#{1,6}\s+)(.+)$/);
  if (headingMatch) {
    const title = headingMatch[1] === "# " ? (target.titles[fileName] ?? target.disclaimerTitle) : undefined;
    return `${headingMatch[1]}${title ?? (await translateSegment(headingMatch[2], fileName, target, cache))}`;
  }

  const listMatch = line.match(/^(\s*(?:[-*+]|\d+\.)\s+)(.+)$/);
  if (listMatch) {
    return `${listMatch[1]}${await translateSegment(listMatch[2], fileName, target, cache)}`;
  }

  if (line.includes("|")) {
    const row = splitTableRow(line);
    const translatedCells = [];

    for (const cell of row.cells) {
      translatedCells.push(await translateSegment(cell, fileName, target, cache));
    }

    return `${row.prefix}${row.hasLeadingPipe ? "|" : ""}${translatedCells.join("|")}${row.hasTrailingPipe ? "|" : ""}${row.suffix}`;
  }

  return translateSegment(line, fileName, target, cache);
}

async function translateMarkdown(markdown, fileName, target, cache) {
  const lines = markdown.split(/\r?\n/);
  const translatedLines = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      translatedLines.push(line);
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      translatedLines.push(line);
      continue;
    }

    translatedLines.push(await translateLine(line, fileName, target, cache));
  }

  return translatedLines.join("\n");
}

function normalizeKnownFormulas(markdown, locale) {
  const replacements = {
    en: [
      [String.raw`\text{Körpergewicht (kg)} / \text{Größe (m)}^2`, String.raw`\text{body weight (kg)} / \text{height (m)}^2`],
      [String.raw`\text{Taillenumfang} / \text{Körpergröße}`, String.raw`\text{waist circumference} / \text{height}`],
      [String.raw`\frac{\text{Summe der letzten 7 Morgengewichte}}{7}`, String.raw`\frac{\text{sum of the last 7 morning weights}}{7}`],
      [String.raw`\frac{\text{Trend Woche 2} - \text{Trend Woche 1}}{\text{Körpergewicht}} \times 100`, String.raw`\frac{\text{trend week 2} - \text{trend week 1}}{\text{body weight}} \times 100`],
      [String.raw`10 \times \text{kg} + 6{,}25 \times \text{cm} - 5 \times \text{Alter} + 5`, String.raw`10 \times \text{kg} + 6{,}25 \times \text{cm} - 5 \times \text{age} + 5`],
      [String.raw`10 \times \text{kg} + 6{,}25 \times \text{cm} - 5 \times \text{Alter} - 161`, String.raw`10 \times \text{kg} + 6{,}25 \times \text{cm} - 5 \times \text{age} - 161`],
      [String.raw`\text{Durchschnittskalorien} - \frac{\text{Gewichtsänderung kg/Woche} \times 7{.}700}{7}`, String.raw`\text{average calories} - \frac{\text{weight change kg/week} \times 7{.}700}{7}`],
      [String.raw`\text{Zielkalorien} - \text{Erhaltungskalorien}`, String.raw`\text{target calories} - \text{maintenance calories}`],
      [String.raw`\text{Gewicht} \times (1 + \frac{\text{Wiederholungen}}{30})`, String.raw`\text{weight} \times (1 + \frac{\text{repetitions}}{30})`],
      [String.raw`\text{Erhaltung} + 100\text{-}300\,\text{kcal/Tag}`, String.raw`\text{maintenance} + 100\text{-}300\,\text{kcal/day}`],
    ],
    zh: [
      [String.raw`\text{Körpergewicht (kg)} / \text{Größe (m)}^2`, String.raw`\text{体重 (kg)} / \text{身高 (m)}^2`],
      [String.raw`\text{Taillenumfang} / \text{Körpergröße}`, String.raw`\text{腰围} / \text{身高}`],
      [String.raw`\frac{\text{Summe der letzten 7 Morgengewichte}}{7}`, String.raw`\frac{\text{最近 7 次晨间体重之和}}{7}`],
      [String.raw`\frac{\text{Trend Woche 2} - \text{Trend Woche 1}}{\text{Körpergewicht}} \times 100`, String.raw`\frac{\text{第 2 周趋势} - \text{第 1 周趋势}}{\text{体重}} \times 100`],
      [String.raw`10 \times \text{kg} + 6{,}25 \times \text{cm} - 5 \times \text{Alter} + 5`, String.raw`10 \times \text{kg} + 6{,}25 \times \text{cm} - 5 \times \text{年龄} + 5`],
      [String.raw`10 \times \text{kg} + 6{,}25 \times \text{cm} - 5 \times \text{Alter} - 161`, String.raw`10 \times \text{kg} + 6{,}25 \times \text{cm} - 5 \times \text{年龄} - 161`],
      [String.raw`\text{Durchschnittskalorien} - \frac{\text{Gewichtsänderung kg/Woche} \times 7{.}700}{7}`, String.raw`\text{平均热量} - \frac{\text{每周体重变化 kg} \times 7{.}700}{7}`],
      [String.raw`\text{Zielkalorien} - \text{Erhaltungskalorien}`, String.raw`\text{目标热量} - \text{维持热量}`],
      [String.raw`\text{Gewicht} \times (1 + \frac{\text{Wiederholungen}}{30})`, String.raw`\text{重量} \times (1 + \frac{\text{重复次数}}{30})`],
      [String.raw`\text{Erhaltung} + 100\text{-}300\,\text{kcal/Tag}`, String.raw`\text{维持} + 100\text{-}300\,\text{kcal/天}`],
    ],
  };

  return (replacements[locale] ?? []).reduce(
    (current, [from, to]) => current.replaceAll(from, to),
    markdown,
  );
}

async function main() {
  const cache = await readCache();
  const docFiles = (await readdir(sourceDocsRoot))
    .filter((fileName) => chapterFilePattern.test(fileName))
    .sort((a, b) => a.localeCompare(b, "de", { numeric: true }));

  for (const [locale, target] of Object.entries(targets)) {
    const localeRoot = path.join(targetRoot, locale);
    await mkdir(localeRoot, { recursive: true });

    for (const fileName of docFiles) {
      const source = await readFile(path.join(sourceDocsRoot, fileName), "utf8");
      const translated = normalizeKnownFormulas(await translateMarkdown(source, fileName, target, cache), locale);
      await writeFile(path.join(localeRoot, fileName), `${translated.trimEnd()}\n`, "utf8");
      console.log(`Translated ${fileName} -> ${locale}`);
      await writeCache(cache);
    }

    const disclaimer = await readFile(sourceDisclaimer, "utf8");
    const translatedDisclaimer = await translateMarkdown(disclaimer, "DISCLAIMER.md", target, cache);
    await writeFile(path.join(localeRoot, "DISCLAIMER.md"), `${translatedDisclaimer.trimEnd()}\n`, "utf8");
    console.log(`Translated DISCLAIMER.md -> ${locale}`);
    await writeCache(cache);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
