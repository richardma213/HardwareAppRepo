export const gpuData = [

    // --- NVIDIA 20 Series (Turing) ---
    { id: 1, name: "NVIDIA GeForce GTX 2050", vram: 4, tdp: 75, baseClock: "1350 MHz", boostClock: "1550 MHz" },
    { id: 2, name: "NVIDIA GeForce GTX 2050 Ti", vram: 4, tdp: 85, baseClock: "1450 MHz", boostClock: "1650 MHz" },

    // --- NVIDIA 30 Series (Ampere) ---
    { id: 3, name: "NVIDIA GeForce RTX 3050", vram: 8, tdp: 130, baseClock: "1550 MHz", boostClock: "1777 MHz" },
    { id: 4, name: "NVIDIA GeForce RTX 3060", vram: 12, tdp: 170, baseClock: "1320 MHz", boostClock: "1777 MHz" },
    { id: 5, name: "NVIDIA GeForce RTX 3070", vram: 8, tdp: 220, baseClock: "1500 MHz", boostClock: "1725 MHz" },
    { id: 6, name: "NVIDIA GeForce RTX 3080", vram: 10, tdp: 320, baseClock: "1440 MHz", boostClock: "1710 MHz" },
    { id: 7, name: "NVIDIA GeForce RTX 3090", vram: 24, tdp: 350, baseClock: "1395 MHz", boostClock: "1695 MHz" },

    // --- NVIDIA 40 Series (Ada Lovelace) ---
    { id: 8, name: "NVIDIA GeForce RTX 4050", vram: 6, tdp: 115, baseClock: "1600 MHz", boostClock: "2350 MHz" },
    { id: 9, name: "NVIDIA GeForce RTX 4060", vram: 8, tdp: 115, baseClock: "1830 MHz", boostClock: "2460 MHz" },
    { id: 10, name: "NVIDIA GeForce RTX 4070", vram: 12, tdp: 200, baseClock: "1920 MHz", boostClock: "2475 MHz" },
    { id: 11, name: "NVIDIA GeForce RTX 4080", vram: 16, tdp: 320, baseClock: "2205 MHz", boostClock: "2505 MHz" },
    { id: 12, name: "NVIDIA GeForce RTX 4090", vram: 24, tdp: 450, baseClock: "2230 MHz", boostClock: "2520 MHz" },

    // --- NVIDIA 50 Series (Blackwell) ---
    { id: 13, name: "NVIDIA GeForce RTX 5050", vram: 8, tdp: 120, baseClock: "2000 MHz", boostClock: "2600 MHz" },
    { id: 14, name: "NVIDIA GeForce RTX 5060", vram: 12, tdp: 160, baseClock: "2100 MHz", boostClock: "2700 MHz" },
    { id: 15, name: "NVIDIA GeForce RTX 5070", vram: 16, tdp: 220, baseClock: "2200 MHz", boostClock: "2800 MHz" },
    { id: 16, name: "NVIDIA GeForce RTX 5080", vram: 20, tdp: 320, baseClock: "2300 MHz", boostClock: "2900 MHz" },
    { id: 17, name: "NVIDIA GeForce RTX 5090", vram: 24, tdp: 450, baseClock: "2400 MHz", boostClock: "3000 MHz" },

    // --- AMD RX 6000 Series ---
    { id: 18, name: "AMD Radeon RX 6600", vram: 8, tdp: 132, baseClock: "1626 MHz", boostClock: "2491 MHz" },
    { id: 19, name: "AMD Radeon RX 6700 XT", vram: 12, tdp: 230, baseClock: "2321 MHz", boostClock: "2581 MHz" },
    { id: 20, name: "AMD Radeon RX 6800 XT", vram: 16, tdp: 300, baseClock: "1825 MHz", boostClock: "2250 MHz" },

    // --- AMD RX 7000 Series ---
    { id: 21, name: "AMD Radeon RX 7600", vram: 8, tdp: 165, baseClock: "1720 MHz", boostClock: "2655 MHz" },
    { id: 22, name: "AMD Radeon RX 7700 XT", vram: 12, tdp: 245, baseClock: "1700 MHz", boostClock: "2544 MHz" },
    { id: 23, name: "AMD Radeon RX 7900 XTX", vram: 24, tdp: 355, baseClock: "1855 MHz", boostClock: "2499 MHz" },

    // --- Integrated GPUs (Intel & AMD) ---
    { id: 24, name: "Intel UHD Graphics 730", vram: 1, tdp: 15, baseClock: "350 MHz", boostClock: "1450 MHz" },
    { id: 25, name: "Intel UHD Graphics 770", vram: 1, tdp: 28, baseClock: "300 MHz", boostClock: "1550 MHz" },
    { id: 26, name: "Intel Iris Xe (80 EU)", vram: 1, tdp: 15, baseClock: "400 MHz", boostClock: "1350 MHz" },
    { id: 27, name: "Intel Iris Xe (96 EU)", vram: 1, tdp: 28, baseClock: "400 MHz", boostClock: "1450 MHz" },

    { id: 28, name: "AMD Radeon Vega 6", vram: 1, tdp: 15, baseClock: "300 MHz", boostClock: "1500 MHz" },
    { id: 29, name: "AMD Radeon Vega 7", vram: 1, tdp: 15, baseClock: "300 MHz", boostClock: "1600 MHz" },
    { id: 30, name: "AMD Radeon Vega 8", vram: 2, tdp: 15, baseClock: "300 MHz", boostClock: "1750 MHz" },
    { id: 31, name: "AMD Radeon 780M (RDNA3)", vram: 2, tdp: 30, baseClock: "400 MHz", boostClock: "2800 MHz" },
    
    // --- NVIDIA 16 Series (Turing, non‑RTX) ---
    { id: 32, name: "NVIDIA GeForce GTX 1650", vram: 4, tdp: 75, baseClock: "1485 MHz", boostClock: "1665 MHz" },
    { id: 33, name: "NVIDIA GeForce GTX 1650 Super", vram: 4, tdp: 100, baseClock: "1530 MHz", boostClock: "1725 MHz" },
    { id: 34, name: "NVIDIA GeForce GTX 1660", vram: 6, tdp: 120, baseClock: "1530 MHz", boostClock: "1785 MHz" },
    { id: 35, name: "NVIDIA GeForce GTX 1660 Super", vram: 6, tdp: 125, baseClock: "1530 MHz", boostClock: "1785 MHz" },
    { id: 36, name: "NVIDIA GeForce GTX 1660 Ti", vram: 6, tdp: 120, baseClock: "1500 MHz", boostClock: "1770 MHz" },

    // --- NVIDIA 10 Series (Pascal) ---
    { id: 37, name: "NVIDIA GeForce GTX 1050", vram: 2, tdp: 75, baseClock: "1354 MHz", boostClock: "1455 MHz" },
    { id: 38, name: "NVIDIA GeForce GTX 1050 Ti", vram: 4, tdp: 75, baseClock: "1290 MHz", boostClock: "1392 MHz" },
    { id: 39, name: "NVIDIA GeForce GTX 1060 3GB", vram: 3, tdp: 120, baseClock: "1506 MHz", boostClock: "1708 MHz" },
    { id: 40, name: "NVIDIA GeForce GTX 1060 6GB", vram: 6, tdp: 120, baseClock: "1506 MHz", boostClock: "1708 MHz" },
    { id: 41, name: "NVIDIA GeForce GTX 1070", vram: 8, tdp: 150, baseClock: "1506 MHz", boostClock: "1683 MHz" },
    { id: 42, name: "NVIDIA GeForce GTX 1080", vram: 8, tdp: 180, baseClock: "1607 MHz", boostClock: "1733 MHz" },
    { id: 43, name: "NVIDIA GeForce GTX 1080 Ti", vram: 11, tdp: 250, baseClock: "1480 MHz", boostClock: "1582 MHz" },


];
