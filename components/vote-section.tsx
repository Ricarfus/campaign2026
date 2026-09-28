"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import { RevealHeading } from "@/components/reveal-heading"
import {
  MASK_DURATION,
  MASK_EASE,
  MASK_FROM_Y,
  MASK_STAGGER,
  prefersReducedMotion,
} from "@/lib/motion"
import { useLanguage } from "@/lib/i18n"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Set to the campaign's Instagram URL once one exists. Hidden entirely until then (Section 7.4/13).
const INSTAGRAM_URL = ""

export function VoteSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const lines = sectionRef.current
      ? Array.from(
          sectionRef.current.querySelectorAll<HTMLElement>(
            ".vote-date .mask-inner, .vote-slogan .mask-inner",
          ),
        )
      : []

    if (prefersReducedMotion()) {
      gsap.set(lines, { yPercent: 0 })
      return
    }

    // Effect 7: the date and slogan rise out of their masks once the headline
    // has revealed. Masked slides only — no opacity.
    const tl = gsap.timeline({
      scrollTrigger: { trigger: headingRef.current, start: "top 45%", once: true },
    })
    tl.fromTo(
      lines,
      { yPercent: MASK_FROM_Y },
      { yPercent: 0, duration: MASK_DURATION, stagger: MASK_STAGGER, ease: MASK_EASE },
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section id="vote" ref={sectionRef} aria-labelledby="vote-heading">
      <RevealHeading
        ref={headingRef}
        id="vote-heading"
        className="vote-headline"
        text={t("vote.heading")}
      />

      <p className="vote-slogan">
        <span className="mask">
          <span className="mask-inner">{t("vote.slogan")}</span>
        </span>
      </p>

      <h3 className="h3 vote-date">
        <span className="mask">
          <span className="mask-inner">{t("vote.date")}</span>
        </span>
      </h3>

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
