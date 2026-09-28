"use client"

import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import { MASK_DURATION, MASK_EASE, MASK_FROM_Y, MASK_STAGGER } from "@/lib/motion"
import { useLanguage } from "@/lib/i18n"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase)
  CustomEase.create("entrance", "0.16, 1, 0.3, 1")
}

export function HeroSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const hudsonRef = useRef<HTMLSpanElement>(null)
  const rufusRef = useRef<HTMLSpanElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const names = [hudsonRef.current, rufusRef.current].filter(Boolean) as HTMLElement[]
    const bottomLines = bottomRef.current
      ? Array.from(bottomRef.current.querySelectorAll<HTMLElement>(".mask-inner"))
      : []

    if (reduced) {
      gsap.set(names, { x: 0 })
      gsap.set(bottomLines, { yPercent: 0 })
      return
    }

    // Effect 2: the scroll exit is built FIRST, with explicit start values. A
    // plain .to() captures whatever value is current when it is created — which
    // would be the entrance's -14vw — so scrolling back to the top would leave
    // the names shifted left and clipped by their wrapper.
    const scrollTween = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom 30%",
        scrub: 0.6,
      },
    })
    if (hudsonRef.current) {
      scrollTween.fromTo(
        hudsonRef.current,
        { x: "0vw", opacity: 1 },
        { x: "-18vw", opacity: 0, ease: "none", immediateRender: false },
        0,
      )
    }
    if (rufusRef.current) {
      scrollTween.fromTo(
        rufusRef.current,
        { x: "0vw", opacity: 1 },
        { x: "18vw", opacity: 0, ease: "none", immediateRender: false },
        0,
      )
    }

    // Effect 1: each name then slides in from the left edge of its clipped
    // wrapper. No opacity — the wrapper's edge is the hard line the letters
    // emerge from. Built last so it owns x while the page is loading.
    const entrance = gsap.timeline()
    entrance.fromTo(names, { x: "-14vw" }, { x: "0vw", duration: 1.2, stagger: 0.15, ease: "entrance" })

    // The bottom row rises, line by line, out of its own mask.
    entrance.fromTo(
      bottomLines,
      { yPercent: MASK_FROM_Y },
      { yPercent: 0, duration: MASK_DURATION, stagger: MASK_STAGGER, ease: MASK_EASE },
      0.9,
    )

    return () => {
      entrance.kill()
      scrollTween.scrollTrigger?.kill()
      scrollTween.kill()
    }
  }, [])

  return (
    <section id="home" ref={sectionRef} className="hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading" className="hero-h1">
        <span className="hero-name-wrap">
          <span ref={hudsonRef} className="hero-name display-hero">
            HUDSON
          </span>
        </span>
        <span className="hero-name-wrap">
          <span ref={rufusRef} className="hero-name display-hero">
            RUFUS
          </span>
        </span>
        <span className="sr-only">{t("hero.descriptor")}</span>
      </h1>

      <div ref={bottomRef} className="hero-bottom" data-i18n-fade>
        <div className="hero-bottom-group">
          <p className="meta">
            <span className="mask">
              <span className="mask-inner">{t("hero.school")}</span>
            </span>
          </p>
          <p className="meta">
            <span className="mask">
              <span className="mask-inner">{t("hero.event")}</span>
            </span>
          </p>
        </div>

        <div className="hero-bottom-group hero-bottom-group--mid">
          <p className="meta">
            <span className="mask">
              <span className="mask-inner">{t("hero.dateLabel")}</span>
            </span>
          </p>
          <p className="meta">
            <span className="mask">
              <span className="mask-inner">{t("hero.date")}</span>
            </span>
          </p>
        </div>

        <a href="#duo" className="hero-scroll">
          <span className="scroll-cue mask">
            <span className="mask-inner">{t("hero.scroll")}</span>
          </span>
          <span className="scroll-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
