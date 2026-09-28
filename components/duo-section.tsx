"use client"

import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import { RevealHeading } from "@/components/reveal-heading"
import { MASK_EASE, MASK_FROM_Y, prefersReducedMotion } from "@/lib/motion"
import { useLanguage } from "@/lib/i18n"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase)
  if (!CustomEase.get("entrance")) {
    CustomEase.create("entrance", "0.16, 1, 0.3, 1")
  }
}

// Superscript: "11e année" -> 11<sup>e</sup> année, French only (Section 10 mechanism note).
function renderGrade(grade: string, lang: string) {
  const match = lang === "fr" ? grade.match(/^(\d+)e(\s.*)$/) : null
  if (!match) return grade
  return (
    <>
      {match[1]}
      <sup>e</sup>
      {match[2]}
    </>
  )
}

/** Every masked line inside an info block, for the staggered rise. */
function infoLines(el: HTMLDivElement | null) {
  return el ? Array.from(el.querySelectorAll<HTMLElement>(".mask-inner")) : []
}

export function DuoSection() {
  const { t, lang } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const hudsonPortraitRef = useRef<HTMLDivElement>(null)
  const rufusPortraitRef = useRef<HTMLDivElement>(null)
  const hudsonInfoRef = useRef<HTMLDivElement>(null)
  const rufusInfoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const portraits = [hudsonPortraitRef.current, rufusPortraitRef.current]
    const lines = [...infoLines(hudsonInfoRef.current), ...infoLines(rufusInfoRef.current)]

    if (prefersReducedMotion()) {
      gsap.set(portraits, { x: 0 })
      gsap.set(lines, { yPercent: 0 })
      return
    }

    const mm = gsap.matchMedia()

    // Effects 4 + 5: each portrait slides in from its own side, clipped by the
    // mask, then its name/role/grade rise line by line. No opacity anywhere.
    const build = (slide: string) => {
      const timelines = [
        { portrait: hudsonPortraitRef.current, info: hudsonInfoRef.current, from: `-${slide}` },
        { portrait: rufusPortraitRef.current, info: rufusInfoRef.current, from: slide },
      ].map(({ portrait, info, from }) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: portrait, start: "top 80%", once: true } })
        tl.fromTo(portrait, { x: from }, { x: "0vw", duration: 1.1, ease: "entrance" })
        tl.fromTo(
          infoLines(info),
          { yPercent: MASK_FROM_Y },
          { yPercent: 0, duration: 0.9, stagger: 0.06, ease: MASK_EASE },
          0.15,
        )
        return tl
      })

      return () =>
        timelines.forEach((tl) => {
          tl.scrollTrigger?.kill()
          tl.kill()
        })
    }

    mm.add("(min-width: 768px)", () => build("8vw"))
    mm.add("(max-width: 767px)", () => build("5vw"))

    return () => mm.revert()
  }, [])

  return (
    <section id="duo" ref={sectionRef} aria-labelledby="duo-heading">
      <RevealHeading id="duo-heading" className="h2" text={t("duo.heading")} />

      <div className="duo-grid">
        <div className="duo-col">
          <div className="portrait-mask">
            <div ref={hudsonPortraitRef} className="portrait">
              <span className="sr-only">Portrait of Hudson Biggar</span>
              <span className="portrait-letter" aria-hidden="true">
                H
              </span>
            </div>
          </div>
          <div ref={hudsonInfoRef} className="duo-info">
            <p className="delegate-name">
              <span className="mask">
                <span className="mask-inner">{t("hudson.name")}</span>
              </span>
            </p>
            <p className="h3">
              <span className="mask">
                <span className="mask-inner">{t("hudson.role")}</span>
              </span>
            </p>
            <p className="body-text grade-text">
              <span className="mask">
                <span className="mask-inner">{renderGrade(t("grade"), lang)}</span>
              </span>
            </p>
          </div>
        </div>

        <div className="duo-col duo-col--rufus">
          <div className="portrait-mask">
            <div ref={rufusPortraitRef} className="portrait">
              <span className="sr-only">Portrait of Rufus Potié</span>
              <span className="portrait-letter" aria-hidden="true">
                R
              </span>
            </div>
          </div>
          <div ref={rufusInfoRef} className="duo-info">
            <p className="delegate-name">
              <span className="mask">
                <span className="mask-inner">{t("rufus.name")}</span>
              </span>
            </p>
            <p className="h3">
              <span className="mask">
                <span className="mask-inner">{t("rufus.role")}</span>
              </span>
            </p>
            <p className="body-text grade-text">
              <span className="mask">
                <span className="mask-inner">{renderGrade(t("grade"), lang)}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
