import { Logo } from "@/components/ui/AppHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-app-line bg-white p-6 shadow-sm">{children}</div>
    </main>
  );
}
