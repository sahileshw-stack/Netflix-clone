import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";

import {
    FaArrowLeft,
    FaImage,
    FaVideo,
    FaFloppyDisk,
    FaPlus,
    FaTrash,
} from "react-icons/fa6";

import "../Styles/RecentlyAddedManagement.css";

function RecentlyAddedManagement() {
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
        "Recently added movie"
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
      "recently-added"
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

    const response = await POST(
      API_HEADER.ADMIN_MOVIES,
      data
    );

    if (response.success === true) {
      setSuccess(
        "Movie added to Recently Added."
      );

      setMovies((previous) => [
        ...previous,
        {
          id: response.movie._id,
          title: response.movie.title,
          genre:
            response.movie.genres?.join(", ") ||
            formData.genre,
          year:
            response.movie.releaseYear,
          duration:
            response.movie.duration,
          rating:
            response.movie.ageRating,
          order:
            response.movie.order,
          posterPreview:
            response.movie.posterUrl,
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
      "Add Recently Added movie error:",
      error.response?.data ||
        error.message
    );

    setError(
      error.response?.data?.message ||
        "Unable to add movie."
    );
  } finally {
    setLoading(false);
  }
}
    function removeMovie(id) {
        setMovies((previous) =>
            previous.filter(
                (movie) => movie.id !== id
            )
        );
    }

    return (
        <div className="recent-management-page">
            <div className="recent-management-top">
                <div>
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
                        Recently Added Management
                    </h1>

                    <p>
                        Manage movie cards displayed
                        inside the Recently Added row.
                    </p>
                </div>
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
                                    Enter the information
                                    shown inside the movie
                                    card and info modal.
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
                                    Movie Media
                                </h2>

                                <p>
                                    Upload the card image and
                                    optional trailer preview.
                                </p>
                            </div>
                        </div>

                        <div className="recent-management-media-grid">
                            <div className="recent-management-upload">
                                <FaImage />

                                <h3>
                                    Movie Card Image
                                </h3>

                                <p>
                                    Upload the horizontal image
                                    shown in the movie row.
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
                                        {posterFile.name}
                                    </span>
                                )}
                            </div>

                            <div className="recent-management-upload">
                                <FaVideo />

                                <h3>
                                    Trailer Video
                                </h3>

                                <p>
                                    Optional trailer used for
                                    hover or info preview.
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
                                        {trailerFile.name}
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
                            : "Add To Recently Added"}
                    </button>
                </form>

                <aside className="recent-management-preview-card">
                    <div className="recent-management-preview-heading">
                        <span>
                            LIVE PREVIEW
                        </span>

                        <h2>
                            Recently Added Card
                        </h2>
                    </div>

                    <div className="recent-card-preview">
                        {posterPreview ? (
                            <img
                                src={
                                    posterPreview
                                }
                                alt="Movie preview"
                            />
                        ) : (
                            <div className="recent-card-placeholder">
                                Movie Card Image
                            </div>
                        )}

                        <div className="recent-card-hover-preview">
                            <div className="recent-card-preview-media">
                                {trailerPreview ? (
                                    <video
                                        src={
                                            trailerPreview
                                        }
                                        poster={
                                            posterPreview
                                        }
                                        muted
                                        loop
                                        autoPlay
                                        playsInline
                                    />
                                ) : posterPreview ? (
                                    <img
                                        src={
                                            posterPreview
                                        }
                                        alt="Preview"
                                    />
                                ) : (
                                    <div>
                                        Preview
                                    </div>
                                )}
                            </div>

                            <div className="recent-card-preview-content">
                                <p>
                                    <span>Film |</span>{" "}
                                    {formData.genre ||
                                        "Genre"}
                                </p>

                                <div className="recent-card-preview-meta">
                                    <span>
                                        {formData.year ||
                                            "2026"}
                                    </span>

                                    <span>
                                        {formData.duration ||
                                            "2h 30m"}
                                    </span>

                                    <span className="recent-card-rating">
                                        {formData.rating ||
                                            "U/A 16+"}
                                    </span>

                                    <span>
                                        HD
                                    </span>
                                </div>

                                <div className="recent-card-preview-actions">
                                    <button type="button">
                                        <i className="fa-solid fa-play"></i>
                                    </button>

                                    <button type="button">
                                        <i className="fa-solid fa-plus"></i>
                                    </button>

                                    <button type="button">
                                        <i className="fa-regular fa-thumbs-up"></i>
                                    </button>

                                    <button
                                        type="button"
                                        className="recent-info-button"
                                    >
                                        <i className="fa-solid fa-circle-info"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <section className="recent-added-list-section">
                <div className="recent-added-list-heading">
                    <div>
                        <span>
                            CURRENT ROW
                        </span>

                        <h2>
                            Recently Added Movies
                        </h2>
                    </div>

                    <strong>
                        {movies.length} Movies
                    </strong>
                </div>

                {movies.length === 0 ? (
                    <div className="recent-empty-list">
                        No movies added yet.
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

export default RecentlyAddedManagement;