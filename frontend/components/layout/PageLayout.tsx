import { cn } from "@/lib/utils";

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100",
        className
      )}
    >
      <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center p-4 sm:p-6">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
