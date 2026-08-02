export function AuthBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-linear-to-br from-rose-100 to-teal-100">
      <div className="animate-auth-gradient-a absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#bae6fd60,transparent)]" />
      <div className="animate-auth-gradient-b absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_300px,#fecdd360,transparent)]" />
      <div className="animate-auth-gradient-c absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_800px,#a5f3fc60,transparent)]" />
    </div>
  );
}
