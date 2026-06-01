"use client";

import { useEffect } from "react";
import { localeLabels, type Locale } from "@/lib/i18n";

type HtmlLangProps = {
  locale: Locale;
};

export function HtmlLang({ locale }: HtmlLangProps) {
  useEffect(() => {
    document.documentElement.lang = localeLabels[locale].htmlLang;
  }, [locale]);

  return null;
}
