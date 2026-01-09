import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from "./database.js";
import ReportRouter from "./routers/reportrouter.js";
import AuthRouter from "./routers/userauth.js";


// Activate and Hook everything
dotenv.config(); 
const FRONTEND_URL = process.env.FRONT_END_URL;

const app = express();
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
connectDB();

app.use("/", ReportRouter);
app.use("/api", AuthRouter);


app.listen(2000, () => {
    console.log("server running at 2000");
});