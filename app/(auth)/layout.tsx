import { AuthFacesPanel } from "@/components/auth/auth-faces-panel";
import { LegalLinks } from "@/components/legal/legal-links";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-1">
      <div className="flex min-h-full flex-1 flex-col lg:max-w-[min(50%,40rem)]">
        {children}
        <footer className="px-4 pb-6">
          <LegalLinks />
        </footer>
      </div>
      <AuthFacesPanel />
    </div>
  );
}
