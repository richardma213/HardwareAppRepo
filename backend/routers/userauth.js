import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router } from "express";

const router = Router();

router.post("/signup", async (req, res) => {
    const {email, password} = req.body;

    const existing = await User.findOne({email});

    if (existing){
        return res.status(400).json({error: "Email already exists"});
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({email, password: hashed})
    
    res.json({message: "User created"});

} );

router.post("/login", async (req, res) => {

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

export default router;