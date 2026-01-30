"use client"

import { Sun, Moon, HelpCircle, Activity } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link"
import { Button } from "@/components/ui/button";

export default function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6">
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </div>

            <h1 className="text-lg font-extrabold text-foreground/90">
              Attention Flow Analyzer
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" title="Help">
            <HelpCircle className="h-5 w-5" />
          </Button>

          <div className="h-6 w-[1px] bg-border" />
 
          <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme">
            {theme === "light" ? (
              <Sun className="h-5 w-5" />
                ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}