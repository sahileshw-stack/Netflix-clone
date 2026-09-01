import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";

import {
  FaArrowLeft,
  FaCloudArrowUp,
  FaPlus,
  FaXmark,
  FaFloppyDisk,
} from "react-icons/fa6";

import "../Styles/AddMovie.css";

function AddMovie() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    originalTitle: "",
    description: "",
    releaseYear: "",
    duration: "",
    language: "",
    ageRating: "",
    director: "",
    creator: "",
    posterUrl: "",
    bannerUrl: "",
    thumbnailUrl: "",
    trailerUrl: "",
    movieUrl: "",
    status: "Draft",
    publishDate: "",
  });

  const [genres, setGenres] = useState([
    "Action",
  ]);

  const [cast, setCast] = useState([
    "",
    "",
    "",
  ]);

  const [displayOptions, setDisplayOptions] =
    useState({
      top10: false,
      trending: false,
      recentlyAdded: false,
      recommended: false,
      netflixOriginal: false,
      featuredBanner: false,
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function addGenre() {
    setGenres((previous) => [
      ...previous,
      "",
    ]);
  }

  function updateGenre(index, value) {
    setGenres((previous) =>
      previous.map((genre, currentIndex) =>
        currentIndex === index
          ? value
          : genre
      )
    );

    setError("");
  }

  function removeGenre(index) {
    setGenres((previous) =>
      previous.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );
  }

  function addCastMember() {
    setCast((previous) => [
      ...previous,
      "",
    ]);
  }

  function updateCast(index, value) {
    setCast((previous) =>
      previous.map((person, currentIndex) =>
        currentIndex === index
          ? value
          : person
      )
    );
  }

  function removeCastMember(index) {
    setCast((previous) =>
      previous.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );
  }

  function toggleDisplayOption(option) {
    setDisplayOptions((previous) => ({
      ...previous,
      [option]: !previous[option],
    }));

    setError("");
    setSuccess("");
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

    if (!formData.description.trim()) {
      setError(
        "Movie description is required."
      );
      return;
    }

    if (!formData.releaseYear) {
      setError("Release year is required.");
      return;
    }

    const releaseYear = Number(
      formData.releaseYear
    );

    if (
      Number.isNaN(releaseYear) ||
      releaseYear < 1888 ||
      releaseYear > 2100
    ) {
      setError(
        "Enter a valid release year."
      );
      return;
    }

    if (!formData.duration.trim()) {
      setError("Duration is required.");
      return;
    }

    if (!formData.language) {
      setError("Language is required.");
      return;
    }

    if (!formData.ageRating) {
      setError("Age rating is required.");
      return;
    }

    const cleanedGenres = genres
      .map((genre) => genre.trim())
      .filter(Boolean);

    if (cleanedGenres.length === 0) {
      setError(
        "Select at least one genre."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await POST(
        API_HEADER.ADMIN_MOVIES,
        {
          ...formData,

          title: formData.title.trim(),

          originalTitle:
            formData.originalTitle.trim(),

          description:
            formData.description.trim(),

          releaseYear,

          duration:
            formData.duration.trim(),

          director:
            formData.director.trim(),

          creator:
            formData.creator.trim(),

          posterUrl:
            formData.posterUrl.trim(),

          bannerUrl:
            formData.bannerUrl.trim(),

          thumbnailUrl:
            formData.thumbnailUrl.trim(),

          trailerUrl:
            formData.trailerUrl.trim(),

          movieUrl:
            formData.movieUrl.trim(),

          genres: cleanedGenres,

          cast: cast
            .map((person) =>
              person.trim()
            )
            .filter(Boolean),

          displayOptions,

          publishDate:
            formData.publishDate || null,
        }
      );

      if (response.success === true) {
        setSuccess(
          response.message ||
            "Movie added successfully."
        );

        setTimeout(() => {
          navigate("/movies");
        }, 1000);
      }
    } catch (error) {
      console.error(
        "Add movie error:",
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

  return (
    <div className="add-movie-page">
      <div className="add-movie-topbar">
        <div>
          <button
            type="button"
            className="add-movie-back"
            onClick={() =>
              navigate("/movies")
            }
          >
            <FaArrowLeft />
            <span>Back to Movies</span>
          </button>

          <h1>Add New Movie</h1>

          <p>
            Create a new title for your
            Netflix content library.
          </p>
        </div>

        <div className="add-movie-top-actions">
          <button
            type="button"
            className="add-movie-cancel"
            disabled={loading}
            onClick={() =>
              navigate("/movies")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            form="addMovieForm"
            className="add-movie-save"
            disabled={loading}
          >
            <FaFloppyDisk />

            <span>
              {loading
                ? "Saving..."
                : "Save Movie"}
            </span>
          </button>
        </div>
      </div>

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

      <form
        id="addMovieForm"
        className="add-movie-form"
        onSubmit={handleSubmit}
      >
        <section className="add-movie-card">
          <div className="add-movie-section-heading">
            <div>
              <span>01</span>

              <div>
                <h2>Basic Details</h2>

                <p>
                  Add the main information
                  viewers will see.
                </p>
              </div>
            </div>
          </div>

          <div className="add-movie-grid two-columns">
            <div className="add-movie-field">
              <label htmlFor="movieTitle">
                Movie title
              </label>

              <input
                id="movieTitle"
                name="title"
                type="text"
                value={formData.title}
                placeholder="Enter movie title"
                onChange={handleInputChange}
              />
            </div>

            <div className="add-movie-field">
              <label htmlFor="originalTitle">
                Original title
              </label>

              <input
                id="originalTitle"
                name="originalTitle"
                type="text"
                value={formData.originalTitle}
                placeholder="Enter original title"
                onChange={handleInputChange}
              />
            </div>

            <div className="add-movie-field full-width">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                placeholder="Write a short movie description..."
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="add-movie-field">
              <label htmlFor="releaseYear">
                Release year
              </label>

              <input
                id="releaseYear"
                name="releaseYear"
                type="number"
                min="1888"
                max="2100"
                value={formData.releaseYear}
                placeholder="2026"
                onChange={handleInputChange}
              />
            </div>

            <div className="add-movie-field">
              <label htmlFor="duration">
                Duration
              </label>

              <input
                id="duration"
                name="duration"
                type="text"
                value={formData.duration}
                placeholder="2h 15m"
                onChange={handleInputChange}
              />
            </div>

            <div className="add-movie-field">
              <label htmlFor="language">
                Language
              </label>

              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
              >
                <option value="">
                  Select language
                </option>

                <option value="English">
                  English
                </option>

                <option value="Tamil">
                  Tamil
                </option>

                <option value="Hindi">
                  Hindi
                </option>

                <option value="Malayalam">
                  Malayalam
                </option>

                <option value="Telugu">
                  Telugu
                </option>
              </select>
            </div>

            <div className="add-movie-field">
              <label htmlFor="ageRating">
                Age rating
              </label>

              <select
                id="ageRating"
                name="ageRating"
                value={formData.ageRating}
                onChange={handleInputChange}
              >
                <option value="">
                  Select rating
                </option>

                <option value="U">U</option>
                <option value="U/A 7+">
                  U/A 7+
                </option>
                <option value="U/A 13+">
                  U/A 13+
                </option>
                <option value="U/A 16+">
                  U/A 16+
                </option>
                <option value="A">A</option>
              </select>
            </div>
          </div>
        </section>

        <section className="add-movie-card">
          <div className="add-movie-section-heading">
            <div>
              <span>02</span>

              <div>
                <h2>Media</h2>

                <p>
                  Add poster, banner, trailer
                  and movie URLs.
                </p>
              </div>
            </div>
          </div>

          <div className="add-movie-upload-grid">
            {[
              "Poster Image",
              "Banner Image",
              "Thumbnail",
              "Trailer Video",
              "Movie File",
            ].map((label) => (
              <label
                key={label}
                className="add-movie-upload-box"
              >
                <FaCloudArrowUp />

                <strong>{label}</strong>

                <span>
                  File upload will be connected
                  later
                </span>

                <input
                  type="file"
                  hidden
                  disabled
                />
              </label>
            ))}
          </div>

          <div className="add-movie-grid two-columns">
            <div className="add-movie-field">
              <label htmlFor="posterUrl">
                Poster URL
              </label>

              <input
                id="posterUrl"
                name="posterUrl"
                type="url"
                value={formData.posterUrl}
                placeholder="https://..."
                onChange={handleInputChange}
              />
            </div>

            <div className="add-movie-field">
              <label htmlFor="bannerUrl">
                Banner URL
              </label>

              <input
                id="bannerUrl"
                name="bannerUrl"
                type="url"
                value={formData.bannerUrl}
                placeholder="https://..."
                onChange={handleInputChange}
              />
            </div>

            <div className="add-movie-field">
              <label htmlFor="thumbnailUrl">
                Thumbnail URL
              </label>

              <input
                id="thumbnailUrl"
                name="thumbnailUrl"
                type="url"
                value={formData.thumbnailUrl}
                placeholder="https://..."
                onChange={handleInputChange}
              />
            </div>

            <div className="add-movie-field">
              <label htmlFor="trailerUrl">
                Trailer URL
              </label>

              <input
                id="trailerUrl"
                name="trailerUrl"
                type="url"
                value={formData.trailerUrl}
                placeholder="https://..."
                onChange={handleInputChange}
              />
            </div>

            <div className="add-movie-field full-width">
              <label htmlFor="movieUrl">
                Movie URL
              </label>

              <input
                id="movieUrl"
                name="movieUrl"
                type="url"
                value={formData.movieUrl}
                placeholder="https://..."
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        <section className="add-movie-card">
          <div className="add-movie-section-heading">
            <div>
              <span>03</span>

              <div>
                <h2>Genres</h2>

                <p>
                  Add one or more genres.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="add-movie-small-add"
              onClick={addGenre}
            >
              <FaPlus />
              Add Genre
            </button>
          </div>

          <div className="add-movie-repeat-list">
            {genres.map((genre, index) => (
              <div
                key={index}
                className="add-movie-repeat-row"
              >
                <select
                  value={genre}
                  onChange={(event) =>
                    updateGenre(
                      index,
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select genre
                  </option>

                  <option value="Action">
                    Action
                  </option>

                  <option value="Drama">
                    Drama
                  </option>

                  <option value="Crime">
                    Crime
                  </option>

                  <option value="Comedy">
                    Comedy
                  </option>

                  <option value="Thriller">
                    Thriller
                  </option>

                  <option value="Sci-Fi">
                    Sci-Fi
                  </option>

                  <option value="Romance">
                    Romance
                  </option>
                </select>

                {genres.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeGenre(index)
                    }
                    aria-label="Remove genre"
                  >
                    <FaXmark />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="add-movie-card">
          <div className="add-movie-section-heading">
            <div>
              <span>04</span>

              <div>
                <h2>Cast and Crew</h2>

                <p>
                  Add director, creator and
                  cast members.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="add-movie-small-add"
              onClick={addCastMember}
            >
              <FaPlus />
              Add Cast
            </button>
          </div>

          <div className="add-movie-grid two-columns">
            <div className="add-movie-field">
              <label htmlFor="director">
                Director
              </label>

              <input
                id="director"
                name="director"
                type="text"
                value={formData.director}
                placeholder="Director name"
                onChange={handleInputChange}
              />
            </div>

            <div className="add-movie-field">
              <label htmlFor="creator">
                Creator
              </label>

              <input
                id="creator"
                name="creator"
                type="text"
                value={formData.creator}
                placeholder="Creator name"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="add-movie-cast-grid">
            {cast.map((person, index) => (
              <div
                key={index}
                className="edit-cast-item"
              >
                <input
                  type="text"
                  value={person}
                  placeholder={`Cast member ${
                    index + 1
                  }`}
                  onChange={(event) =>
                    updateCast(
                      index,
                      event.target.value
                    )
                  }
                />

                {cast.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeCastMember(index)
                    }
                    aria-label="Remove cast member"
                  >
                    <FaXmark />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="add-movie-card">
          <div className="add-movie-section-heading">
            <div>
              <span>05</span>

              <div>
                <h2>
                  Netflix Display Options
                </h2>

                <p>
                  Control where this title
                  appears.
                </p>
              </div>
            </div>
          </div>

          <div className="add-movie-options-grid">
            {[
              ["top10", "Top 10"],
              ["trending", "Trending"],
              [
                "recentlyAdded",
                "Recently Added",
              ],
              [
                "recommended",
                "Recommended",
              ],
              [
                "netflixOriginal",
                "Netflix Original",
              ],
              [
                "featuredBanner",
                "Featured Banner",
              ],
            ].map(([key, label]) => (
              <label
                key={key}
                className="add-movie-option"
              >
                <input
                  type="checkbox"
                  checked={
                    displayOptions[key]
                  }
                  onChange={() =>
                    toggleDisplayOption(key)
                  }
                />

                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="add-movie-card">
          <div className="add-movie-section-heading">
            <div>
              <span>06</span>

              <div>
                <h2>
                  Publishing Settings
                </h2>

                <p>
                  Choose the final movie
                  status.
                </p>
              </div>
            </div>
          </div>

          <div className="add-movie-grid two-columns">
            <div className="add-movie-field">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Draft">
                  Draft
                </option>

                <option value="Published">
                  Published
                </option>

                <option value="Archived">
                  Archived
                </option>
              </select>
            </div>

            <div className="add-movie-field">
              <label htmlFor="publishDate">
                Publish date
              </label>

              <input
                id="publishDate"
                name="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}

export default AddMovie;