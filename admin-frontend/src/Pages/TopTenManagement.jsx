import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";

import {
  FaArrowLeft,
  FaImage,
  FaVideo,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";

import "../Styles/TopTenManagement.css";

function TopTenManagement() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    year: "",
    duration: "",
    rating: "",
    description: "",
    rank: "1",
  });

  const [posterFile, setPosterFile] =
    useState(null);

  const [trailerFile, setTrailerFile] =
    useState(null);

  const [posterPreview, setPosterPreview] =
    useState("");

  const [trailerPreview, setTrailerPreview] =
    useState("");

  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePosterChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPosterFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setPosterPreview(previewUrl);
  }

  function handleTrailerChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setTrailerFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setTrailerPreview(previewUrl);
  }
async function handleSubmit(event) {
  event.preventDefault();

  if (loading) {
    return;
  }

  if (!formData.title.trim()) {
    setError("Movie title is required.");
    return;
  }

  if (!formData.genre.trim()) {
    setError("Genre is required.");
    return;
  }

  if (!formData.year) {
    setError("Release year is required.");
    return;
  }

  if (!formData.duration.trim()) {
    setError("Duration is required.");
    return;
  }

  if (!formData.rating.trim()) {
    setError("Age rating is required.");
    return;
  }

  if (!formData.rank) {
    setError("Rank position is required.");
    return;
  }

  const rankNumber = Number(formData.rank);

  if (rankNumber < 1 || rankNumber > 10) {
    setError("Rank must be between 1 and 10.");
    return;
  }

  if (!posterFile) {
    setError("Movie card image is required.");
    return;
  }

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const data = new FormData();

    data.append(
      "title",
      formData.title.trim()
    );

    data.append(
      "description",
      formData.description.trim() ||
        "Top 10 movie"
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
      "English"
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

    data.append(
      "section",
      "top-10"
    );

    data.append(
      "rank",
      String(rankNumber)
    );

    data.append(
      "order",
      String(rankNumber)
    );

    data.append(
      "status",
      "Published"
    );

    data.append(
      "publishDate",
      new Date().toISOString()
    );

    data.append(
      "poster",
      posterFile
    );

    if (trailerFile) {
      data.append(
        "trailer",
        trailerFile
      );
    }

    const response = await POST(
      API_HEADER.ADMIN_MOVIES,
      data
    );

    if (response.success === true) {
      setSuccess(
        `Movie added at rank ${rankNumber}.`
      );

      setMovies((previous) =>
        [
          ...previous,
          {
            id: response.movie._id,

            title:
              response.movie.title,

            genre:
              response.movie.genres?.join(", ") ||
              formData.genre,

            year:
              response.movie.releaseYear,

            duration:
              response.movie.duration,

            rating:
              response.movie.ageRating,

            rank:
              response.movie.rank,

            posterPreview:
              response.movie.posterUrl,

            trailerPreview:
              response.movie.trailerUrl,
          },
        ].sort(
          (a, b) =>
            Number(a.rank) -
            Number(b.rank)
        )
      );

      setFormData({
        title: "",
        genre: "",
        year: "",
        duration: "",
        rating: "",
        description: "",
        rank: "",
      });

      setPosterFile(null);
      setTrailerFile(null);

      setPosterPreview("");
      setTrailerPreview("");
    }
  } catch (error) {
    console.error(
      "Add Top 10 movie error:",
      error.response?.data ||
        error.message
    );

    setError(
      error.response?.data?.message ||
        "Unable to add Top 10 movie."
    );
  } finally {
    setLoading(false);
  }
}
  function removeMovie(id) {
    setMovies((previous) =>
      previous.filter(
        (movie) =>
          movie.id !== id
      )
    );
  }

  return (
    <div className="topten-management-page">
      <div className="topten-management-top">
        <button
          type="button"
          className="topten-management-back"
          onClick={() =>
            navigate("/movies")
          }
        >
          <FaArrowLeft />

          Back to Movie Management
        </button>

        <h1>
          Top 10 Movies Management
        </h1>

        <p>
          Manage ranked movie cards
          displayed inside the Top 10 row.
        </p>
      </div>

      <div className="topten-management-layout">
        <form
          className="topten-management-form"
          onSubmit={handleSubmit}
        >
            {error && (
  <p className="add-movie-message add-movie-error">
    {error}
  </p>
)}

{success && (
  <p className="add-movie-message add-movie-success">
    {success}
  </p>
)}
          <section className="topten-management-card">
            <div className="topten-management-card-heading">
              <span>01</span>

              <div>
                <h2>
                  Movie Details
                </h2>

                <p>
                  Enter movie information
                  and choose its ranking.
                </p>
              </div>
            </div>

            <div className="topten-management-fields">
              <div className="topten-management-field">
                <label>
                  Movie Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={
                    formData.title
                  }
                  placeholder="Enter movie title"
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="topten-management-field">
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
                    {
                      length: 10,
                    },
                    (_, index) =>
                      index + 1
                  ).map(
                    (number) => (
                      <option
                        key={
                          number
                        }
                        value={
                          number
                        }
                      >
                        Rank{" "}
                        {number}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="topten-management-field">
                <label>
                  Genre
                </label>

                <input
                  type="text"
                  name="genre"
                  value={
                    formData.genre
                  }
                  placeholder="Action, Drama"
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="topten-management-field">
                <label>
                  Release Year
                </label>

                <input
                  type="number"
                  name="year"
                  value={
                    formData.year
                  }
                  placeholder="2026"
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="topten-management-field">
                <label>
                  Duration
                </label>

                <input
                  type="text"
                  name="duration"
                  value={
                    formData.duration
                  }
                  placeholder="2h 30m"
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="topten-management-field">
                <label>
                  Age Rating
                </label>

                <input
                  type="text"
                  name="rating"
                  value={
                    formData.rating
                  }
                  placeholder="U/A 16+"
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="topten-management-field full-width">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  rows="4"
                  placeholder="Enter movie description..."
                  onChange={
                    handleChange
                  }
                ></textarea>
              </div>
            </div>
          </section>

          <section className="topten-management-card">
            <div className="topten-management-card-heading">
              <span>02</span>

              <div>
                <h2>
                  Movie Media
                </h2>

                <p>
                  Upload the Top 10 movie
                  card image and optional
                  trailer.
                </p>
              </div>
            </div>

            <div className="topten-management-media-grid">
              <div className="topten-management-upload">
                <FaImage />

                <h3>
                  Movie Card Image
                </h3>

                <p>
                  Upload the card image
                  displayed beside the
                  ranking number.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handlePosterChange
                  }
                />

                {posterFile && (
                  <span>
                    {
                      posterFile.name
                    }
                  </span>
                )}
              </div>

              <div className="topten-management-upload">
                <FaVideo />

                <h3>
                  Trailer Video
                </h3>

                <p>
                  Optional trailer used
                  inside hover or info
                  preview.
                </p>

                <input
                  type="file"
                  accept="video/*"
                  onChange={
                    handleTrailerChange
                  }
                />

                {trailerFile && (
                  <span>
                    {
                      trailerFile.name
                    }
                  </span>
                )}
              </div>
            </div>
          </section>

          <button
  type="submit"
  className="topten-management-add-button"
  disabled={loading}
>
  <FaPlus />

  {loading
    ? "Saving..."
    : "Add To Top 10"}
</button>
        </form>

        <aside className="topten-preview-card">
          <div className="topten-preview-heading">
            <span>
              LIVE PREVIEW
            </span>

            <h2>
              Top 10 Card
            </h2>
          </div>

          <div className="topten-preview-area">
            <div className="topten-preview-item">
              <span className="topten-preview-number">
                {formData.rank ||
                  "1"}
              </span>

              <div className="topten-preview-poster">
                {posterPreview ? (
                  <img
                    src={
                      posterPreview
                    }
                    alt="Top 10 preview"
                  />
                ) : (
                  <div className="topten-poster-placeholder">
                    Movie Image
                  </div>
                )}
              </div>
            </div>

            <div className="topten-hover-preview">
              <div className="topten-hover-media">
                {trailerPreview ? (
                  <video
                    src={
                      trailerPreview
                    }
                    poster={
                      posterPreview
                    }
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : posterPreview ? (
                  <img
                    src={
                      posterPreview
                    }
                    alt="Top 10 hover"
                  />
                ) : (
                  <div>
                    Preview
                  </div>
                )}
              </div>

              <div className="topten-hover-content">
                <p>
                  <span>
                    Film |
                  </span>{" "}
                  {formData.genre ||
                    "Genre"}
                </p>

                <div className="topten-hover-meta">
                  <span>
                    {formData.year ||
                      "2026"}
                  </span>

                  <span>
                    {formData.duration ||
                      "2h 30m"}
                  </span>

                  <span className="topten-rating">
                    {formData.rating ||
                      "U/A 16+"}
                  </span>

                  <span>
                    HD
                  </span>
                </div>

                <div className="topten-hover-actions">
                  <button
                    type="button"
                  >
                    <i className="fa-solid fa-play"></i>
                  </button>

                  <button
                    type="button"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>

                  <button
                    type="button"
                  >
                    <i className="fa-regular fa-thumbs-up"></i>
                  </button>

                  <button
                    type="button"
                    className="topten-info-button"
                  >
                    <i className="fa-solid fa-circle-info"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="topten-current-section">
        <div className="topten-current-heading">
          <div>
            <span>
              CURRENT RANKING
            </span>

            <h2>
              Top 10 Movies
            </h2>
          </div>

          <strong>
            {movies.length}/10
          </strong>
        </div>

        {movies.length === 0 ? (
          <div className="topten-empty">
            No ranked movies added yet.
          </div>
        ) : (
          <div className="topten-current-grid">
            {movies.map(
              (movie) => (
                <article
                  key={
                    movie.id
                  }
                  className="topten-current-card"
                >
                  <div className="topten-current-visual">
                    <span>
                      {movie.rank}
                    </span>

                    <div>
                      {movie.posterPreview ? (
                        <img
                          src={
                            movie.posterPreview
                          }
                          alt={
                            movie.title
                          }
                        />
                      ) : (
                        <FaImage />
                      )}
                    </div>
                  </div>

                  <div className="topten-current-content">
                    <div>
                      <h3>
                        {
                          movie.title
                        }
                      </h3>

                      <p>
                        {movie.genre ||
                          "Movie"}
                      </p>
                    </div>

                    <button
                      type="button"
                      title="Remove movie"
                      onClick={() =>
                        removeMovie(
                          movie.id
                        )
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default TopTenManagement;