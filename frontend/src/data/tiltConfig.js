// Hand-authored tilt constants. NOT auto-generated - unlike scoreConfig.js,
// nothing here is fit by regression, so it's safe from being overwritten by
// scripts/fitBenchmarkModel.mjs. See scripts/SCORING.md for the full model.
//
// The tilt layer lets the user's weight sliders nudge a component's score
// around its real-benchmark-derived backbone, without ever letting sliders
// override a measured performance gap. Two knobs control that:
//
//   TILT_STRENGTH - how much the sliders are allowed to move a score at all.
//   TILT_CLAMP    - the hard ceiling/floor on that movement, regardless of
//                   how extreme the sliders or the spec gap are.
//
// ALPHAS are diminishing-returns exponents applied to each metric's ratio-to-
// baseline before it's weighted - the same exponents the original scoring
// model used (0.6 / 0.4), extended to cover threads. These are hand-set, not
// fit against data (unlike GPU_MODEL/CPU_MODEL in scoreConfig.js) - they
// encode "this spec's advantage matters less the further it is from the
// baseline," not a measured relationship.

export const TILT_STRENGTH = 0.35; // 0 = sliders do nothing, 1 = tilt moves as much as the raw ratios would

export const TILT_CLAMP = { min: 0.8, max: 1.25 }; // caps slider-driven movement to -20% / +25%

export const GPU_ALPHAS = {
  clock: 1.0,      // clock scales close to linearly with its ratio to baseline
  vram: 0.6,       // diminishing returns - a 3x VRAM lead shouldn't be a 3x tilt
  efficiency: 0.4, // diminishing returns - strongest compression, TDP swings are large
};

export const CPU_ALPHAS = {
  clockSpeed: 1.0,
  cores: 0.6,
  threads: 0.5,
  efficiency: 0.4,
};

/** Clamp a tilt factor to TILT_CLAMP so sliders can never fully override a real benchmark gap. */
export function clampTilt(value) {
  return Math.min(TILT_CLAMP.max, Math.max(TILT_CLAMP.min, value));
}
