const mongoose = require("mongoose");


const likedMovieSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      profileId: {
        type:
          mongoose.Schema.Types.ObjectId,
        required: true,
      },

      movieId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      genre: {
        type: String,
        required: true,
      },

      image: {
        type: String,
        required: true,
      },

      reaction: {
        type: String,

        enum: [
          "like",
          "love",
          "dislike",
        ],

        required: true,
      },
    },
    {
      timestamps: true,
    }
  );


likedMovieSchema.index(
  {
    userId: 1,
    profileId: 1,
    movieId: 1,
  },
  {
    unique: true,
  }
);


module.exports =
  mongoose.model(
    "LikedMovie",
    likedMovieSchema
  );