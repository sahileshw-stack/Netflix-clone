const MyList = require("../Models/MyList");

const addToMyList = async (req, res) => {
  try {
    const {
      movieId,
      title,
      genre,
      image,
    } = req.body || {};

    const user = req.user;

    if (
      movieId === undefined ||
      movieId === null ||
      !title ||
      !genre ||
      !image
    ) {
      return res.status(400).json({
        message: "Movie details are required",
      });
    }

    if (!user.currentProfile) {
      return res.status(400).json({
        message: "Please select a profile first",
      });
    }

    const normalizedTitle =
      title.trim().toLowerCase();

    const alreadyAdded =
      await MyList.findOne({
        userId: user._id,
        profileId: user.currentProfile,
        normalizedTitle,
      });

    if (alreadyAdded) {
      return res.status(200).json({
        success: true,
        alreadyAdded: true,
        message: "Movie is already in My List",
        item: alreadyAdded,
      });
    }

    const listItem = await MyList.create({
      userId: user._id,

      profileId:
        user.currentProfile,

      movieId,

      title,

      normalizedTitle,

      genre,

      image,
    });

    console.log("----------------------------");
    console.log("Movie added to My List");
    console.log("User ID:", user._id.toString());
    console.log(
      "Profile ID:",
      user.currentProfile.toString()
    );
    console.log("Movie:", title);
    console.log("----------------------------");

    return res.status(201).json({
      success: true,
      alreadyAdded: false,
      message: "Movie added to My List",
      item: listItem,
    });
  } catch (error) {
    console.error("Add to My List error:", error);

    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        alreadyAdded: true,
        message: "Movie is already in My List",
      });
    }

    return res.status(500).json({
      message: "Unable to add movie to My List",
      error: error.message,
    });
  }
};
const getMyList = async (req, res) => {
  try {
    const user = req.user;

    if (!user.currentProfile) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a profile first",
      });
    }

    const items =
      await MyList.find({
        userId: user._id,
        profileId:
          user.currentProfile,
      })
        .populate("movieId")
        .sort({
          createdAt: -1,
        });

    console.log(
      "MY LIST ITEMS FOUND:",
      items.length
    );

    return res.status(200).json({
      success: true,
      myList: items,
    });

  } catch (error) {
    console.error(
      "Get My List error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to get My List",
      error: error.message,
    });
  }
};
const removeFromMyList = async (req, res) => {
  try {
    const { movieId } = req.body || {};

    const user = req.user;

    if (
      movieId === undefined ||
      movieId === null
    ) {
      return res.status(400).json({
        message: "Movie ID is required",
      });
    }

    if (!user.currentProfile) {
      return res.status(400).json({
        message: "Please select a profile first",
      });
    }

    const removedMovie =
      await MyList.findOneAndDelete({
        userId: user._id,
        profileId: user.currentProfile,
        movieId,
      });

    if (!removedMovie) {
      return res.status(404).json({
        message: "Movie was not found in My List",
      });
    }

    console.log("----------------------------");
    console.log("Movie removed from My List");
    console.log("Movie:", removedMovie.title);
    console.log("Movie ID:", removedMovie.movieId);
    console.log("----------------------------");

    return res.status(200).json({
      success: true,
      message: "Movie removed from My List",
      movieId: removedMovie.movieId,
    });
  } catch (error) {
    console.error(
      "Remove from My List error:",
      error
    );

    return res.status(500).json({
      message: "Unable to remove movie from My List",
      error: error.message,
    });
  }
};

module.exports = {
  addToMyList,
  getMyList,
  removeFromMyList,
};