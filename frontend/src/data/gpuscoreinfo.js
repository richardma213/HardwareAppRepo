

// Parser to extract number ghz 
function parseMHz(clockString) {
  if (!clockString) return 0;
  const numeric = parseFloat(clockString);
  if (isNaN(numeric)) return 0;
  return numeric;
}

// Calculate GPU score based on weights + dynamic baseline
export function calculateGpuScore(gpu, weights, baselineGPU) {
  const baseClock = parseMHz(gpu.baseClock);
  const boostClock = parseMHz(gpu.boostClock);
  const vram = Number(gpu.vram);
  const tdp = Number(gpu.tdp);

  const avgClock = (baseClock + boostClock) / 2;

  const clockScore = (avgClock / baselineGPU.boostClock) * weights.clock;
  const vramScore = (vram / baselineGPU.vram) * weights.vram;
  const efficiencyScore = (baselineGPU.tdp / tdp) * weights.efficiency;

  const total = clockScore + vramScore + efficiencyScore;

  return {
    total,               
    clockScore,
    vramScore,
    efficiencyScore
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

