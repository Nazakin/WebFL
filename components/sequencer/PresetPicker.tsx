"use client";

import { Button } from "@/components/ui/button";
import { PRESETS, type Preset } from "@/lib/audio/presets";

type PresetPickerProps = {
  onSelect: (preset: Preset) => void;
};

export function PresetPicker({ onSelect }: PresetPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Presets</span>
      {PRESETS.map((preset) => (
        <Button key={preset.id} size="sm" variant="outline" onClick={() => onSelect(preset)}>
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
