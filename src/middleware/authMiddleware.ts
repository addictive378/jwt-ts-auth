import { error } from "console";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({error: "Access denied. no token provide"});
        return;
    }
    
    try {
        const decode = jwt.verify(token, JWT_SECRET);

        (req as any).user = decode;

        next()
    } catch (error) {
        res.status(401).json({error: "Invalid token"});
    }
}