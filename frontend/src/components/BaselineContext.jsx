import { createContext, useContext } from "react";
import { useBaselineSettings } from "../data/useBaselineSettings";

/** 
 * Baseline Context holds the global component settings (baseline CPU + GPU)
 * so any other functions can access and update
*/
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

/**
 * 
 * useBaseline
 *
 * Convenience hook for accessing baseline CPU/GPU settings.
 * Must be used inside a <BaselineProvider>.
 * @returns {{
 *   baselineCPU: string | null,
 *   setBaselineCPU: Function,
 *   baselineGPU: string | null,
 *   setBaselineGPU: Function
 * }}
 */
export function useBaseline() {
  return useContext(BaselineContext);
}
