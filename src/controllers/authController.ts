import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data:{
                email,
                password: hashedPassword
            }
        });
        res.json({ message: "Register Success", user})
    } catch (error) {
        res.status(400).json({message: "Register Failed"})
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({error: "Invalid Credetials"});
        };

        const token = jwt.sign(
            {
                userId: user?.id,
                email: user?.email    
            },
                JWT_SECRET,
            {
                expiresIn: "1h"
            },
        );

        res.json({message: "Login Success", token})
    } catch (error) {
        res.status(500).json({message: "Login Failed"})
    }
}