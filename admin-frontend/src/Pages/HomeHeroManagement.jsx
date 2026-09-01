import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";

import {
  FaArrowLeft,
  FaImage,
  FaVideo,
  FaFloppyDisk,
} from "react-icons/fa6";

import "../Styles/HomeHeroManagement.css";

function HomeHeroManagement() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    genre: "",
    year: "",
    duration: "",
    rating: "",
    description: "",
    playUrl: "",
  });

  const [titleLogoFile, setTitleLogoFile] =
    useState(null);

  const [bannerFile, setBannerFile] =
    useState(null);

  const [trailerFile, setTrailerFile] =
    useState(null);

  const [titleLogoPreview, setTitleLogoPreview] =
    useState("");

  const [bannerPreview, setBannerPreview] =
    useState("");

  const [trailerPreview, setTrailerPreview] =
    useState("");

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

  function handleTitleLogoChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setTitleLogoFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setTitleLogoPreview(previewUrl);
  }

  function handleBannerChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setBannerFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setBannerPreview(previewUrl);
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

  if (!formData.description.trim()) {
    setError("Description is required.");
    return;
  }

  if (!titleLogoFile) {
    setError("Movie title PNG is required.");
    return;
  }

  if (!bannerFile) {
    setError("Hero banner image is required.");
    return;
  }

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const data = new FormData();

    // We still need a title field because
    // your Movie schema requires title.
    // For now use a simple internal title.
    data.append(
      "title",
      "Home Hero"
    );

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
      "home-hero"
    );

    data.append(
      "order",
      "1"
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
      "titleLogo",
      titleLogoFile
    );

    data.append(
      "banner",
      bannerFile
    );

    if (trailerFile) {
      data.append(
        "trailer",
        trailerFile
      );
    }

    if (formData.playUrl.trim()) {
      data.append(
        "movieUrl",
        formData.playUrl.trim()
      );
    }

    const response = await POST(
      API_HEADER.ADMIN_MOVIES,
      data
    );

    if (response.success === true) {
      setSuccess(
        "Home Hero saved successfully."
      );
    }
  } catch (error) {
    console.error(
      "Save Home Hero error:",
      error.response?.data ||
        error.message
    );

    setError(
      error.response?.data?.message ||
        "Unable to save Home Hero."
    );
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="hero-management-page">
      <div className="hero-management-top">
        <div>
          <button
            type="button"
            className="hero-management-back"
            onClick={() =>
              navigate("/movies")
            }
          >
            <FaArrowLeft />

            Back to Movie Management
          </button>

          <h1>
            Home Hero Management
          </h1>

          <p>
            Manage the large featured
            movie shown at the top of
            the user home page.
          </p>
        </div>
<button
  type="submit"
  form="heroManagementForm"
  className="hero-management-save"
  disabled={loading}
>
  <FaFloppyDisk />

  {loading
    ? "Saving..."
    : "Save Hero"}
</button>
      </div>

      <div className="hero-management-grid">
        <form
          id="heroManagementForm"
          className="hero-management-form"
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
          {/* HERO DETAILS */}

          <section className="hero-management-card">
            <div className="hero-management-card-heading">
              <span>01</span>

              <div>
                <h2>
                  Hero Details
                </h2>

                <p>
                  Enter the information
                  displayed over the
                  hero banner.
                </p>
              </div>
            </div>

            <div className="hero-management-fields two-column">
              <div className="hero-management-field">
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

              <div className="hero-management-field">
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

              <div className="hero-management-field">
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

              <div className="hero-management-field">
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

              <div className="hero-management-field full-width">
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

              <div className="hero-management-field full-width">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  rows="5"
                  placeholder="Enter short movie description..."
                  onChange={
                    handleChange
                  }
                ></textarea>
              </div>
            </div>
          </section>

          {/* HERO MEDIA */}

          <section className="hero-management-card">
            <div className="hero-management-card-heading">
              <span>02</span>

              <div>
                <h2>
                  Hero Media
                </h2>

                <p>
                  Upload movie title PNG,
                  banner image and trailer.
                </p>
              </div>
            </div>

            <div className="hero-management-media-grid">
              {/* TITLE PNG */}

              <div className="hero-management-upload-card">
                <FaImage />

                <h3>
                  Movie Title PNG
                </h3>

                <p>
                  Upload a transparent PNG
                  logo for the movie title.
                </p>

                <input
                  type="file"
                  accept="image/png"
                  onChange={
                    handleTitleLogoChange
                  }
                />

                {titleLogoFile && (
                  <span className="hero-selected-file">
                    {
                      titleLogoFile.name
                    }
                  </span>
                )}
              </div>

              {/* BANNER */}

              <div className="hero-management-upload-card">
                <FaImage />

                <h3>
                  Banner Image
                </h3>

                <p>
                  Upload a wide hero
                  background image.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleBannerChange
                  }
                />

                {bannerFile && (
                  <span className="hero-selected-file">
                    {
                      bannerFile.name
                    }
                  </span>
                )}
              </div>

              {/* TRAILER */}

              <div className="hero-management-upload-card">
                <FaVideo />

                <h3>
                  Trailer Video
                </h3>

                <p>
                  Upload the trailer used
                  for hero autoplay.
                </p>

                <input
                  type="file"
                  accept="video/*"
                  onChange={
                    handleTrailerChange
                  }
                />

                {trailerFile && (
                  <span className="hero-selected-file">
                    {
                      trailerFile.name
                    }
                  </span>
                )}
              </div>
            </div>
          </section>
        </form>

        {/* LIVE PREVIEW */}

        <aside className="hero-management-preview-card">
          <div className="hero-preview-heading">
            <span>
              LIVE PREVIEW
            </span>

            <h2>
              User Home Hero
            </h2>
          </div>

          <div className="hero-preview-wrapper">
            {trailerPreview ? (
              <video
                src={
                  trailerPreview
                }
                poster={
                  bannerPreview
                }
                className="hero-preview-video"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : bannerPreview ? (
              <img
                src={
                  bannerPreview
                }
                alt="Hero banner"
                className="hero-preview-background"
              />
            ) : (
              <div className="hero-preview-no-media">
                Banner / Trailer Preview
              </div>
            )}

            <div className="hero-preview-overlay"></div>

            <div className="hero-preview-content">
              {titleLogoPreview ? (
                <img
                  src={
                    titleLogoPreview
                  }
                  alt="Movie title logo"
                  className="hero-preview-title-logo"
                />
              ) : (
                <div className="hero-preview-title-placeholder">
                  Movie Title PNG
                </div>
              )}

              <div className="hero-preview-meta">
                <span>
                  Film
                </span>

                <span>
                  {formData.genre ||
                    "Genre"}
                </span>

                <span>
                  {formData.year ||
                    "2026"}
                </span>

                <span>
                  {formData.duration ||
                    "2h 30m"}
                </span>

                <span>
                  {formData.rating ||
                    "U/A 16+"}
                </span>
              </div>

              <p>
                {formData.description ||
                  "Your hero movie description will appear here."}
              </p>

              <div className="hero-preview-buttons">
                <button
                  type="button"
                >
                  <i className="fa-solid fa-play"></i>

                  Play
                </button>

                <button
                  type="button"
                >
                  More Info
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default HomeHeroManagement;