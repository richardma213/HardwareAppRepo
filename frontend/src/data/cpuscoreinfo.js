// Path: src/data/cpuscoreinfo.js

// Base line score metrics
export const baselineCPU = {
  clockSpeed: 4.0,
  cores: 8,
  threads: 16,
  tdp: 100
};

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

// Calculate a cpu's score based on weights
export function calculateScore(cpu, weights) {
  const cpuClock = parseGHz(cpu.boostClock);
  const cores = Number(cpu.cores);
  const threads = Number(cpu.threads);
  const tdp = Number(cpu.tdp);

  const clockScore = (cpuClock / baselineCPU.clockSpeed) * weights.clockSpeed;
  const coreScore = (cores / baselineCPU.cores) * weights.cores;
  const threadScore = (threads / baselineCPU.threads) * weights.threads;
  const efficiencyScore = (baselineCPU.tdp / tdp) * weights.efficiency;

  const total = clockScore + coreScore + threadScore + efficiencyScore;

  return Math.round(total * 100);
}
