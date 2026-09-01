const User = require("../Models/User");

const getUserStats = async (req, res) => {
  try {
    /*
      =========================
      TOTAL USERS
      =========================
    */

    const totalUsers =
      await User.countDocuments();


    /*
      =========================
      CURRENT DATE
      =========================
    */

    const now = new Date();

    const currentMonthStart =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    const nextMonthStart =
      new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );

    const previousMonthStart =
      new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );


    /*
      =========================
      THIS MONTH SIGNUPS
      =========================
    */

    const thisMonthUsers =
      await User.countDocuments({
        createdAt: {
          $gte: currentMonthStart,
          $lt: nextMonthStart,
        },
      });


    /*
      =========================
      PREVIOUS MONTH SIGNUPS
      =========================
    */

    const previousMonthUsers =
      await User.countDocuments({
        createdAt: {
          $gte: previousMonthStart,
          $lt: currentMonthStart,
        },
      });


    /*
      =========================
      MONTHLY % CHANGE
      =========================
    */

    let monthlyPercentage = 0;

    let monthlyTrend = "same";

    if (previousMonthUsers === 0) {

      if (thisMonthUsers > 0) {
        /*
          We cannot calculate a normal
          percentage increase from zero.
        */

        monthlyPercentage = 100;
        monthlyTrend = "increase";
      }

    } else {

      monthlyPercentage =
        (
          (
            thisMonthUsers -
            previousMonthUsers
          ) /
          previousMonthUsers
        ) * 100;


      if (monthlyPercentage > 0) {
        monthlyTrend = "increase";
      }

      else if (
        monthlyPercentage < 0
      ) {
        monthlyTrend = "decrease";
      }

      else {
        monthlyTrend = "same";
      }
    }


    /*
      Round:
      33.333333 → 33.3
    */

    monthlyPercentage =
      Number(
        monthlyPercentage.toFixed(1)
      );


    /*
      =========================
      USERS GROUPED BY MONTH
      =========================
    */

    const monthlySignups =
      await User.aggregate([
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            newUsers: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);


    /*
      =========================
      CUMULATIVE USERS
      =========================
    */

    let runningTotal = 0;

    const monthlyUsers =
      monthlySignups.map(
        (item) => {

          runningTotal +=
            item.newUsers;

          return {
            year:
              item._id.year,

            month:
              item._id.month,

            newUsers:
              item.newUsers,

            totalUsers:
              runningTotal,
          };
        }
      );


    /*
      =========================
      RESPONSE
      =========================
    */

    return res.status(200).json({
      success: true,

      totalUsers,

      thisMonthUsers,

      previousMonthUsers,

      monthlyPercentage,

      monthlyTrend,

      monthlyUsers,
    });

  } catch (error) {

    console.error(
      "Get user stats error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to load user statistics",

      error:
        error.message,
    });
  }
};


module.exports = {
  getUserStats,
};