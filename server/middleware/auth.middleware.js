import { getToken } from "next-auth/jwt";

export const authenticateUser = async (req, res, next) => {
    try {
    
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = token; // Attach token data to req
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const isAdmin = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    next();
};
