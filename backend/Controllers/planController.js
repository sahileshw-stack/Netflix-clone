const Plan = require("../Models/Plan");

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({
      isActive: true,
    }).sort({
      monthlyPrice: 1,
    });

    return res.status(200).json({
      message: "Plans fetched successfully",
      plans,
    });
  } catch (error) {
    console.error("Get plans error:", error);

    return res.status(500).json({
      message: "Unable to fetch plans",
      error: error.message,
    });
  }
};

module.exports = {
  getPlans,
};