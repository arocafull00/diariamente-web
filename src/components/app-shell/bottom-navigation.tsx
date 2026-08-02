"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, User, Users, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const patientItems: NavItem[] = [
  { href: "/inicio", label: "Inicio", icon: Home },
  { href: "/mis-registros", label: "Registros", icon: BookOpen },
  { href: "/perfil", label: "Perfil", icon: User },
];

const psychologistItems: NavItem[] = [
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/invitacion", label: "Invitar", icon: UserPlus },
  { href: "/perfil", label: "Perfil", icon: User },
];

function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function PatientNavigation() {
  return <BottomNav items={patientItems} />;
}

export function PsychologistNavigation() {
  return <BottomNav items={psychologistItems} />;
}
