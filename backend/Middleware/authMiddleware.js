const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Authorization token is missing",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        req.user = user;
        req.userId = user._id;
        req.auth = decoded;

        next();

    } catch (error) {
        console.error("Auth middleware error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Login session expired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid login token",
            });
        }

        return res.status(500).json({
            message: "Authentication failed",
            error: error.message,
        });
    }
};

module.exports = protect;