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
  FaPen,
  FaTrash,
  FaFilm,
} from "react-icons/fa6";

import {
  GET,
  DELETE,
} from "../api/api";

import "../Styles/SectionMovieList.css";

const BACKEND_URL =
  "http://localhost:5000";

function getMediaUrl(path) {
  if (!path) {
    return null;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  return `${BACKEND_URL}${path}`;
}

function SectionMovieList() {
  const navigate = useNavigate();

  const { section } = useParams();

  const [movies, setMovies] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const sectionNames = {
    "home-hero": "Home Hero",

    "recently-added":
      "Recently Added",

    trending:
      "Trending Now",

    "netflix-original":
      "Only on Netflix",

    "top-10":
      "Top 10 Movies",

    worldwide:
      "Worldwide",
  };

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const response =
          await GET(
            `/api/admin/movies/section/${section}`
          );

        if (response.success) {
          setMovies(
            response.movies || []
          );
        }
      } catch (error) {
        console.error(
          "Section movies error:",
          error.response?.data ||
          error.message
        );

        setError(
          error.response?.data
            ?.message ||
          "Unable to load movies."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [section]);

  async function handleDelete(movie) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${movie.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await DELETE(
        `/api/admin/movies/${movie._id}`
      );

      if (response.success) {
        setMovies((previousMovies) =>
          previousMovies.filter(
            (item) =>
              item._id !== movie._id
          )
        );
      }
    } catch (error) {
      console.error(
        "Delete movie error:",
        error.response?.data ||
        error.message
      );

      alert(
        error.response?.data?.message ||
        "Unable to delete movie."
      );
    }
  }

  return (
    <div className="section-movie-page">

      <button
        type="button"
        className="section-movie-back"
        onClick={() =>
          navigate(
            "/movies/library"
          )
        }
      >
        <FaArrowLeft />

        Back to Movie Library
      </button>

      <div className="section-movie-heading">

        <div>

          <p>
            MOVIE LIBRARY
          </p>

          <h1>
            {sectionNames[
              section
            ] || "Movies"}
          </h1>

          <span>
            Manage movies inside
            this section.
          </span>

        </div>

        <div className="section-movie-total">

          <span>
            Total Movies
          </span>

          <strong>
            {loading
              ? "..."
              : movies.length}
          </strong>

        </div>

      </div>

      {error && (
        <div className="section-movie-error">
          {error}
        </div>
      )}

      {loading ? (

        <div className="section-movie-empty">
          Loading movies...
        </div>

      ) : movies.length === 0 ? (

        <div className="section-movie-empty">

          <FaFilm />

          <h2>
            No movies found
          </h2>

          <p>
            There are currently no
            movies inside this
            section.
          </p>

        </div>

      ) : (

        <div className="section-movie-grid">

          {movies.map(
            (movie) => {

              const image =
                getMediaUrl(
                  movie.posterUrl ||
                  movie.thumbnailUrl ||
                  movie.bannerUrl
                );

              return (
                <article
                  key={movie._id}
                  className="section-movie-card"
                >

                  <div className="section-movie-image">

                    {image ? (
                      <img
                        src={image}
                        alt={
                          movie.title
                        }
                      />
                    ) : (
                      <div className="section-movie-no-image">
                        <FaFilm />
                      </div>
                    )}

                    {section ===
                      "top-10" &&
                      movie.rank && (
                        <span className="section-movie-rank">
                          #
                          {
                            movie.rank
                          }
                        </span>
                      )}

                  </div>

                  <div className="section-movie-content">

                    <div className="section-movie-info">

                      <span className="section-movie-status">
                        {movie.status}
                      </span>

                      <h2>
                        {movie.title}
                      </h2>

                      <p>
                        {movie.releaseYear ||
                          "—"}

                        {" • "}

                        {movie.duration ||
                          "—"}

                        {" • "}

                        {movie.ageRating ||
                          "—"}
                      </p>

                      {movie.genres
                        ?.length >
                        0 && (
                          <small>
                            {movie.genres.join(
                              ", "
                            )}
                          </small>
                        )}

                    </div>

                    <div className="section-movie-actions">

                      <button
                        type="button"
                        className="section-edit-button"
                        onClick={() =>
                          navigate(
                            `/movies/edit/${movie._id}`
                          )
                        }
                      >
                        <FaPen />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="section-delete-button"
                        onClick={() =>
                          handleDelete(movie)
                        }
                      >
                        <FaTrash />
                        Delete
                      </button>

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}

export default SectionMovieList;