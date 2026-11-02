import { SsoCallbackHandler } from "@/components/auth/sso-callback-handler";

export default function SsoCallbackPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 px-4 py-12">
      <SsoCallbackHandler />
      <div id="clerk-captcha" />
    </div>
  );
}
