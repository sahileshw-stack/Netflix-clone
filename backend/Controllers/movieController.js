const Movie = require("../Models/Movie");

const getPublishedMovies = async (req, res) => {
  try {
    const { section } = req.query;

    const filter = {
      status: "Published",
    };

    if (section) {
      filter.section = section;
    }

    const movies = await Movie.find(filter).sort({
      order: 1,
      rank: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.error(
      "Get published movies error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load movies",
      error: error.message,
    });
  }
};

module.exports = {
  getPublishedMovies,
};