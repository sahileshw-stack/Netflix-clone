const LikedMovie = require(
  "../Models/LikedMovie"
);

const User = require(
  "../Models/User"
);

const {
  decryptEmail,
} = require(
  "../Utils/emailCrypto"
);


const getAdminReactions =
  async (req, res) => {

    try {

      /*
      =========================
      GET ALL REACTIONS
      =========================
      */

      const items =
        await LikedMovie.find({})
          .populate("movieId")
          .sort({
            createdAt: -1,
          });


      const reactions = [];


      /*
      =========================
      BUILD ADMIN DATA
      =========================
      */

      for (const item of items) {

        const user =
          await User.findById(
            item.userId
          );


        if (!user) {
          continue;
        }


        const profile =
          user.profiles?.find(
            (profile) =>
              String(profile._id) ===
              String(item.profileId)
          );


        reactions.push({

          _id:
            item._id,

          userId:
            user._id,

          userName:
            user.profiles?.[0]
              ?.name ||
            "User",

          email:
            user.email
              ? decryptEmail(
                  user.email
                )
              : "",

          profileId:
            item.profileId,

          profileName:
            profile?.name ||
            "Profile",

          movieId:
            item.movieId?._id ||
            item.movieId,

          movieTitle:
            item.title,

          genre:
            item.genre,

          image:
            item.image,

          reaction:
            item.reaction,

          reactedDate:
            item.createdAt,

        });

      }


      /*
      =========================
      TOTAL REACTIONS
      =========================
      */

      const totalReactions =
        reactions.length;


      /*
      =========================
      TOTAL LIKES
      =========================
      */

      const totalLikes =
        reactions.filter(
          (item) =>
            item.reaction ===
            "like"
        ).length;


      /*
      =========================
      TOTAL LOVES
      =========================
      */

      const totalLoves =
        reactions.filter(
          (item) =>
            item.reaction ===
            "love"
        ).length;


      /*
      =========================
      TOTAL DISLIKES
      =========================
      */

      const totalDislikes =
        reactions.filter(
          (item) =>
            item.reaction ===
            "dislike"
        ).length;


      /*
      =========================
      MONTH DATES
      =========================
      */

      const now =
        new Date();


      const startOfThisMonth =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );


      const startOfNextMonth =
        new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          1
        );


      const startOfLastMonth =
        new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );


      /*
      =========================
      THIS MONTH COUNT
      =========================
      */

      const thisMonthCount =
        reactions.filter(
          (item) => {

            const date =
              new Date(
                item.reactedDate
              );


            return (
              date >=
                startOfThisMonth &&

              date <
                startOfNextMonth
            );

          }
        ).length;


      /*
      =========================
      LAST MONTH COUNT
      =========================
      */

      const lastMonthCount =
        reactions.filter(
          (item) => {

            const date =
              new Date(
                item.reactedDate
              );


            return (
              date >=
                startOfLastMonth &&

              date <
                startOfThisMonth
            );

          }
        ).length;


      /*
      =========================
      MONTHLY PERCENTAGE
      =========================
      */

      let percentage = 0;

      let trend = "normal";


      if (
        lastMonthCount === 0 &&
        thisMonthCount > 0
      ) {

        percentage = 100;

        trend = "increase";

      }

      else if (
        lastMonthCount === 0 &&
        thisMonthCount === 0
      ) {

        percentage = 0;

        trend = "normal";

      }

      else {

        const change =
          (
            (
              thisMonthCount -
              lastMonthCount
            ) /
            lastMonthCount
          ) * 100;


        percentage =
          Math.abs(
            Math.round(
              change
            )
          );


        if (change > 0) {

          trend =
            "increase";

        }

        else if (change < 0) {

          trend =
            "decrease";

        }

        else {

          trend =
            "normal";

        }

      }


      /*
      =========================
      RESPONSE
      =========================
      */

      return res
        .status(200)
        .json({

          success: true,

          totalReactions,

          totalLikes,

          totalLoves,

          totalDislikes,

          thisMonthCount,

          lastMonthCount,

          percentage,

          trend,

          reactions,

        });


    } catch (error) {

      console.error(
        "Admin reactions error:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to load reactions",

          error:
            error.message,

        });

    }

  };

  const deleteAdminReaction = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    const reaction =
      await LikedMovie.findById(
        id
      );


    if (!reaction) {

      return res.status(404).json({
        success: false,
        message:
          "Reaction not found",
      });

    }


    await LikedMovie.findByIdAndDelete(
      id
    );


    return res.status(200).json({

      success: true,

      message:
        "Reaction removed successfully",

      id,

      reaction:
        reaction.reaction,

    });


  } catch (error) {

    console.error(
      "Delete reaction error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to remove reaction",

      error:
        error.message,

    });

  }

};


module.exports = {
  getAdminReactions,
  deleteAdminReaction,
};