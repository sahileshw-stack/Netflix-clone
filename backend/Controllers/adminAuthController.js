const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin");
const bcrypt = require("bcryptjs");
const sendOtpMail = require("../Utils/sendOtpMail");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const admin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    if (admin.isActive !== true) {
      return res.status(403).json({
        message: "Admin account is disabled",
      });
    }

    const passwordMatched =
      await admin.comparePassword(password);

    if (!passwordMatched) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing in .env"
      );
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        role: admin.role,
        purpose: "admin-login",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      message: "Unable to login as admin",
      error: error.message,
    });
  }
};

const checkAdminAuth = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      authenticated: true,
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Unable to verify admin session",
      error: error.message,
    });
  }
};
const requestPasswordReset = async (req, res) => {
  try {
    const {
      email,
      newPassword,
      confirmPassword,
    } = req.body || {};

    if (
      !email ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message:
          "Email, new password and confirm password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Password must contain at least 6 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const admin = await Admin.findOne({
      email: normalizedEmail,
      isActive: true,
    });

    if (!admin) {
      return res.status(404).json({
        message:
          "No active admin account found with this email",
      });
    }

    const otp = Math.floor(
      1000 + Math.random() * 9000
    ).toString();

    const pendingPasswordHash =
      await bcrypt.hash(newPassword, 10);

    admin.resetOtp = otp;

    admin.resetOtpExpiresAt =
      new Date(Date.now() + 10 * 60 * 1000);

    admin.pendingPasswordHash =
      pendingPasswordHash;

    await admin.save();

    await sendOtpMail(
      admin.email,
      otp
    );

    return res.status(200).json({
      success: true,
      message:
        "A 4-digit OTP has been sent to the registered admin email",
      email: admin.email,
    });
  } catch (error) {
    console.error(
      "Request admin password reset error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to send password reset OTP",
      error: error.message,
    });
  }
};

const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const admin = await Admin.findOne({
      email: normalizedEmail,
      isActive: true,
    });

    if (!admin) {
      return res.status(404).json({
        message: "Admin account not found",
      });
    }

    if (
      !admin.resetOtp ||
      !admin.resetOtpExpiresAt ||
      !admin.pendingPasswordHash
    ) {
      return res.status(400).json({
        message:
          "No active password reset request found",
      });
    }

    if (
      admin.resetOtpExpiresAt.getTime() <
      Date.now()
    ) {
      admin.resetOtp = "";
      admin.resetOtpExpiresAt = null;
      admin.pendingPasswordHash = "";

      await admin.save();

      return res.status(400).json({
        message:
          "OTP has expired. Request a new OTP.",
      });
    }

    if (admin.resetOtp !== otp.toString()) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    /*
      pendingPasswordHash is already hashed.

      updateOne() is used here so the password
      pre-save hook does not hash it again.
    */
    await Admin.updateOne(
      {
        _id: admin._id,
      },
      {
        $set: {
          password:
            admin.pendingPasswordHash,
          resetOtp: "",
          resetOtpExpiresAt: null,
          pendingPasswordHash: "",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Admin password changed successfully",
    });
  } catch (error) {
    console.error(
      "Verify admin reset OTP error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to verify password reset OTP",
      error: error.message,
    });
  }
};

const getAdminProfile = async (req, res) => {
  try {

    const admin = await Admin.findById(
      req.admin._id
    ).select(
      "-password -resetOtp -resetOtpExpiresAt -pendingPasswordHash"
    );


    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }


    return res.status(200).json({
      success: true,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        profileImage: admin.profileImage || "",
      },
    });

  } catch (error) {

    console.error(
      "Get admin profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load admin profile",
      error: error.message,
    });

  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body || {};

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Admin name is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Admin email is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // Check whether another admin already uses this email
    const existingAdmin =
      await Admin.findOne({
        email: normalizedEmail,
        _id: {
          $ne: req.admin._id,
        },
      });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message:
          "This email is already registered",
      });
    }

    const admin =
      await Admin.findById(
        req.admin._id
      );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin account not found",
      });
    }

    admin.name =
      name.trim();

    admin.email =
      normalizedEmail;

    await admin.save();

    return res.status(200).json({
      success: true,

      message:
        "Profile updated successfully",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });

  } catch (error) {
    console.error(
      "Update admin profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update admin profile",
      error: error.message,
    });
  }
};
const changeAdminPassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body || {};

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All password fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must contain at least 6 characters",
      });
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New passwords do not match",
      });
    }

    const admin =
      await Admin.findById(
        req.admin._id
      );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin account not found",
      });
    }

    const currentPasswordMatched =
      await admin.comparePassword(
        currentPassword
      );

    if (!currentPasswordMatched) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    const samePassword =
      await admin.comparePassword(
        newPassword
      );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    admin.password =
      newPassword;

    await admin.save();

    return res.status(200).json({
      success: true,
      message:
        "Password updated successfully",
    });

  } catch (error) {
    console.error(
      "Change admin password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to change password",
      error: error.message,
    });
  }
};
const updateAdminProfileImage =
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Profile image is required",
        });
      }


      const admin =
        await Admin.findById(
          req.admin._id
        );


      if (!admin) {
        return res.status(404).json({
          success: false,
          message:
            "Admin account not found",
        });
      }


      const imagePath =
        `/uploads/admin/${req.file.filename}`;


      admin.profileImage =
        imagePath;


      await admin.save();


      return res
        .status(200)
        .json({

          success: true,

          message:
            "Profile image updated successfully",

          profileImage:
            admin.profileImage,

        });


    } catch (error) {

      console.error(
        "Update admin profile image error:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to update profile image",

          error:
            error.message,

        });

    }

  };
module.exports = {
  adminLogin,
  checkAdminAuth,
  requestPasswordReset,
  verifyResetOtp,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  updateAdminProfileImage,
};