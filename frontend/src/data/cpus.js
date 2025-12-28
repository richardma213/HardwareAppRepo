// sample dataset

export const cpuData = [
  { id: 1, name: "Intel Core i3-10100", cores: 4, threads: 8, baseClock: "3.6 GHz", boostClock: "4.3 GHz", tdp: 65 },
  { id: 2, name: "Intel Core i5-10400F", cores: 6, threads: 12, baseClock: "2.9 GHz", boostClock: "4.3 GHz", tdp: 65 },
  { id: 3, name: "Intel Core i7-10700K", cores: 8, threads: 16, baseClock: "3.8 GHz", boostClock: "5.1 GHz", tdp: 125 },
  { id: 4, name: "Intel Core i9-10900K", cores: 10, threads: 20, baseClock: "3.7 GHz", boostClock: "5.3 GHz", tdp: 125 },

  { id: 5, name: "Intel Core i5-11400F", cores: 6, threads: 12, baseClock: "2.6 GHz", boostClock: "4.4 GHz", tdp: 65 },
  { id: 6, name: "Intel Core i7-11700K", cores: 8, threads: 16, baseClock: "3.6 GHz", boostClock: "5.0 GHz", tdp: 125 },
  { id: 7, name: "Intel Core i9-11900K", cores: 8, threads: 16, baseClock: "3.5 GHz", boostClock: "5.3 GHz", tdp: 125 },

  { id: 8, name: "Intel Core i3-12100F", cores: 4, threads: 8, baseClock: "3.3 GHz", boostClock: "4.3 GHz", tdp: 58 },
  { id: 9, name: "Intel Core i5-12400F", cores: 6, threads: 12, baseClock: "2.5 GHz", boostClock: "4.4 GHz", tdp: 65 },
  { id: 10, name: "Intel Core i5-12600K", cores: 10, threads: 16, baseClock: "3.7 GHz", boostClock: "4.9 GHz", tdp: 125 },
  { id: 11, name: "Intel Core i7-12700K", cores: 12, threads: 20, baseClock: "3.6 GHz", boostClock: "5.0 GHz", tdp: 125 },
  { id: 12, name: "Intel Core i9-12900K", cores: 16, threads: 24, baseClock: "3.2 GHz", boostClock: "5.2 GHz", tdp: 125 },

  { id: 13, name: "Intel Core i5-13400F", cores: 10, threads: 16, baseClock: "2.5 GHz", boostClock: "4.6 GHz", tdp: 65 },
  { id: 14, name: "Intel Core i5-13600K", cores: 14, threads: 20, baseClock: "3.5 GHz", boostClock: "5.1 GHz", tdp: 125 },
  { id: 15, name: "Intel Core i7-13700K", cores: 16, threads: 24, baseClock: "3.4 GHz", boostClock: "5.4 GHz", tdp: 125 },
  { id: 16, name: "Intel Core i9-13900K", cores: 24, threads: 32, baseClock: "3.0 GHz", boostClock: "5.8 GHz", tdp: 125 },

  { id: 17, name: "Intel Core i5-14400F", cores: 10, threads: 16, baseClock: "2.5 GHz", boostClock: "4.7 GHz", tdp: 65 },
  { id: 18, name: "Intel Core i7-14700K", cores: 20, threads: 28, baseClock: "3.4 GHz", boostClock: "5.6 GHz", tdp: 125 },
  { id: 19, name: "Intel Core i9-14900K", cores: 24, threads: 32, baseClock: "3.2 GHz", boostClock: "6.0 GHz", tdp: 125 },

  { id: 20, name: "AMD Ryzen 3 3100", cores: 4, threads: 8, baseClock: "3.6 GHz", boostClock: "3.9 GHz", tdp: 65 },
  { id: 21, name: "AMD Ryzen 5 3600", cores: 6, threads: 12, baseClock: "3.6 GHz", boostClock: "4.2 GHz", tdp: 65 },
  { id: 22, name: "AMD Ryzen 7 3700X", cores: 8, threads: 16, baseClock: "3.6 GHz", boostClock: "4.4 GHz", tdp: 65 },
  { id: 23, name: "AMD Ryzen 9 3900X", cores: 12, threads: 24, baseClock: "3.8 GHz", boostClock: "4.6 GHz", tdp: 105 },

  { id: 24, name: "AMD Ryzen 5 5600", cores: 6, threads: 12, baseClock: "3.5 GHz", boostClock: "4.4 GHz", tdp: 65 },
  { id: 25, name: "AMD Ryzen 5 5600X", cores: 6, threads: 12, baseClock: "3.7 GHz", boostClock: "4.6 GHz", tdp: 65 },
  { id: 26, name: "AMD Ryzen 7 5800X", cores: 8, threads: 16, baseClock: "3.8 GHz", boostClock: "4.7 GHz", tdp: 105 },
  { id: 27, name: "AMD Ryzen 9 5900X", cores: 12, threads: 24, baseClock: "3.7 GHz", boostClock: "4.8 GHz", tdp: 105 },
  { id: 28, name: "AMD Ryzen 9 5950X", cores: 16, threads: 32, baseClock: "3.4 GHz", boostClock: "4.9 GHz", tdp: 105 },

  { id: 29, name: "AMD Ryzen 5 7600", cores: 6, threads: 12, baseClock: "3.8 GHz", boostClock: "5.1 GHz", tdp: 65 },
  { id: 30, name: "AMD Ryzen 5 7600X", cores: 6, threads: 12, baseClock: "4.7 GHz", boostClock: "5.3 GHz", tdp: 105 },
  { id: 31, name: "AMD Ryzen 7 7700", cores: 8, threads: 16, baseClock: "3.8 GHz", boostClock: "5.3 GHz", tdp: 65 },
  { id: 32, name: "AMD Ryzen 7 7700X", cores: 8, threads: 16, baseClock: "4.5 GHz", boostClock: "5.4 GHz", tdp: 105 },
  { id: 33, name: "AMD Ryzen 9 7900", cores: 12, threads: 24, baseClock: "3.7 GHz", boostClock: "5.4 GHz", tdp: 65 },
  { id: 34, name: "AMD Ryzen 9 7900X", cores: 12, threads: 24, baseClock: "4.7 GHz", boostClock: "5.6 GHz", tdp: 170 },
  { id: 35, name: "AMD Ryzen 9 7950X", cores: 16, threads: 32, baseClock: "4.5 GHz", boostClock: "5.7 GHz", tdp: 170 },

  { id: 36, name: "AMD Ryzen 7 5800X3D", cores: 8, threads: 16, baseClock: "3.4 GHz", boostClock: "4.5 GHz", tdp: 105 },
  { id: 37, name: "AMD Ryzen 7 7800X3D", cores: 8, threads: 16, baseClock: "4.2 GHz", boostClock: "5.0 GHz", tdp: 120 },
  { id: 38, name: "AMD Ryzen 9 7900X3D", cores: 12, threads: 24, baseClock: "4.4 GHz", boostClock: "5.6 GHz", tdp: 120 },
  { id: 39, name: "AMD Ryzen 9 7950X3D", cores: 16, threads: 32, baseClock: "4.2 GHz", boostClock: "5.7 GHz", tdp: 120 },

  { id: 40, name: "Intel Pentium Gold G6400", cores: 2, threads: 4, baseClock: "4.0 GHz", boostClock: "0 GHz", tdp: 58 }
];
