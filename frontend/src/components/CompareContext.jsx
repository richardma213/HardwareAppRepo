import { useEffect, createContext, useContext, useState } from "react";

const CompareContext = createContext();

export function CompareProvider({ children }) {
    
  // Define cpuLists and gpuLists and save in local storage
    const [cpuList, setCpuList] = useState(() => {
      const saved = localStorage.getItem("cpuList");
      return saved ? JSON.parse(saved) : [];
    });

    const [gpuList, setGpuList] = useState(() => {
      const saved = localStorage.getItem("gpuList");
      return saved ? JSON.parse(saved) : [];
    });

    const [weights, setWeights] = useState({
      clockSpeed: 0.4,
      cores: 0.3,
      threads: 0.2,
      efficiency: 0.1,
      clock: 0.4,
      vram: 0.4,
      efficiencyGPU: 0.2
    });

    useEffect(() => {localStorage.setItem("cpuList", JSON.stringify(cpuList));}, [cpuList]);

    useEffect(() => {localStorage.setItem("gpuList", JSON.stringify(gpuList));}, [gpuList]);


    function addCPU(cpu) {setCpuList(prev => [...prev, cpu]);}

    function removeCPU(id) {setCpuList(prev => prev.filter(c => c.id !== id));}

    function addGPU(gpu) {setGpuList(prev => [...prev, gpu]);}

    function removeGPU(id) {setGpuList(prev => prev.filter(g => g.id !== id));}

    function clearCPUs(){
      setCpuList([]);
    }

    function clearGPUs(){
      setGpuList([]);
    }

    return (
    <CompareContext.Provider value={{
      cpuList,
      gpuList,
      addCPU,
      addGPU,
      removeCPU,
      removeGPU,
      weights,
      setWeights,
      clearCPUs,
      clearGPUs
      }}>
      {children}
    </CompareContext.Provider>

    );
  }


export function useCompare() {
  return useContext(CompareContext);
}
