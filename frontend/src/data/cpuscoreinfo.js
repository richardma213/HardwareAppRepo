
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

// Calculate CPU score based on weights + dynamic baseline
export function calculateScore(cpu, weights, baselineCPU) {
  const cpuClock = parseGHz(cpu.boostClock);
  const cores = Number(cpu.cores);
  const threads = Number(cpu.threads);
  const tdp = Number(cpu.tdp);

  const clockScore = (cpuClock / baselineCPU.clockSpeed) * weights.clockSpeed;
  const coreScore = (cores / baselineCPU.cores) * weights.cores;
  const threadScore = (threads / baselineCPU.threads) * weights.threads;
  const efficiencyScore = (baselineCPU.tdp / tdp) * weights.efficiency;

  const total = clockScore + coreScore + threadScore + efficiencyScore;

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

