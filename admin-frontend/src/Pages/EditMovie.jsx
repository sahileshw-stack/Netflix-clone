import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaCloudArrowUp,
  FaFloppyDisk,
} from "react-icons/fa6";

import {
  GET,
  PUT,
} from "../api/api";

import "../Styles/EditMovie.css";

import { toast } from "react-toastify";

function EditMovie() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [movie, setMovie] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    year: "",
    duration: "",
    rating: "",
    description: "",
    order: "",
    rank: "",
    playUrl: "",
  });

  /*
   * Normal sections:
   * recently-added
   * trending
   * netflix-original
   * top-10
   * worldwide
   */
  const [posterFile, setPosterFile] =
    useState(null);

  const [posterPreview, setPosterPreview] =
    useState("");

  /*
   * Home Hero only
   */
  const [titleLogoFile, setTitleLogoFile] =
    useState(null);

  const [
    titleLogoPreview,
    setTitleLogoPreview,
  ] = useState("");

  const [bannerFile, setBannerFile] =
    useState(null);

  const [bannerPreview, setBannerPreview] =
    useState("");

  /*
   * Shared optional trailer
   */
  const [trailerFile, setTrailerFile] =
    useState(null);

  const [trailerPreview, setTrailerPreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================
  // LOAD MOVIE
  // =========================================

  useEffect(() => {
    async function loadMovie() {
      try {
        setLoading(true);
        setError("");

        const response = await GET(
          `/api/admin/movies/${id}`
        );

        const loadedMovie =
          response.movie;

        setMovie(loadedMovie);

        setFormData({
          title:
            loadedMovie.title || "",

          genre:
            loadedMovie.genres?.[0] || "",

          year:
            loadedMovie.releaseYear || "",

          duration:
            loadedMovie.duration || "",

          rating:
            loadedMovie.ageRating || "",

          description:
            loadedMovie.description || "",

          order:
            loadedMovie.order ?? "",

          rank:
            loadedMovie.rank ?? "",

          playUrl:
            loadedMovie.movieUrl || "",
        });

        setPosterPreview(
          loadedMovie.posterUrl || ""
        );

        setTitleLogoPreview(
          loadedMovie.titleLogoUrl || ""
        );

        setBannerPreview(
          loadedMovie.bannerUrl || ""
        );

        setTrailerPreview(
          loadedMovie.trailerUrl || ""
        );
      } catch (error) {
        console.error(
          "Load movie error:",
          error.response?.data ||
            error.message
        );

        setError(
          error.response?.data?.message ||
            "Unable to load movie."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);


  // =========================================
  // NORMAL INPUT
  // =========================================

  function handleChange(event) {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }


  // =========================================
  // POSTER / CARD IMAGE
  // =========================================

  function handlePosterChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setPosterFile(file);

    setPosterPreview(
      URL.createObjectURL(file)
    );
  }


  // =========================================
  // HOME HERO TITLE LOGO
  // =========================================

  function handleTitleLogoChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setTitleLogoFile(file);

    setTitleLogoPreview(
      URL.createObjectURL(file)
    );
  }


  // =========================================
  // HOME HERO BANNER
  // =========================================

  function handleBannerChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setBannerFile(file);

    setBannerPreview(
      URL.createObjectURL(file)
    );
  }


  // =========================================
  // TRAILER
  // =========================================

  function handleTrailerChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setTrailerFile(file);

    setTrailerPreview(
      URL.createObjectURL(file)
    );
  }


  // =========================================
  // UPDATE
  // =========================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (!movie || saving) {
      return;
    }

    setError("");
    setSuccess("");

    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

    if (
      movie.section !== "home-hero" &&
      !formData.title.trim()
    ) {
      setError(
        "Movie title is required."
      );

      return;
    }

    if (!formData.genre.trim()) {
      setError(
        "Genre is required."
      );

      return;
    }

    if (!formData.year) {
      setError(
        "Release year is required."
      );

      return;
    }

    if (!formData.duration.trim()) {
      setError(
        "Duration is required."
      );

      return;
    }

    if (!formData.rating.trim()) {
      setError(
        "Age rating is required."
      );

      return;
    }


    // TOP 10 VALIDATION

    if (movie.section === "top-10") {
      const rankNumber =
        Number(formData.rank);

      if (
        rankNumber < 1 ||
        rankNumber > 10
      ) {
        setError(
          "Rank must be between 1 and 10."
        );

        return;
      }
    }


    try {
      setSaving(true);

      const data =
        new FormData();


      // =====================================
      // COMMON FIELDS
      // =====================================

      /*
       * Home Hero create page uses
       * "Home Hero" as internal DB title.
       */

      if (
        movie.section === "home-hero"
      ) {
        data.append(
          "title",
          movie.title || "Home Hero"
        );
      } else {
        data.append(
          "title",
          formData.title.trim()
        );
      }


      data.append(
        "description",
        formData.description.trim()
      );


      data.append(
        "releaseYear",
        formData.year
      );


      data.append(
        "duration",
        formData.duration.trim()
      );


      data.append(
        "language",
        movie.language || "English"
      );


      data.append(
        "ageRating",
        formData.rating.trim()
      );


      data.append(
        "genres",
        JSON.stringify([
          formData.genre.trim(),
        ])
      );


      /*
       * IMPORTANT:
       * Keep original section.
       */

      data.append(
        "section",
        movie.section
      );


      data.append(
        "status",
        movie.status || "Published"
      );


      // =====================================
      // HOME HERO
      // =====================================

      if (
        movie.section === "home-hero"
      ) {
        data.append(
          "order",
          "1"
        );

        if (
          formData.playUrl.trim()
        ) {
          data.append(
            "movieUrl",
            formData.playUrl.trim()
          );
        }

        if (titleLogoFile) {
          data.append(
            "titleLogo",
            titleLogoFile
          );
        }

        if (bannerFile) {
          data.append(
            "banner",
            bannerFile
          );
        }
      }


      // =====================================
      // TOP 10
      // =====================================

      else if (
        movie.section === "top-10"
      ) {
        const rankNumber =
          Number(formData.rank);

        data.append(
          "rank",
          String(rankNumber)
        );

        data.append(
          "order",
          String(rankNumber)
        );

        if (posterFile) {
          data.append(
            "poster",
            posterFile
          );
        }
      }


      // =====================================
      // OTHER ROWS
      // =====================================

      else {
        data.append(
          "order",
          formData.order || "1"
        );

        if (posterFile) {
          data.append(
            "poster",
            posterFile
          );
        }
      }


      // =====================================
      // OPTIONAL TRAILER
      // =====================================

      if (trailerFile) {
        data.append(
          "trailer",
          trailerFile
        );
      }


      // =====================================
      // PUT REQUEST
      // =====================================

      const response = await PUT(
        `/api/admin/movies/${id}`,
        data
      );


      if (response.success) {
        toast.success(
  "Movie updated successfully!"
);

        setMovie(response.movie);

        setPosterFile(null);
        setTitleLogoFile(null);
        setBannerFile(null);
        setTrailerFile(null);

        /*
         * Update previews using returned
         * MongoDB movie URLs.
         */

        if (response.movie) {
          setPosterPreview(
            response.movie.posterUrl ||
              posterPreview
          );

          setTitleLogoPreview(
            response.movie.titleLogoUrl ||
              titleLogoPreview
          );

          setBannerPreview(
            response.movie.bannerUrl ||
              bannerPreview
          );

          setTrailerPreview(
            response.movie.trailerUrl ||
              trailerPreview
          );
        }
      }
    } catch (error) {
      console.error(
        "Update movie error:",
        error.response?.data ||
          error.message
      );

      toast.error(
  error.response?.data?.message ||
    "Unable to update movie."
);
    } finally {
      setSaving(false);
    }
  }


  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="edit-movie-page">
        <p>Loading movie...</p>
      </div>
    );
  }


  if (!movie) {
    return (
      <div className="edit-movie-page">
        <p>
          {error || "Movie not found."}
        </p>
      </div>
    );
  }


  // =========================================
  // SECTION NAME
  // =========================================

  const sectionNames = {
    "home-hero":
      "Home Hero",

    "recently-added":
      "Recently Added",

    trending:
      "Trending Now",

    "netflix-original":
      "Only on Netflix",

    "top-10":
      "Top 10",

    worldwide:
      "Worldwide",
  };


  const sectionTitle =
    sectionNames[movie.section] ||
    movie.section;


  // =========================================
  // JSX
  // =========================================

  return (
    <div className="edit-movie-page">

      <div className="edit-movie-top">

        <div>
          <button
            type="button"
            className="edit-movie-back"
            onClick={() =>
              navigate(-1)
            }
          >
            <FaArrowLeft />

            Back to Movies
          </button>


          <h1>
            Edit {sectionTitle}
          </h1>


          <p>
            Update this movie's
            information and media.
          </p>
        </div>


        <div className="edit-movie-actions">

          <button
            type="button"
            className="edit-movie-cancel"
            onClick={() =>
              navigate(-1)
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            form="editMovieForm"
            className="edit-movie-save"
            disabled={saving}
          >
            <FaFloppyDisk />

            {saving
              ? "Updating..."
              : "Update Movie"}
          </button>

        </div>

      </div>


      <form
        id="editMovieForm"
        onSubmit={handleSubmit}
        className="edit-movie-form"
      >

        {error && (
          <p className="edit-movie-error">
            {error}
          </p>
        )}


        {success && (
          <p className="edit-movie-success">
            {success}
          </p>
        )}


        {/* =================================
            01 DETAILS
        ================================= */}

        <section className="edit-movie-card">

          <div className="edit-movie-card-heading">

            <span>01</span>

            <div>
              <h2>
                {movie.section ===
                "home-hero"
                  ? "Hero Details"
                  : "Movie Details"}
              </h2>

              <p>
                Update the information
                for this section.
              </p>
            </div>

          </div>


          <div className="edit-movie-fields">


            {/* NORMAL MOVIE TITLE */}

            {movie.section !==
              "home-hero" && (
              <div className="edit-movie-field">

                <label>
                  Movie Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>
            )}


            {/* TOP 10 RANK */}

            {movie.section ===
              "top-10" && (
              <div className="edit-movie-field">

                <label>
                  Rank Position
                </label>

                <select
                  name="rank"
                  value={
                    formData.rank
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="">
                    Select rank
                  </option>

                  {Array.from(
                    { length: 10 },
                    (_, index) =>
                      index + 1
                  ).map((number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      Rank {number}
                    </option>
                  ))}
                </select>

              </div>
            )}


            <div className="edit-movie-field">

              <label>Genre</label>

              <input
                type="text"
                name="genre"
                value={
                  formData.genre
                }
                onChange={
                  handleChange
                }
              />

            </div>


            <div className="edit-movie-field">

              <label>
                Release Year
              </label>

              <input
                type="number"
                name="year"
                value={
                  formData.year
                }
                onChange={
                  handleChange
                }
              />

            </div>


            <div className="edit-movie-field">

              <label>
                Duration
              </label>

              <input
                type="text"
                name="duration"
                value={
                  formData.duration
                }
                onChange={
                  handleChange
                }
              />

            </div>


            <div className="edit-movie-field">

              <label>
                Age Rating
              </label>

              <input
                type="text"
                name="rating"
                value={
                  formData.rating
                }
                onChange={
                  handleChange
                }
              />

            </div>


            {/* ORDER */}

            {movie.section !==
              "home-hero" &&
              movie.section !==
                "top-10" && (
                <div className="edit-movie-field">

                  <label>
                    Row Order
                  </label>

                  <input
                    type="number"
                    name="order"
                    value={
                      formData.order
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>
              )}


            {/* HOME HERO PLAY URL */}

            {movie.section ===
              "home-hero" && (
              <div className="edit-movie-field full-width">

                <label>
                  Play URL
                </label>

                <input
                  type="text"
                  name="playUrl"
                  value={
                    formData.playUrl
                  }
                  placeholder="https://..."
                  onChange={
                    handleChange
                  }
                />

              </div>
            )}


            <div className="edit-movie-field full-width">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                rows="5"
                onChange={
                  handleChange
                }
              />

            </div>

          </div>

        </section>


        {/* =================================
            02 MEDIA
        ================================= */}

        <section className="edit-movie-card">

          <div className="edit-movie-card-heading">

            <span>02</span>

            <div>
              <h2>
                {movie.section ===
                "home-hero"
                  ? "Hero Media"
                  : "Movie Media"}
              </h2>

              <p>
                Leave a file unchanged
                if you don't want to
                replace it.
              </p>
            </div>

          </div>


          <div className="edit-media-grid">


            {/* =============================
                HOME HERO
            ============================= */}

            {movie.section ===
              "home-hero" && (
              <>

                <label className="edit-upload-box">

                  <FaCloudArrowUp />

                  <strong>
                    Movie Title PNG
                  </strong>

                  <span>
                    Replace title logo
                  </span>

                  {titleLogoPreview && (
                    <img
                      src={
                        titleLogoPreview
                      }
                      alt="Title logo"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/png,image/webp,image/jpeg"
                    hidden
                    onChange={
                      handleTitleLogoChange
                    }
                  />

                </label>


                <label className="edit-upload-box">

                  <FaCloudArrowUp />

                  <strong>
                    Hero Banner
                  </strong>

                  <span>
                    Replace hero banner
                  </span>

                  {bannerPreview && (
                    <img
                      src={
                        bannerPreview
                      }
                      alt="Hero banner"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={
                      handleBannerChange
                    }
                  />

                </label>

              </>
            )}


            {/* =============================
                NORMAL POSTER
            ============================= */}

            {movie.section !==
              "home-hero" && (
              <label className="edit-upload-box">

                <FaCloudArrowUp />

                <strong>
                  {movie.section ===
                  "worldwide"
                    ? "Worldwide Landscape Image"
                    : "Movie Card Image"}
                </strong>

                <span>
                  {movie.section ===
                  "worldwide"
                    ? "Replace 16:9 landscape image"
                    : "Replace movie image"}
                </span>

                {posterPreview && (
                  <img
                    src={posterPreview}
                    alt={formData.title}
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={
                    handlePosterChange
                  }
                />

              </label>
            )}


            {/* =============================
                TRAILER
            ============================= */}

            <label className="edit-upload-box">

              <FaCloudArrowUp />

              <strong>
                Trailer
              </strong>

              <span>
                Replace trailer
              </span>

              {trailerPreview && (
                <video
                  src={trailerPreview}
                  muted
                  controls
                />
              )}

              <input
                type="file"
                accept="video/*"
                hidden
                onChange={
                  handleTrailerChange
                }
              />

            </label>

          </div>

        </section>

      </form>

    </div>
  );
}

export default EditMovie;