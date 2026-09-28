import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase)
  if (!CustomEase.get("entrance")) {
    CustomEase.create("entrance", "0.16, 1, 0.3, 1")
  }
}

/**
 * Shared motion values. Entrances are masked slides only — opacity is never
 * animated, because a fade is what makes scroll reveals look generated rather
 * than directed. (Exit animations may still fade.)
 */
export const MASK_FROM_Y = 150
export const MASK_DURATION = 1.1
export const MASK_STAGGER = 0.07
export const MASK_EASE = "power4.out"

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}
