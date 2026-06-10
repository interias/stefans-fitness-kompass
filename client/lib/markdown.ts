import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { toOptimizedAssetPath } from "@/lib/content";
import { defaultLocale, type Locale, localizePath } from "@/lib/i18n";

type HastNode = {
  children?: HastNode[];
  properties?: Record<string, unknown>;
  tagName?: string;
  type: string;
  value?: string;
};

type UnistTree = Parameters<typeof visit>[0];

function isExternalReference(value: string) {
  return /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith("//");
}

function getNodeText(node: HastNode): string {
  if (node.type === "text") {
    return node.value ?? "";
  }

  return (node.children ?? []).map(getNodeText).join("");
}

function rewriteMarkdownLink(value: string, locale: Locale) {
  if (!value || value.startsWith("#") || isExternalReference(value)) {
    return value;
  }

  const [withoutHash, hash = ""] = value.split("#");
  const [withoutQuery, query = ""] = withoutHash.split("?");
  const normalized = withoutQuery.replace(/\\/g, "/");

  if (!normalized.endsWith(".md")) {
    return value;
  }

  const fileName = normalized.split("/").pop();
  if (!fileName) {
    return value;
  }

  if (fileName === "DISCLAIMER.md") {
    return localizePath(locale, `/disclamer${hash ? `#${hash}` : ""}`);
  }

  if (!/^\d{2}-.+\.md$/.test(fileName)) {
    return value;
  }

  const slug = fileName.replace(/\.md$/, "");
  const queryPart = query ? `?${query}` : "";
  const hashPart = hash ? `#${hash}` : "";

  return localizePath(locale, `/kapitel/${slug}${queryPart}${hashPart}`);
}

/* Kurzbelege wie "DGE 2024a" oder "Li et al. 2018": externer Link, kurzer Text,
 * endet auf eine Jahreszahl (optional mit Buchstabensuffix). */
function isCitationText(text: string) {
  const trimmed = text.trim();
  return trimmed.length <= 48 && /(1[89]\d{2}|20\d{2})[a-z]?$/.test(trimmed);
}

function rehypeRewriteLinksAndImages(locale: Locale) {
  return (tree: UnistTree) => {
    visit(tree, "element", (node: HastNode) => {
      if (!node.properties) {
        return;
      }

      if (node.tagName === "img" && typeof node.properties.src === "string") {
        node.properties.src = toOptimizedAssetPath(node.properties.src);
        node.properties.loading = "lazy";
        node.properties.decoding = "async";
      }

      if (node.tagName === "a" && typeof node.properties.href === "string") {
        const href = rewriteMarkdownLink(node.properties.href, locale);
        node.properties.href = href;

        if (isExternalReference(href)) {
          node.properties.rel = "noreferrer";
          node.properties.target = "_blank";

          if (isCitationText(getNodeText(node))) {
            const existing = Array.isArray(node.properties.className) ? node.properties.className : [];
            node.properties.className = [...existing, "cite-chip"];
          }
        }
      }
    });
  };
}

type CalloutType = "grundsatz" | "grenze" | "warnsignal" | "quelle";

const calloutKeywords: Array<{ keywords: string[]; type: CalloutType }> = [
  { keywords: ["quelle prüfen", "quelle pruefen", "check the source", "check source", "核对来源"], type: "quelle" },
  { keywords: ["warnsignal", "warnung", "achtung", "wichtig", "warning", "important", "caution", "警示", "警告", "注意"], type: "warnsignal" },
  { keywords: ["grenze", "limit", "界限", "局限"], type: "grenze" },
];

const calloutLabels: Record<Locale, Record<CalloutType, string>> = {
  de: { grenze: "Grenze", grundsatz: "Grundsatz", quelle: "Quelle prüfen", warnsignal: "Warnsignal" },
  en: { grenze: "Limit", grundsatz: "Principle", quelle: "Check the source", warnsignal: "Warning sign" },
  zh: { grenze: "界限", grundsatz: "原则", quelle: "核对来源", warnsignal: "警示" },
};

/* Lucide-Icons (1.75 stroke) als Inline-SVG für die Callout-Labelzeile. */
const calloutIconPaths: Record<CalloutType, Array<{ attributes: Record<string, string>; tag: string }>> = {
  grundsatz: [
    { attributes: { cx: "12", cy: "12", r: "10" }, tag: "circle" },
    { attributes: { points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" }, tag: "polygon" },
  ],
  grenze: [
    { attributes: { d: "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" }, tag: "path" },
    { attributes: { d: "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" }, tag: "path" },
    { attributes: { d: "M7 21h10" }, tag: "path" },
    { attributes: { d: "M12 3v18" }, tag: "path" },
    { attributes: { d: "M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" }, tag: "path" },
  ],
  warnsignal: [{ attributes: { points: "22 12 18 12 15 21 9 3 6 12 2 12" }, tag: "polyline" }],
  quelle: [
    { attributes: { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }, tag: "path" },
    { attributes: { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" }, tag: "path" },
  ],
};

function createCalloutIcon(type: CalloutType): HastNode {
  return {
    children: calloutIconPaths[type].map((shape) => ({
      children: [],
      properties: { ...shape.attributes },
      tagName: shape.tag,
      type: "element",
    })),
    properties: {
      ariaHidden: "true",
      fill: "none",
      height: "13",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.75",
      viewBox: "0 0 24 24",
      width: "13",
    },
    tagName: "svg",
    type: "element",
  };
}

function detectCalloutType(node: HastNode): CalloutType {
  const text = getNodeText(node).trim().toLowerCase();

  for (const entry of calloutKeywords) {
    if (entry.keywords.some((keyword) => text.startsWith(keyword))) {
      return entry.type;
    }
  }

  return "grundsatz";
}

function rehypeCallouts(locale: Locale) {
  return (tree: UnistTree) => {
    visit(tree, "element", (node: HastNode) => {
      if (node.tagName !== "blockquote") {
        return;
      }

      const type = detectCalloutType(node);

      node.tagName = "aside";
      node.properties = {
        ...node.properties,
        className: ["callout", `callout-${type}`],
      };
      node.children = [
        {
          children: [
            createCalloutIcon(type),
            { type: "text", value: calloutLabels[locale][type] },
          ],
          properties: { className: ["callout-label"] },
          tagName: "p",
          type: "element",
        },
        ...(node.children ?? []),
      ];
    });
  };
}

function isWhitespaceText(node: HastNode) {
  return node.type === "text" && !(node.value ?? "").trim();
}

function isHeroImageParagraph(node: HastNode) {
  if (node.type !== "element" || node.tagName !== "p") {
    return false;
  }

  const children = (node.children ?? []).filter((child) => !isWhitespaceText(child));
  return children.length > 0 && children.every((child) => child.type === "element" && child.tagName === "img");
}

/* Entfernt das führende H1 und das Hero-Bild am Kapitelanfang; beides rendert
 * die Kapitelseite selbst (Kicker + H1 + 4:1-Banner). */
function rehypeStripChapterHeader() {
  return (tree: UnistTree) => {
    const root = tree as HastNode;
    const children = root.children ?? [];
    let elementsSeen = 0;
    let removedTitle = false;
    let removedHero = false;

    for (let index = 0; index < children.length; index += 1) {
      const node = children[index];

      if (node.type !== "element") {
        continue;
      }

      if (!removedTitle && node.tagName === "h1") {
        children.splice(index, 1);
        removedTitle = true;
        index -= 1;
        continue;
      }

      if (!removedHero && isHeroImageParagraph(node)) {
        children.splice(index, 1);
        removedHero = true;
        index -= 1;
        continue;
      }

      elementsSeen += 1;
      if (elementsSeen >= 2 || (removedTitle && removedHero)) {
        break;
      }
    }
  };
}

type RenderMarkdownOptions = {
  stripChapterHeader?: boolean;
};

export async function renderMarkdown(
  markdown: string,
  locale: Locale = defaultLocale,
  options: RenderMarkdownOptions = {},
) {
  let processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw);

  if (options.stripChapterHeader) {
    processor = processor.use(rehypeStripChapterHeader);
  }

  const file = await processor
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeCallouts, locale)
    .use(rehypeRewriteLinksAndImages, locale)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      content: {
        type: "text",
        value: "#",
      },
      properties: {
        ariaLabel: "Abschnitt verlinken",
        className: ["heading-anchor"],
      },
    })
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
