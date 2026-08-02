import { SignIn } from "@clerk/nextjs";

export default function RecoverPasswordPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
      <SignIn
        routing="path"
        path="/recuperar-password"
        signUpUrl="/registro"
        forceRedirectUrl="/"
      />
    </div>
  );
}
