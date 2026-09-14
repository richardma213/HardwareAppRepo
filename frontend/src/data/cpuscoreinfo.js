import { estimateCpuPerf } from "./estimatePerf";
import { CPU_ALPHAS, TILT_STRENGTH, clampTilt } from "./tiltConfig";

// Parser to extract number ghz
export function parseGHz(clockString) {
  if (!clockString) return 0;

  const cleaned = clockString
    .toString()
    .toLowerCase()
    .replace("ghz", "")
    .replace(" ", "")
    .trim();

  const num = parseFloat(cleaned);

  return num;
}

// Calculate CPU score: a real-benchmark-derived backbone, tilted by the
// user's weight sliders. See scripts/SCORING.md for the full model writeup.
//
//   backbone    = cpu's real benchmark / baseline's estimated benchmark
//   tiltFactor  = how much the sliders nudge that, clamped to +/-20-25%
//   total       = backbone * tiltFactor
//
// clockScore / coreScore / threadScore / efficiencyScore stay the plain
// linear ratio*weight values (unchanged from before) - purely for the %
// breakdown shown in the UI, not part of how `total` is computed.
export function calculateScore(cpu, weights, baselineCPU) {
  const cpuClock = parseGHz(cpu.boostClock);
  const cores = Number(cpu.cores);
  const threads = Number(cpu.threads);
  const tdp = Number(cpu.tdp);

  // ---- backbone: real performance vs. the baseline's estimated performance ----
  const perf = cpu.benchmark ?? estimateCpuPerf(cpu); // real for every current catalog part; fallback for future ones
  // baseline uses `clockSpeed` (not `boostClock`, unlike the catalog's field name) - remap before estimating.
  const perfBaseline = estimateCpuPerf({
    boostClock: baselineCPU.clockSpeed,
    cores: baselineCPU.cores,
    threads: baselineCPU.threads,
    tdp: baselineCPU.tdp,
  }); // baseline is synthetic, always estimated
  const backbone = perfBaseline > 0 ? perf / perfBaseline : 0;

  // ---- per-metric ratios vs. baseline (same ratios the UI breakdown uses) ----
  const clockRatio = cpuClock / baselineCPU.clockSpeed;
  const coreRatio = cores / baselineCPU.cores;
  const threadRatio = threads / baselineCPU.threads;
  const efficiencyRatio = baselineCPU.tdp / tdp; // inverted: lower TDP scores higher

  const clockScore = clockRatio * weights.clockSpeed;
  const coreScore = coreRatio * weights.cores;
  const threadScore = threadRatio * weights.threads;
  const efficiencyScore = efficiencyRatio * weights.efficiency;

  // ---- tilt: weighted diminishing-returns ratios, nudging the backbone ----
  const tiltRaw =
    Math.pow(clockRatio, CPU_ALPHAS.clockSpeed) * weights.clockSpeed +
    Math.pow(coreRatio, CPU_ALPHAS.cores) * weights.cores +
    Math.pow(threadRatio, CPU_ALPHAS.threads) * weights.threads +
    Math.pow(efficiencyRatio, CPU_ALPHAS.efficiency) * weights.efficiency;

  // weights sum to 1, so tiltRaw ~= 1.0 for a cpu that matches baseline on
  // every metric - tiltFactor only deviates from 1.0 when a cpu's spec
  // profile over/under-indexes on what the user weighted.
  const tiltFactor = clampTilt(1 + TILT_STRENGTH * (tiltRaw - 1));

  const total = backbone * tiltFactor;

  return {
    total,
    clockScore,
    coreScore,
    threadScore,
    efficiencyScore
  };
}


export function normalizeCpuMetrics(cpuList) {
  const maxClock = Math.max(...cpuList.map(c => parseGHz(c.boostClock) || 0), 1);
  const maxCores = Math.max(...cpuList.map(c => Number(c.cores) || 0), 1);
  const maxThreads = Math.max(...cpuList.map(c => Number(c.threads) || 0), 1);
  const minTDP = Math.min(...cpuList.map(c => Number(c.tdp) || 1), 1);

  return cpuList.map(cpu => ({
    ...cpu,
    clockPercent: Math.round((parseGHz(cpu.boostClock) / maxClock) * 100),
    coresPercent: Math.round((cpu.cores / maxCores) * 100),
    threadsPercent: Math.round((cpu.threads / maxThreads) * 100),
    efficiencyPercent: Math.round((minTDP / cpu.tdp) * 100)
  }));
}
