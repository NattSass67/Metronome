"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => setMounted(true), []);

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("fixed top-4 right-4 z-50", className)}
        aria-label="Toggle theme"
      >
        <Sun className="size-5" aria-hidden />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("fixed top-4 right-4 z-50", className)}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="size-5" aria-hidden />
      ) : (
        <Moon className="size-5" aria-hidden />
      )}
    </Button>
  );
}
