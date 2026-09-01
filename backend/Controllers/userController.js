const User = require("../Models/User");
const transporter = require("../Utils/mailer");
const Plan = require("../Models/Plan");
const bcrypt = require("bcryptjs");

const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");


const {
  normalizeEmail,
  encryptEmail,
  hashEmail,
} = require("../Utils/emailCrypto");


// ======================================================
// 1. HERO PAGE — SAVE ENCRYPTED EMAIL
// POST /api/users/start-signup
// ======================================================
const startSignup = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email || email.trim() === "") {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const encryptedEmail = encryptEmail(normalizedEmail);
    const emailHash = hashEmail(normalizedEmail);

    const existingUser = await User.findOne({
      emailHash,
    });

    if (existingUser) {
      const signupCompleted =
        existingUser.paymentCompleted === true &&
        existingUser.profileCompleted === true &&
        existingUser.accountCreated === true;

      console.log("--------------------------------");
      console.log("Existing user found");
      console.log("User ID:", existingUser._id.toString());
      console.log("Signup completed:", signupCompleted);
      console.log("--------------------------------");

      return res.status(200).json({
        success: true,
        existingUser: true,
        signupCompleted,
        email: normalizedEmail,
        userId: existingUser._id,
      });
    }

    const user = await User.create({
      email: encryptedEmail,
      emailHash,
    });

    console.log("--------------------------------");
    console.log("New signup started");
    console.log("User ID:", user._id.toString());
    console.log("Email stored in encrypted format");
    console.log("--------------------------------");

    return res.status(201).json({
      success: true,
      existingUser: false,
      signupCompleted: false,
      message: "Email saved successfully",
      email: normalizedEmail,
      userId: user._id,
    });
  } catch (error) {
    console.error("Start signup error:", error);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
// ======================================================
// 2. NEWSIGNIN PAGE — GENERATE TOKEN AND SEND EMAIL
// POST /api/users/send-link
// ======================================================

const sendSignupLink = async (req, res) => {
  try {
    const { email, userId } = req.body || {};

    if (!email || email.trim() === "") {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const token = jwt.sign(
      {
        email: normalizedEmail,
        userId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    console.log("--------------------------------");
    console.log("Signup token generated");
    console.log("Email:", normalizedEmail);
    console.log("Token:", token);
    console.log("--------------------------------");

    const htmlPath = path.join(
      __dirname,
      "../Templates/welcome.html"
    );

    let html = fs.readFileSync(htmlPath, "utf8");

    html = html.replace(
      "{{USER_EMAIL}}",
      normalizedEmail
    );

    html = html.replace(
      "{{CREATE_ACCOUNT_URL}}",
      `http://localhost:5173/chooseplan?token=${encodeURIComponent(
        token
      )}`
    );

    await transporter.sendMail({
      from: `"Netflix Clone" <${process.env.MAIL_USER}>`,
      to: normalizedEmail,
      subject: "Finish setting up your Netflix account",
      html,

      attachments: [
        {
          filename: "netflix.png",
          path: path.join(
            __dirname,
            "../Templates/images/netflix.png"
          ),
          cid: "netflix-logo",
        },
        {
          filename: "shield.png",
          path: path.join(
            __dirname,
            "../Templates/images/shield.png"
          ),
          cid: "shield-icon",
        },
        {
          filename: "cross.png",
          path: path.join(
            __dirname,
            "../Templates/images/cross.png"
          ),
          cid: "cross-icon",
        },
        {
          filename: "tv.png",
          path: path.join(
            __dirname,
            "../Templates/images/tv.png"
          ),
          cid: "tv-icon",
        },
      ],
    });

    console.log("Signup email sent successfully to:", normalizedEmail);

    return res.status(200).json({
      message: "Email sent successfully",
      token,
    });
  } catch (error) {
    console.error("Send signup link error:", error);

    return res.status(500).json({
      message: "Unable to send signup email",
      error: error.message,
    });
  }
};


// ======================================================
// 3. CHOOSEPLAN PAGE — VERIFY EMAIL TOKEN
// POST /api/users/verify-signup-token
// ======================================================

const verifySignupToken = async (req, res) => {
  try {
    const { token } = req.body || {};

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("--------------------------------");
    console.log("Signup token decoded successfully");
    console.log("Verified email:", decoded.email);
    console.log("Token issued at:", new Date(decoded.iat * 1000));
    console.log("Token expires at:", new Date(decoded.exp * 1000));
    console.log("--------------------------------");

    return res.status(200).json({
      message: "Token verified successfully",
      email: decoded.email,
      token,
    });
  } catch (error) {
    console.error("Verify signup token error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Signup link has expired",
      });
    }

    return res.status(401).json({
      message: "Invalid signup link",
    });
  }
};
const continueSignup = async (req, res) => {
  try {
    const { token } = req.body || {};

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("----------------------------");
    console.log("Continue signup");
    console.log("Verified email:", decoded.email);
    console.log("----------------------------");

    return res.status(200).json({
      message: "Continue to plan page",
      email: decoded.email,
    });
  } catch (error) {
    console.error(
      "Continue signup error:",
      error.message
    );

    return res.status(401).json({
      message:
        error.name === "TokenExpiredError"
          ? "Signup token expired"
          : "Invalid signup token",
    });
  }
};
const selectPlan = async (req, res) => {
  try {
    const { token, planId } = req.body || {};

    console.log("--------------------------------");
    console.log("Select plan request received");
    console.log("Received token:", token);
    console.log("Received plan ID:", planId);
    console.log("--------------------------------");

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    if (!planId) {
      return res.status(400).json({
        message: "Plan ID is required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log("Token decoded successfully");
    console.log("Verified email:", decoded.email);

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }
    user.selectedPlan = plan._id;
    user.paymentCompleted = false;

    await user.save();

    console.log("----------------------------");
    console.log("Plan selected and saved");
    console.log("User ID:", decoded.userId);
    console.log("Verified email:", decoded.email);
    console.log("Plan ID:", plan._id.toString());
    console.log("Plan name:", plan.name);
    console.log("----------------------------");

    return res.status(200).json({
      message: "Plan selected successfully",
      userId: user._id,
      email: decoded.email,
      plan,
    });
  } catch (error) {
    console.error("--------------------------------");
    console.error("Select plan real error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("--------------------------------");

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Signup token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid signup token",
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid plan ID",
      });
    }

    return res.status(500).json({
      message: "Unable to select plan",
      error: error.message,
    });
  }
};

const startWatching = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Token is required");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log("----------------------------");
    console.log("Start Watching link opened");
    console.log("User ID:", user._id.toString());
    console.log("Profile completed:", user.profileCompleted);
    console.log("----------------------------");

    if (user.profileCompleted === true) {
      return res.redirect(
        "http://localhost:5173/movies"
      );
    }

    return res.redirect(
      `http://localhost:5173/profilesetup?token=${encodeURIComponent(token)}`
    );
  } catch (error) {
    console.error("Start watching error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).send(
        "Start Watching link has expired"
      );
    }

    return res.status(401).send(
      "Invalid Start Watching link"
    );
  }
};
const saveProfiles = async (req, res) => {
  try {
    const { token, profiles } = req.body || {};

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    if (!Array.isArray(profiles) || profiles.length === 0) {
      return res.status(400).json({
        message: "At least one profile is required",
      });
    }

    if (profiles.length > 5) {
      return res.status(400).json({
        message: "Maximum 5 profiles are allowed",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const cleanedProfiles = profiles.map((profile, index) => ({
      name: profile.name.trim(),
      isMainProfile: index === 0,
    }));

    user.profiles = cleanedProfiles;
    user.profileCompleted = true;

    await user.save();

    console.log("----------------------------");
    console.log("Profiles saved");
    console.log("User ID:", user._id.toString());
    console.log("Profiles:", cleanedProfiles);
    console.log("Profile completed:", user.profileCompleted);
    console.log("----------------------------");

    return res.status(200).json({
      message: "Profiles saved successfully",
      success: true,
      profiles: user.profiles,
    });
  } catch (error) {
    console.error("Save profiles error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Signup token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid signup token",
      });
    }

    return res.status(500).json({
      message: "Unable to save profiles",
      error: error.message,
    });
  }
};
const saveLanguage = async (req, res) => {
  try {
    const { token, language } = req.body || {};

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    if (!language || language.length === 0) {
      return res.status(400).json({
        message: "Please select at least one language.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.language = language;

    await user.save();

    console.log("----------------------------");
    console.log("Language saved");
    console.log("User ID:", user._id);
    console.log("Languages:", user.language);
    console.log("----------------------------");

    return res.status(200).json({
      success: true,
      message: "Language saved successfully",
    });

  } catch (error) {
    console.error("Save language error:", error);

    return res.status(500).json({
      message: "Unable to save language",
    });
  }
};
const saveFavoriteMovies = async (req, res) => {
  try {
    const { token, favoriteMovies } = req.body || {};

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    if (
      !Array.isArray(favoriteMovies) ||
      favoriteMovies.length === 0
    ) {
      return res.status(400).json({
        message: "Please select at least one movie.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.favoriteMovies = favoriteMovies;

    await user.save();

    console.log("----------------------------");
    console.log("Favorite movies saved");
    console.log("User ID:", user._id.toString());
    console.log("Movies:", user.favoriteMovies);
    console.log("----------------------------");

    return res.status(200).json({
      success: true,
      message: "Favorite movies saved successfully",
      favoriteMovies: user.favoriteMovies,
    });
  } catch (error) {
    console.error("Save favorite movies error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Signup token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid signup token",
      });
    }

    return res.status(500).json({
      message: "Unable to save favorite movies",
      error: error.message,
    });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const { token } = req.body || {};

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const mainProfile = user.profiles.find(
      (profile) => profile.isMainProfile === true
    );

    console.log("----------------------------");
    console.log("Main profile loaded");
    console.log("User ID:", user._id.toString());
    console.log(
      "Profile name:",
      mainProfile?.name || "User"
    );
    console.log("----------------------------");

    return res.status(200).json({
      success: true,
      username: mainProfile?.name || "User",
    });
  } catch (error) {
    console.error("Get user profile error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Signup token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid signup token",
      });
    }

    return res.status(500).json({
      message: "Unable to load user profile",
      error: error.message,
    });
  }
};
const getProfiles = async (req, res) => {
  try {
    const user = req.user;

    const sortedProfiles = [...user.profiles].sort(
      (a, b) =>
        Number(b.isMainProfile) -
        Number(a.isMainProfile)
    );

    console.log("----------------------------");
    console.log("Profiles loaded");
    console.log("User ID:", user._id.toString());
    console.log("Profiles:", sortedProfiles);
    console.log("----------------------------");

    return res.status(200).json({
      success: true,
      profiles: sortedProfiles,
    });
  } catch (error) {
    console.error("Get profiles error:", error);

    return res.status(500).json({
      message: "Unable to load profiles",
      error: error.message,
    });
  }
};
const completeOnboarding = async (req, res) => {
  try {
    const { profileId } = req.body || {};

    const user = req.user;

    const email =
      req.auth?.email ||
      decryptEmail(user.email);

    if (!profileId) {
      return res.status(400).json({
        message: "Profile ID is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Unable to find user email",
      });
    }
    if (user.paymentCompleted !== true) {
      return res.status(403).json({
        message: "Payment is not completed",
      });
    }

    if (user.profileCompleted !== true) {
      return res.status(403).json({
        message: "Profile setup is not completed",
      });
    }

    const selectedProfile =
      user.profiles.id(profileId);

    if (!selectedProfile) {
      return res.status(404).json({
        message: "Selected profile not found",
      });
    }

    user.currentProfile = selectedProfile._id;
    user.accountCreated = true;

    await user.save();

    const htmlPath = path.join(
      __dirname,
      "../Templates/accountReady.html"
    );

    let html = fs.readFileSync(
      htmlPath,
      "utf8"
    );

    const moviesUrl =
      "http://localhost:5173/movies";

    html = html.replace(
      "{{USER_NAME}}",
      selectedProfile.name
    );

    html = html.replaceAll(
      "{{EMAIL}}",
      email
    );

    html = html.replace(
      "{{WATCH_NOW_URL}}",
      moviesUrl
    );

    html = html.replace(
      "{{MOVIES_URL}}",
      moviesUrl
    );

    html = html.replaceAll(
      "{{HELP_URL}}",
      "https://help.netflix.com"
    );

    html = html.replaceAll(
      "{{CONTACT_URL}}",
      "https://help.netflix.com/contactus"
    );

    html = html.replaceAll(
      "{{TERMS_URL}}",
      "https://www.netflix.com/TermsOfUse"
    );

    html = html.replaceAll(
      "{{PRIVACY_URL}}",
      "https://www.netflix.com/privacy"
    );

    html = html.replace(
      "{{EMAIL_REFERENCE}}",
      Date.now().toString()
    );

    console.log("Final email sending started");
    console.log("Email:", email);

    await transporter.sendMail({
      from: `"Netflix Clone" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "We've received your payment",
      html,

      attachments: [
        {
          filename: "netflix.png",
          path: path.join(
            __dirname,
            "../Templates/images/netflix.png"
          ),
          cid: "netflix-logo",
        },
      ],
    });

    console.log("----------------------------");
    console.log("Onboarding completed");
    console.log("User ID:", user._id.toString());
    console.log(
      "Selected profile:",
      selectedProfile.name
    );
    console.log(
      "Current profile ID:",
      user.currentProfile.toString()
    );
    console.log(
      "Account created:",
      user.accountCreated
    );
    console.log(
      "Final email sent to:",
      email
    );
    console.log("----------------------------");

    return res.status(200).json({
      success: true,
      message:
        "Onboarding completed successfully",
      profile: selectedProfile,
    });
  } catch (error) {
    console.error(
      "Complete onboarding error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to complete onboarding",
      error: error.message,
    });
  }
};
const getCurrentProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user.currentProfile) {
      return res.status(400).json({
        message: "No profile is currently selected",
      });
    }

    const currentProfile = user.profiles.id(
      user.currentProfile
    );

    if (!currentProfile) {
      return res.status(404).json({
        message: "Current profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: currentProfile,
    });
  } catch (error) {
    console.error(
      "Get current profile error:",
      error
    );

    return res.status(500).json({
      message: "Unable to load current profile",
      error: error.message,
    });
  }
};

const savePassword = async (req, res) => {
  try {
    const { token, password } = req.body || {};

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    console.log("----------------------------");
    console.log("Password saved");
    console.log("User ID:", user._id.toString());
    console.log("Email:", decoded.email);
    console.log("----------------------------");

    return res.status(200).json({
      success: true,
      message: "Password saved successfully",
      email: decoded.email,
    });
  } catch (error) {
    console.error("Save password error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Signup token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid signup token",
      });
    }

    return res.status(500).json({
      message: "Unable to save password",
      error: error.message,
    });
  }
};
const sendSigninOtp = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email || email.trim() === "") {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const emailHash = hashEmail(normalizedEmail);

    const user = await User.findOne({
      emailHash,
    });

    // NEW USER
    if (!user) {
      const encryptedEmail = encryptEmail(normalizedEmail);

      const newUser = await User.create({
        email: encryptedEmail,
        emailHash,
      });

      console.log("----------------------------");
      console.log("New user entered Signin page");
      console.log("User ID:", newUser._id.toString());
      console.log("Redirecting to New Signin");
      console.log("----------------------------");

      return res.status(200).json({
        success: false,
        accountStatus: "new",
        message: "New account created",
        email: normalizedEmail,
        userId: newUser._id,
      });
    }

    // EXISTING BUT INCOMPLETE USER
    const accountCompleted =
      user.paymentCompleted === true &&
      user.profileCompleted === true &&
      user.accountCreated === true;

    if (!accountCompleted) {
      return res.status(200).json({
        success: false,
        accountStatus: "incomplete",
        message: "Account setup is not completed",
        email: normalizedEmail,
        userId: user._id,
      });
    }

    // COMPLETED USER — GENERATE OTP
    const otp = Math.floor(
      1000 + Math.random() * 9000
    ).toString();

    const otpHash = await bcrypt.hash(otp, 10);

    user.signinOtpHash = otpHash;
    user.signinOtpExpiresAt = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    const htmlPath = path.join(
      __dirname,
      "../Templates/signinOtp.html"
    );

    let html = fs.readFileSync(
      htmlPath,
      "utf8"
    );

    const formattedOtp = otp.split("").join(" ");

    html = html.replace(
      "{{OTP_CODE}}",
      formattedOtp
    );

    html = html.replaceAll(
      "{{EMAIL}}",
      normalizedEmail
    );

    html = html.replace(
      "{{EMAIL_REFERENCE}}",
      Date.now().toString()
    );

    await transporter.sendMail({
      from: `"Netflix Clone" <${process.env.MAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your Netflix sign-in code",
      html,

      attachments: [
        {
          filename: "netflix.png",
          path: path.join(
            __dirname,
            "../Templates/images/netflix.png"
          ),
          cid: "netflix-logo",
        },
      ],
    });

    const signinToken = jwt.sign(
      {
        userId: user._id,
        email: normalizedEmail,
        purpose: "signin-otp",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    console.log("----------------------------");
    console.log("Signin OTP sent");
    console.log("User ID:", user._id.toString());
    console.log("Email:", normalizedEmail);
    console.log("OTP:", otp);
    console.log("----------------------------");

    return res.status(200).json({
      success: true,
      accountStatus: "completed",
      message: "Signin OTP sent successfully",
      email: normalizedEmail,
      signinToken,
    });
  } catch (error) {
    console.error("Send signin OTP error:", error);

    return res.status(500).json({
      message: "Unable to send signin OTP",
      error: error.message,
    });
  }
};
const verifySigninOtp = async (req, res) => {
  try {
    const { signinToken, otp } = req.body || {};

    if (!signinToken) {
      return res.status(400).json({
        message: "Signin token is required",
      });
    }

    if (!otp || otp.trim().length !== 4) {
      return res.status(400).json({
        message: "Enter the 4-digit code",
      });
    }

    const decoded = jwt.verify(
      signinToken,
      process.env.JWT_SECRET
    );

    if (decoded.purpose !== "signin-otp") {
      return res.status(401).json({
        message: "Invalid signin token",
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      !user.signinOtpExpiresAt ||
      user.signinOtpExpiresAt.getTime() < Date.now()
    ) {
      return res.status(401).json({
        message: "Signin code has expired",
      });
    }

    const otpMatched = await bcrypt.compare(
      otp.trim(),
      user.signinOtpHash
    );

    if (!otpMatched) {
      return res.status(401).json({
        message: "Incorrect signin code",
      });
    }

    user.signinOtpHash = "";
    user.signinOtpExpiresAt = null;

    await user.save();

    const loginToken = jwt.sign(
      {
        userId: user._id,
        email: decoded.email,
        purpose: "login",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log("----------------------------");
    console.log("Signin OTP verified");
    console.log("User ID:", user._id.toString());
    console.log("----------------------------");

    return res.status(200).json({
      success: true,
      message: "Signin successful",
      loginToken,
    });
  } catch (error) {
    console.error("Verify signin OTP error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Signin session expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid signin token",
      });
    }

    return res.status(500).json({
      message: "Unable to verify signin code",
      error: error.message,
    });
  }
};
const checkAuth = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      success: true,
      authenticated: true,
      userId: user._id,
    });
  } catch (error) {
    console.error("Check auth error:", error);

    return res.status(500).json({
      message: "Unable to verify authentication",
      error: error.message,
    });
  }
};

module.exports = {
  startSignup,
  sendSignupLink,
  verifySignupToken,
  continueSignup,
  selectPlan,
  startWatching,
  saveProfiles,
  saveLanguage,
  saveFavoriteMovies,
  getUserProfile,
  getProfiles,
  completeOnboarding,
  getCurrentProfile,
  savePassword,
  sendSigninOtp,
  verifySigninOtp,
  checkAuth,
};