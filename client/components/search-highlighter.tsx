"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const ignoredSelector = [
  "a",
  "button",
  "code",
  "input",
  "kbd",
  "mark.search-hit",
  "pre",
  "samp",
  "script",
  "select",
  "style",
  "textarea",
  ".heading-anchor",
  ".katex",
].join(",");

function normalizeSearchValue(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCharacter(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getHighlightTerms(query: string) {
  return Array.from(new Set(normalizeSearchValue(query).split(" ").filter((term) => term.length >= 2)));
}

function getRanges(text: string, terms: string[]) {
  let normalizedText = "";
  const normalizedToOriginal: Array<{ end: number; start: number }> = [];
  let originalOffset = 0;

  Array.from(text).forEach((character) => {
    const characterStart = originalOffset;
    const characterEnd = characterStart + character.length;
    const normalizedCharacter = normalizeCharacter(character);

    Array.from(normalizedCharacter).forEach((normalizedPart) => {
      normalizedText += normalizedPart;
      normalizedToOriginal.push({ end: characterEnd, start: characterStart });
    });

    originalOffset = characterEnd;
  });

  const ranges: Array<{ end: number; start: number }> = [];

  terms.forEach((term) => {
    let index = normalizedText.indexOf(term);

    while (index >= 0) {
      const start = normalizedToOriginal[index]?.start;
      const end = normalizedToOriginal[index + term.length - 1]?.end;

      if (start !== undefined && end !== undefined) {
        ranges.push({ end, start });
      }

      index = normalizedText.indexOf(term, index + term.length);
    }
  });

  return ranges
    .sort((a, b) => a.start - b.start)
    .reduce<Array<{ end: number; start: number }>>((merged, range) => {
      const previous = merged[merged.length - 1];

      if (!previous || range.start > previous.end) {
        merged.push({ ...range });
        return merged;
      }

      previous.end = Math.max(previous.end, range.end);
      return merged;
    }, []);
}

function removeExistingHighlights(root: HTMLElement) {
  root.querySelectorAll("mark.search-hit").forEach((mark) => {
    mark.replaceWith(document.createTextNode(mark.textContent ?? ""));
  });
  root.normalize();
}

function highlightTextNode(textNode: Text, terms: string[]) {
  const text = textNode.nodeValue ?? "";
  const ranges = getRanges(text, terms);

  if (ranges.length === 0 || !textNode.parentNode) {
    return;
  }

  const fragment = document.createDocumentFragment();
  let cursor = 0;

  ranges.forEach((range) => {
    if (cursor < range.start) {
      fragment.append(document.createTextNode(text.slice(cursor, range.start)));
    }

    const mark = document.createElement("mark");
    mark.className = "search-hit";
    mark.textContent = text.slice(range.start, range.end);
    fragment.append(mark);
    cursor = range.end;
  });

  if (cursor < text.length) {
    fragment.append(document.createTextNode(text.slice(cursor)));
  }

  textNode.parentNode.replaceChild(fragment, textNode);
}

function findFirstHitNearHash(root: HTMLElement) {
  const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));

  if (!hash) {
    return root.querySelector("mark.search-hit");
  }

  const heading = document.getElementById(hash);

  if (!heading || !root.contains(heading)) {
    return root.querySelector("mark.search-hit");
  }

  const headingHit = heading.querySelector("mark.search-hit");

  if (headingHit) {
    return headingHit;
  }

  const headingLevel = Number(heading.tagName.match(/^H([1-6])$/)?.[1] ?? 6);
  let element = heading.nextElementSibling;

  while (element) {
    const currentLevel = Number(element.tagName.match(/^H([1-6])$/)?.[1] ?? 7);

    if (currentLevel <= headingLevel) {
      break;
    }

    const hit = element.querySelector("mark.search-hit");

    if (hit) {
      return hit;
    }

    element = element.nextElementSibling;
  }

  return root.querySelector("mark.search-hit");
}

export function SearchHighlighter() {
  const searchParams = useSearchParams();
  const query = searchParams.get("highlight") ?? "";

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".prose-kompass");

    if (!root) {
      return;
    }

    removeExistingHighlights(root);

    const terms = getHighlightTerms(query);

    if (terms.length === 0) {
      return;
    }

    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(root, window.NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        const text = node.nodeValue ?? "";

        if (!parent || !text.trim() || parent.closest(ignoredSelector)) {
          return window.NodeFilter.FILTER_REJECT;
        }

        return window.NodeFilter.FILTER_ACCEPT;
      },
    });

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode as Text);
    }

    textNodes.forEach((textNode) => highlightTextNode(textNode, terms));

    window.requestAnimationFrame(() => {
      findFirstHitNearHash(root)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    return () => removeExistingHighlights(root);
  }, [query]);

  return null;
}
