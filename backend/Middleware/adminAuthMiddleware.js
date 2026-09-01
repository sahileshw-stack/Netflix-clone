const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin");

const adminProtect = async (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Admin token is missing",
      });
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (
      decoded.role !== "admin" ||
      decoded.purpose !== "admin-login"
    ) {
      return res.status(403).json({
        message: "Admin access denied",
      });
    }

    const admin = await Admin.findById(
      decoded.adminId
    );

    if (!admin || admin.isActive !== true) {
      return res.status(401).json({
        message: "Admin account not found or inactive",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error(
      "Admin authentication error:",
      error
    );

    return res.status(401).json({
      message: "Invalid or expired admin token",
    });
  }
};

module.exports = adminProtect;