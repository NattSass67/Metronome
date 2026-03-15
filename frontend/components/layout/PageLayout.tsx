import { cn } from "@/lib/utils";

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100",
        className
      )}
    >
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">{children}</main>
    </div>
  );
}
