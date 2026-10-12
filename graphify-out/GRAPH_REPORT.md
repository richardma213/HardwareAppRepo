# Graph Report - Hardware_Application  (2026-10-05)

## Corpus Check
- 79 files · ~91,610 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 35 file(s) not represented in the graph (top: .css 23, (none) 6, .csv 2)

## Summary
- 442 nodes · 915 edges · 22 communities (19 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7a5f0405`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Compare.jsx
- fitBenchmarkModel.mjs
- App.js
- frontend/package.json
- BaselineWindow.jsx
- Scoring Model
- reportrouter.js
- users.js
- backend/package.json
- dependencies
- Learn More
- server.js
- Prisma + Postgres (Leaderboard)
- rateLimit.js
- leaderboardCache.js
- Docker Setup
- manifest.json
- README.md
- scripts
- Raw benchmark data
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `App()` - 25 edges
2. `react` - 24 edges
3. `Compare()` - 22 edges
4. `react-router-dom` - 17 edges
5. `CPU()` - 17 edges
6. `GPU()` - 17 edges
7. `Modal()` - 15 edges
8. `Scoring Model` - 12 edges
9. `getUsername()` - 11 edges
10. `Report()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Known limitations` --references--> `Report()`  [INFERRED]
  frontend/public_scripts/PRISMA.md → frontend/src/pages/Report.jsx
- `The schema` --references--> `Report()`  [INFERRED]
  frontend/public_scripts/PRISMA.md → frontend/src/pages/Report.jsx
- `Why `ON CONFLICT` instead of `prisma.component.upsert()`` --references--> `Report()`  [INFERRED]
  frontend/public_scripts/PRISMA.md → frontend/src/pages/Report.jsx
- `The write path: `POST /save-report`` --references--> `Report()`  [INFERRED]
  frontend/public_scripts/PRISMA.md → frontend/src/pages/Report.jsx
- `The models` --references--> `leastSquares()`  [INFERRED]
  frontend/public_scripts/SCORING.md → frontend/public_scripts/fitBenchmarkModel.mjs

## Import Cycles
- None detected.

## Communities (22 total, 3 thin omitted)

### Community 0 - "Compare.jsx"
Cohesion: 0.09
Nodes (43): useBaseline(), Card(), CompareContext, CompareProvider(), addCPU(), addGPU(), clearCPUs(), clearGPUs() (+35 more)

### Community 1 - "fitBenchmarkModel.mjs"
Cohesion: 0.08
Nodes (22): [ck, ca, cb, cc, cd], cPred, cpuModel, cRows, cX, cY, __dirname, fitDate (+14 more)

### Community 2 - "App.js"
Cohesion: 0.08
Nodes (47): App(), BaselineWindow(), BenchReportInfo(), STEPS, ConfirmationPopup(), GalleryCard(), METRICS, METRICS_BY_TYPE (+39 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.04
Nodes (43): browserslist, development, production, dependencies, chart.js, jwt-decode, react, react-chartjs-2 (+35 more)

### Community 4 - "BaselineWindow.jsx"
Cohesion: 0.09
Nodes (37): BaselineContext, BaselineProvider(), BaselineField(), BaselinePerfSummary(), BaselineSection(), BRANDS, formatNumber(), isValid() (+29 more)

### Community 5 - "Scoring Model"
Cohesion: 0.10
Nodes (19): leastSquares(), Choosing a baseline, Display: why scores are shown as "× baseline", Edge cases, History: why the backbone-and-tilt model was replaced, How weights behave, Integrated GPUs and efficiency, Known limitations (+11 more)

### Community 80 - "reportrouter.js"
Cohesion: 0.17
Nodes (8): authMiddleware(), optionalAuthMiddleware(), MAX_TAGS, REPORT_TAGS, SharedReportSchema, escapeRegex(), searchFilter(), jsonwebtoken

### Community 90 - "users.js"
Cohesion: 0.18
Nodes (6): profileUpdateLimiter, profileViewLimiter, adapter, prisma, RESERVED, @prisma/adapter-pg

### Community 91 - "backend/package.json"
Cohesion: 0.14
Nodes (13): author, description, keywords, license, main, name, type, version (+5 more)

### Community 97 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, bcrypt, cors, dotenv, express, express-rate-limit, jsonwebtoken, mongoose (+7 more)

### Community 112 - "Learn More"
Cohesion: 0.14
Nodes (13): Advanced Configuration, Analyzing the Bundle Size, Available Scripts, Code Splitting, Deployment, Getting Started with Create React App, Learn More, Making a Progressive Web App (+5 more)

### Community 135 - "server.js"
Cohesion: 0.15
Nodes (12): connectDB(), authLimiter, ReportSchema, userSchema, router, router, router, app (+4 more)

### Community 141 - "Prisma + Postgres (Leaderboard)"
Cohesion: 0.14
Nodes (13): Architecture, Caching (Upstash Redis), Known limitations, Most Popular, Popular Builds, Prisma + Postgres (Leaderboard), The BigInt gotcha, The read path: `GET /api/leaderboard` (+5 more)

### Community 148 - "rateLimit.js"
Cohesion: 0.18
Nodes (10): byIp(), byUser(), deleteSharedLimiter, galleryLimiter, leaderboardLimiter, saveReportLimiter, shareReportLimiter, TOO_MANY (+2 more)

### Community 192 - "leaderboardCache.js"
Cohesion: 0.33
Nodes (6): cacheLeaderboard(), getCachedLeaderboard(), invalidateLeaderboard(), withTimeout(), redis, @upstash/redis

### Community 202 - "Docker Setup"
Cohesion: 0.22
Nodes (8): Architecture at a glance, Backend `Dockerfile`, `docker-compose.yml`, Docker Setup, Frontend `Dockerfile.frontend`, Known limitations, Running it, Why the build context is the repo root

### Community 215 - "manifest.json"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 216 - "README.md"
Cohesion: 0.25
Nodes (7): Data Sources & Credits, Description, Development Process, HardwareAppRepo, How to run the site, Screenshots, Why I built this and other recommendations

### Community 235 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, postinstall, start, test

## Knowledge Gaps
- **147 isolated node(s):** `TOO_MANY`, `ReportSchema`, `SharedReportSchema`, `userSchema`, `name` (+142 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 182 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.js` to `Compare.jsx`, `frontend/package.json`, `BaselineWindow.jsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `TOO_MANY`, `ReportSchema`, `SharedReportSchema` to the rest of the system?**
  _147 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Compare.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09216589861751152 - nodes in this community are weakly interconnected._
- **Why does `leastSquares()` connect `Scoring Model` to `fitBenchmarkModel.mjs`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `fitBenchmarkModel.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._
- **Should `App.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08035087719298245 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04336734693877551 - nodes in this community are weakly interconnected._