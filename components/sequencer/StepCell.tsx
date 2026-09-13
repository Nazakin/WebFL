"use client";

import { cn } from "@/lib/utils";

type StepCellProps = {
  active: boolean;
  current: boolean;
  onToggle: () => void;
};

export function StepCell({ active, current, onToggle }: StepCellProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        "h-8 w-8 rounded-sm border border-border transition-colors",
        active ? "bg-primary neon-glow" : "bg-muted hover:bg-muted-foreground/20",
        current && !active && "ring-2 ring-primary ring-offset-1 ring-offset-background",
        current && active && "step-pulse"
      )}
    />
  );
}
