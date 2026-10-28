import type { RequiredScreen, UserRole } from "@/db/schema";

type RequiredScreenConfig = {
  id: RequiredScreen;
  version: number;
  href: string;
  roles: readonly UserRole[];
};

type ScreenAcknowledgement = {
  screen: RequiredScreen;
  version: number;
};

export const REQUIRED_SCREENS: Record<RequiredScreen, RequiredScreenConfig> = {
  welcome: {
    id: "welcome",
    version: 1,
    href: "/bienvenida",
    roles: ["patient", "psychologist"],
  },
};

export function getPendingRequiredScreen(
  role: UserRole,
  acknowledgements: readonly ScreenAcknowledgement[],
) {
  return (
    Object.values(REQUIRED_SCREENS).find(
      (screen) =>
        screen.roles.includes(role) &&
        !acknowledgements.some(
          (item) => item.screen === screen.id && item.version === screen.version,
        ),
    ) ?? null
  );
}
