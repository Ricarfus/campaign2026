"use client"

import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import { TypewriterHeading } from "@/components/typewriter-heading"
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

export function DuoSection() {
  const { t, lang } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const hudsonPortraitRef = useRef<HTMLDivElement>(null)
  const rufusPortraitRef = useRef<HTMLDivElement>(null)
  const hudsonInfoRef = useRef<HTMLDivElement>(null)
  const rufusInfoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const targets = [
      hudsonPortraitRef.current,
      rufusPortraitRef.current,
      hudsonInfoRef.current,
      rufusInfoRef.current,
    ].filter(Boolean) as HTMLElement[]

    if (reduced) {
      gsap.set(targets, { opacity: 1, x: 0 })
      return
    }

    const mm = gsap.matchMedia()

    // Effect 4 + 5: portraits slide in from opposite sides, names/roles fade in shortly after.
    mm.add("(min-width: 768px)", () => {
      const timelines = [
        { portrait: hudsonPortraitRef.current, info: hudsonInfoRef.current, from: "-8vw" },
        { portrait: rufusPortraitRef.current, info: rufusInfoRef.current, from: "8vw" },
      ].map(({ portrait, info, from }) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: portrait, start: "top 80%", once: true } })
        tl.fromTo(portrait, { x: from, opacity: 0 }, { x: "0vw", opacity: 1, duration: 1.1, ease: "entrance" })
        tl.fromTo(info, { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0.15)
        return tl
      })

      return () =>
        timelines.forEach((tl) => {
          tl.scrollTrigger?.kill()
          tl.kill()
        })
    })

    // Mobile: plain fade, no slide, lighter stagger (Section 8 mobile performance note).
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true } })
      tl.fromTo(
        [hudsonPortraitRef.current, rufusPortraitRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 1.1, stagger: 0.08 },
      )
      tl.fromTo(
        [hudsonInfoRef.current, rufusInfoRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 0.7, stagger: 0.08 },
        0.15,
      )
      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="duo" ref={sectionRef} aria-labelledby="duo-heading">
      <TypewriterHeading id="duo-heading" className="h2" text={t("duo.heading")} />

      <div className="duo-grid">
        <div className="duo-col">
          <div ref={hudsonPortraitRef} className="portrait">
            <span className="sr-only">Portrait of Hudson Biggar</span>
            <span className="portrait-letter" aria-hidden="true">
              H
            </span>
          </div>
          <div ref={hudsonInfoRef} className="duo-info">
            <p className="delegate-name">{t("hudson.name")}</p>
            <p className="h3">{t("hudson.role")}</p>
            <p className="body-text grade-text">{renderGrade(t("grade"), lang)}</p>
          </div>
        </div>

        <div className="duo-col duo-col--rufus">
          <div ref={rufusPortraitRef} className="portrait">
            <span className="sr-only">Portrait of Rufus Potié</span>
            <span className="portrait-letter" aria-hidden="true">
              R
            </span>
          </div>
          <div ref={rufusInfoRef} className="duo-info">
            <p className="delegate-name">{t("rufus.name")}</p>
            <p className="h3">{t("rufus.role")}</p>
            <p className="body-text grade-text">{renderGrade(t("grade"), lang)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
