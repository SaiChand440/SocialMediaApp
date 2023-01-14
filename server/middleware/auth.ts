import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export const verifyToken =async (req: Request, res: Response, next) => {
    try {
       let token = req.header("Authorization");
       
       if (!token) {
        return res.status(403).send("Access Denied");
       }

       if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimStart();
       }

       const verified = jwt.verify(token, process.env.JWT_SECRET);
       
       if (verified) {
           next();
       } else {
         res.json(500).json({message: "User Not Authenticated"});
       }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}