"use client"

import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
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

    if (reduced) {
      gsap.set(names, { opacity: 1, x: 0 })
      gsap.set(bottomRef.current, { opacity: 1 })
      return
    }

    const entrance = gsap.timeline()

    // Effect 1: big slide-in for the hero names, then the bottom row fades in.
    entrance.fromTo(
      names,
      { x: "-14vw", opacity: 0 },
      { x: "0vw", opacity: 1, duration: 1.2, stagger: 0.15, ease: "entrance" },
    )
    entrance.fromTo(bottomRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.9)

    // Effect 2: slide out, scrubbed to the hero's scroll exit.
    const scrollTween = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom 30%",
        scrub: 0.6,
      },
    })
    if (hudsonRef.current) {
      scrollTween.to(hudsonRef.current, { x: "-18vw", opacity: 0, ease: "none" }, 0)
    }
    if (rufusRef.current) {
      scrollTween.to(rufusRef.current, { x: "18vw", opacity: 0, ease: "none" }, 0)
    }

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
          <p className="meta">{t("hero.school")}</p>
          <p className="meta">{t("hero.event")}</p>
        </div>
        <div className="hero-bottom-group hero-bottom-group--mid">
          <p className="meta">{t("hero.dateLabel")}</p>
          <p className="meta">{t("hero.date")}</p>
        </div>
        <a href="#duo" className="hero-scroll">
          <span className="scroll-cue">{t("hero.scroll")}</span>
          <span className="scroll-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
