import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  "aria-label": string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  "aria-label": ariaLabel,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 md:p-6",
        className
      )}
      aria-label={ariaLabel}
    >
      <h2 className="text-sm font-medium text-zinc-800 dark:text-zinc-400 mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">{description}</p>
      )}
      {children}
    </section>
  );
}
