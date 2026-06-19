"use client";

import { useEffect, useState } from "react";
import { Coffee, X } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { paypalUrl } from "@/lib/site";

const STORAGE_KEY = "fk-support-dismissed";

/**
 * Schlanker, schließbarer Hinweis-Balken ganz oben. Server-seitig sichtbar
 * gerendert; nach dem Mount wird ein gemerktes Schließen (localStorage)
 * übernommen – das vermeidet eine Hydration-Diskrepanz und nervt
 * wiederkehrende Besucher nicht.
 */
export function SupportBar({ locale }: { locale: Locale }) {
  const { support } = getDictionary(locale);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- gemerkten Dismiss-Status nach Mount übernehmen
      setDismissed(true);
    }
  }, []);

  if (dismissed) {
    return null;
  }

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage nicht verfügbar – Balken bleibt für diese Sitzung sichtbar.
    }

    setDismissed(true);
  }

  return (
    <div className="bg-fk-teal-dark text-white">
      <div className="relative mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-10 py-2 text-center text-[13.5px] leading-[1.4] md:px-12">
        <p className="inline-flex items-center gap-1.5">
          <Coffee className="hidden h-4 w-4 shrink-0 sm:inline" strokeWidth={1.75} aria-hidden="true" />
          <span>{support.message}</span>
        </p>
        <a
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold text-white transition-colors duration-150 hover:bg-white/25"
          href={paypalUrl}
          rel="noreferrer"
          target="_blank"
        >
          {support.cta}
          <span aria-hidden="true">→</span>
        </a>
        <button
          aria-label={support.dismiss}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-white/80 transition-colors duration-150 hover:bg-white/15 hover:text-white"
          onClick={dismiss}
          type="button"
        >
          <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
