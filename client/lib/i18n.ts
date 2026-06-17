export const locales = ["de", "en", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

/**
 * Sprachen mit URL-Präfix (/en, /zh). Die Standardsprache (de) wird unter den
 * unpräfigierten Routen ausgeliefert; sie hier auszunehmen verhindert, dass
 * /de/* als Duplikat der unpräfigierten Seiten erzeugt wird.
 */
export const prefixedLocales = locales.filter((locale) => locale !== defaultLocale);

export type ChapterGroupKey =
  | "orientierung"
  | "alltag"
  | "ernaehrung"
  | "training"
  | "gesundheit"
  | "einordnung";

export const localeLabels: Record<
  Locale,
  {
    htmlLang: string;
    label: string;
    shortLabel: string;
    switchTitle: string;
  }
> = {
  de: {
    htmlLang: "de",
    label: "Deutsch",
    shortLabel: "DE",
    switchTitle: "Deutsch — fachliche Quelle",
  },
  en: {
    htmlLang: "en",
    label: "English",
    shortLabel: "EN",
    switchTitle: "English — translated from the German original",
  },
  zh: {
    htmlLang: "zh-Hans",
    label: "中文",
    shortLabel: "ZH",
    switchTitle: "中文 — 译自德语原文",
  },
};

export type Dictionary = {
  breadcrumbHome: string;
  chapterKicker: (number: string) => string;
  chapterNavLabel: string;
  chapters: string;
  chaptersDescription: string;
  chaptersEyebrow: string;
  chaptersTitle: string;
  closeNavigation: string;
  footer: {
    copyright: string;
    disclaimer: string;
    github: string;
    sources: string;
  };
  github: string;
  groups: Record<ChapterGroupKey, string>;
  home: {
    heroSubline: string;
    heroTitle: string;
    leversTitle: string;
    levers: Array<{
      key: "energy" | "protein" | "strength" | "movement" | "sleep" | "consistency";
      label: string;
    }>;
    routeSubline: string;
    routeTitle: string;
    searchPlaceholder: string;
    startCta: string;
    startItems: Array<{
      key: "strength" | "protein" | "trend" | "sleep";
      note: string;
      title: string;
    }>;
    startTitle: string;
  };
  license: string;
  nav: {
    chapters: string;
    compass: string;
    searchLabel: string;
    sources: string;
  };
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
  siteSubtitle: string;
  siteTitle: string;
};

const dictionaries: Record<Locale, Dictionary> = {
  de: {
    breadcrumbHome: "Kompass",
    chapterKicker: (number) => `Kapitel ${number}`,
    chapterNavLabel: "Kapitel",
    chapters: "Kapitel",
    chaptersDescription:
      "Die Kapitel folgen der bestehenden Reihenfolge: erst Grundlagen, dann Ernährung, Training, Gesundheit, Quellenbewertung und Fazit.",
    chaptersEyebrow: "Kapitel",
    chaptersTitle: "Fitness-Kompass lesen",
    closeNavigation: "Navigation schliessen",
    footer: {
      copyright: "© Stefan · Open Source (CC0)",
      disclaimer: "Disclaimer — keine medizinische Beratung",
      github: "Auf GitHub ansehen",
      sources: "Quellen",
    },
    github: "GitHub",
    groups: {
      orientierung: "Orientierung",
      alltag: "Alltag & Messung",
      ernaehrung: "Ernährung",
      training: "Training",
      gesundheit: "Gesundheit",
      einordnung: "Einordnung & Quellen",
    },
    home: {
      heroSubline: "17 Kapitel, eine Route. Evidenz statt Programmverkauf.",
      heroTitle: "Ein Kartenblatt für Training, Ernährung und Gesundheit.",
      leversTitle: "Die zentralen Hebel",
      levers: [
        { key: "energy", label: "Energiebilanz" },
        { key: "protein", label: "Protein" },
        { key: "strength", label: "Progressives Krafttraining" },
        { key: "movement", label: "Alltagsbewegung" },
        { key: "sleep", label: "Schlaf" },
        { key: "consistency", label: "Konsistenz" },
      ],
      routeSubline: "Alle 17 Kapitel in Lesereihenfolge — von der Orientierung bis zu den Quellen.",
      routeTitle: "Die Route",
      searchPlaceholder: "Im Kompass suchen — Kapitel, Begriffe, Quellen",
      startCta: "Kurzfassung lesen",
      startItems: [
        {
          key: "strength",
          note: "Ganzkörper reicht — Konstanz schlägt Programm.",
          title: "2× Krafttraining pro Woche",
        },
        {
          key: "protein",
          note: "Eine klare Proteinquelle auf jedem Teller.",
          title: "Protein pro Hauptmahlzeit",
        },
        {
          key: "trend",
          note: "Trends lesen, Tageswerte ignorieren.",
          title: "7-Tage-Gewichtstrend",
        },
        {
          key: "sleep",
          note: "Regelmäßig, ausreichend, geschützt.",
          title: "Schlaf ernst nehmen",
        },
      ],
      startTitle: "Minimaler Startpunkt",
    },
    license: "CC0",
    nav: {
      chapters: "Kapitel",
      compass: "Kompass",
      searchLabel: "Suchen …",
      sources: "Quellen",
    },
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
    siteSubtitle: "Evidenzbasiertes Nachschlagewerk",
    siteTitle: "Stefans Fitness-Kompass",
  },
  en: {
    breadcrumbHome: "Compass",
    chapterKicker: (number) => `Chapter ${number}`,
    chapterNavLabel: "Chapters",
    chapters: "Chapters",
    chaptersDescription:
      "The chapters follow the existing order: foundations first, then nutrition, training, health, source evaluation, and conclusion.",
    chaptersEyebrow: "Chapters",
    chaptersTitle: "Read the Fitness Compass",
    closeNavigation: "Close navigation",
    footer: {
      copyright: "© Stefan · Open source (CC0)",
      disclaimer: "Disclaimer — not medical advice",
      github: "View on GitHub",
      sources: "Sources",
    },
    github: "GitHub",
    groups: {
      orientierung: "Orientation",
      alltag: "Daily Life & Measurement",
      ernaehrung: "Nutrition",
      training: "Training",
      gesundheit: "Health",
      einordnung: "Context & Sources",
    },
    home: {
      heroSubline: "17 chapters, one route. Evidence instead of program sales.",
      heroTitle: "One map sheet for training, nutrition, and health.",
      leversTitle: "The central levers",
      levers: [
        { key: "energy", label: "Energy balance" },
        { key: "protein", label: "Protein" },
        { key: "strength", label: "Progressive strength training" },
        { key: "movement", label: "Daily movement" },
        { key: "sleep", label: "Sleep" },
        { key: "consistency", label: "Consistency" },
      ],
      routeSubline: "All 17 chapters in reading order — from orientation to the sources.",
      routeTitle: "The Route",
      searchPlaceholder: "Search the compass — chapters, terms, sources",
      startCta: "Read the summary",
      startItems: [
        {
          key: "strength",
          note: "Full body is enough — consistency beats programming.",
          title: "2× strength training per week",
        },
        {
          key: "protein",
          note: "One clear protein source on every plate.",
          title: "Protein with every main meal",
        },
        {
          key: "trend",
          note: "Read trends, ignore daily values.",
          title: "7-day weight trend",
        },
        {
          key: "sleep",
          note: "Regular, sufficient, protected.",
          title: "Take sleep seriously",
        },
      ],
      startTitle: "Minimal starting point",
    },
    license: "CC0",
    nav: {
      chapters: "Chapters",
      compass: "Compass",
      searchLabel: "Search …",
      sources: "Sources",
    },
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
    siteSubtitle: "Evidence-based reference",
    siteTitle: "Stefan's Fitness Compass",
  },
  zh: {
    breadcrumbHome: "指南",
    chapterKicker: (number) => `第 ${number} 章`,
    chapterNavLabel: "章节",
    chapters: "章节",
    chaptersDescription: "章节保持既有顺序：先打基础，再看营养、训练、健康、来源评估和总结。",
    chaptersEyebrow: "章节",
    chaptersTitle: "阅读健身指南",
    closeNavigation: "关闭导航",
    footer: {
      copyright: "© Stefan · 开源（CC0）",
      disclaimer: "免责声明 — 非医疗建议",
      github: "在 GitHub 上查看",
      sources: "来源",
    },
    github: "GitHub",
    groups: {
      orientierung: "基础导航",
      alltag: "日常与测量",
      ernaehrung: "营养",
      training: "训练",
      gesundheit: "健康",
      einordnung: "评估与来源",
    },
    home: {
      heroSubline: "17 个章节，一条路线。以证据为准，不卖课程。",
      heroTitle: "一张涵盖训练、营养与健康的地图。",
      leversTitle: "核心杠杆",
      levers: [
        { key: "energy", label: "能量平衡" },
        { key: "protein", label: "蛋白质" },
        { key: "strength", label: "渐进式力量训练" },
        { key: "movement", label: "日常活动" },
        { key: "sleep", label: "睡眠" },
        { key: "consistency", label: "坚持" },
      ],
      routeSubline: "17 个章节按阅读顺序排列——从基础导航到来源评估。",
      routeTitle: "路线",
      searchPlaceholder: "搜索指南——章节、术语、来源",
      startCta: "阅读摘要",
      startItems: [
        {
          key: "strength",
          note: "全身训练即可——坚持比计划更重要。",
          title: "每周 2 次力量训练",
        },
        {
          key: "protein",
          note: "每个餐盘上都有明确的蛋白质来源。",
          title: "每餐主食配蛋白质",
        },
        {
          key: "trend",
          note: "看趋势，别盯单日数值。",
          title: "7 天体重趋势",
        },
        {
          key: "sleep",
          note: "规律、充足、不受干扰。",
          title: "认真对待睡眠",
        },
      ],
      startTitle: "最小起点",
    },
    license: "CC0",
    nav: {
      chapters: "章节",
      compass: "指南",
      searchLabel: "搜索…",
      sources: "来源",
    },
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
    siteSubtitle: "循证参考手册",
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
