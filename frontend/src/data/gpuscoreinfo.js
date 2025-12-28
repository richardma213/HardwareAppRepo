const baselineGPU = {
  baseClock: 1500,   // MHz
  boostClock: 1800,  // MHz
  vram: 8,           // GB
  tdp: 200           // W
};

// Parser to extract number ghz 
function parseMHz(clockString) {
  if (!clockString) return 0;
  const numeric = parseFloat(clockString);
  if (isNaN(numeric)) return 0;
  return numeric;
}

// Calculate gpu score based on weights
export function calculateGpuScore(gpu, weights) {
  const baseClock = parseMHz(gpu.baseClock);
  const boostClock = parseMHz(gpu.boostClock);
  const vram = Number(gpu.vram);
  const tdp = Number(gpu.tdp);

  const avgClock = (baseClock + boostClock) / 2;

  const clockScore = (avgClock / baselineGPU.boostClock) * weights.clock;
  const vramScore = (vram / baselineGPU.vram) * weights.vram;
  const efficiencyScore = (baselineGPU.tdp / tdp) * weights.efficiency;

  const total = clockScore + vramScore + efficiencyScore;

  return Math.round(total * 100);
}
