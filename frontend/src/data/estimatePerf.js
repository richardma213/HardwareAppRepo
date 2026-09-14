import { GPU_MODEL, CPU_MODEL } from "./scoreConfig";

// Fallback performance estimator.
//
// Every real GPU/CPU in the catalog has its own real PassMark `benchmark`
// value and should use that directly - never call these functions for a
// real catalog part. These exist for the two cases where no real benchmark
// exists:
//   1. The baseline (a synthetic spec object, not a real component)
//   2. Any future catalog part added without a matched benchmark score
//
// The constants come from scripts/fitBenchmarkModel.mjs - a log-log least
// squares regression fit against the real catalog. See SCORING.md.

function parseMHz(clockString) {
  if (!clockString) return 0;
  const n = parseFloat(clockString);
  return isNaN(n) ? 0 : n;
}

function parseGHz(clockString) {
  if (!clockString) return 0;
  const n = parseFloat(clockString);
  return isNaN(n) ? 0 : n;
}

/**
 * Estimate a GPU's PassMark-scale G3D Mark from its specs.
 * @param {{ boostClock: string, vram: number, tdp: number }} specs
 * @returns {number}
 */
export function estimateGpuPerf({ boostClock, vram, tdp }) {
  const clock = parseMHz(boostClock);
  const { k, a, b, c } = GPU_MODEL;

  if (!clock || !vram || !tdp) return 0;

  return Math.exp(k) * Math.pow(clock, a) * Math.pow(vram, b) * Math.pow(tdp, c);
}

/**
 * Estimate a CPU's PassMark-scale CPU Mark from its specs.
 * @param {{ boostClock: string, cores: number, threads: number, tdp: number }} specs
 * @returns {number}
 */
export function estimateCpuPerf({ boostClock, cores, threads, tdp }) {
  const clock = parseGHz(boostClock);
  const { k, a, b, c, d } = CPU_MODEL;

  if (!clock || !cores || !threads || !tdp) return 0;

  return Math.exp(k) * Math.pow(clock, a) * Math.pow(cores, b) * Math.pow(threads, c) * Math.pow(tdp, d);
}
