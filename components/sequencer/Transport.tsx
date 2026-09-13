"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type TransportProps = {
  isPlaying: boolean;
  bpm: number;
  onTogglePlay: () => void;
  onBpmChange: (bpm: number) => void;
};

export function Transport({ isPlaying, bpm, onTogglePlay, onBpmChange }: TransportProps) {
  return (
    <div className="flex items-center gap-4">
      <Button onClick={onTogglePlay}>{isPlaying ? "Stop" : "Play"}</Button>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">BPM</span>
        <div className="w-40">
          <Slider
            value={[bpm]}
            min={60}
            max={200}
            step={1}
            onValueChange={(next) => onBpmChange(Array.isArray(next) ? next[0] : next)}
          />
        </div>
        <span className="w-10 text-sm tabular-nums">{bpm}</span>
      </div>
    </div>
  );
}
