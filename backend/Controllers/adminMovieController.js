const Movie = require("../Models/Movie");

const addMovie = async (req, res) => {
  try {
    const {
      title,
      originalTitle,
      description,
      releaseYear,
      duration,
      language,
      ageRating,

      director,
      creator,

      thumbnailUrl,
      movieUrl,

      section,
      order,
      rank,

      status,
      publishDate,
    } = req.body || {};

    /*
      =========================
      VALIDATION
      =========================
    */

    if (
      !title ||
      !description ||
      !releaseYear ||
      !duration ||
      !language ||
      !ageRating
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, release year, duration, language and age rating are required.",
      });
    }

    if (!section) {
      return res.status(400).json({
        success: false,
        message: "Movie section is required",
      });
    }

    /*
      =========================
      PARSE GENRES
      =========================
    */

    let genres = [];

    if (req.body.genres) {
      try {
        genres = JSON.parse(
          req.body.genres
        );
      } catch (error) {
        genres = [
          req.body.genres,
        ];
      }
    }

    if (!Array.isArray(genres)) {
      genres = [];
    }

    genres = genres
      .map((genre) =>
        String(genre).trim()
      )
      .filter(Boolean);

    /*
      =========================
      PARSE CAST
      =========================
    */

    let cast = [];

    if (req.body.cast) {
      try {
        cast = JSON.parse(
          req.body.cast
        );
      } catch (error) {
        cast = [
          req.body.cast,
        ];
      }
    }

    if (!Array.isArray(cast)) {
      cast = [];
    }

    cast = cast
      .map((person) =>
        String(person).trim()
      )
      .filter(Boolean);

    /*
      =========================
      PARSE DISPLAY OPTIONS
      =========================
    */

    let displayOptions = {};

    if (req.body.displayOptions) {
      try {
        displayOptions =
          typeof req.body.displayOptions ===
          "string"
            ? JSON.parse(
                req.body.displayOptions
              )
            : req.body.displayOptions;
      } catch (error) {
        displayOptions = {};
      }
    }

    /*
      =========================
      MULTER FILES
      =========================
    */

    const posterFile =
      req.files?.poster?.[0];

    const trailerFile =
      req.files?.trailer?.[0];

    const bannerFile =
      req.files?.banner?.[0];

    const titleLogoFile =
      req.files?.titleLogo?.[0];

    /*
      =========================
      FILE URLS
      =========================
    */

    const posterUrl = posterFile
      ? `/uploads/movies/${posterFile.filename}`
      : "";

    const trailerUrl = trailerFile
      ? `/uploads/movies/${trailerFile.filename}`
      : "";

    const bannerUrl = bannerFile
      ? `/uploads/movies/${bannerFile.filename}`
      : "";

    const titleLogoUrl =
      titleLogoFile
        ? `/uploads/movies/${titleLogoFile.filename}`
        : "";

    /*
      =========================
      CREATE MOVIE
      =========================
    */

    const movie =
      await Movie.create({
        title:
          title.trim(),

        originalTitle:
          originalTitle?.trim() ||
          "",

        description:
          description.trim(),

        releaseYear:
          Number(releaseYear),

        duration:
          duration.trim(),

        language:
          language.trim(),

        ageRating:
          ageRating.trim(),

        genres,

        director:
          director?.trim() || "",

        creator:
          creator?.trim() || "",

        cast,

        posterUrl,

        bannerUrl,

        thumbnailUrl:
          thumbnailUrl?.trim() ||
          "",

        trailerUrl,

        movieUrl:
          movieUrl?.trim() || "",

        titleLogoUrl,

        section,

        order:
          Number(order) || 1,

        rank:
          rank &&
          Number(rank) > 0
            ? Number(rank)
            : null,

        displayOptions: {
          top10:
            displayOptions?.top10 ===
            true,

          trending:
            displayOptions
              ?.trending === true,

          recentlyAdded:
            displayOptions
              ?.recentlyAdded === true,

          recommended:
            displayOptions
              ?.recommended === true,

          netflixOriginal:
            displayOptions
              ?.netflixOriginal ===
            true,

          featuredBanner:
            displayOptions
              ?.featuredBanner ===
            true,
        },

        status:
          status ||
          "Draft",

        publishDate:
          publishDate
            ? new Date(
                publishDate
              )
            : null,

        createdBy:
          req.admin._id,
      });

    /*
      =========================
      RESPONSE
      =========================
    */

    return res
      .status(201)
      .json({
        success: true,
        message:
          "Movie added successfully",
        movie,
      });
  } catch (error) {
    console.error(
      "Add movie error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Unable to add movie",
        error:
          error.message,
      });
  }
};
const getDashboardStats = async (req, res) => {
  try {
    const totalMovies =
      await Movie.countDocuments();

    const homeHero =
      await Movie.countDocuments({
        section: "home-hero",
      });

    const recentlyAdded =
      await Movie.countDocuments({
        section: "recently-added",
      });

    const trending =
      await Movie.countDocuments({
        section: "trending",
      });

    const netflixOriginal =
      await Movie.countDocuments({
        section: "netflix-original",
      });

    const topTen =
      await Movie.countDocuments({
        section: "top-10",
      });

    const worldwide =
      await Movie.countDocuments({
        section: "worldwide",
      });

    const recentMovies =
      await Movie.find()
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select(
          "title section createdAt updatedAt"
        );

    return res.status(200).json({
      success: true,

      totalMovies,

      sections: {
        homeHero,
        recentlyAdded,
        trending,
        netflixOriginal,
        topTen,
        worldwide,
      },

      recentMovies,
    });
  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load dashboard stats",
    });
  }
};
const getMoviesBySection = async (req, res) => {
  try {
    const { section } = req.params;

    const allowedSections = [
      "home-hero",
      "recently-added",
      "trending",
      "netflix-original",
      "top-10",
      "worldwide",
    ];

    if (!allowedSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie section",
      });
    }

    let sortOption = {
      order: 1,
      createdAt: -1,
    };

    // Top 10 should follow rank
    if (section === "top-10") {
      sortOption = {
        rank: 1,
        createdAt: -1,
      };
    }

    const movies = await Movie.find({
      section,
    }).sort(sortOption);

    return res.status(200).json({
      success: true,
      section,
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.error(
      "Get section movies error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load section movies",
      error: error.message,
    });
  }
};
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie =
      await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    await Movie.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete movie error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete movie",
      error: error.message,
    });
  }
};
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    return res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error(
      "Get movie by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load movie",
      error: error.message,
    });
  }
};
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const {
      title,
      originalTitle,
      description,
      releaseYear,
      duration,
      language,
      ageRating,
      director,
      creator,
      status,
      publishDate,
      genres,
      cast,
      displayOptions,
    } = req.body || {};

    movie.title = title ?? movie.title;
    movie.originalTitle =
      originalTitle ?? movie.originalTitle;
    movie.description =
      description ?? movie.description;
    movie.releaseYear =
      releaseYear
        ? Number(releaseYear)
        : movie.releaseYear;
    movie.duration =
      duration ?? movie.duration;
    movie.language =
      language ?? movie.language;
    movie.ageRating =
      ageRating ?? movie.ageRating;
    movie.director =
      director ?? movie.director;
    movie.creator =
      creator ?? movie.creator;
    movie.status =
      status ?? movie.status;
    movie.publishDate =
      publishDate
        ? new Date(publishDate)
        : movie.publishDate;

    if (Array.isArray(genres)) {
      movie.genres = genres;
    }

    if (Array.isArray(cast)) {
      movie.cast = cast;
    }

    if (displayOptions) {
      movie.displayOptions = {
        ...movie.displayOptions,
        ...displayOptions,
      };
    }

    await movie.save();

    return res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    console.error(
      "Update movie error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update movie",
      error: error.message,
    });
  }
};
module.exports = {
  addMovie,
  getDashboardStats,
  getMoviesBySection,
  getMovieById,
  updateMovie,
  deleteMovie,
};