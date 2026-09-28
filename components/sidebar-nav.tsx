"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/i18n"

const SECTIONS = ["home", "duo", "promises", "vote"] as const

export function SidebarNav() {
  const { t } = useLanguage()
  const [active, setActive] = useState<string>("home")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    )

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="rail">
      <a href="#home" className="rail-logo" aria-label="Hudson and Rufus">
        <img src="/assets/logo-cream.svg" alt="" width={40} height={28} />
      </a>

      <nav className="rail-nav" aria-label="Primary">
        <ul className="rail-list">
          {SECTIONS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`rail-link nav ${active === id ? "is-active" : ""}`}
                aria-current={active === id ? "true" : undefined}
                data-i18n-fade
              >
                {t(`nav.${id}`)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="rail-copy meta" data-i18n-fade>
        {t("footer.copy")}
      </p>
    </div>
  )
}
