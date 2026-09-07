// CPU catalog for BenchReport
//
// Fields:
//   cores / threads / baseClock / boostClock / tdp  - manufacturer spec sheets
//   benchmark                                        - PassMark CPU Mark (multi-thread)
//   singleThread                                     - PassMark single-thread rating
//
// Benchmark source: PassMark, via the "CPU Benchmarks Compilation" dataset on
// Kaggle (user: alanjo). Snapshot is from 2022, so this catalog is limited to
// CPUs released up to early 2022. See README "Data Sources & Credits" and
// SCORING.md. CPUs without a PassMark entry are intentionally excluded.

export const cpuData = [

  // --- Intel Core 8th Gen (Coffee Lake) ---
  { id: 1,  name: "Intel Core i3-8100",   cores: 4,  threads: 4,  baseClock: "3.6 GHz", boostClock: "3.6 GHz", tdp: 65,  benchmark: 6163,  singleThread: 2240 },
  { id: 2,  name: "Intel Core i5-8400",   cores: 6,  threads: 6,  baseClock: "2.8 GHz", boostClock: "4.0 GHz", tdp: 65,  benchmark: 9222,  singleThread: 2404 },
  { id: 3,  name: "Intel Core i5-8600K",  cores: 6,  threads: 6,  baseClock: "3.6 GHz", boostClock: "4.3 GHz", tdp: 95,  benchmark: 10195, singleThread: 2609 },
  { id: 4,  name: "Intel Core i7-8700",   cores: 6,  threads: 12, baseClock: "3.2 GHz", boostClock: "4.6 GHz", tdp: 65,  benchmark: 13046, singleThread: 2662 },
  { id: 5,  name: "Intel Core i7-8700K",  cores: 6,  threads: 12, baseClock: "3.7 GHz", boostClock: "4.7 GHz", tdp: 95,  benchmark: 13850, singleThread: 2764 },

  // --- Intel Core 9th Gen (Coffee Lake Refresh) ---
  { id: 6,  name: "Intel Core i3-9100",   cores: 4,  threads: 4,  baseClock: "3.6 GHz", boostClock: "4.2 GHz", tdp: 65,  benchmark: 6625,  singleThread: 2519 },
  { id: 7,  name: "Intel Core i3-9100F",  cores: 4,  threads: 4,  baseClock: "3.6 GHz", boostClock: "4.2 GHz", tdp: 65,  benchmark: 6768,  singleThread: 2519 },
  { id: 8,  name: "Intel Core i5-9400F",  cores: 6,  threads: 6,  baseClock: "2.9 GHz", boostClock: "4.1 GHz", tdp: 65,  benchmark: 9544,  singleThread: 2471 },
  { id: 9,  name: "Intel Core i5-9600K",  cores: 6,  threads: 6,  baseClock: "3.7 GHz", boostClock: "4.6 GHz", tdp: 95,  benchmark: 10793, singleThread: 2773 },
  { id: 10, name: "Intel Core i7-9700K",  cores: 8,  threads: 8,  baseClock: "3.6 GHz", boostClock: "4.9 GHz", tdp: 95,  benchmark: 14550, singleThread: 2899 },
  { id: 11, name: "Intel Core i9-9900K",  cores: 8,  threads: 16, baseClock: "3.6 GHz", boostClock: "5.0 GHz", tdp: 95,  benchmark: 18716, singleThread: 2960 },
  { id: 12, name: "Intel Core i9-9900KS", cores: 8,  threads: 16, baseClock: "4.0 GHz", boostClock: "5.0 GHz", tdp: 127, benchmark: 19518, singleThread: 3039 },

  // --- Intel Core 10th Gen (Comet Lake) ---
  { id: 13, name: "Intel Core i3-10100",  cores: 4,  threads: 8,  baseClock: "3.6 GHz", boostClock: "4.3 GHz", tdp: 65,  benchmark: 8800,  singleThread: 2637 },
  { id: 14, name: "Intel Core i3-10100F", cores: 4,  threads: 8,  baseClock: "3.6 GHz", boostClock: "4.3 GHz", tdp: 65,  benchmark: 8854,  singleThread: 2604 },
  { id: 15, name: "Intel Core i5-10400",  cores: 6,  threads: 12, baseClock: "2.9 GHz", boostClock: "4.3 GHz", tdp: 65,  benchmark: 12320, singleThread: 2587 },
  { id: 16, name: "Intel Core i5-10400F", cores: 6,  threads: 12, baseClock: "2.9 GHz", boostClock: "4.3 GHz", tdp: 65,  benchmark: 12439, singleThread: 2572 },
  { id: 17, name: "Intel Core i5-10600K", cores: 6,  threads: 12, baseClock: "4.1 GHz", boostClock: "4.8 GHz", tdp: 125, benchmark: 14534, singleThread: 2936 },
  { id: 18, name: "Intel Core i7-10700",  cores: 8,  threads: 16, baseClock: "2.9 GHz", boostClock: "4.8 GHz", tdp: 65,  benchmark: 16946, singleThread: 2922 },
  { id: 19, name: "Intel Core i7-10700K", cores: 8,  threads: 16, baseClock: "3.8 GHz", boostClock: "5.1 GHz", tdp: 125, benchmark: 19277, singleThread: 3074 },
  { id: 20, name: "Intel Core i9-10900K", cores: 10, threads: 20, baseClock: "3.7 GHz", boostClock: "5.3 GHz", tdp: 125, benchmark: 23768, singleThread: 3167 },

  // --- Intel Core 11th Gen (Rocket Lake) ---
  { id: 21, name: "Intel Core i5-11400",  cores: 6,  threads: 12, baseClock: "2.6 GHz", boostClock: "4.4 GHz", tdp: 65,  benchmark: 17132, singleThread: 3048 },
  { id: 22, name: "Intel Core i5-11400F", cores: 6,  threads: 12, baseClock: "2.6 GHz", boostClock: "4.4 GHz", tdp: 65,  benchmark: 17213, singleThread: 3023 },
  { id: 23, name: "Intel Core i5-11600K", cores: 6,  threads: 12, baseClock: "3.9 GHz", boostClock: "4.9 GHz", tdp: 125, benchmark: 19781, singleThread: 3374 },
  { id: 24, name: "Intel Core i7-11700K", cores: 8,  threads: 16, baseClock: "3.6 GHz", boostClock: "5.0 GHz", tdp: 125, benchmark: 24749, singleThread: 3429 },
  { id: 25, name: "Intel Core i9-11900K", cores: 8,  threads: 16, baseClock: "3.5 GHz", boostClock: "5.3 GHz", tdp: 125, benchmark: 25539, singleThread: 3519 },

  // --- Intel Core 12th Gen (Alder Lake) ---
  { id: 26, name: "Intel Core i3-12100",  cores: 4,  threads: 8,  baseClock: "3.3 GHz", boostClock: "4.3 GHz", tdp: 60,  benchmark: 14503, singleThread: 3549 },
  { id: 27, name: "Intel Core i3-12100F", cores: 4,  threads: 8,  baseClock: "3.3 GHz", boostClock: "4.3 GHz", tdp: 58,  benchmark: 14490, singleThread: 3532 },
  { id: 28, name: "Intel Core i5-12400",  cores: 6,  threads: 12, baseClock: "2.5 GHz", boostClock: "4.4 GHz", tdp: 65,  benchmark: 19571, singleThread: 3532 },
  { id: 29, name: "Intel Core i5-12400F", cores: 6,  threads: 12, baseClock: "2.5 GHz", boostClock: "4.4 GHz", tdp: 65,  benchmark: 19659, singleThread: 3567 },
  { id: 30, name: "Intel Core i5-12600K", cores: 10, threads: 16, baseClock: "3.7 GHz", boostClock: "4.9 GHz", tdp: 125, benchmark: 27429, singleThread: 3965 },
  { id: 31, name: "Intel Core i7-12700K", cores: 12, threads: 20, baseClock: "3.6 GHz", boostClock: "5.0 GHz", tdp: 125, benchmark: 34125, singleThread: 4047 },
  { id: 32, name: "Intel Core i9-12900K", cores: 16, threads: 24, baseClock: "3.2 GHz", boostClock: "5.2 GHz", tdp: 125, benchmark: 41077, singleThread: 4209 },
  { id: 33, name: "Intel Core i9-12900KS",cores: 16, threads: 24, baseClock: "3.4 GHz", boostClock: "5.5 GHz", tdp: 150, benchmark: 44243, singleThread: 4317 },

  // --- AMD Ryzen 1000 Series (Zen) ---
  { id: 34, name: "AMD Ryzen 5 1600",     cores: 6,  threads: 12, baseClock: "3.2 GHz", boostClock: "3.6 GHz", tdp: 65,  benchmark: 12314, singleThread: 2074 },
  { id: 35, name: "AMD Ryzen 7 1700",     cores: 8,  threads: 16, baseClock: "3.0 GHz", boostClock: "3.7 GHz", tdp: 65,  benchmark: 14628, singleThread: 1985 },
  { id: 36, name: "AMD Ryzen 7 1800X",    cores: 8,  threads: 16, baseClock: "3.6 GHz", boostClock: "4.0 GHz", tdp: 95,  benchmark: 16306, singleThread: 2186 },

  // --- AMD Ryzen 2000 Series (Zen+) ---
  { id: 37, name: "AMD Ryzen 5 2600",     cores: 6,  threads: 12, baseClock: "3.4 GHz", boostClock: "3.9 GHz", tdp: 65,  benchmark: 13195, singleThread: 2250 },
  { id: 38, name: "AMD Ryzen 5 2600X",    cores: 6,  threads: 12, baseClock: "3.6 GHz", boostClock: "4.2 GHz", tdp: 95,  benchmark: 14053, singleThread: 2406 },
  { id: 39, name: "AMD Ryzen 7 2700X",    cores: 8,  threads: 16, baseClock: "3.7 GHz", boostClock: "4.3 GHz", tdp: 105, benchmark: 17578, singleThread: 2436 },

  // --- AMD Ryzen 3000 Series (Zen 2) ---
  { id: 40, name: "AMD Ryzen 3 3100",     cores: 4,  threads: 8,  baseClock: "3.6 GHz", boostClock: "3.9 GHz", tdp: 65,  benchmark: 11660, singleThread: 2427 },
  { id: 41, name: "AMD Ryzen 3 3300X",    cores: 4,  threads: 8,  baseClock: "3.8 GHz", boostClock: "4.3 GHz", tdp: 65,  benchmark: 12746, singleThread: 2689 },
  { id: 42, name: "AMD Ryzen 5 3600",     cores: 6,  threads: 12, baseClock: "3.6 GHz", boostClock: "4.2 GHz", tdp: 65,  benchmark: 17822, singleThread: 2576 },
  { id: 43, name: "AMD Ryzen 5 3600X",    cores: 6,  threads: 12, baseClock: "3.8 GHz", boostClock: "4.4 GHz", tdp: 95,  benchmark: 18285, singleThread: 2670 },
  { id: 44, name: "AMD Ryzen 7 3700X",    cores: 8,  threads: 16, baseClock: "3.6 GHz", boostClock: "4.4 GHz", tdp: 65,  benchmark: 22716, singleThread: 2680 },
  { id: 45, name: "AMD Ryzen 7 3800X",    cores: 8,  threads: 16, baseClock: "3.9 GHz", boostClock: "4.5 GHz", tdp: 105, benchmark: 23275, singleThread: 2735 },
  { id: 46, name: "AMD Ryzen 9 3900X",    cores: 12, threads: 24, baseClock: "3.8 GHz", boostClock: "4.6 GHz", tdp: 105, benchmark: 32751, singleThread: 2725 },
  { id: 47, name: "AMD Ryzen 9 3950X",    cores: 16, threads: 32, baseClock: "3.5 GHz", boostClock: "4.7 GHz", tdp: 105, benchmark: 39157, singleThread: 2738 },

  // --- AMD Ryzen 5000 Series (Zen 3) ---
  { id: 48, name: "AMD Ryzen 5 5500",     cores: 6,  threads: 12, baseClock: "3.6 GHz", boostClock: "4.2 GHz", tdp: 65,  benchmark: 19949, singleThread: 3096 },
  { id: 49, name: "AMD Ryzen 5 5600",     cores: 6,  threads: 12, baseClock: "3.5 GHz", boostClock: "4.4 GHz", tdp: 65,  benchmark: 21350, singleThread: 3208 },
  { id: 50, name: "AMD Ryzen 5 5600G",    cores: 6,  threads: 12, baseClock: "3.9 GHz", boostClock: "4.4 GHz", tdp: 65,  benchmark: 19830, singleThread: 3187 },
  { id: 51, name: "AMD Ryzen 5 5600X",    cores: 6,  threads: 12, baseClock: "3.7 GHz", boostClock: "4.6 GHz", tdp: 65,  benchmark: 22088, singleThread: 3377 },
  { id: 52, name: "AMD Ryzen 7 5700X",    cores: 8,  threads: 16, baseClock: "3.4 GHz", boostClock: "4.6 GHz", tdp: 65,  benchmark: 27065, singleThread: 3397 },
  { id: 53, name: "AMD Ryzen 7 5800X",    cores: 8,  threads: 16, baseClock: "3.8 GHz", boostClock: "4.7 GHz", tdp: 105, benchmark: 28368, singleThread: 3485 },
  { id: 54, name: "AMD Ryzen 7 5800X3D",  cores: 8,  threads: 16, baseClock: "3.4 GHz", boostClock: "4.5 GHz", tdp: 105, benchmark: 25508, singleThread: 2850 },
  { id: 55, name: "AMD Ryzen 9 5900X",    cores: 12, threads: 24, baseClock: "3.7 GHz", boostClock: "4.8 GHz", tdp: 105, benchmark: 39457, singleThread: 3494 },
  { id: 56, name: "AMD Ryzen 9 5950X",    cores: 16, threads: 32, baseClock: "3.4 GHz", boostClock: "4.9 GHz", tdp: 105, benchmark: 46195, singleThread: 3498 },

];
