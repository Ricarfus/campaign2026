import { DuoSection } from '@/components/duo-section'
import { HeroSection } from '@/components/hero-section'
import { LanguageToggle } from '@/components/language-toggle'
import { MobileTopbar } from '@/components/mobile-topbar'
import { PromisesSection } from '@/components/promises-section'
import { SidebarNav } from '@/components/sidebar-nav'
import { VoteSection } from '@/components/vote-section'
import { LanguageProvider } from '@/lib/i18n'

export default function Page() {
  return (
    <LanguageProvider>
      <SidebarNav />
      <MobileTopbar />
      <LanguageToggle />
      <main className="page-content">
        <HeroSection />
        <DuoSection />
        <PromisesSection />
        <VoteSection />
      </main>
    </LanguageProvider>
  )
}
