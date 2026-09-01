import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaImage,
  FaVideo,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";

import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";

import "../Styles/RecentlyAddedManagement.css";

function WorldwideManagement() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    year: "",
    duration: "",
    rating: "",
    description: "",
    order: "",
  });

  const [posterFile, setPosterFile] =
    useState(null);

  const [trailerFile, setTrailerFile] =
    useState(null);

  const [posterPreview, setPosterPreview] =
    useState("");

  const [trailerPreview, setTrailerPreview] =
    useState("");

  const [movies, setMovies] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  function handleChange(event) {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePosterChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setPosterFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setPosterPreview(previewUrl);
  }

  function handleTrailerChange(event) {
    const file =
      event.target.files?.[0];

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

    if (!posterFile) {
      setError(
        "Worldwide landscape image is required."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data =
        new FormData();

      data.append(
        "title",
        formData.title.trim()
      );

      data.append(
        "description",
        formData.description.trim() ||
          "Worldwide movie"
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
        "worldwide"
      );

      data.append(
        "order",
        formData.order || "1"
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

      const response =
        await POST(
          API_HEADER.ADMIN_MOVIES,
          data
        );

      if (
        response.success === true
      ) {
        setSuccess(
          "Movie added to Worldwide."
        );

        setMovies((previous) => [
          ...previous,
          {
            id:
              response.movie._id,

            title:
              response.movie.title,

            genre:
              response.movie.genres?.join(
                ", "
              ) ||
              formData.genre,

            order:
              response.movie.order,

            posterPreview,
          },
        ]);

        setFormData({
          title: "",
          genre: "",
          year: "",
          duration: "",
          rating: "",
          description: "",
          order: "",
        });

        setPosterFile(null);
        setTrailerFile(null);

        setPosterPreview("");
        setTrailerPreview("");
      }
    } catch (error) {
      console.error(
        "Add Worldwide movie error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to add Worldwide movie."
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
    <div className="recent-management-page">

      <div className="recent-management-top">

        <button
          type="button"
          className="recent-management-back"
          onClick={() =>
            navigate("/movies")
          }
        >
          <FaArrowLeft />

          Back to Movie Management
        </button>

        <h1>
          Worldwide Management
        </h1>

        <p>
          Manage 16:9 landscape
          cards displayed inside
          the In Worldwide row.
        </p>

      </div>

      <div className="recent-management-layout">

        <form
          className="recent-management-form"
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

          <section className="recent-management-card">

            <div className="recent-management-card-heading">

              <span>01</span>

              <div>
                <h2>
                  Movie Details
                </h2>

                <p>
                  Enter the movie
                  information for the
                  Worldwide row.
                </p>
              </div>

            </div>

            <div className="recent-management-fields">

              <div className="recent-management-field">
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

              <div className="recent-management-field">
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

              <div className="recent-management-field">
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

              <div className="recent-management-field">
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

              <div className="recent-management-field">
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

              <div className="recent-management-field">
                <label>
                  Row Order
                </label>

                <input
                  type="number"
                  name="order"
                  value={
                    formData.order
                  }
                  placeholder="1"
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="recent-management-field full-width">

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

          <section className="recent-management-card">

            <div className="recent-management-card-heading">

              <span>02</span>

              <div>
                <h2>
                  Worldwide Media
                </h2>

                <p>
                  Upload a landscape
                  16:9 image.
                </p>
              </div>

            </div>

            <div className="recent-management-media-grid">

              <div className="recent-management-upload">

                <FaImage />

                <h3>
                  Worldwide 16:9 Image
                </h3>

                <p>
                  Recommended:
                  1920 × 1080
                  landscape image.
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

              <div className="recent-management-upload">

                <FaVideo />

                <h3>
                  Trailer Video
                </h3>

                <p>
                  Optional trailer
                  for hover/info.
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
            className="recent-management-add-button"
            disabled={loading}
          >
            <FaPlus />

            {loading
              ? "Saving..."
              : "Add To Worldwide"}
          </button>

        </form>

        <aside className="recent-management-preview-card">

          <div className="recent-management-preview-heading">

            <span>
              16:9 PREVIEW
            </span>

            <h2>
              Worldwide Card
            </h2>

          </div>

          <div className="worldwide-preview-wrapper">

            {posterPreview ? (
              <img
                src={
                  posterPreview
                }
                alt="Worldwide preview"
              />
            ) : (
              <div className="worldwide-preview-placeholder">
                16:9 Movie Image
              </div>
            )}

          </div>

        </aside>

      </div>

      <section className="recent-added-list-section">

        <div className="recent-added-list-heading">

          <div>
            <span>
              CURRENT WORLDWIDE
            </span>

            <h2>
              Worldwide Movies
            </h2>
          </div>

          <strong>
            {movies.length} Movies
          </strong>

        </div>

        {movies.length === 0 ? (
          <div className="recent-empty-list">
            No Worldwide movies
            added yet.
          </div>
        ) : (
          <div className="recent-admin-movie-grid">

            {movies.map(
              (movie, index) => (
                <article
                  key={
                    movie.id
                  }
                  className="recent-admin-movie-card"
                >

                  <div className="recent-admin-movie-image">

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

                  <div className="recent-admin-movie-content">

                    <div>
                      <span className="recent-order">
                        #
                        {movie.order ||
                          index + 1}
                      </span>

                      <h3>
                        {movie.title}
                      </h3>

                      <p>
                        {movie.genre}
                      </p>
                    </div>

                    <button
                      type="button"
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

export default WorldwideManagement;