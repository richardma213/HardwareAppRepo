import { useState } from "react";

export function useBaselineSettings() {
  const [baselineCPU, setBaselineCPU] = useState({
    clockSpeed: 4.0,
    cores: 8,
    threads: 16,
    tdp: 100
  });

  const [baselineGPU, setBaselineGPU] = useState({
    boostClock: 2000,
    vram: 8,
    tdp: 150
  });

  return {
    baselineCPU,
    setBaselineCPU,
    baselineGPU,
    setBaselineGPU
  };
}
