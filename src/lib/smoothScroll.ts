export type SmoothScrollEnvironment = {
  reducedMotion: boolean;
  touchInput: boolean;
  hardwareConcurrency: number;
};

export function shouldEnableSmoothScroll({
  reducedMotion,
  touchInput,
  hardwareConcurrency,
}: SmoothScrollEnvironment) {
  return !reducedMotion && !touchInput && hardwareConcurrency > 4;
}
