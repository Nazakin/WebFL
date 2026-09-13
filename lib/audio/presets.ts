import { STEP_COUNT, type SoundType } from "@/lib/audio/types";

export type PresetTrack = {
  sound: SoundType;
  hits: number[];
};

export type Preset = {
  id: string;
  label: string;
  bpm: number;
  tracks: PresetTrack[];
};

export function stepsFromHits(hits: number[]): boolean[] {
  const steps = Array.from({ length: STEP_COUNT }, () => false);
  for (const hit of hits) steps[hit] = true;
  return steps;
}

export const PRESETS: Preset[] = [
  {
    id: "dnb",
    label: "Drum & Bass",
    bpm: 174,
    tracks: [
      { sound: "kick", hits: [0, 6, 10] },
      {sound: "kickTight", hits: [3]},
      { sound: "sub", hits: [0, 6, 10] },
      { sound: "snare", hits: [4, 12] },
      { sound: "hihatClosed", hits: [2, 6, 10, 14] },
      { sound: "hihatOpen", hits: [8] },
    ],
  },
  {
    id: "techno",
    label: "Techno",
    bpm: 128,
    tracks: [
      { sound: "kick", hits: [0, 4, 8, 12] },
      { sound: "clap", hits: [4, 12] },
      { sound: "hihatClosed", hits: [2, 6, 10, 14] },
      { sound: "perc", hits: [3, 7, 11, 15] },
      { sound: "crash", hits: [0] },
    ],
  },
  {
    id: "neon-drift",
    label: "Neon Drift",
    bpm: 140,
    tracks: [
      { sound: "kick", hits: [0, 7] },
      { sound: "sub", hits: [0, 7] },
      { sound: "snare", hits: [8] },
      { sound: "clap", hits: [12] },
      { sound: "hihatClosed", hits: [2, 4, 6, 10, 14] },
      { sound: "hihatOpen", hits: [9] },
      { sound: "rim", hits: [3, 11] },
      { sound: "tom", hits: [15] },
      { sound: "perc", hits: [5, 13] },
      { sound: "crash", hits: [0] },
    ],
  },
];
