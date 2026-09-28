"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { MASK_DURATION, MASK_EASE, MASK_FROM_Y, prefersReducedMotion } from "@/lib/motion"

interface RevealHeadingProps {
  text: string
  id?: string
  className?: string
}

/**
 * Section headline that rises out of a hard-edged mask as it scrolls into view
 * (Motion effect 3). Opacity is never animated — the text is clipped by its
 * wrapper and slides, so the letters surface one by one as they clear the edge.
 *
 * Re-runs whenever `text` changes so the mask is re-measured for the new copy.
 * A language switch shows the new text at rest instead of replaying the reveal.
 */
export const RevealHeading = forwardRef<HTMLHeadingElement, RevealHeadingProps>(
  function RevealHeading({ text, id, className }, forwardedRef) {
    const headingRef = useRef<HTMLHeadingElement>(null)
    const innerRef = useRef<HTMLSpanElement>(null)
    const playedRef = useRef(false)

    useImperativeHandle(forwardedRef, () => headingRef.current as HTMLHeadingElement)

    useEffect(() => {
      const heading = headingRef.current
      const inner = innerRef.current
      if (!heading || !inner) return

      if (prefersReducedMotion() || playedRef.current) {
        gsap.set(inner, { yPercent: 0 })
        ScrollTrigger.refresh()
        return
      }

      gsap.set(inner, { yPercent: MASK_FROM_Y })
      const tween = gsap.to(inner, {
        yPercent: 0,
        duration: MASK_DURATION,
        ease: MASK_EASE,
        scrollTrigger: { trigger: heading, start: "top 85%", once: true },
      })
      playedRef.current = true

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    }, [text])

    return (
      <h2 ref={headingRef} id={id} className={className}>
        <span className="mask">
          <span ref={innerRef} className="mask-inner">
            {text}
          </span>
        </span>
      </h2>
    )
  },
)
