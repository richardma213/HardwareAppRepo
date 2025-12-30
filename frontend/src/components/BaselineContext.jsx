import { createContext, useContext } from "react";
import { useBaselineSettings } from "../data/useBaselineSettings";

const BaselineContext = createContext(null);

export function BaselineProvider({ children }) {
  const {
    baselineCPU,
    setBaselineCPU,
    baselineGPU,
    setBaselineGPU
  } = useBaselineSettings();

  return (
    <BaselineContext.Provider value={{
      baselineCPU,
      setBaselineCPU,
      baselineGPU,
      setBaselineGPU
    }}>
    {children}
    </BaselineContext.Provider>
  );
  
}

export function useBaseline() {
  return useContext(BaselineContext);
}
