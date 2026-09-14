// One-time / re-run-when-catalog-changes dev script.
//
// Fits a log-log power-law regression predicting real PassMark benchmark
// scores from spec sheet values:
//
//   GPU:  benchmark = C * boostClock^a * vram^b * tdp^c
//   CPU:  benchmark = C * boostClock^a * cores^b * threads^c * tdp^d
//
// Solved via ordinary least squares on log(benchmark) vs log(specs) - i.e.
// find the (k, a, b, c[, d]) that minimize total squared error across every
// real component in the catalog at once. See SCORING.md for the full writeup.
//
// This is NOT run as part of the app build. Run it manually whenever gpus.js
// / cpus.js change meaningfully, and commit the regenerated scoreConfig.js:
//
//   node scripts/fitBenchmarkModel.mjs
//
// It only produces the fallback/baseline estimator - every real catalog part
// keeps using its own real `benchmark` field untouched.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { gpuData } from "../src/data/gpus.js";
import { cpuData } from "../src/data/cpus.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = path.join(__dirname, "../src/data/scoreConfig.js");

function parseMHz(s) { return parseFloat(s); }
function parseGHz(s) { return parseFloat(s); }

/**
 * Ordinary least squares: find the beta = [k, a, b, c, ...] that minimizes
 * total squared error between (X * beta) and y, across every row at once.
 *
 * X: one row per data point (GPU or CPU), columns are [1, log(spec1), log(spec2), ...].
 *    The leading 1 lets its fitted coefficient double as the constant `k`.
 * y: one entry per data point - log(real benchmark) for that part.
 *
 * Solved via the "normal equations": (XtX) * beta = Xty. This turns an
 * arbitrarily-large system (53 GPUs, 4 unknowns) into one small n x n system
 * (4 unknowns, 4 equations) that's solved exactly - no iteration/guessing.
 */
function leastSquares(X, y) {
  const n = X[0].length; // number of unknowns (k + one exponent per spec)

  // XtX[i][j] = sum over every row of (X[row][i] * X[row][j])  -- this IS
  // "X transposed, times X" computed directly, without building a transpose.
  const XtX = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => X.reduce((s, row) => s + row[i] * row[j], 0))
  );
  // Xty[i] = sum over every row of (X[row][i] * y[row])  -- "X transposed, times y".
  const Xty = Array.from({ length: n }, (_, i) => X.reduce((s, row, r) => s + row[i] * y[r], 0));

  // Solve (XtX) * beta = Xty via Gaussian elimination on the augmented
  // matrix A = [XtX | Xty] - the same by-hand technique for solving a
  // system of equations, just generalized to n unknowns.
  const A = XtX.map((row, i) => [...row, Xty[i]]);

  // Forward elimination: zero out everything below the diagonal, one
  // column at a time, until A is upper-triangular.
  for (let i = 0; i < n; i++) {
    // Partial pivoting: swap in whichever remaining row has the largest
    // value in this column first. Pure numerical-stability bookkeeping -
    // doesn't change the answer, just avoids dividing by something tiny.
    let piv = i;
    for (let k = i + 1; k < n; k++) if (Math.abs(A[k][i]) > Math.abs(A[piv][i])) piv = k;
    [A[i], A[piv]] = [A[piv], A[i]]; // swap rows (array destructuring, no temp var needed)

    // Subtract a multiple of row i from every row below it so that column i
    // becomes 0 in all of them.
    for (let k = i + 1; k < n; k++) {
      const f = A[k][i] / A[i][i];
      for (let j = i; j <= n; j++) A[k][j] -= f * A[i][j];
    }
  }

  // Back-substitution: A is now upper-triangular, so the last row has only
  // one unknown -> solve it directly. Each row above it then has one new
  // unknown once the ones below are already known, so walk upward solving
  // one variable at a time.
  const beta = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = A[i][n]; // the right-hand-side value for this row
    for (let j = i + 1; j < n; j++) s -= A[i][j] * beta[j]; // subtract known unknowns' contributions
    beta[i] = s / A[i][i];
  }
  return beta; // [k, a, b, c, ...]
}

/**
 * R^2 ("coefficient of determination"): what fraction of the real spread in
 * the data does the fitted model explain? 1.0 = perfect fit, 0 = no better
 * than just predicting the average every time.
 */
function rSquared(yTrue, yPred) {
  const mean = yTrue.reduce((a, b) => a + b, 0) / yTrue.length;
  const ssTot = yTrue.reduce((s, v) => s + (v - mean) ** 2, 0);       // total variance in the real data
  const ssRes = yTrue.reduce((s, v, i) => s + (v - yPred[i]) ** 2, 0); // variance left over after fitting
  return 1 - ssRes / ssTot; // fraction explained = 1 - (unexplained / total)
}

// ---------------------------------------------------------------- GPU model
const gRows = gpuData.map(g => ({ clock: parseMHz(g.boostClock), vram: g.vram, tdp: g.tdp, bench: g.benchmark }));
const gX = gRows.map(r => [1, Math.log(r.clock), Math.log(r.vram), Math.log(r.tdp)]);
const gY = gRows.map(r => Math.log(r.bench));
const [gk, ga, gb, gc] = leastSquares(gX, gY);
const gPred = gX.map(row => row[0] * gk + row[1] * ga + row[2] * gb + row[3] * gc);
const gpuModel = {
  k: gk, a: ga, b: gb, c: gc,
  r2: rSquared(gY, gPred),
  n: gRows.length,
};

// ---------------------------------------------------------------- CPU model
const cRows = cpuData.map(c => ({ clock: parseGHz(c.boostClock), cores: c.cores, threads: c.threads, tdp: c.tdp, bench: c.benchmark }));
const cX = cRows.map(r => [1, Math.log(r.clock), Math.log(r.cores), Math.log(r.threads), Math.log(r.tdp)]);
const cY = cRows.map(r => Math.log(r.bench));
const [ck, ca, cb, cc, cd] = leastSquares(cX, cY);
const cPred = cX.map(row => row[0] * ck + row[1] * ca + row[2] * cb + row[3] * cc + row[4] * cd);
const cpuModel = {
  k: ck, a: ca, b: cb, c: cc, d: cd,
  r2: rSquared(cY, cPred),
  n: cRows.length,
};

// ---------------------------------------------------------------- write output
const round = n => Math.round(n * 1e6) / 1e6;
const fitDate = new Date().toISOString().slice(0, 10);

const fileContents = `// AUTO-GENERATED by scripts/fitBenchmarkModel.mjs on ${fitDate}. Do not hand-edit -
// re-run the script after changing gpus.js / cpus.js to regenerate these constants.
//
// Fitted power-law models predicting real PassMark benchmark scores from
// spec-sheet values (log-log least squares regression). Used ONLY as a
// fallback estimator - for the baseline (which has no real benchmark of its
// own) and for any future catalog part added without one. Every real
// catalog part uses its own real benchmark field directly. See SCORING.md.
//
//   GPU:  benchmark = e^k * boostClock^a * vram^b * tdp^c        (R^2 = ${round(gpuModel.r2)}, n = ${gpuModel.n})
//   CPU:  benchmark = e^k * boostClock^a * cores^b * threads^c * tdp^d   (R^2 = ${round(cpuModel.r2)}, n = ${cpuModel.n})

export const GPU_MODEL = {
  k: ${round(gpuModel.k)},
  a: ${round(gpuModel.a)},
  b: ${round(gpuModel.b)},
  c: ${round(gpuModel.c)},
  r2: ${round(gpuModel.r2)},
  n: ${gpuModel.n},
  fitDate: "${fitDate}",
};

export const CPU_MODEL = {
  k: ${round(cpuModel.k)},
  a: ${round(cpuModel.a)},
  b: ${round(cpuModel.b)},
  c: ${round(cpuModel.c)},
  d: ${round(cpuModel.d)},
  r2: ${round(cpuModel.r2)},
  n: ${cpuModel.n},
  fitDate: "${fitDate}",
};
`;

fs.writeFileSync(OUT_FILE, fileContents);

console.log("=== GPU model ===");
console.log(gpuModel);
console.log("\n=== CPU model ===");
console.log(cpuModel);
console.log(`\nWrote ${OUT_FILE}`);
