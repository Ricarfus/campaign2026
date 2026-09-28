"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import { TypewriterHeading } from "@/components/typewriter-heading"
import { useLanguage } from "@/lib/i18n"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Set to the campaign's Instagram URL once one exists. Hidden entirely until then (Section 7.4/13).
const INSTAGRAM_URL = ""

export function VoteSection() {
  const { t } = useLanguage()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const sloganRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      gsap.set(sloganRef.current, { opacity: 1 })
      return
    }

    // Effect 7: slogan fades in after the headline's typewriter reveal finishes.
    const tl = gsap.timeline({
      scrollTrigger: { trigger: headingRef.current, start: "top 35%", once: true },
    })
    tl.fromTo(sloganRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section id="vote" aria-labelledby="vote-heading">
      <TypewriterHeading ref={headingRef} id="vote-heading" className="vote-headline" text={t("vote.heading")} />
      <h3 className="h3 vote-date">{t("vote.date")}</h3>
      <p ref={sloganRef} className="vote-slogan body-text">
        {t("vote.slogan")}
      </p>
      {INSTAGRAM_URL && (
        <a href={INSTAGRAM_URL} className="vote-follow meta" target="_blank" rel="noreferrer">
          {t("vote.follow")}
        </a>
      )}

      <footer className="site-footer">
        <div className="footer-left">
          <img src="/assets/logo-cream.svg" alt="Hudson and Rufus" className="footer-logo" width={56} height={39} />
          <p className="meta">{t("footer.copy")}</p>
        </div>
        <p className="meta footer-school">{t("footer.school")}</p>
        <a href="#home" className="meta footer-top">
          {t("footer.top")}
        </a>
      </footer>
    </section>
  )
}
