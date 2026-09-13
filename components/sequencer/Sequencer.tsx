"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AddTrackRow } from "@/components/sequencer/AddTrackRow";
import { PresetPicker } from "@/components/sequencer/PresetPicker";
import { Transport } from "@/components/sequencer/Transport";
import { TrackRow } from "@/components/sequencer/TrackRow";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getAudioContext } from "@/lib/audio/context";
import { playSound } from "@/lib/audio/instruments";
import { stepsFromHits, type Preset } from "@/lib/audio/presets";
import { createScheduler } from "@/lib/audio/scheduler";
import { SOUND_LABELS, STEP_COUNT, type SoundType, type Track } from "@/lib/audio/types";

let trackIdCounter = 0;
function nextTrackId() {
  trackIdCounter += 1;
  return `track-${trackIdCounter}`;
}

function createTrack(sound: SoundType): Track {
  return {
    id: nextTrackId(),
    name: SOUND_LABELS[sound],
    sound,
    steps: Array.from({ length: STEP_COUNT }, () => false),
    volume: 0.8,
    muted: false,
  };
}

const DEFAULT_TRACKS: SoundType[] = ["kick", "sub", "hihatClosed", "snare", "clap"];

export function Sequencer() {
  const [tracks, setTracks] = useState<Track[]>(() => DEFAULT_TRACKS.map(createTrack));
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  const tracksRef = useRef(tracks);
  const bpmRef = useRef(bpm);
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());
  const schedulerRef = useRef<ReturnType<typeof createScheduler> | null>(null);

  useEffect(() => {
    tracksRef.current = tracks;
    for (const track of tracks) {
      const gain = gainNodesRef.current.get(track.id);
      if (gain) gain.gain.value = track.muted ? 0 : track.volume;
    }
  }, [tracks]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  const getTrackGain = useCallback((track: Track) => {
    const ctx = getAudioContext();
    let gain = gainNodesRef.current.get(track.id);
    if (!gain) {
      gain = ctx.createGain();
      gain.gain.value = track.muted ? 0 : track.volume;
      gain.connect(ctx.destination);
      gainNodesRef.current.set(track.id, gain);
    }
    return gain;
  }, []);

  useEffect(() => {
    const scheduler = createScheduler({
      stepCount: STEP_COUNT,
      getBpm: () => bpmRef.current,
      onStep: (step, time) => {
        const ctx = getAudioContext();
        const delayMs = Math.max(0, (time - ctx.currentTime) * 1000);
        setTimeout(() => setCurrentStep(step), delayMs);
        for (const track of tracksRef.current) {
          if (track.muted || !track.steps[step]) continue;
          playSound(track.sound, ctx, time, getTrackGain(track));
        }
      },
    });
    schedulerRef.current = scheduler;
    return () => {
      scheduler.stop();
    };
  }, [getTrackGain]);

  const togglePlay = () => {
    const scheduler = schedulerRef.current;
    if (!scheduler) return;
    if (scheduler.isRunning()) {
      scheduler.stop();
      setIsPlaying(false);
      setCurrentStep(-1);
    } else {
      getAudioContext();
      scheduler.start();
      setIsPlaying(true);
    }
  };

  const addTrack = (sound: SoundType) => {
    setTracks((prev) => [...prev, createTrack(sound)]);
  };

  const removeTrack = (id: string) => {
    gainNodesRef.current.get(id)?.disconnect();
    gainNodesRef.current.delete(id);
    setTracks((prev) => prev.filter((track) => track.id !== id));
  };

  const applyPreset = (preset: Preset) => {
    schedulerRef.current?.stop();
    setIsPlaying(false);
    setCurrentStep(-1);
    for (const gain of gainNodesRef.current.values()) gain.disconnect();
    gainNodesRef.current.clear();
    setBpm(preset.bpm);
    setTracks(
      preset.tracks.map((presetTrack) => ({
        ...createTrack(presetTrack.sound),
        steps: stepsFromHits(presetTrack.hits),
      }))
    );
  };

  const toggleStep = (trackId: string, stepIndex: number) => {
    const track = tracksRef.current.find((t) => t.id === trackId);
    if (track && !track.muted) {
      const ctx = getAudioContext();
      playSound(track.sound, ctx, ctx.currentTime, getTrackGain(track));
    }
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, steps: t.steps.map((v, i) => (i === stepIndex ? !v : v)) } : t))
    );
  };

  const toggleMute = (trackId: string) => {
    setTracks((prev) => prev.map((track) => (track.id === trackId ? { ...track, muted: !track.muted } : track)));
  };

  const setVolume = (trackId: string, volume: number) => {
    setTracks((prev) => prev.map((track) => (track.id === trackId ? { ...track, volume } : track)));
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">WebFL Sequencer</h1>
        <div className="flex items-center gap-4">
          <PresetPicker onSelect={applyPreset} />
          <ThemeToggle />
        </div>
      </div>
      <Transport isPlaying={isPlaying} bpm={bpm} onTogglePlay={togglePlay} onBpmChange={setBpm} />
      <div className="flex flex-col divide-y divide-border">
        {tracks.map((track) => (
          <TrackRow
            key={track.id}
            track={track}
            currentStep={isPlaying ? currentStep : -1}
            onToggleStep={(stepIndex) => toggleStep(track.id, stepIndex)}
            onToggleMute={() => toggleMute(track.id)}
            onVolumeChange={(volume) => setVolume(track.id, volume)}
            onRemove={() => removeTrack(track.id)}
          />
        ))}
      </div>
      <AddTrackRow onAdd={addTrack} />
    </div>
  );
}
