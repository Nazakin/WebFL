"use client";

import { StepCell } from "@/components/sequencer/StepCell";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { Track } from "@/lib/audio/types";

type TrackRowProps = {
  track: Track;
  currentStep: number;
  onToggleStep: (stepIndex: number) => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onRemove: () => void;
};

export function TrackRow({ track, currentStep, onToggleStep, onToggleMute, onVolumeChange, onRemove }: TrackRowProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-24 shrink-0 truncate text-sm font-medium">{track.name}</div>
      <Button size="sm" variant={track.muted ? "secondary" : "outline"} onClick={onToggleMute}>
        {track.muted ? "Muted" : "Mute"}
      </Button>
      <div className="w-24 shrink-0">
        <Slider
          value={[track.volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(next) => onVolumeChange(Array.isArray(next) ? next[0] : next)}
        />
      </div>
      <div className="flex gap-1">
        {track.steps.map((active, index) => (
          <StepCell key={index} active={active} current={currentStep === index} onToggle={() => onToggleStep(index)} />
        ))}
      </div>
      <Button size="sm" variant="ghost" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
}
