import { AppShell } from "../../components/layout/app-shell";
import { SiteHeader } from "../../components/layout/site-header";
import { FinalCtaSection } from "../../components/sections/final-cta-section";
import { FaqSection } from "../../components/sections/faq-section";

export default function ContactPage() {
  return (
    <AppShell>
      <SiteHeader
        eyebrow="Contact"
        title="Parlons d’un site ou d’un outil web."
        description="Un échange simple suffit pour cadrer le besoin et choisir la bonne suite."
      />
      <FinalCtaSection />
      <FaqSection />
    </AppShell>
  );
}
