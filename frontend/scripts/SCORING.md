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

## End-to-end walkthrough

How one score actually gets produced, start to finish.

1. **The catalog.** Every GPU/CPU has real specs (`vram`, `tdp`, clocks,
   `cores`/`threads`) and a real PassMark `benchmark` (`../src/data/gpus.js`
   / `cpus.js`, 53/56 parts, curated from Kaggle CSVs).
2. **The baseline.** A synthetic spec object (not a real product) set via
   presets, manual entry, or a default — `BaselineWindow` /
   `useBaselineSettings`. Has no real benchmark of its own.
3. **Weight sliders are normalized to sum to 1** (e.g. `{0.8, 0.8, 0.4}` →
   `{0.4, 0.4, 0.2}`), so the score ends up a weighted *average*, not a
   weighted sum — maxing every slider can't inflate it.
4. **The estimator gives the baseline a comparable number.**
   `estimatePerf(baselineSpecs)` predicts what the baseline's benchmark
   *would* be, via the regression formula in the next section. This is the
   only place in a normal run where the estimator gets called — the baseline
   isn't real, so it has nothing else to use.
5. **Backbone: real performance vs. baseline performance.**
   `backbone = component.benchmark / estimatePerf(baseline)`.
   `backbone ≈ 1.0` means "performs like your baseline." This is the part of
   the score anchored in measured reality.
6. **Tilt: sliders bend the backbone, within limits.** Per-metric ratios vs.
   baseline (`clockRatio`, `vramRatio`/`coreRatio`/`threadRatio`, inverted
   `efficiencyRatio`), each raised to a diminishing-returns exponent, summed
   weighted by the normalized sliders into `tiltRaw` (≈1.0 if the component
   matches the baseline everywhere), then damped and clamped into
   `tiltFactor` — see the formula and clamp rationale below.
7. **Combine:** `total = backbone × tiltFactor`.
8. **Normalize for display:**
   `score = round(total / max(total across the displayed set) × 100)` —
   unchanged from the original design, independent of everything above it.
   Rescales whatever's currently shown (whole catalog on the selector pages,
   only-selected on Compare) so the best option in view reads as 100%.
9. **Sort / filter / render** — same UI code throughout, untouched by any of
   this rework.

**In one line:** real benchmark ÷ estimated-baseline-benchmark = backbone
(the "how fast, really" answer) → nudged ±20-25% by weighted,
diminishing-returns spec ratios (the "but I care about X" answer) → rescaled
to 0–100% against whatever's on screen.

### Worked example

RTX 3080 (`benchmark = 24,853`) vs. a baseline `{2000 MHz, 8GB, 150W}`
(`estimatePerf ≈ 13,868`), neutral-ish weights:

```
backbone   = 24,853 / 13,868 ≈ 1.79
tiltRaw    ≈ 1.02   (RTX 3080 slightly over-indexes on what's weighted)
tiltFactor = clamp(1 + 0.35·0.02, 0.8, 1.25) ≈ 1.007
total      ≈ 1.79 × 1.007 ≈ 1.80
score      = round(1.80 / maxTotalInSet × 100)   ← e.g. 78% if the RTX 3090 Ti is the max in view
```

## The live scoring model (backbone + tilt)

Implemented in `../src/data/gpuscoreinfo.js` / `cpuscoreinfo.js`, using
`estimatePerf.js` (below) and `../src/data/tiltConfig.js`.

```
perf(component)   = component.benchmark ?? estimatePerf(component)   // real for every current catalog part
perfBaseline       = estimatePerf(baselineSpecs)                     // baseline is synthetic, always estimated
backbone            = perf(component) / perfBaseline

tiltRaw             = Σ  weight_i · ratio_i(component)^alpha_i        // weights already sum to 1 (existing UI)
tiltFactor          = clamp(1 + TILT_STRENGTH · (tiltRaw − 1), 0.8, 1.25)

total               = backbone × tiltFactor
```

- **`backbone`** is where the real benchmark data lives — it's a ratio of two
  performance numbers, one real (the component), one estimated (the
  baseline, since it's not an actual product).
- **`tiltFactor`** is where the existing weight sliders live — unchanged
  ratio-vs-baseline math per metric (`clockRatio`, `vramRatio`/`coreRatio`/
  `threadRatio`, inverted `efficiencyRatio`), diminishing-returns exponents
  (`GPU_ALPHAS` / `CPU_ALPHAS` in `tiltConfig.js`), weighted by the
  normalized sliders. Because those weights sum to 1, `tiltRaw ≈ 1.0` for a
  component that matches the baseline on every metric — so a neutral slider
  setup barely moves the backbone at all.
- **The clamp (`TILT_CLAMP = [0.8, 1.25]`) is the safety rail**: sliders can
  shift a score at most −20% / +25%, however extreme the spec gap or the
  slider setting. A real 2× benchmark lead can never be erased by slider
  tuning — this is what keeps "customizable" from breaking "realistic."
- **`TILT_STRENGTH = 0.35`** dampens `tiltRaw`'s deviation from 1.0 before
  the clamp is applied - a second, gentler knob alongside the hard clamp.
- The `clockScore` / `vramScore` (GPU) and `clockScore` / `coreScore` /
  `threadScore` (CPU) fields returned alongside `total` are the plain linear
  ratio×weight values, unchanged from the original design — they only feed
  the % breakdown shown in the Compare page UI and are not part of how
  `total` is computed.
- Verified against the real catalog: at neutral weights, the resulting
  ranking closely tracks real benchmark order (large tier separations
  preserved); under an extreme single-metric weight (VRAM maxed to 0.8), the
  clamp keeps the ranking from being scrambled - no low-benchmark part
  leapfrogs a much faster one.

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

## Honest assessment

Not "this is accurate" — **"this is honest about how accurate it is, and the
design reflects where the uncertainty actually lives."** That's a meaningfully
different (and more defensible) claim, worth stating directly:

- The core design is sound: real data does the heavy lifting (backbone), user
  preference does a bounded adjustment (tilt), and the clamp is what keeps
  those two from fighting each other instead of composing.
- The backbone is only as trustworthy as the baseline estimate feeding it,
  and that estimate carries a measured ~14% average error - so even the
  "grounded in reality" half of the score carries real uncertainty whenever
  the baseline is a hypothetical rather than an actual product.
- Three specs can't fully describe a chip. The regression can't see 3D
  V-Cache, IPC differences, or anything outside `{clock, vram/cores/threads,
  tdp}` - that's the ceiling of predicting performance from spec sheets
  alone, not a bug to patch. Real improvement here means more real benchmark
  coverage, not a cleverer formula.
- The tilt's exponents, `TILT_STRENGTH`, and clamp bounds are reasoned
  defaults, not optimized values - nothing in the tilt layer was fit against
  data (unlike the backbone's regression). A more rigorous version would
  tune those against actual user expectations, which would require usage
  data this project doesn't have.
- PassMark is one benchmark methodology. "Grounded in real data" means
  grounded in *this* data - real-world gaming FPS, productivity workloads,
  and a synthetic aggregate score don't always agree.

## Re-fitting

Run after adding/editing catalog entries with real benchmarks:

```bash
cd frontend
node scripts/fitBenchmarkModel.mjs
```

This overwrites `src/data/scoreConfig.js` with newly fit constants, R², and
sample size. Commit the regenerated file.
