"use client"

import { gsap } from "gsap"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Lang = "en" | "fr"

/**
 * Single source of truth for all copy on the site (Design sheet, Section 10).
 * Edit only this object to change wording.
 */
export const I18N: Record<Lang, Record<string, string>> = {
  en: {
    "meta.title": "Hudson & Rufus, Student Council Election 2026",
    "meta.description":
      "Hudson Biggar and Rufus Potié are running for student council president and vice-president at École Secondaire Jules Verne. Election day: October 5, 2026.",
    "nav.home": "Home",
    "nav.duo": "Duo",
    "nav.promises": "Promises",
    "nav.vote": "Vote",
    "lang.label": "Language",
    "hero.descriptor":
      "Two candidates for student council president and vice-president at École Secondaire Jules Verne.",
    "hero.school": "École Secondaire Jules Verne",
    "hero.event": "Student council election",
    "hero.dateLabel": "Election day",
    "hero.date": "October 5, 2026",
    "hero.scroll": "Scroll",
    "duo.heading": "Meet the team",
    "hudson.name": "Hudson Biggar",
    "hudson.role": "Vice-President",
    "rufus.name": "Rufus Potié",
    "rufus.role": "President",
    grade: "Grade 11",
    "promises.heading": "Our promises",
    "p1.title": "Fix the hallway TVs",
    "p1.desc": "They've been off for about ten years. We know how to bring them back.",
    "p2.title": "More funding for soccer equipment",
    "p2.desc": "Proper gear for everyone who plays.",
    "p3.title": "Occasional food truck visits",
    "p3.desc": "A change from the usual lunch, once in a while.",
    "p4.title": "Fix the water fountains",
    "p4.desc": "Water fountains that work when you need them.",
    "p5.title": "Unblock websites",
    "p5.desc": "Fewer blocked sites on the school network.",
    "p6.title": "More microwaves",
    "p6.desc": "Shorter lunch lines.",
    "vote.heading": "Vote Hudson and Rufus",
    "vote.date": "Election day: October 5, 2026",
    "vote.slogan": "The obvious choice.",
    "vote.follow": "Follow the campaign",
    "footer.copy": "© 2026 Hudson Biggar and Rufus Potié",
    "footer.school": "Student council campaign, École Secondaire Jules Verne",
    "footer.top": "Back to top",
    "rail.copy": "©2026",
  },
  fr: {
    "meta.title": "Hudson et Rufus, Élection du conseil étudiant 2026",
    "meta.description":
      "Hudson Biggar et Rufus Potié se présentent à la présidence et à la vice-présidence du conseil étudiant de l'École Secondaire Jules Verne. Jour de l'élection : le 5 octobre 2026.",
    "nav.home": "Accueil",
    "nav.duo": "Duo",
    "nav.promises": "Promesses",
    "nav.vote": "Voter",
    "lang.label": "Langue",
    "hero.descriptor":
      "Deux candidats à la présidence et à la vice-présidence du conseil étudiant de l'École Secondaire Jules Verne.",
    "hero.school": "École Secondaire Jules Verne",
    "hero.event": "Élection du conseil étudiant",
    "hero.dateLabel": "Jour de l'élection",
    "hero.date": "5 octobre 2026",
    "hero.scroll": "Défiler",
    "duo.heading": "Voici l'équipe",
    "hudson.name": "Hudson Biggar",
    "hudson.role": "Vice-président",
    "rufus.name": "Rufus Potié",
    "rufus.role": "Président",
    grade: "11e année",
    "promises.heading": "Nos promesses",
    "p1.title": "Réparer les téléviseurs des corridors",
    "p1.desc": "Éteints depuis une dizaine d'années. On sait comment les remettre en marche.",
    "p2.title": "Plus de financement pour l'équipement de soccer",
    "p2.desc": "Du bon équipement pour tous ceux qui jouent.",
    "p3.title": "Des camions de cuisine de rue, à l'occasion",
    "p3.desc": "Un petit changement au dîner, de temps en temps.",
    "p4.title": "Réparer les fontaines d'eau",
    "p4.desc": "Des fontaines qui fonctionnent quand on en a besoin.",
    "p5.title": "Débloquer des sites Web",
    "p5.desc": "Moins de sites bloqués sur le réseau de l'école.",
    "p6.title": "Plus de micro-ondes",
    "p6.desc": "Des files moins longues à l'heure du dîner.",
    "vote.heading": "Votez pour Hudson et Rufus",
    "vote.date": "Jour de l'élection : le 5 octobre 2026",
    "vote.slogan": "Le choix évident.",
    "vote.follow": "Suivez la campagne",
    "footer.copy": "© 2026 Hudson Biggar et Rufus Potié",
    "footer.school": "Campagne du conseil étudiant, École Secondaire Jules Verne",
    "footer.top": "Retour en haut",
    "rail.copy": "©2026",
  },
}

interface LanguageContextValue {
  lang: Lang
  t: (key: string) => string
  requestLanguage: (next: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")

  // Resolve initial language once on mount: ?lang= override, then localStorage, default "en".
  useEffect(() => {
    let initial: Lang = "en"
    try {
      const params = new URLSearchParams(window.location.search)
      const urlLang = params.get("lang")
      if (urlLang === "en" || urlLang === "fr") {
        initial = urlLang
      } else {
        const saved = window.localStorage.getItem("lang")
        if (saved === "en" || saved === "fr") initial = saved
      }
    } catch {
      // ignore storage/URL access errors
    }
    setLang(initial)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem("lang", lang)
    } catch {
      // ignore storage errors
    }
    document.documentElement.lang = lang
    document.title = I18N[lang]["meta.title"]
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) metaDescription.setAttribute("content", I18N[lang]["meta.description"])
  }, [lang])

  const t = (key: string) => I18N[lang][key] ?? key

  const requestLanguage = (next: Lang) => {
    if (next === lang) return

    if (prefersReducedMotion()) {
      setLang(next)
      return
    }

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-i18n-fade]"))
    if (nodes.length === 0) {
      setLang(next)
      return
    }

    gsap.to(nodes, {
      opacity: 0,
      duration: 0.15,
      onComplete: () => {
        setLang(next)
        requestAnimationFrame(() => {
          gsap.to(nodes, { opacity: 1, duration: 0.15 })
          ScrollTriggerRefresh()
        })
      },
    })
  }

  return <LanguageContext.Provider value={{ lang, t, requestLanguage }}>{children}</LanguageContext.Provider>
}

function ScrollTriggerRefresh() {
  // Loaded dynamically so pages that never touch ScrollTrigger don't pull it in.
  import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
    ScrollTrigger.refresh()
  })
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider")
  return ctx
}
