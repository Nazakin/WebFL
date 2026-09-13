"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SOUND_LABELS, type SoundType } from "@/lib/audio/types";

type AddTrackRowProps = {
  onAdd: (sound: SoundType) => void;
};

const SOUND_TYPES = Object.keys(SOUND_LABELS) as SoundType[];

export function AddTrackRow({ onAdd }: AddTrackRowProps) {
  const [sound, setSound] = useState<SoundType>("kick");

  return (
    <div className="flex items-center gap-3 border-t border-border pt-4">
      <Select value={sound} onValueChange={(value) => setSound(value as SoundType)}>
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SOUND_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {SOUND_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={() => onAdd(sound)}>
        + Add track
      </Button>
    </div>
  );
}
