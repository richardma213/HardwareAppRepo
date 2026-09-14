# Scoring Model

How BenchReport turns a component's specs (and a real benchmark, when one
exists) into the score you see in the UI, and where that model is known to
be wrong.

## Overview

Two independent inputs feed every score:

1. **A real benchmark, when available** — PassMark G3D Mark (GPU) or CPU Mark
   (CPU), sourced from public Kaggle datasets (see repo root `README.md` for
   credits). Every part currently in the catalog has one of these.
2. **User weight sliders + a baseline** — the existing UI (clock/VRAM/efficiency
   for GPU; clock/cores/threads/efficiency for CPU), letting a user tilt the
   ranking toward what they personally care about.

The design goal: scores should be **grounded in measured performance**, not a
spec-sheet guess, while still being **fully customizable** to a user's
priorities. Most tools do one or the other — a fixed "objective" tier list, or
a spec calculator with sliders that can rank a worse card first if you push
the right sliders far enough. This tries to do both by having customization
operate *around* a real anchor instead of replacing it.

## The fallback estimator (this directory)

`fitBenchmarkModel.mjs` + `../src/data/scoreConfig.js` + `../src/data/estimatePerf.js`.

**This estimator is never used for a real catalog part.** Every GPU/CPU in
`gpus.js` / `cpus.js` has a real benchmark and uses it directly. The estimator
exists for the one case where no real benchmark can exist: **the baseline** —
a synthetic, user-editable spec object (or a preset like "Gaming" /
"Workstation"), not an actual product. It also serves as a fallback for any
future catalog part added without a matched benchmark.

### The model

A log-log power-law regression, fit once against the real catalog:

```
GPU:  benchmark = e^k * boostClock^a * vram^b * tdp^c          (R² = 0.949, n = 53)
CPU:  benchmark = e^k * boostClock^a * cores^b * threads^c * tdp^d   (R² = 0.876, n = 56)
```

Taking the log of both sides turns the product into a sum, which is what lets
ordinary least squares solve for the exponents — least squares can only fit
sums of terms, not products. The fitted `(k, a, b, c[, d])` are the single
combination that minimizes total squared error across every real component in
the catalog *simultaneously* (not fit one variable at a time — they're
solved jointly because each depends on what the others are).

### Reading the fitted exponents (current values, see `scoreConfig.js` for exact numbers + fit date)

- **GPU: TDP (`c ≈ 0.70`) is the strongest predictor**, ahead of clock
  (`a ≈ 0.54`). TDP acts as a proxy for die size / core count / architecture
  generation — things not directly in the spec fields.
- **GPU: VRAM (`b ≈ 0.08`) is a weak predictor of raw 3D throughput.** VRAM
  capacity mostly determines whether a game runs at a given resolution at
  all, not how fast the GPU is when it does. This is *why* VRAM lives in the
  user-weight tilt layer, not the performance backbone — it's a real user
  priority, just not a strong performance signal.
- **CPU: clock (`a ≈ 1.19`) dominates**, threads (`c ≈ 0.63`) matter more than
  raw core count (`b ≈ 0.31`) — expected, since CPU Mark is a multi-threaded
  aggregate.
- **CPU: TDP is negative (`d ≈ -0.17`).** At fixed clock/cores/threads, a
  lower-TDP part scores slightly *higher* — this is the regression picking up
  generational efficiency gains (newer architectures do more per watt) that
  aren't captured by any other field.

## Known limitations (read before trusting an estimated number)

- **Fit quality only, not ground truth.** `R² = 0.95` (GPU) / `0.88` (CPU)
  means the model explains most of the variance in the training data — not
  that it perfectly describes *why* hardware performs the way it does. It's
  the best available fit for this functional form on this data, not a claim
  about the true underlying relationship.
- **Blind to anything not in the spec fields.** The AMD Ryzen 7 5800X3D is
  underestimated by ~18% because 3D V-Cache isn't a tracked spec — the model
  has no way to know it exists. Any part whose performance comes from an
  architectural feature outside `{clock, vram/cores/threads, tdp}` will be
  mis-estimated in the same way.
- **Integrated GPUs are the worst-fit category** (~40% error observed on
  Intel UHD 630). The model is trained mostly on discrete GPUs with their own
  power budget; an iGPU shares TDP with the CPU package, so the clock/vram/tdp
  relationship doesn't transfer cleanly.
- **Average error ~14% (both categories)** across the full catalog when
  estimating a part that actually has a real benchmark (used only to measure
  the estimator, never in production — real parts always use their real
  number). That 14% is the error band to assume for any *actually* estimated
  value (the baseline, or a future benchmark-less part).
- **Least squares is a choice, not the only valid one.** It minimizes squared
  error specifically; a different loss (absolute error, etc.) would produce
  different constants. Standard, but worth naming as a modeling decision.
- **Static snapshot.** The regression is fit against a 2022 PassMark
  snapshot (see repo root `README.md`) and only re-run manually
  (`node scripts/fitBenchmarkModel.mjs`) when the catalog changes — there is
  no live retraining.

## Re-fitting

Run after adding/editing catalog entries with real benchmarks:

```bash
cd frontend
node scripts/fitBenchmarkModel.mjs
```

This overwrites `src/data/scoreConfig.js` with newly fit constants, R², and
sample size. Commit the regenerated file.
