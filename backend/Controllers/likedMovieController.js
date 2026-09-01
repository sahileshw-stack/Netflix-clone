const LikedMovie = require("../Models/LikedMovie");



const toggleLike = async (req, res) => {
  try {
    const {
      movieId,
      title,
      genre,
      image,
      reaction,
    } = req.body || {};

    const user = req.user;

    const allowedReactions = [
      "like",
      "love",
      "dislike",
    ];


    if (
      !movieId ||
      !title ||
      !genre ||
      !image ||
      !allowedReactions.includes(reaction)
    ) {
      return res.status(400).json({
        message: "Movie details and reaction are required",
      });
    }


    if (!user.currentProfile) {
      return res.status(400).json({
        message: "Please select a profile first",
      });
    }


    const existingReaction =
      await LikedMovie.findOne({
        userId: user._id,
        profileId: user.currentProfile,
        movieId,
      });


    // Same reaction clicked again → remove it
    if (
      existingReaction &&
      existingReaction.reaction === reaction
    ) {
      await existingReaction.deleteOne();

      return res.status(200).json({
        success: true,
        removed: true,
        reaction: "",
        movieId,
        message: "Reaction removed",
      });
    }


    // Movie already has another reaction → update it
    if (existingReaction) {
      existingReaction.reaction =
        reaction;

      existingReaction.title =
        title;

      existingReaction.genre =
        genre;

      existingReaction.image =
        image;

      await existingReaction.save();

      return res.status(200).json({
        success: true,
        removed: false,
        reaction,
        movieId,
        message: "Reaction updated",
        item: existingReaction,
      });
    }


    // No reaction yet → create one
    const reactionItem =
      await LikedMovie.create({
        userId: user._id,

        profileId:
          user.currentProfile,

        movieId,

        title,

        genre,

        image,

        reaction,
      });


    return res.status(201).json({
      success: true,
      removed: false,
      reaction,
      movieId,
      message: "Reaction saved",
      item: reactionItem,
    });

  } catch (error) {

    console.error(
      "Toggle reaction error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to update reaction",

      error:
        error.message,
    });

  }
};

const getLikedMovies = async (req, res) => {
  try {
    const user = req.user;

    if (!user.currentProfile) {
      return res.status(400).json({
        message: "Please select a profile first",
      });
    }

    const likedMovies = await LikedMovie.find({
      userId: user._id,
      profileId: user.currentProfile,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      likedMovies,
    });
  } catch (error) {
    console.error("Get liked movies error:", error);

    return res.status(500).json({
      message: "Unable to load liked movies",
      error: error.message,
    });
  }
};

const getRatingStatus = async (req, res) => {
  try {
    const user = req.user;

    if (!user.currentProfile) {
      return res.status(400).json({
        message: "Please select a profile first",
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
      feedbackCompleted:
        currentProfile.feedbackCompleted === true,
      feedbackType:
        currentProfile.feedbackType || "",
    });
  } catch (error) {
    console.error("Get rating status error:", error);

    return res.status(500).json({
      message: "Unable to load rating status",
      error: error.message,
    });
  }
};

const saveFirstRating = async (req, res) => {
  try {
    const { feedbackType } = req.body || {};

    const user = req.user;

    const allowedTypes = [
      "dislike",
      "like",
      "love",
    ];

    if (!allowedTypes.includes(feedbackType)) {
      return res.status(400).json({
        message: "Invalid feedback type",
      });
    }

    if (!user.currentProfile) {
      return res.status(400).json({
        message: "Please select a profile first",
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

    currentProfile.feedbackCompleted = true;
    currentProfile.feedbackType = feedbackType;

    await user.save();

    return res.status(200).json({
      success: true,
      feedbackCompleted: true,
      feedbackType,
      message: "Rating preference saved",
    });
  } catch (error) {
    console.error("Save first rating error:", error);

    return res.status(500).json({
      message: "Unable to save rating preference",
      error: error.message,
    });
  }
};

module.exports = {
  toggleLike,
  getLikedMovies,
  getRatingStatus,
  saveFirstRating,
};