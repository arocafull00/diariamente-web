import { SsoCallbackHandler } from "@/components/auth/sso-callback-handler";

export default function SsoCallbackPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
      <SsoCallbackHandler />
    </div>
  );
}
