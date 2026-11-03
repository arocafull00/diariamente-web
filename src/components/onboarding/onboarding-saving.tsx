import { SsoLoadingFaces } from "@/components/auth/sso-loading-faces";

type OnboardingSavingProps = {
  saving: boolean;
};

export function OnboardingSaving({ saving }: OnboardingSavingProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <SsoLoadingFaces />
      {saving ? (
        <p className="font-display text-2xl leading-tight font-medium text-balance">
          Preparando <span className="text-mood-lp-strong italic">tu espacio</span>...
        </p>
      ) : null}
    </div>
  );
}
