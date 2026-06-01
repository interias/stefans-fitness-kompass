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

type ElementNode = {
  properties?: Record<string, unknown>;
  tagName?: string;
  type?: string;
};

type UnistTree = Parameters<typeof visit>[0];

function isExternalReference(value: string) {
  return /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith("//");
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

function rehypeRewriteLinksAndImages(locale: Locale) {
  return (tree: UnistTree) => {
    visit(tree, "element", (node: ElementNode) => {
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
        }
      }
    });
  };
}

export async function renderMarkdown(markdown: string, locale: Locale = defaultLocale) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypeSlug)
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
