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

// Fixed priority order (Section 7.3). Never reorder.
const PROMISE_KEYS = ["p1", "p2", "p3", "p4", "p5", "p6"] as const

export function PromisesSection() {
  const { t } = useLanguage()
  const rowRefs = useRef<HTMLDivElement[]>([])
  rowRefs.current = []

  useEffect(() => {
    const rows = rowRefs.current

    if (prefersReducedMotion()) {
      rows.forEach((row) => {
        const rule = row.querySelector(".promise-rule")
        const inner = row.querySelector(".promise-title .mask-inner")
        if (rule) gsap.set(rule, { scaleX: 1 })
        gsap.set(inner, { yPercent: 0 })
      })
      return
    }

    // Effect 6: the row's rule draws left-to-right while its title rises out of
    // the mask. No opacity — the title slides, it does not fade.
    const timelines = rows.map((row) => {
      const rule = row.querySelector(".promise-rule")
      const inner = row.querySelector(".promise-title .mask-inner")
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } })
      tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "none" }, 0)
      tl.fromTo(inner, { yPercent: MASK_FROM_Y }, { yPercent: 0, duration: 0.9, ease: MASK_EASE }, 0)
      return tl
    })

    return () =>
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill()
        tl.kill()
      })
  }, [])

  return (
    <section id="promises" aria-labelledby="promises-heading">
      <div className="promises-body">
        <div className="promises-heading-col">
          <RevealHeading id="promises-heading" className="h2" text={t("promises.heading")} />
        </div>

        <div className="promises-list">
          {PROMISE_KEYS.map((key, index) => (
            <div
              key={key}
              ref={(el) => {
                if (el) rowRefs.current[index] = el
              }}
              className="promise-row"
            >
              <span className="promise-rule" aria-hidden="true" />
              <h3 className="h3 promise-title">
                <span className="mask">
                  <span className="mask-inner">{t(`${key}.title`)}</span>
                </span>
              </h3>
            </div>
          ))}
          <span className="promise-rule promise-rule--final" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
