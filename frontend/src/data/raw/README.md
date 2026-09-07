# Raw benchmark data

Source CSVs used to populate the `benchmark` / `singleThread` fields in
`../gpus.js` and `../cpus.js`. Kept for provenance — **not imported at runtime.**

| File | Source | Columns used |
|---|---|---|
| `GPU_benchmarks_v7.csv` | PassMark, via Kaggle dataset `alanjo/gpu-benchmarks` ("GPU Benchmarks Compilation") | `gpuName`, `G3Dmark` |
| `CPU_benchmark_v4.csv` | PassMark, via Kaggle dataset `alanjo/cpu-benchmarks` ("CPU Benchmarks Compilation") | `cpuName`, `cpuMark`, `threadMark` |

## Notes

- Both snapshots are from **2022**. The hardware catalog is therefore capped at
  parts released up to early 2022 (no RTX 40/50 series, RX 7000 series, Ryzen
  7000+, or Intel 13th/14th gen).
- Benchmark scores are the property of PassMark Software. Used here for a
  non-commercial educational/portfolio project.
- The other two files from these Kaggle datasets (`GPU_scores_graphicsAPIs.csv`,
  `CPU_r23_v2.csv`) were not used: the first is compute-API scores (different
  methodology), the second is Cinebench with only ~200 entries.
