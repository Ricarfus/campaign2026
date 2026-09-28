"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface TypewriterHeadingProps {
  text: string
  id?: string
  className?: string
}

/**
 * Section headline that reveals character by character as it scrolls into view
 * (Motion effect 3). Re-splits whenever `text` changes so a language switch
 * rebuilds the characters and its ScrollTrigger against the new layout (effect 8).
 */
export const TypewriterHeading = forwardRef<HTMLHeadingElement, TypewriterHeadingProps>(
  function TypewriterHeading({ text, id, className }, forwardedRef) {
    const innerRef = useRef<HTMLHeadingElement>(null)
    useImperativeHandle(forwardedRef, () => innerRef.current as HTMLHeadingElement)

    useEffect(() => {
      const el = innerRef.current
      if (!el) return

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      el.innerHTML = ""
      const words = text.split(" ")
      words.forEach((word, i) => {
        const wordSpan = document.createElement("span")
        wordSpan.style.whiteSpace = "nowrap"
        Array.from(word).forEach((char) => {
          const charSpan = document.createElement("span")
          charSpan.textContent = char
          charSpan.className = "tw-char"
          charSpan.setAttribute("aria-hidden", "true")
          charSpan.style.opacity = reduced ? "1" : "0"
          wordSpan.appendChild(charSpan)
        })
        el.appendChild(wordSpan)
        if (i < words.length - 1) el.appendChild(document.createTextNode(" "))
      })

      if (reduced) return

      const chars = el.querySelectorAll<HTMLElement>(".tw-char")
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "top 35%",
          scrub: true,
        },
      })
      tl.to(chars, { opacity: 1, stagger: 0.03, ease: "none" })

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    }, [text])

    return <h2 ref={innerRef} id={id} className={className} aria-label={text} />
  },
)
