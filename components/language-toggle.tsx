"use client"

import { useLanguage } from "@/lib/i18n"

export function LanguageToggle() {
  const { lang, t, requestLanguage } = useLanguage()

  return (
    <div className="lang-toggle" role="group" aria-label={t("lang.label")}>
      <span className={`lang-toggle-thumb ${lang === "fr" ? "lang-toggle-thumb--fr" : ""}`} aria-hidden="true" />
      <button
        type="button"
        lang="en"
        aria-pressed={lang === "en"}
        className={`lang-toggle-btn ${lang === "en" ? "is-active" : ""}`}
        onClick={() => requestLanguage("en")}
      >
        EN
      </button>
      <button
        type="button"
        lang="fr"
        aria-pressed={lang === "fr"}
        className={`lang-toggle-btn ${lang === "fr" ? "is-active" : ""}`}
        onClick={() => requestLanguage("fr")}
      >
        FR
      </button>
    </div>
  )
}
