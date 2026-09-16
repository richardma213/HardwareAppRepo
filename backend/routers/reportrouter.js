import {Router} from "express";
import {authMiddleware} from "../middleware/authMiddleware.js";
import Report from "../models/Report.js";
import SharedReports from "../models/SharedReports.js";
import {prisma} from "../prismaClient.js";

const router = Router();

router.post("/save-report", authMiddleware, async(req, res) => {

    try {
        const userID = req.user.id;
        const rep_data = req.body;

        const mongoDoc = await Report.create({userID, ...rep_data});
        res.json({message : "report saved!"});

        // Postgres analytics write - best-effort, never blocks or fails the real save.
        // Not transactional with the Mongo write above (two separate databases); a
        // failure here just means this one report is missing from the leaderboard.
        try {
            const pgReport = await prisma.report.create({
                data: { mongoReportId: mongoDoc._id.toString(), userId: userID },
            });

            const picks = [
                ...(rep_data.cpus ?? []).map(c => ({ name: c.name, category: "CPU" })),
                ...(rep_data.gpus ?? []).map(g => ({ name: g.name, category: "GPU" })),
            ];

            for (const p of picks) {
                const component = await prisma.component.upsert({
                    where: { name: p.name },
                    update: {},
                    create: p,
                });
                await prisma.reportComponent.create({
                    data: { reportId: pgReport.id, componentId: component.id },
                });
            }
        } catch (pgErr) {
            console.error("Postgres analytics write failed (non-fatal):", pgErr);
        }

    } catch (e) {
        console.error(e);
        res.status(500).json({message: "error saving report"});
    }
});

router.get("/reports", authMiddleware, async (req, res) => {
  try {
    const userID = req.user.id;

    const reports = await Report.find({ userID }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "error fetching reports" });
  }
});

router.delete("/reports/:id", authMiddleware, async (req, res) => {
    try {
        const userID = req.user.id;
        const {id} = req.params;

        const deleted = await Report.findOneAndDelete({_id: id, userID});

        if (!deleted){
            return res.json({message: "report not found"});
        }
        return res.json({success: true});
    } catch (e){
        console.error(e);
        res.status(500).json({ message: "error deleting report" });
    }

});


router.post("/api/share-report", async (req, res) => {
  try {
    const { report } = req.body;

    const doc = await SharedReports.create({
      ownerId: req.user?.id || null,
      data: report
    });

    res.json({ id: doc._id });

  } catch (err) {
    console.error("Share error:", err);
    res.status(500).json({ error: "Failed to share report" });

  }
});


router.get("/api/shared/:id", async (req, res) => {
  try {
    const doc = await SharedReports.findById(req.params.id);

    if (!doc) {
    return res.status(404).json({ error: "Not found" });
    }

    res.json(doc.data);

  } catch (err) {
    console.error("Load shared error:", err);
    res.status(500).json({ error: "Failed to load shared report" });

  }
});

// GET ALL SHARED REPORTS (multi-viewer)
router.get("/api/shared", async (req, res) => {
  try {
    const docs = await SharedReports.find().sort({ createdAt: -1 });

    // Change format to match 
    const normalized = docs.map(doc => ({
      _id: doc._id,
      ...doc.data,        
      createdAt: doc.createdAt,
      ownerId: doc.ownerId
    }));

    res.json(normalized);
  } catch (err) {
    console.error("Fetch shared reports error:", err);
    res.status(500).json({ error: "Failed to fetch shared reports" });
  }
});

router.delete("/api/shared/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ success: true });

    // Delete asynchronously (non-blocking)
    SharedReports.findByIdAndDelete(id).catch(err =>
      console.error("Async delete error:", err)
    );

  } catch (err) {
    console.error("Delete shared report error:", err);
    res.status(500).json({ error: "Failed to delete shared report" });
  }
});

// Two cross-user aggregates over Postgres (not Mongo), backed by the
// dual-write in POST /save-report above. Both use $queryRaw because Prisma's
// fluent query builder (groupBy) can't express COUNT(DISTINCT ...) across a
// join, or a self-join, on its own - see backend/PRISMA.md for why.
router.get("/api/leaderboard", async (req, res) => {
  try {
    // Most Popular: ranked by DISTINCT users who picked a component, not raw
    // picks - so one person re-saving the same build 50x can't outrank a
    // component that 10 different people each picked once.
    const mostPopular = await prisma.$queryRaw`
      SELECT c.id, c.name, c.category, COUNT(DISTINCT r."userId") AS "uniqueUsers"
      FROM "ReportComponent" rc
      JOIN "Component" c ON c.id = rc."componentId"
      JOIN "Report" r ON r.id = rc."reportId"
      GROUP BY c.id
      ORDER BY "uniqueUsers" DESC
      LIMIT 10;
    `;

    // Popular Builds: which CPU+GPU pairs show up together in the same report
    // most often. A self-join on ReportComponent via reportId - rc1 finds the
    // CPU side, rc2 finds the GPU side of the same report.
    const popularBuilds = await prisma.$queryRaw`
      SELECT cpu.name AS "cpuName", gpu.name AS "gpuName", COUNT(*) AS pairs
      FROM "ReportComponent" rc1
      JOIN "Component" cpu ON cpu.id = rc1."componentId" AND cpu.category = 'CPU'
      JOIN "ReportComponent" rc2 ON rc2."reportId" = rc1."reportId"
      JOIN "Component" gpu ON gpu.id = rc2."componentId" AND gpu.category = 'GPU'
      GROUP BY cpu.name, gpu.name
      ORDER BY pairs DESC
      LIMIT 10;
    `;

    // Postgres COUNT() comes back as BigInt - JSON.stringify can't serialize
    // that, so convert to plain numbers before responding.
    res.json({
      mostPopular: mostPopular.map(r => ({ ...r, uniqueUsers: Number(r.uniqueUsers) })),
      popularBuilds: popularBuilds.map(r => ({ ...r, pairs: Number(r.pairs) })),
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

export default router;
