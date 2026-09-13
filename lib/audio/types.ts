export type SoundType =
  | "kick"
  | "kickTight"
  | "kickDeep"
  | "sub"
  | "snare"
  | "snareTight"
  | "rim"
  | "tom"
  | "hihatClosed"
  | "hihatOpen"
  | "clap"
  | "crash"
  | "perc";

export type Track = {
  id: string;
  name: string;
  sound: SoundType;
  steps: boolean[];
  volume: number;
  muted: boolean;
};

export const STEP_COUNT = 16;

export const SOUND_LABELS: Record<SoundType, string> = {
  kick: "Kick",
  kickTight: "Kick Tight",
  kickDeep: "Kick Deep",
  sub: "Sub Bass",
  snare: "Snare",
  snareTight: "Snare Tight",
  rim: "Rimshot",
  tom: "Tom",
  hihatClosed: "Hi-Hat Closed",
  hihatOpen: "Hi-Hat Open",
  clap: "Clap",
  crash: "Crash",
  perc: "Perc",
};
