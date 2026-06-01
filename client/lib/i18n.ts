export const locales = ["de", "en", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

export const localeLabels: Record<
  Locale,
  {
    flag: string;
    htmlLang: string;
    label: string;
    shortLabel: string;
  }
> = {
  de: {
    flag: "🇩🇪",
    htmlLang: "de",
    label: "Deutsch",
    shortLabel: "DE",
  },
  en: {
    flag: "🇬🇧",
    htmlLang: "en",
    label: "English",
    shortLabel: "EN",
  },
  zh: {
    flag: "🇨🇳",
    htmlLang: "zh-Hans",
    label: "中文",
    shortLabel: "中文",
  },
};

export type Dictionary = {
  chapterNavLabel: string;
  chapters: string;
  chaptersDescription: string;
  chaptersEyebrow: string;
  chaptersTitle: string;
  closeNavigation: string;
  github: string;
  home: {
    kicker: string;
    lead: string;
    primaryCta: string;
    principles: Array<{
      key: "nutrition" | "training" | "tracking" | "health";
      text: string;
      title: string;
    }>;
    secondaryCta: string;
    workEyebrow: string;
    workLead: string;
    workTitle: string;
  };
  license: string;
  nextChapter: string;
  notFound: {
    cta: string;
    text: string;
    title: string;
  };
  onThisPage: string;
  openNavigation: string;
  overview: string;
  previousChapter: string;
  searchNav: string;
  search: {
    bestShown: (count: number) => string;
    empty: string;
    heading: string;
    label: string;
    minChars: string;
    placeholder: string;
    reasonChapterTitle: string;
    reasonHeading: string;
    reasonText: string;
    resultCount: (count: number) => string;
    sectionHits: (count: number) => string;
    title: string;
  };
  siteDescription: string;
  siteTitle: string;
};

const dictionaries: Record<Locale, Dictionary> = {
  de: {
    chapterNavLabel: "Kapitel",
    chapters: "Kapitel",
    chaptersDescription:
      "Die Kapitel folgen der bestehenden Reihenfolge: erst Grundlagen, dann Ernährung, Training, Gesundheit, Quellenbewertung und Fazit.",
    chaptersEyebrow: "Kapitel",
    chaptersTitle: "Fitness-Kompass lesen",
    closeNavigation: "Navigation schliessen",
    github: "GitHub",
    home: {
      kicker: "Grundlagen vor Optimierung",
      lead:
        "Langfristiger Fortschritt entsteht, wenn gute Entscheidungen so einfach werden, dass du sie regelmäßig triffst.",
      primaryCta: "Kurzfassung lesen",
      principles: [
        {
          key: "nutrition",
          title: "Ernährung",
          text: "Protein, Ballaststoffe, Lebensmittelqualität und Energiebilanz als robuste Basis.",
        },
        {
          key: "training",
          title: "Training",
          text: "Progression, Technik, Reps in Reserve und Wiederholbarkeit vor maximaler Erschöpfung.",
        },
        {
          key: "tracking",
          title: "Tracking",
          text: "Trends und Kontext statt einzelne Tageswerte als Entscheidungshilfe nutzen.",
        },
        {
          key: "health",
          title: "Gesundheit",
          text: "Schlaf, Ausdauer, Alltagsbewegung und große Risikofaktoren nüchtern priorisieren.",
        },
      ],
      secondaryCta: "Kapitel ansehen",
      workEyebrow: "Arbeitsweise",
      workLead:
        "Die Web-Version macht den bestehenden Kompass schneller nutzbar: Kapitel bleiben Markdown, Quellen bleiben sichtbar, und Entscheidungen werden über Trends, Kontext und Wiederholbarkeit eingeordnet.",
      workTitle: "Richtung prüfen, nicht Tageswerte jagen",
    },
    license: "CC0",
    nextChapter: "Nächstes Kapitel",
    notFound: {
      cta: "Zur Startseite",
      text: "Der angeforderte Inhalt ist im Fitness-Kompass nicht vorhanden.",
      title: "Seite nicht gefunden",
    },
    onThisPage: "Auf dieser Seite",
    openNavigation: "Navigation oeffnen",
    overview: "Überblick",
    previousChapter: "Vorheriges Kapitel",
    searchNav: "Suche",
    search: {
      bestShown: (count) => `, die besten ${count} angezeigt`,
      empty: "Kein passender Inhalt gefunden.",
      heading: "Inhalte in den Kapiteln finden",
      label: "Suchbegriff",
      minChars: "Bitte mindestens zwei Zeichen eingeben.",
      placeholder: "Thema, Begriff oder konkrete Frage suchen",
      reasonChapterTitle: "im Kapiteltitel",
      reasonHeading: "in der Abschnittsüberschrift",
      reasonText: "im Text",
      resultCount: (count) => (count === 1 ? "1 relevanter Abschnitt" : `${count} relevante Abschnitte`),
      sectionHits: (count) => `${count} Textstellen im Abschnitt`,
      title: "Suchen und einsteigen",
    },
    siteDescription:
      "Ein deutschsprachiger Fitness-Kompass zu Ernährung, Training, Gesundheit, Alltag und Quellenbewertung.",
    siteTitle: "Stefans Fitness-Kompass",
  },
  en: {
    chapterNavLabel: "Chapters",
    chapters: "Chapters",
    chaptersDescription:
      "The chapters follow the existing order: foundations first, then nutrition, training, health, source evaluation, and conclusion.",
    chaptersEyebrow: "Chapters",
    chaptersTitle: "Read the Fitness Compass",
    closeNavigation: "Close navigation",
    github: "GitHub",
    home: {
      kicker: "Foundations before optimization",
      lead:
        "Long-term progress happens when good decisions become simple enough to repeat regularly.",
      primaryCta: "Read the summary",
      principles: [
        {
          key: "nutrition",
          title: "Nutrition",
          text: "Protein, fiber, food quality, and energy balance as a robust base.",
        },
        {
          key: "training",
          title: "Training",
          text: "Progression, technique, reps in reserve, and repeatability before maximum exhaustion.",
        },
        {
          key: "tracking",
          title: "Tracking",
          text: "Use trends and context instead of single daily values as decision support.",
        },
        {
          key: "health",
          title: "Health",
          text: "Prioritize sleep, endurance, daily movement, and major risk factors soberly.",
        },
      ],
      secondaryCta: "View chapters",
      workEyebrow: "Working method",
      workLead:
        "The web version makes the existing compass faster to use: chapters stay Markdown, sources stay visible, and decisions are framed through trends, context, and repeatability.",
      workTitle: "Check direction, do not chase daily values",
    },
    license: "CC0",
    nextChapter: "Next chapter",
    notFound: {
      cta: "Go to homepage",
      text: "The requested content is not available in the Fitness Compass.",
      title: "Page not found",
    },
    onThisPage: "On this page",
    openNavigation: "Open navigation",
    overview: "Overview",
    previousChapter: "Previous chapter",
    searchNav: "Search",
    search: {
      bestShown: (count) => `, showing the best ${count}`,
      empty: "No matching content found.",
      heading: "Find content in the chapters",
      label: "Search term",
      minChars: "Please enter at least two characters.",
      placeholder: "Search for a topic, term, or specific question",
      reasonChapterTitle: "in the chapter title",
      reasonHeading: "in the section heading",
      reasonText: "in the text",
      resultCount: (count) => (count === 1 ? "1 relevant section" : `${count} relevant sections`),
      sectionHits: (count) => `${count} text matches in this section`,
      title: "Search and start",
    },
    siteDescription:
      "A fitness compass for nutrition, training, health, daily life, and source evaluation.",
    siteTitle: "Stefan's Fitness Compass",
  },
  zh: {
    chapterNavLabel: "章节",
    chapters: "章节",
    chaptersDescription: "章节保持既有顺序：先打基础，再看营养、训练、健康、来源评估和总结。",
    chaptersEyebrow: "章节",
    chaptersTitle: "阅读健身指南",
    closeNavigation: "关闭导航",
    github: "GitHub",
    home: {
      kicker: "先打基础，再谈优化",
      lead: "长期进步来自足够简单、能够稳定重复的好决策。",
      primaryCta: "阅读摘要",
      principles: [
        {
          key: "nutrition",
          title: "营养",
          text: "以蛋白质、膳食纤维、食物质量和能量平衡作为稳定基础。",
        },
        {
          key: "training",
          title: "训练",
          text: "优先考虑渐进、技术、保留次数和可重复性，而不是极限疲劳。",
        },
        {
          key: "tracking",
          title: "追踪",
          text: "用趋势和背景帮助判断，而不是盯住单日数值。",
        },
        {
          key: "health",
          title: "健康",
          text: "冷静优先处理睡眠、耐力、日常活动和主要风险因素。",
        },
      ],
      secondaryCta: "查看章节",
      workEyebrow: "使用方式",
      workLead:
        "网页版让现有指南更容易使用：章节仍是 Markdown，来源保持可见，决策通过趋势、背景和可重复性来判断。",
      workTitle: "看方向，不追逐单日数值",
    },
    license: "CC0",
    nextChapter: "下一章",
    notFound: {
      cta: "返回首页",
      text: "健身指南中没有所请求的内容。",
      title: "页面未找到",
    },
    onThisPage: "本页内容",
    openNavigation: "打开导航",
    overview: "概览",
    previousChapter: "上一章",
    searchNav: "搜索",
    search: {
      bestShown: (count) => `，显示最相关的 ${count} 个`,
      empty: "没有找到匹配内容。",
      heading: "在章节中查找内容",
      label: "搜索词",
      minChars: "请输入至少两个字符。",
      placeholder: "搜索主题、术语或具体问题",
      reasonChapterTitle: "章节标题中",
      reasonHeading: "小节标题中",
      reasonText: "正文中",
      resultCount: (count) => `${count} 个相关小节`,
      sectionHits: (count) => `本小节 ${count} 处文本匹配`,
      title: "搜索并进入",
    },
    siteDescription: "关于营养、训练、健康、日常生活和来源评估的健身指南。",
    siteTitle: "Stefan 健身指南",
  },
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function stripLocalePrefix(pathname: string) {
  const [pathWithoutQuery, suffix = ""] = pathname.split(/(?=[?#])/);
  const segments = pathWithoutQuery.split("/").filter(Boolean);

  if (isLocale(segments[0])) {
    const stripped = `/${segments.slice(1).join("/")}`;
    return `${stripped === "/" ? "/" : stripped.replace(/\/$/, "")}${suffix}`;
  }

  return pathname || "/";
}

export function localizePath(locale: Locale, path: string) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith("//")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (locale === defaultLocale) {
    return normalizedPath;
  }

  return normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;
}
