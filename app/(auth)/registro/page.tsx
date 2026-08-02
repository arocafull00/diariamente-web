import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <>
      <div
        className="auth-soft-background absolute inset-0 -z-10 h-full w-full"
        aria-hidden
      />
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
        <SignUp
          routing="path"
          path="/registro"
          signInUrl="/login"
          forceRedirectUrl="/onboarding"
        />
      </div>
    </>
  );
}
