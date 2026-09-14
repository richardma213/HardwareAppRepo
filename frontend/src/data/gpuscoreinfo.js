import { estimateGpuPerf } from "./estimatePerf";
import { GPU_ALPHAS, TILT_STRENGTH, clampTilt } from "./tiltConfig";

// Parser to extract number ghz
function parseMHz(clockString) {
  if (!clockString) return 0;
  const numeric = parseFloat(clockString);
  if (isNaN(numeric)) return 0;
  return numeric;
}

// Calculate GPU score: a real-benchmark-derived backbone, tilted by the
// user's weight sliders. See scripts/SCORING.md for the full model writeup.
//
//   backbone    = gpu's real benchmark / baseline's estimated benchmark
//   tiltFactor  = how much the sliders nudge that, clamped to +/-20-25%
//   total       = backbone * tiltFactor
//
// clockScore / vramScore / efficiencyScore stay the plain linear ratio*weight
// values (unchanged from before) - they're purely for the % breakdown shown
// in the UI, not part of how `total` is computed.
export function calculateGpuScore(gpu, weights, baselineGPU) {
  const baseClock = parseMHz(gpu.baseClock);
  const boostClock = parseMHz(gpu.boostClock);
  const vram = Number(gpu.vram);
  const tdp = Number(gpu.tdp);
  const avgClock = (baseClock + boostClock) / 2;

  // ---- backbone: real performance vs. the baseline's estimated performance ----
  const perf = gpu.benchmark ?? estimateGpuPerf(gpu); // real for every current catalog part; fallback for future ones
  const perfBaseline = estimateGpuPerf(baselineGPU);  // baseline is synthetic, always estimated
  const backbone = perfBaseline > 0 ? perf / perfBaseline : 0;

  // ---- per-metric ratios vs. baseline (same ratios the UI breakdown uses) ----
  const clockRatio = avgClock / baselineGPU.boostClock;
  const vramRatio = vram / baselineGPU.vram;
  const efficiencyRatio = baselineGPU.tdp / tdp; // inverted: lower TDP scores higher

  const clockScore = clockRatio * weights.clock;
  const vramScore = vramRatio * weights.vram;
  const efficiencyScore = efficiencyRatio * weights.efficiency;

  // ---- tilt: weighted diminishing-returns ratios, nudging the backbone ----
  const tiltRaw =
    Math.pow(clockRatio, GPU_ALPHAS.clock) * weights.clock +
    Math.pow(vramRatio, GPU_ALPHAS.vram) * weights.vram +
    Math.pow(efficiencyRatio, GPU_ALPHAS.efficiency) * weights.efficiency;

  // weights sum to 1, so tiltRaw ~= 1.0 for a card that matches baseline on
  // every metric - tiltFactor only deviates from 1.0 when a card's spec
  // profile over/under-indexes on what the user weighted.
  const tiltFactor = clampTilt(1 + TILT_STRENGTH * (tiltRaw - 1));

  const total = backbone * tiltFactor;

  return {
    total,
    clockScore,
    vramScore,
    efficiencyScore,
  };
}


export function normalizeGpuMetrics(gpuList) {
  const maxClock = Math.max(...gpuList.map(g => parseMHz(g.boostClock) || 0), 1);
  const maxVRAM = Math.max(...gpuList.map(g => Number(g.vram) || 0), 1);
  const minTDP = Math.min(...gpuList.map(g => Number(g.tdp) || 1), 1);

  return gpuList.map(gpu => ({
    ...gpu,
    clockPercent: Math.round((parseMHz(gpu.boostClock) / maxClock) * 100),
    vramPercent: Math.round((gpu.vram / maxVRAM) * 100),
    efficiencyGPUPercent: Math.round((minTDP / gpu.tdp) * 100)
  }));
}
