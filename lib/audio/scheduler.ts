import { getAudioContext } from "@/lib/audio/context";

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_SEC = 0.1;

type SchedulerOptions = {
  stepCount: number;
  getBpm: () => number;
  onStep: (step: number, time: number) => void;
};

export function createScheduler({ stepCount, getBpm, onStep }: SchedulerOptions) {
  let timerId: ReturnType<typeof setInterval> | null = null;
  let currentStep = 0;
  let nextStepTime = 0;

  function secondsPerStep() {
    return 60 / getBpm() / 4;
  }

  function tick() {
    const ctx = getAudioContext();
    while (nextStepTime < ctx.currentTime + SCHEDULE_AHEAD_SEC) {
      onStep(currentStep, nextStepTime);
      nextStepTime += secondsPerStep();
      currentStep = (currentStep + 1) % stepCount;
    }
  }

  return {
    start() {
      if (timerId !== null) return;
      const ctx = getAudioContext();
      currentStep = 0;
      nextStepTime = ctx.currentTime;
      tick();
      timerId = setInterval(tick, LOOKAHEAD_MS);
    },
    stop() {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
      currentStep = 0;
    },
    isRunning() {
      return timerId !== null;
    },
  };
}
