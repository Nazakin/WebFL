import type { SoundType } from "@/lib/audio/types";

let noiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return buffer;
}

function envelopeGain(ctx: AudioContext, time: number, attack: number, peak: number, decay: number, releaseTo = 0.0001) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(peak, time + attack);
  gain.gain.exponentialRampToValueAtTime(releaseTo, time + attack + decay);
  return gain;
}

function playKick(ctx: AudioContext, time: number, output: AudioNode) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(45, time + 0.15);

  const gain = envelopeGain(ctx, time, 0.001, 1, 0.25);
  osc.connect(gain).connect(output);
  osc.start(time);
  osc.stop(time + 0.3);
}

function playKickTight(ctx: AudioContext, time: number, output: AudioNode) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(220, time);
  osc.frequency.exponentialRampToValueAtTime(65, time + 0.05);
  const gain = envelopeGain(ctx, time, 0.001, 1, 0.1);
  osc.connect(gain).connect(output);
  osc.start(time);
  osc.stop(time + 0.13);

  const click = ctx.createBufferSource();
  click.buffer = getNoiseBuffer(ctx);
  const clickFilter = ctx.createBiquadFilter();
  clickFilter.type = "highpass";
  clickFilter.frequency.value = 2500;
  const clickGain = envelopeGain(ctx, time, 0.001, 0.5, 0.01);
  click.connect(clickFilter).connect(clickGain).connect(output);
  click.start(time);
  click.stop(time + 0.02);
}

function playKickDeep(ctx: AudioContext, time: number, output: AudioNode) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, time);
  osc.frequency.exponentialRampToValueAtTime(32, time + 0.4);
  const gain = envelopeGain(ctx, time, 0.005, 1, 0.5);
  osc.connect(gain).connect(output);
  osc.start(time);
  osc.stop(time + 0.55);
}

function playSub(ctx: AudioContext, time: number, output: AudioNode) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(90, time);
  osc.frequency.exponentialRampToValueAtTime(38, time + 0.35);

  const gain = envelopeGain(ctx, time, 0.005, 1, 0.55);
  osc.connect(gain).connect(output);
  osc.start(time);
  osc.stop(time + 0.6);
}

function playSnare(ctx: AudioContext, time: number, output: AudioNode) {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1000;
  const noiseGain = envelopeGain(ctx, time, 0.001, 1, 0.15);
  noise.connect(filter).connect(noiseGain).connect(output);

  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(180, time);
  const oscGain = envelopeGain(ctx, time, 0.001, 0.5, 0.1);
  osc.connect(oscGain).connect(output);

  noise.start(time);
  noise.stop(time + 0.2);
  osc.start(time);
  osc.stop(time + 0.12);
}

function playSnareTight(ctx: AudioContext, time: number, output: AudioNode) {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 2200;
  const noiseGain = envelopeGain(ctx, time, 0.001, 1, 0.07);
  noise.connect(filter).connect(noiseGain).connect(output);
  noise.start(time);
  noise.stop(time + 0.09);

  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(220, time);
  const oscGain = envelopeGain(ctx, time, 0.001, 0.35, 0.05);
  osc.connect(oscGain).connect(output);
  osc.start(time);
  osc.stop(time + 0.07);
}

function playRim(ctx: AudioContext, time: number, output: AudioNode) {
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(1800, time);
  const oscGain = envelopeGain(ctx, time, 0.001, 0.5, 0.03);
  osc.connect(oscGain).connect(output);

  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 3000;
  const noiseGain = envelopeGain(ctx, time, 0.001, 0.4, 0.02);
  noise.connect(filter).connect(noiseGain).connect(output);

  osc.start(time);
  osc.stop(time + 0.04);
  noise.start(time);
  noise.stop(time + 0.03);
}

function playTom(ctx: AudioContext, time: number, output: AudioNode) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(180, time);
  osc.frequency.exponentialRampToValueAtTime(90, time + 0.2);

  const gain = envelopeGain(ctx, time, 0.001, 0.9, 0.3);
  osc.connect(gain).connect(output);
  osc.start(time);
  osc.stop(time + 0.35);
}

function playHihatClosed(ctx: AudioContext, time: number, output: AudioNode) {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 7000;
  const gain = envelopeGain(ctx, time, 0.001, 0.6, 0.05);
  noise.connect(filter).connect(gain).connect(output);
  noise.start(time);
  noise.stop(time + 0.06);
}

function playHihatOpen(ctx: AudioContext, time: number, output: AudioNode) {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 6000;
  const gain = envelopeGain(ctx, time, 0.001, 0.5, 0.3);
  noise.connect(filter).connect(gain).connect(output);
  noise.start(time);
  noise.stop(time + 0.35);
}

function playClap(ctx: AudioContext, time: number, output: AudioNode) {
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1500;
  filter.connect(output);

  for (let i = 0; i < 3; i++) {
    const burstTime = time + i * 0.01;
    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);
    const gain = envelopeGain(ctx, burstTime, 0.001, 0.8, 0.08);
    noise.connect(gain).connect(filter);
    noise.start(burstTime);
    noise.stop(burstTime + 0.1);
  }
}

function playCrash(ctx: AudioContext, time: number, output: AudioNode) {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  noise.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 5000;
  const gain = envelopeGain(ctx, time, 0.001, 0.5, 0.9);
  noise.connect(filter).connect(gain).connect(output);
  noise.start(time);
  noise.stop(time + 1);
}

function playPerc(ctx: AudioContext, time: number, output: AudioNode) {
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(700, time);
  osc.frequency.exponentialRampToValueAtTime(300, time + 0.08);
  const gain = envelopeGain(ctx, time, 0.001, 0.5, 0.1);
  osc.connect(gain).connect(output);
  osc.start(time);
  osc.stop(time + 0.12);
}

const PLAYERS: Record<SoundType, (ctx: AudioContext, time: number, output: AudioNode) => void> = {
  kick: playKick,
  kickTight: playKickTight,
  kickDeep: playKickDeep,
  sub: playSub,
  snare: playSnare,
  snareTight: playSnareTight,
  rim: playRim,
  tom: playTom,
  hihatClosed: playHihatClosed,
  hihatOpen: playHihatOpen,
  clap: playClap,
  crash: playCrash,
  perc: playPerc,
};

export function playSound(sound: SoundType, ctx: AudioContext, time: number, output: AudioNode) {
  PLAYERS[sound](ctx, time, output);
}
