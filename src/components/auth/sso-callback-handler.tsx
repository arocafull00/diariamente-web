"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";

import { SsoLoadingFaces } from "@/components/auth/sso-loading-faces";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SsoCallbackHandler() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!clerk.loaded || !signIn || !signUp || hasRun.current) {
        return;
      }

      hasRun.current = true;

      if (clerk.session) {
        router.replace("/");
        return;
      }

      const navigateHome = async (decorateUrl: (url: string) => string) => {
        const url = decorateUrl("/");

        if (url.startsWith("http")) {
          window.location.href = url;
          return;
        }

        router.push(url);
      };

      const finalizeSignIn = async () => {
        await signIn.finalize({
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              return;
            }

            await navigateHome(decorateUrl);
          },
        });
      };

      const finalizeSignUp = async () => {
        await signUp.finalize({
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              return;
            }

            await navigateHome(decorateUrl);
          },
        });
      };

      try {
        if (signIn.status === "complete") {
          await finalizeSignIn();
          return;
        }

        if (signUp.isTransferable) {
          await signIn.create({ transfer: true });

          const signInStatus = signIn.status as typeof signIn.status | "complete";

          if (signInStatus === "complete") {
            await finalizeSignIn();
            return;
          }

          if (clerk.session) {
            router.replace("/");
            return;
          }

          router.push("/login");
          return;
        }

        if (
          signIn.status === "needs_first_factor" &&
          !signIn.supportedFirstFactors?.every(
            (factor) => factor.strategy === "enterprise_sso",
          )
        ) {
          router.push("/login");
          return;
        }

        if (signIn.isTransferable) {
          await signUp.create({ transfer: true });

          if (signUp.status === "complete") {
            await finalizeSignUp();
            return;
          }

          router.push("/onboarding");
          return;
        }

        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }

        if (signUp.status === "missing_requirements" && signUp.id) {
          router.replace("/onboarding");
          return;
        }

        if (
          signIn.status === "needs_second_factor" ||
          signIn.status === "needs_new_password"
        ) {
          router.push("/login");
          return;
        }

        const existingSessionId =
          signIn.existingSession?.sessionId ||
          signUp.existingSession?.sessionId;

        if (!existingSessionId) {
          logger.error(
            "auth.login.sso_callback_unresolved",
            new Error("SSO callback ended without a session"),
            { signInStatus: signIn.status, signUpStatus: signUp.status },
          );
          setError("No se pudo completar el inicio de sesión. Inténtalo de nuevo.");
          return;
        }

        await clerk.setActive({
          session: existingSessionId,
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              return;
            }

            await navigateHome(decorateUrl);
          },
        });
      } catch (caughtError) {
        logger.error("auth.login.sso_callback_failed", caughtError, {
          signInStatus: signIn.status,
          signUpStatus: signUp.status,
        });
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "No se pudo completar el inicio de sesión";

        setError(message);
      }
    })();
  }, [clerk, signIn, signUp, router]);

  if (error) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button type="button" variant="link" onClick={() => router.push("/login")}>
          Volver al login
        </Button>
      </div>
    );
  }

  return <SsoLoadingFaces />;
}
