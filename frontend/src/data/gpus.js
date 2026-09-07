// GPU catalog for BenchReport
//
// Fields:
//   vram / tdp / baseClock / boostClock  - manufacturer spec sheets (public data)
//   benchmark                            - PassMark G3D Mark score
//
// Benchmark source: PassMark, via the "GPU Benchmarks Compilation" dataset on
// Kaggle (user: alanjo). Snapshot is from 2022, so this catalog is limited to
// GPUs released up to early 2022. See README "Data Sources & Credits" and
// SCORING.md. Cards without a PassMark entry are intentionally excluded.

export const gpuData = [

  // --- NVIDIA GeForce GTX 10 Series (Pascal) ---
  { id: 1,  name: "NVIDIA GeForce GTX 1050",        vram: 2,  tdp: 75,  baseClock: "1354 MHz", boostClock: "1455 MHz", benchmark: 5090 },
  { id: 2,  name: "NVIDIA GeForce GTX 1050 Ti",     vram: 4,  tdp: 75,  baseClock: "1290 MHz", boostClock: "1392 MHz", benchmark: 6314 },
  { id: 3,  name: "NVIDIA GeForce GTX 1060 3GB",    vram: 3,  tdp: 120, baseClock: "1506 MHz", boostClock: "1708 MHz", benchmark: 9728 },
  { id: 4,  name: "NVIDIA GeForce GTX 1060 6GB",    vram: 6,  tdp: 120, baseClock: "1506 MHz", boostClock: "1708 MHz", benchmark: 10070 },
  { id: 5,  name: "NVIDIA GeForce GTX 1070",        vram: 8,  tdp: 150, baseClock: "1506 MHz", boostClock: "1683 MHz", benchmark: 13482 },
  { id: 6,  name: "NVIDIA GeForce GTX 1070 Ti",     vram: 8,  tdp: 180, baseClock: "1607 MHz", boostClock: "1683 MHz", benchmark: 14500 },
  { id: 7,  name: "NVIDIA GeForce GTX 1080",        vram: 8,  tdp: 180, baseClock: "1607 MHz", boostClock: "1733 MHz", benchmark: 15265 },
  { id: 8,  name: "NVIDIA GeForce GTX 1080 Ti",     vram: 11, tdp: 250, baseClock: "1480 MHz", boostClock: "1582 MHz", benchmark: 18284 },

  // --- NVIDIA GeForce GTX 16 Series (Turing) ---
  { id: 9,  name: "NVIDIA GeForce GTX 1650",        vram: 4,  tdp: 75,  baseClock: "1485 MHz", boostClock: "1665 MHz", benchmark: 7807 },
  { id: 10, name: "NVIDIA GeForce GTX 1650 Super",  vram: 4,  tdp: 100, baseClock: "1530 MHz", boostClock: "1725 MHz", benchmark: 10032 },
  { id: 11, name: "NVIDIA GeForce GTX 1660",        vram: 6,  tdp: 120, baseClock: "1530 MHz", boostClock: "1785 MHz", benchmark: 11695 },
  { id: 12, name: "NVIDIA GeForce GTX 1660 Super",  vram: 6,  tdp: 125, baseClock: "1530 MHz", boostClock: "1785 MHz", benchmark: 12732 },
  { id: 13, name: "NVIDIA GeForce GTX 1660 Ti",     vram: 6,  tdp: 120, baseClock: "1500 MHz", boostClock: "1770 MHz", benchmark: 11794 },

  // --- NVIDIA GeForce RTX 20 Series (Turing) ---
  { id: 14, name: "NVIDIA GeForce RTX 2060",        vram: 6,  tdp: 160, baseClock: "1365 MHz", boostClock: "1680 MHz", benchmark: 13953 },
  { id: 15, name: "NVIDIA GeForce RTX 2060 Super",  vram: 8,  tdp: 175, baseClock: "1470 MHz", boostClock: "1650 MHz", benchmark: 16514 },
  { id: 16, name: "NVIDIA GeForce RTX 2070",        vram: 8,  tdp: 175, baseClock: "1410 MHz", boostClock: "1620 MHz", benchmark: 16079 },
  { id: 17, name: "NVIDIA GeForce RTX 2070 Super",  vram: 8,  tdp: 215, baseClock: "1605 MHz", boostClock: "1770 MHz", benchmark: 18168 },
  { id: 18, name: "NVIDIA GeForce RTX 2080",        vram: 8,  tdp: 215, baseClock: "1515 MHz", boostClock: "1710 MHz", benchmark: 18732 },
  { id: 19, name: "NVIDIA GeForce RTX 2080 Super",  vram: 8,  tdp: 250, baseClock: "1650 MHz", boostClock: "1815 MHz", benchmark: 19519 },
  { id: 20, name: "NVIDIA GeForce RTX 2080 Ti",     vram: 11, tdp: 250, baseClock: "1350 MHz", boostClock: "1545 MHz", benchmark: 21796 },

  // --- NVIDIA GeForce RTX 30 Series (Ampere) ---
  { id: 21, name: "NVIDIA GeForce RTX 3050",        vram: 8,  tdp: 130, baseClock: "1552 MHz", boostClock: "1777 MHz", benchmark: 12718 },
  { id: 22, name: "NVIDIA GeForce RTX 3060",        vram: 12, tdp: 170, baseClock: "1320 MHz", boostClock: "1777 MHz", benchmark: 16958 },
  { id: 23, name: "NVIDIA GeForce RTX 3060 Ti",     vram: 8,  tdp: 200, baseClock: "1410 MHz", boostClock: "1665 MHz", benchmark: 20206 },
  { id: 24, name: "NVIDIA GeForce RTX 3070",        vram: 8,  tdp: 220, baseClock: "1500 MHz", boostClock: "1725 MHz", benchmark: 22093 },
  { id: 25, name: "NVIDIA GeForce RTX 3070 Ti",     vram: 8,  tdp: 290, baseClock: "1575 MHz", boostClock: "1770 MHz", benchmark: 23367 },
  { id: 26, name: "NVIDIA GeForce RTX 3080",        vram: 10, tdp: 320, baseClock: "1440 MHz", boostClock: "1710 MHz", benchmark: 24853 },
  { id: 27, name: "NVIDIA GeForce RTX 3080 Ti",     vram: 12, tdp: 350, baseClock: "1365 MHz", boostClock: "1665 MHz", benchmark: 26887 },
  { id: 28, name: "NVIDIA GeForce RTX 3090",        vram: 24, tdp: 350, baseClock: "1395 MHz", boostClock: "1695 MHz", benchmark: 26395 },
  { id: 29, name: "NVIDIA GeForce RTX 3090 Ti",     vram: 24, tdp: 450, baseClock: "1560 MHz", boostClock: "1860 MHz", benchmark: 29094 },

  // --- AMD Radeon RX 400/500 Series (Polaris) ---
  { id: 30, name: "AMD Radeon RX 480",             vram: 8,  tdp: 150, baseClock: "1120 MHz", boostClock: "1266 MHz", benchmark: 8674 },
  { id: 31, name: "AMD Radeon RX 580",             vram: 8,  tdp: 185, baseClock: "1257 MHz", boostClock: "1340 MHz", benchmark: 8907 },
  { id: 32, name: "AMD Radeon RX 590",             vram: 8,  tdp: 175, baseClock: "1469 MHz", boostClock: "1545 MHz", benchmark: 9665 },

  // --- AMD Radeon RX 5000 Series (RDNA) ---
  { id: 33, name: "AMD Radeon RX 5500 XT",         vram: 8,  tdp: 130, baseClock: "1717 MHz", boostClock: "1845 MHz", benchmark: 9188 },
  { id: 34, name: "AMD Radeon RX 5600 XT",         vram: 6,  tdp: 150, baseClock: "1235 MHz", boostClock: "1620 MHz", benchmark: 13836 },
  { id: 35, name: "AMD Radeon RX 5700",            vram: 8,  tdp: 180, baseClock: "1465 MHz", boostClock: "1725 MHz", benchmark: 14729 },
  { id: 36, name: "AMD Radeon RX 5700 XT",         vram: 8,  tdp: 225, baseClock: "1605 MHz", boostClock: "1905 MHz", benchmark: 16892 },

  // --- AMD Radeon RX 6000 Series (RDNA 2) ---
  { id: 37, name: "AMD Radeon RX 6400",            vram: 4,  tdp: 53,  baseClock: "1923 MHz", boostClock: "2321 MHz", benchmark: 6958 },
  { id: 38, name: "AMD Radeon RX 6500 XT",         vram: 4,  tdp: 107, baseClock: "2310 MHz", boostClock: "2825 MHz", benchmark: 9445 },
  { id: 39, name: "AMD Radeon RX 6600",            vram: 8,  tdp: 132, baseClock: "1626 MHz", boostClock: "2491 MHz", benchmark: 13881 },
  { id: 40, name: "AMD Radeon RX 6600 XT",         vram: 8,  tdp: 160, baseClock: "1968 MHz", boostClock: "2589 MHz", benchmark: 15853 },
  { id: 41, name: "AMD Radeon RX 6700 XT",         vram: 12, tdp: 230, baseClock: "2321 MHz", boostClock: "2581 MHz", benchmark: 18993 },
  { id: 42, name: "AMD Radeon RX 6800",            vram: 16, tdp: 250, baseClock: "1700 MHz", boostClock: "2105 MHz", benchmark: 20667 },
  { id: 43, name: "AMD Radeon RX 6800 XT",         vram: 16, tdp: 300, baseClock: "1825 MHz", boostClock: "2250 MHz", benchmark: 23364 },
  { id: 44, name: "AMD Radeon RX 6900 XT",         vram: 16, tdp: 300, baseClock: "1825 MHz", boostClock: "2250 MHz", benchmark: 25458 },

  // --- AMD Radeon Vega / VII ---
  { id: 45, name: "AMD Radeon RX Vega 56",         vram: 8,  tdp: 210, baseClock: "1156 MHz", boostClock: "1471 MHz", benchmark: 13636 },
  { id: 46, name: "AMD Radeon RX Vega 64",         vram: 8,  tdp: 295, baseClock: "1247 MHz", boostClock: "1546 MHz", benchmark: 14636 },
  { id: 47, name: "AMD Radeon VII",                vram: 16, tdp: 300, baseClock: "1400 MHz", boostClock: "1750 MHz", benchmark: 16767 },

  // --- Integrated GPUs ---
  { id: 48, name: "Intel UHD Graphics 630",        vram: 1,  tdp: 15,  baseClock: "350 MHz",  boostClock: "1200 MHz", benchmark: 1293 },
  { id: 49, name: "Intel UHD Graphics 730",        vram: 1,  tdp: 15,  baseClock: "300 MHz",  boostClock: "1300 MHz", benchmark: 1553 },
  { id: 50, name: "Intel UHD Graphics 770",        vram: 1,  tdp: 15,  baseClock: "300 MHz",  boostClock: "1550 MHz", benchmark: 2611 },
  { id: 51, name: "Intel Iris Xe Graphics",        vram: 1,  tdp: 15,  baseClock: "400 MHz",  boostClock: "1300 MHz", benchmark: 2782 },
  { id: 52, name: "AMD Radeon Vega 8",             vram: 1,  tdp: 15,  baseClock: "300 MHz",  boostClock: "1100 MHz", benchmark: 1593 },
  { id: 53, name: "AMD Radeon RX Vega 11",         vram: 1,  tdp: 15,  baseClock: "300 MHz",  boostClock: "1300 MHz", benchmark: 2137 },

];
