import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from "./database.js";
import User from "./models/User.js";
import {authMiddleware} from "./middleware/authMiddleware.js";
import Report from "./models/Report.js";
import SharedReports from "./models/SharedReports.js";

// Activate and Hook everything
dotenv.config(); 
const router = express.Router();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();


app.post("/signup", async (req, res) => {
    const {email, password} = req.body;

    const existing = await User.findOne({email});

    if (existing){
        return res.status(400).json({error: "Email already exists"});
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({email, password: hashed})
    
    res.json({message: "User created"});

} );

app.post("/login", async (req, res) => {

    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user){
        return res.status(400).json({error: "wrong username or password" });
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match){
        return res.status(400).json({error: "Incorrect password"});
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({token});
});

app.post("/save-report", authMiddleware, async(req, res) => {

    try {
        const userID = req.user.id;
        const rep_data = req.body;

        await Report.create({userID, ...rep_data});
        res.json({message : "report saved!"});

    } catch (e) {
        console.error(e);
        res.status(500).json({message: "error saving report"});
    }
});

app.get("/reports", authMiddleware, async (req, res) => {
  try {
    const userID = req.user.id;

    const reports = await Report.find({ userID }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "error fetching reports" });
  }
});

app.delete("/reports/:id", authMiddleware, async (req, res) => {
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


app.post("/api/share-report", async (req, res) => {
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


app.get("/api/shared/:id", async (req, res) => {
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
app.get("/api/shared", async (req, res) => {
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

app.delete("/api/shared/:id", async (req, res) => {
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



app.listen(2000, () => {
    console.log("server running at 2000");
});