# BenchReport — Interview Prep

A talk-track for explaining BenchReport in an interview: elevator pitches,
how each part actually works, the questions you're likely to get, and the
weaknesses worth owning before someone else points them out.

Deeper write-ups: `SCORING.md` (scoring math), `PRISMA.md` (Postgres +
leaderboard SQL), `DOCKER.md` (containers).

---

## 1. The pitch

### 30 seconds

> BenchReport is a full-stack web app for comparing CPUs and GPUs. Most
> hardware tools either give you a fixed tier list or a spec calculator you
> can game with sliders. I wanted both: scores anchored to real PassMark
> benchmark data, but still customizable to what a user cares about. I
> curated a 110-part catalog from public benchmark datasets, built a
> regression model from scratch, and designed a scoring system that compares
> every part to a reference machine you choose: a score of 1.3× means 30%
> better than your baseline by your priorities. Real benchmark performance
> starts at half the weight, and you can rebalance toward efficiency, VRAM or
> single-thread speed. It's React on the front, Node and Express on the back,
> with MongoDB for user data and Postgres for a cross-user leaderboard.

### 1 minute (add these after the 30-second version)

> On the data side, I took Kaggle's PassMark CSVs, cleaned them down to 54
> GPUs and 56 CPUs with full specs, and fit a log-log least-squares
> regression — written from scratch with Gaussian elimination, no libraries —
> that predicts a benchmark from specs with an R² of 0.95 for GPUs and 0.88
> for CPUs. Each part is scored as a weighted geometric mean of its ratios
> to a baseline — a real part the user owns, using real benchmarks on both
> sides, or custom specs, where the regression estimates the benchmarks.
>
> On the backend, auth is JWT and bcrypt with rate limiting. Reports are
> stored in MongoDB, and every save also writes into a relational Postgres
> schema through Prisma, which powers a leaderboard using SQL joins —
> including a self-join to find the most common CPU-and-GPU pairings across
> users. It's deployed on Vercel and Render, and I debugged a couple of real
> production issues along the way, like a Node-version mismatch that crashed
> the server on Render.

---

## 2. Architecture

| Layer | Tech | Hosted on |
|---|---|---|
| Frontend | React 19 (Create React App), React Router 7, Chart.js | Vercel |
| Backend | Node + Express 5 (ES modules), run via `tsx` | Render |
| Auth | `bcrypt` + `jsonwebtoken` | — |
| Rate limiting | `@upstash/ratelimit`, falls back to `express-rate-limit` | Upstash Redis |
| Primary DB | MongoDB via Mongoose — users, reports, shared reports | MongoDB Atlas |
| Analytics DB | PostgreSQL via Prisma 7 (`pg` driver adapter) — leaderboard | Neon |
| Scoring | Runs client-side; constants fit offline by a Node script | — |

**Request flow:** the browser calls the Express API, sending the JWT as a
`Bearer` header. Express verifies the token and reads or writes MongoDB.
Saving a report also mirrors it into Postgres. The leaderboard endpoint reads
only from Postgres.

**Where scoring lives:** entirely in the browser. The catalog (`gpus.js`,
`cpus.js`) and fitted constants (`scoreConfig.js`) ship with the frontend, so
moving a slider re-ranks instantly with no API call.

---

## 3. The scoring algorithm

### The question it answers

> "How much better is this part than *my* machine, by *my* priorities?"

The user picks a **baseline**: a real catalog part (default: the
top-benchmarking CPU/GPU, or a part they own) or custom specs. Every part is compared to it on several metrics, the user's
weights decide how much each metric counts, and the result is a single
number like **1.32×**: 32% better than the baseline.

### Step 1 — One ratio per metric

| Metric | CPU | GPU |
|---|---|---|
| Performance | PassMark CPU Mark | PassMark G3D Mark |
| Single-thread | PassMark single-thread rating | — |
| Clock | — | Boost clock |
| Cores / Threads | Counts | — |
| VRAM | — | GB |
| Efficiency | Benchmark ÷ TDP (perf per watt) | Benchmark ÷ TDP |

Each ratio is `part ÷ baseline`. Efficiency is deliberately *performance per
watt*: ranking by low TDP alone just crowns the weakest chips.

### Step 2 — The regression (only for a custom-specs baseline)

A baseline picked from the catalog has real benchmarks, so no estimate is
needed. Custom specs don't, so the regression fills them in.

Performance doesn't scale linearly with specs, so the model assumes a
**product of specs, each raised to a learned power**:

```
GPU:  benchmark = e^k · clock^a · vram^b · tdp^c
CPU:  benchmark = e^k · clock^a · cores^b · threads^c · tdp^d
```

The exponents are what get learned. `a = 1` means doubling clock doubles the
score; `a = 0.5` means doubling it gives about 1.41× (diminishing returns); a
negative exponent means that spec drags the score down.

Taking the natural log of both sides turns the product into a sum:

```
ln(benchmark) = k + a·ln(clock) + b·ln(vram) + c·ln(tdp)
```

That's a plain linear regression in log space. `fitBenchmarkModel.mjs`
solves it with ordinary least squares — building the normal equations
`XᵀX·β = Xᵀy` and solving them with Gaussian elimination (partial pivoting),
written from scratch — separately for the 54 GPUs and 56 CPUs. It writes the
results to `scoreConfig.js`:

| | k | clock | vram / cores | threads | tdp | R² |
|---|---|---|---|---|---|---|
| GPU | 1.757 | 0.545 | 0.079 | — | 0.692 | 0.949 |
| CPU | 6.546 | 1.185 | 0.307 | 0.635 | −0.167 | 0.876 |
| CPU single-thread | 5.803 | 1.449 | — | — | — | 0.590 |

The single-thread model uses clock alone; adding TDP or core count barely
helped (R² 0.59 → 0.63), because single-thread speed mostly comes from
architecture, which no spec field captures.

What the exponents say: for GPUs, TDP is the strongest predictor (a proxy for
die size and architecture), and VRAM barely predicts raw speed. For CPUs,
clock dominates and threads matter more than cores. CPU TDP is negative:
at equal clock/cores/threads, newer, more efficient chips score higher.

### Step 3 — Combine with a weighted geometric mean

```
score = ratio_1^w_1 × ratio_2^w_2 × … × ratio_n^w_n      (weights sum to 1)
      = part's weighted profile ÷ baseline's weighted profile
```

Defaults: **performance 50%**, the rest split evenly (CPU 12.5% each, GPU
~16.7% each). Why geometric, not a weighted average:

- **Ratios combine multiplicatively.** "Twice as fast, half as efficient"
  lands at 1×; a weighted average says 1.25×.
- **One big ratio can't swamp the rest.** VRAM ratios reach 3×, clock ratios
  stay near 1×.
- **100% on one metric ranks purely by that metric.**

SPEC and other benchmark suites use geometric means of ratios against a
reference machine for the same reasons.

### Step 4 — Display "× baseline", not "% of best"

The score is shown as-is (`1.32×`) and compares the part to your baseline.
The bar, scaled to the best part, compares it to the other parts.

An earlier version showed `score ÷ best score`, and the baseline cancelled
out of that division entirely, so the regression-estimated baseline had no
visible effect. Showing the ratio keeps the reference point. Rankings never
depend on the baseline — it's a measuring stick, not a preference.

### Worked example (output of the real code)

RTX 3080 (G3D Mark 24,853, 1710 MHz, 10 GB, 320 W) vs a custom baseline
`{2000 MHz, 8 GB, 150 W}`, estimated G3D Mark **13,863**:

```
performance = 24,853 ÷ 13,863                  = 1.79×
clock       = 1710 ÷ 2000                      = 0.85×
vram        = 10 ÷ 8                           = 1.25×
efficiency  = (24,853 ÷ 320) ÷ (13,863 ÷ 150)  = 0.84×

score = 1.79^0.5 × 0.85^0.167 × 1.25^0.167 × 0.84^0.167 ≈ 1.32×
```

Sliders really change the order: at defaults the RTX 3090 Ti leads (1.62×);
at 100% efficiency integrated GPUs and the RX 6400 lead; at 100% VRAM the
24 GB cards lead (3.00×).

### How to describe it in one sentence

> "Each part is compared to a reference machine on every metric, those
> ratios are combined with a weighted geometric mean using the user's
> priorities, and the result reads as 'times better than your baseline'."

---

## 4. The Postgres / Prisma leaderboard

**Schema:** three tables forming a many-to-many relationship.

- `Component` — one row per distinct part name (unique).
- `Report` — one row per saved report, linked back to Mongo by
  `mongoReportId`. It stores no report content; Mongo owns that.
- `ReportComponent` — the join table, one row per (report, component) pair.

**Write path:** `POST /save-report` saves to Mongo and responds first. Then,
best-effort, it creates a `Report` row, upserts each picked `Component` (so
names never duplicate), and inserts a `ReportComponent` row for each pick. A
Postgres failure is logged and swallowed; it can never fail the user's save.

**Read path — two raw SQL queries via `prisma.$queryRaw`:**

```sql
-- Most popular parts, ranked by distinct users (not raw picks)
SELECT c.id, c.name, c.category, COUNT(DISTINCT r."userId") AS "uniqueUsers"
FROM "ReportComponent" rc
JOIN "Component" c ON c.id = rc."componentId"
JOIN "Report" r ON r.id = rc."reportId"
GROUP BY c.id
ORDER BY "uniqueUsers" DESC
LIMIT 10;
```

`COUNT(DISTINCT userId)` means one person re-saving the same build 50 times
can't outrank a part chosen once each by 10 different people.

```sql
-- Most common CPU + GPU pairings (self-join)
SELECT cpu.name AS "cpuName", gpu.name AS "gpuName", COUNT(*) AS pairs
FROM "ReportComponent" rc1
JOIN "Component" cpu ON cpu.id = rc1."componentId" AND cpu.category = 'CPU'
JOIN "ReportComponent" rc2 ON rc2."reportId" = rc1."reportId"
JOIN "Component" gpu ON gpu.id = rc2."componentId" AND gpu.category = 'GPU'
GROUP BY cpu.name, gpu.name
ORDER BY pairs DESC
LIMIT 10;
```

The join table is joined to itself on `reportId`: for each report, its CPU
edge is paired with its GPU edge from the same report, and the pairs are
counted.

**Why raw SQL instead of Prisma's query builder:** Prisma's `groupBy` can't
express `COUNT(DISTINCT …)` across a join or a self-join. `$queryRaw` is a
tagged template, so values are parameterized, not string-concatenated — no
SQL injection risk.

**Gotcha worth mentioning:** Postgres `COUNT()` returns a `bigint`, which
arrives in JavaScript as a `BigInt`, and `JSON.stringify` throws on those.
The results are converted with `Number()` before responding.

---

## 5. Auth

- **Signup:** email trimmed and lowercased; password must be 8+ characters;
  hashed with `bcrypt` (cost 10). Duplicate emails are caught by the unique
  index (Mongo error 11000) rather than a check-then-insert, which avoids a
  race between two simultaneous signups.
- **Login:** `bcrypt.compare`, then a JWT signed with `JWT_SECRET`,
  containing only the user id and email, expiring in 7 days. The same
  "Invalid email or password" message is returned whether the email exists
  or not, so attackers can't discover which emails are registered.
- **Rate limiting:** 20 attempts per 15 minutes per IP on login and signup,
  and 15 requests per minute on saving, sharing, deleting shared reports,
  and the leaderboard. Each route has its own counter; saving is counted per
  account rather than per IP, so users on a shared network (a school or
  office) don't use up each other's limit. Uses a sliding window stored in
  Upstash Redis (`middleware/rateLimit.js`).
  Counts live in Redis, so they survive server restarts and would be shared
  across multiple server instances. If Redis is misconfigured, unreachable,
  or slower than 1 second, it falls back to an in-memory limiter, so an
  outage weakens protection instead of removing it or locking users out.
  `trust proxy` is set so `req.ip` is the real client, not Render's proxy.
- **Protected routes:** `authMiddleware` verifies the token's signature and
  expiry, attaches the user to `req.user`, and returns 401 otherwise.
- **CORS** is restricted to the frontend's origin.
- **Ownership (authorization, not just authentication):** shared reports
  store `ownerId` from the token; listing returns only your own, and delete
  matches `{ _id, ownerId }` in one query, so someone else's report is just
  "not found" (no hint it exists). Guests can share, but their links are
  anonymous and undeletable. `optionalAuthMiddleware` lets guests through
  without a header but rejects a *bad* token, so an expired session isn't
  silently treated as a guest.
- **No mass assignment:** routes copy named fields from the body
  (`{ weights, baseline, cpus, gpus }`, `{ username, bio }`) instead of
  spreading it, so a client can't set `userID`, `email` or anything else.
- **Public profiles are opt-in:** a profile only exists once the user picks
  a username, and that screen says what becomes public. The public route
  selects public fields only, so the email can't leak. Usernames are unique
  via a *sparse* index (accounts without one don't collide), case-folded,
  and checked against a reserved list (`admin`, `api`, …).

---

## 6. Common interview questions

### "Why use both MongoDB and Postgres?"

> "MongoDB was the original store, and it fits reports well: a report is a
> self-contained document with nested arrays of parts, specs, and weights
> whose shape can vary, and it's always read as a whole. The leaderboard is a
> different kind of question — counting relationships across all users,
> deduplicating by user, and pairing parts within the same report. That's
> what relational databases are built for: foreign keys, joins, `GROUP BY`,
> and integrity constraints like unique component names.
>
> Honestly, I could have built a simpler version with Mongo's aggregation
> pipeline using `$unwind` and `$group`. I chose Postgres deliberately to
> learn relational modeling, and the self-join is much more natural in SQL.
> If this were a production system, I'd probably consolidate onto one
> database — likely Postgres, storing the report payload in a JSONB column —
> because running two databases adds operational cost and you lose
> transactions across them."

### "Where does each piece of data live?"

| Store | What's there |
|---|---|
| **MongoDB** (source of truth) | `users` (email, bcrypt hash, optional unique username, bio) · `reports` (saved: weights, baseline, CPUs, GPUs) · `sharedreports` (owner or null, report snapshot, title, description, tags, unlisted/public) |
| **Postgres** (analytics copy) | `Component`, `Report` (Mongo id + user id only), `ReportComponent` join table — saved reports only |
| **Redis** (short-lived) | rate-limit counters, 60 s leaderboard cache |
| **Browser** | JWT, cached username, baseline (part stored by id), weights, dark mode, Compare picks |

- A **profile** isn't its own collection — it's a user with a username; join
  date comes from the ObjectId timestamp, stats are computed per request.
- The **gallery** isn't its own collection — it's `sharedreports` filtered
  to `visibility: "public"`, backed by a `{visibility, createdAt, _id}` index.
- **Author names aren't copied onto reports**; they're looked up at read
  time, so a rename updates old posts.

> "Mongo holds anything a user creates, because each one is a
> self-contained document. Postgres holds a relational copy of which parts
> are in which reports, because cross-user counting and joins are what SQL
> is good at. Redis holds short-lived data. Mongo is the source of truth;
> the Postgres copy is written separately, so a failure there only means
> the leaderboard misses one report."

*Follow-up — "why not put the gallery in Postgres?"* Shared reports are read
as whole snapshots and filtered on simple fields, which Mongo handles well.
Postgres earns its place only where there are joins and aggregates across
many users.

### "SQL vs NoSQL — what are the tradeoffs in general?"

| | SQL (Postgres) | NoSQL document (MongoDB) |
|---|---|---|
| Schema | Fixed, enforced; changes need migrations | Flexible per document |
| Relationships | First-class: foreign keys, joins | Embed data or join manually / `$lookup` |
| Integrity | Constraints, multi-row ACID transactions | Per-document atomicity by default; multi-document transactions exist but cost more |
| Best for | Data with many relationships and cross-entity queries (analytics, finance, inventory) | Self-contained, variable-shape records read as a unit (profiles, content, logs) |
| Scaling | Traditionally vertical; horizontal is harder | Designed for horizontal scaling (sharding) |
| Querying | SQL — very expressive for aggregation | Query API + aggregation pipeline |

Rule of thumb to say out loud: *if your main questions are about
relationships between things, lean SQL; if they're about retrieving whole
self-contained things, a document store fits well.*

### "How do you keep the two databases consistent?"

> "I don't guarantee it, and that was a deliberate choice. There's no
> transaction across two databases. Mongo is the source of truth and is
> written first; the Postgres write is best-effort. If Postgres fails, the
> user's report is still saved, and the leaderboard just under-counts by one.
> I prioritized never failing a user's save over perfect analytics. To make
> it stronger I'd use an outbox pattern or a background job that reconciles
> Mongo reports missing from Postgres."

### "Why a log-log model and not plain linear regression?"

> "Hardware performance scales multiplicatively with diminishing returns —
> doubling VRAM doesn't double speed. A power-law model captures that, and
> taking logs turns it into a linear problem least squares can solve. A side
> benefit is that errors are effectively measured as percentages, which
> makes sense when scores range from about 1,000 to 30,000."

### "Is an R² of 0.95 good? Could it be overfitting?"

> "It's a good fit, but I'm careful about what it means. It's in-sample — I
> didn't hold out a test set, so it describes fit quality, not proven
> predictive accuracy. With only four or five parameters on about 55 points,
> severe overfitting is unlikely, but the honest error measure is the
> average absolute error, which is about 14%. It's much worse for
> integrated GPUs — around 28% on average — because they share power with the
> CPU, and it underestimates the Ryzen 7 5800X3D by about 18% because 3D
> V-Cache isn't a spec the model can see. That's why real parts always use
> their real benchmark, and the model only fills in the hypothetical
> baseline."

### "Why write the regression from scratch?"

> "To understand it, and because the problem is small enough that the math
> is a few dozen lines: build `XᵀX` and `Xᵀy`, then solve with Gaussian
> elimination. It also taught me about degenerate cases — when I tried
> fitting integrated GPUs alone, they all had the same TDP, so that column
> had no variance, the matrix was singular, and the solver returned NaN. In
> production I'd use a tested library."

### "Did you ever have to rethink a design?"

> "Yes — the scoring model. The first version multiplied a part's real
> benchmark ratio by a 'tilt' from the sliders, damped and clamped to
> −20%/+25%, so preferences could never override a measured gap. When I
> actually tested it, the benchmark ratio varied about 23× across the GPU
> catalog while the tilt could only move a score between 0.88× and 1.25×.
> Even with efficiency at 100%, the most power-hungry card still ranked
> first. The sliders were basically decorative.
>
> Removing the clamp alone didn't fix it, because the benchmark still
> multiplied everything. So I made real performance one weighted metric
> among equals and combined them with a weighted geometric mean, with
> performance defaulting to 50% so benchmarks still lead out of the box.
>
> Testing also turned up a second problem: scores were shown as a percent of
> the best part, and the baseline cancelled out of that division entirely —
> my regression estimate had no visible effect. Showing scores as 'times your
> baseline' fixed that.
>
> Then I let users pick a real part as the baseline — 'how much better than
> what I own?' — which uses real benchmarks on both sides, so the regression
> is only a fallback for custom specs. Entering an RTX 2070's specs as custom
> gives an estimate 14% below its real score, which shows why real data
> wins wherever it exists."

### "Why a geometric mean instead of a weighted average?"

> "The metrics are ratios against a baseline, and ratios combine
> multiplicatively. If a part is twice as fast but half as efficient, with
> equal weights the geometric mean says 1× — which is right — while a
> weighted average says 1.25×. It also stops one metric with a huge spread,
> like VRAM at 3×, from swamping metrics that barely vary, and putting 100%
> on one metric ranks purely by it. It's the same reason SPEC reports
> geometric means against a reference machine.
>
> One subtlety I'd mention: a weight controls how much a metric's ratio
> counts, not how much it moves the ranking. Performance varies far more
> across the catalog than clock speed, so at equal weights it still drives
> most of the ordering. I kept it that way so the score stays interpretable
> as 'times the baseline'."

### "Why JWT instead of sessions? Where's the token stored?"

> "JWTs are stateless, so the backend doesn't need a session store, which
> is simple for a single small service. The tradeoffs: a token can't be
> revoked before it expires, so a leaked token is valid for up to 7 days,
> and I store it in `localStorage`, which means an XSS bug could steal it.
> The more secure option is an httpOnly cookie, which JavaScript can't read,
> combined with CSRF protection. With more time I'd add short-lived access
> tokens plus refresh tokens."

### "Why not use an auth provider like Auth0 or Clerk?"

> "For a real product I'd seriously consider it — they handle email
> verification, password resets, OAuth, and breach detection. Here I wanted
> to understand the fundamentals: hashing, token signing and verification,
> and attacks like brute force and user enumeration, which I addressed with
> rate limiting and identical error messages."

### "Why Redis for rate limiting? What happens if Redis goes down?"

> "An in-memory limiter keeps counts inside one server process, so they
> reset whenever the server restarts — which on Render's free tier is often
> — and they wouldn't be shared if I ran more than one instance. Redis gives
> one shared counter that survives restarts. I used Upstash because it's
> serverless Redis over HTTP with a free tier, and its library gives a
> sliding window, which avoids the burst you can get at fixed-window
> boundaries.
>
> For outages I had three options. Fail open — allow everything — removes
> brute-force protection exactly when something's already wrong. Fail
> closed — block everything — means a Redis outage locks every user out of
> login. I chose to degrade: if Redis errors, times out after 1 second, or
> is misconfigured, it falls back to the in-memory limiter. I tested each
> path, and testing caught that a malformed Redis URL threw at startup and
> crashed the server, so client creation is wrapped to fall back too."

### "Why is scoring done on the client?"

> "The catalog is small and static and the math is cheap, so running it in
> the browser means sliders re-rank instantly with no network round-trip and
> no server load. The tradeoff is that updating the catalog means shipping a
> new frontend build."

### "Tell me about a bug you debugged."

> "After adding Prisma, the deployed app's leaderboard showed a JSON parse
> error: `Unexpected token '<'`. The frontend was getting an HTML error page
> instead of JSON, which meant the whole backend had crashed on startup. The
> generated Prisma client folder is gitignored, and nothing regenerated it on
> Render, so the import failed. I reproduced it locally by deleting the
> folder, then fixed it with a `postinstall: prisma generate` script.
>
> The next deploy crashed differently: `Unknown file extension .ts`. Prisma 7
> generates TypeScript, my machine runs Node 24, which can import `.ts`
> files natively, but Render ran Node 22.16, which can't. Instead of pinning
> an exact Node version, I ran the server with `tsx`, which makes it work on
> any version."

### "Did you find any security problems in your own code?"

> "Three, when I planned public profiles. The shared-report delete route had
> no auth at all, so anyone could delete anyone's link, and it replied
> 'success' before the delete ran. The share route never ran auth either, so
> every report's owner was null and the 'Shared reports' page showed
> everyone's. And save-report did `Report.create({ userID, ...body })`, so a
> request body containing `userID` could save into another account — classic
> mass assignment. I fixed all three, and tested them with signed tokens for
> two made-up users: 401 without a login, 404 on someone else's report, and
> the spoofed `userID` ignored."

### "Have you dealt with a race condition?"

> "Yes — and a test found it, not code review. When a report is saved, its
> parts are also written to Postgres for the leaderboard. That used Prisma's
> `upsert`, which looks atomic but is really a SELECT then an INSERT. If two
> saves introduced the same never-seen part at nearly the same moment, both
> SELECTs found nothing, both tried to INSERT, and the second hit the unique
> constraint on the part name. The error was caught and logged, so the user
> never noticed — that report just silently went missing from the
> leaderboard. My test saved two reports back-to-back and Postgres recorded
> only one.
>
> I replaced it with `INSERT … ON CONFLICT (name) DO UPDATE SET name =
> EXCLUDED.name RETURNING id`, which does the check and insert as one
> statement inside Postgres: a second concurrent insert waits for the first
> to commit, then takes the conflict branch. I also wrapped each report's
> rows in a transaction so a failure can't leave half a report. Then I fired
> six saves at once — all six recorded, one row per part."

**Why it happened:** check-then-act across two separate statements. Between
the SELECT and the INSERT, another request can change the world.

**Likely follow-ups**

- *"Why `DO UPDATE` and not `DO NOTHING`?"* — `DO NOTHING` returns no row on
  conflict, so `RETURNING id` would come back empty for an existing part.
  The no-op update makes it return the existing row's id.
- *"Why not just retry on the error?"* — Retrying works but is a workaround;
  letting the database resolve it atomically removes the race instead of
  recovering from it.
- *"Why wasn't it caught earlier?"* — It only happens with concurrent saves
  of a part nobody has saved before, and the failure was swallowed by a
  deliberate "best-effort" catch — correct for availability, but it hid the
  bug. Silent failure paths need tests, because logs alone go unread.
- *"Same pattern elsewhere?"* — Signup already relies on the unique index
  (Mongo error 11000) instead of checking "does this email exist?" first,
  and usernames do the same: the unique index is the real check.

### "How does the gallery's pagination work?"

> "Keyset (cursor) pagination, not page numbers. Each response includes a
> cursor - the last item's `createdAt` and `_id` - and the next request asks
> for items *older* than that. With `skip`/offset, a report published while
> you're scrolling shifts everything down one and you see a duplicate; a
> cursor doesn't move. `_id` breaks ties for reports created in the same
> millisecond, and an index on `{visibility, createdAt, _id}` matches the
> query's sort. I fetch one extra row to know if there's another page,
> instead of running a count. I tested it with 15 reports, three sharing one
> timestamp: two pages, all 15, no repeats."

### "How do public and private reports work?"

> "A shared report is unlisted by default - reachable only by its link.
> The owner can publish it to the gallery, which requires an account with a
> username so every public report has an author. Unlisted links never reveal
> who made them. Visibility and listing fields are edited through an
> owner-only route, and the report's contents can't be changed after
> sharing. Authors are looked up at read time in one batched query per page,
> so a renamed user's old reports show the new name."

### "How does the leaderboard cache work?"

> "It's cache-aside. The leaderboard endpoint checks Redis first; on a hit it
> skips Postgres entirely. On a miss it runs the two join queries, responds,
> and stores the result for 60 seconds. When someone saves a report, the
> save deletes the cached copy once its Postgres write succeeds, so the next
> request recomputes fresh data — the 60-second expiry is just a safety net.
>
> The cache can never break the endpoint: every Redis call has a 500ms
> timeout and catches its own errors, so if Redis is down it falls back to
> querying Postgres. I tested hit, miss, invalidation, and Redis being
> unconfigured, unreachable, and misconfigured. The main benefit isn't raw
> latency — each request still makes a network round trip to Redis — it's
> that repeat views stop running SQL joins against Neon's free-tier compute.
>
> One edge case I know about: a request that misses the cache can finish its
> queries and write its result after a concurrent save already cleared the
> cache, re-caching slightly old data. The 60-second expiry bounds that."

### "How does your schema handle username changes?"

**Key idea: reference by a permanent id, display by a mutable name.** The
username lives in exactly one field on the user document; everything else
points at the user's `_id`:

| Where | References the user by |
|---|---|
| Saved reports (Mongo) | `userID` |
| Shared / gallery reports (Mongo) | `ownerId` |
| Postgres analytics (`Report.userId`) | the id as a string |
| JWT | id + email, **not** the username |

- A rename is one `PATCH /api/me` updating one field — no other documents,
  no migration.
- Gallery cards and public report pages look up authors at read time (one
  batched query per page), so old reports show the new name immediately.
- The token stays valid (it never contained the username); the frontend's
  cached copy is updated when the save succeeds.
- A unique (sparse) index decides who gets a name — two people claiming it
  at once get a duplicate-key error → 409, no check-then-save race.

**Trade-offs to admit:** old `/u/oldname` links 404 (no redirect); the old
name is freed immediately, so someone else could claim it; renames are only
limited by the general profile-edit rate limit.

> "Usernames live in one field, and everything else references the user's
> permanent id — reports, shared links, the Postgres analytics, even the
> login token. Authors are looked up when a page is read, so a rename is one
> update and shows everywhere immediately. A unique index decides who gets a
> name, so there's no race. The trade-off is that old profile URLs break and
> the old name is freed straight away; in production I'd add a rename-history
> table that redirects old URLs and holds old names for a while."

### "Profiles and a gallery sound like a lot — what was actually hard?"

> "Honestly, very little was new structure. Profiles were two fields on
> the user document; the gallery was four fields on shared reports and one
> query. Nothing needed a new database, service or rewrite, which told me
> the original design held up. The real work was correctness: who can see,
> edit or delete what — owners versus guests, unlisted versus public, never
> leaking emails or owner ids — plus the two bugs I found on the way: a
> mass-assignment hole in saving reports, and a race in the Postgres
> analytics write. And pagination that stays correct while new reports are
> being published."

The point to land: building features is the easy part to describe; the
judgement is in the authorization rules, the bugs you caught in your own
code, and the scoring model and two-database design.

### "How would you scale this?"

- The leaderboard is already cached in Redis (see "How does the leaderboard
  cache work?"). Next steps would be database indexes on the join columns,
  or a Postgres materialized view refreshed periodically.
- Move scoring constants and the catalog behind an API so data updates
  don't require a frontend rebuild.
- Replace the best-effort dual-write with a queue or outbox.
- Add healthchecks, logging/monitoring, and automated tests with CI.

### "What would you do differently?"

- Pick one database (Postgres + JSONB) unless there's a clear need for two.
- Hold out a test set when fitting the model, and report out-of-sample
  error.
- Use versioned migrations (`prisma migrate`) instead of `db push`.
- Write tests from the start.
- Use Vite instead of Create React App, which is no longer maintained.

---

## 7. Weaknesses to own before they're found

Better to raise these yourself than have an interviewer discover them:

- **No automated tests or CI.**
- **Shared-report endpoints are unauthenticated.** `DELETE /api/shared/:id`
  has no auth middleware, so anyone with an ID could delete a shared report,
  and `POST /api/share-report` never runs the auth middleware, so `ownerId`
  is always null. (Fix: require auth and check ownership.)
- **No email verification or password reset.**
- **Tokens in `localStorage`** and **no token revocation** (see the JWT
  answer above).
- **Dual-write isn't transactional**, so the leaderboard can under-count.
- **No Prisma migration history** — the schema was applied with `db push`.
- **Weights are judgement calls, not measurements.** The 50% performance
  default isn't fit to anything; tuning it properly would need user data.
- **Integrated GPU efficiency is approximate.** Their 15 W is the whole
  chip's power budget, so they top the efficiency ranking partly unfairly.
  They're labelled in the UI, not corrected.
- **The single-thread estimator is weak** (R² 0.59), though it only affects
  a custom-specs baseline's reference point, never the ranking.
- **Docker is not verified.** The Dockerfiles and compose file were fixed on
  review, but the images haven't completed a successful build, and they
  still use `node:18`, which several dependencies (Prisma 7, Mongoose 9,
  React Router 7) don't support. Don't claim the app runs in Docker until
  that's fixed and tested.
- **Data is a 2022 snapshot**, so newer hardware isn't in the catalog.

---

## 8. Numbers to remember

| Fact | Value |
|---|---|
| Catalog | 54 GPUs, 56 CPUs (110 parts), PassMark scores from Kaggle |
| GPU model fit | R² 0.949 |
| CPU model fit | R² 0.876 |
| Average estimator error | ~14% (GPU 13.8%, CPU 14.4%) |
| Integrated GPU error | ~28.5% average (discrete: ~12.6%) |
| Single-thread model fit | R² 0.590 (~9% average error) |
| Default weights | Performance 50%; CPU others 12.5% each, GPU others ~16.7% each |
| Worked example | RTX 3080 = 1.32× a custom `{2000 MHz, 8 GB, 150 W}` baseline; 1.27× an RTX 2070 |
| Default baseline | Top-benchmarking parts: Ryzen 9 5950X, RTX 3090 Ti |
| JWT lifetime | 7 days |
| Rate limit | 20 requests / 15 min / IP on login and signup |
| Leaderboard | Top 10 parts by distinct users; top 10 CPU+GPU pairs |
