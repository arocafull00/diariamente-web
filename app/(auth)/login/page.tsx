import { GoogleSignInForm } from "@/components/auth/google-sign-in-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
      <GoogleSignInForm />
    </div>
  );
}
