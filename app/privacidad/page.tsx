import type { Metadata } from "next";
import Link from "next/link";

import { PRIVACY_POLICY_SECTIONS } from "@/components/privacy/privacy-policy-content";
import { PrivacyPolicySection } from "@/components/privacy/privacy-policy-section";

export const metadata: Metadata = {
  title: "Política de privacidad · DiariaMente",
  description:
    "Qué datos trata DiariaMente, quién puede verlos, cuánto tiempo se conservan y cómo ejercer tus derechos.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-2xl space-y-8 px-4 py-10">
      <header className="space-y-2">
        <Link href="/" className="text-sm font-medium text-primary">
          DiariaMente
        </Link>
        <h1 className="font-display text-3xl font-medium">Política de privacidad</h1>
      </header>
      {PRIVACY_POLICY_SECTIONS.map((section) => (
        <PrivacyPolicySection
          key={section.title}
          title={section.title}
          paragraphs={section.paragraphs}
        />
      ))}
    </div>
  );
}
