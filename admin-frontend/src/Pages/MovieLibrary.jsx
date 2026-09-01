import React, {
  useEffect,
  useState,
} from "react";

import {
  FaImage,
  FaClockRotateLeft,
  FaFire,
  FaN,
  FaRankingStar,
  FaEarthAmericas,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

import { GET } from "../api/api";
import API_HEADER from "../api/apiHeader";

import "../Styles/MovieLibrary.css";

function MovieLibrary() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalMovies: 0,

    sections: {
      homeHero: 0,
      recentlyAdded: 0,
      trending: 0,
      netflixOriginal: 0,
      topTen: 0,
      worldwide: 0,
    },
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError("");

        const response = await GET(
          API_HEADER.ADMIN_MOVIE_DASHBOARD_STATS
        );

        if (response.success) {
          setStats({
            totalMovies:
              response.totalMovies || 0,

            sections:
              response.sections || {},
          });
        }
      } catch (error) {
        console.error(
          "Movie library error:",
          error.response?.data ||
            error.message
        );

        setError(
          error.response?.data?.message ||
            "Unable to load movie library."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const sections = [
    {
      id: 1,
      title: "Home Hero",
      description:
        "Movies used as the main home hero banner.",

      section: "home-hero",

      count:
        stats.sections.homeHero || 0,

      icon: <FaImage />,
    },

    {
      id: 2,
      title: "Recently Added",
      description:
        "Movies displayed in the Recently Added row.",

      section: "recently-added",

      count:
        stats.sections.recentlyAdded ||
        0,

      icon: <FaClockRotateLeft />,
    },

    {
      id: 3,
      title: "Trending Now",
      description:
        "Movies currently displayed in Trending Now.",

      section: "trending",

      count:
        stats.sections.trending || 0,

      icon: <FaFire />,
    },

    {
      id: 4,
      title: "Only on Netflix",
      description:
        "Exclusive titles displayed in the Only on Netflix row.",

      section: "netflix-original",

      count:
        stats.sections
          .netflixOriginal || 0,

      icon: <FaN />,
    },

    {
      id: 5,
      title: "Top 10 Movies",
      description:
        "Ranked titles displayed in the Top 10 section.",

      section: "top-10",

      count:
        stats.sections.topTen || 0,

      icon: <FaRankingStar />,
    },

    {
      id: 6,
      title: "Worldwide",
      description:
        "16:9 landscape titles displayed in Worldwide.",

      section: "worldwide",

      count:
        stats.sections.worldwide || 0,

      icon: <FaEarthAmericas />,
    },
  ];

  function openSection(section) {
    navigate(
      `/movies/library/${section}`
    );
  }

  return (
    <div className="movie-library-page">

      <button
        type="button"
        className="movie-library-back"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        <FaArrowLeft />
        Back to Dashboard
      </button>

      <div className="movie-library-heading">

        <div>
          <p className="movie-library-label">
            CONTENT LIBRARY
          </p>

          <h1>All Movies</h1>

          <p>
            View and manage movies
            based on their home page
            section.
          </p>
        </div>

        <div className="movie-library-total">
          <span>Total Movies</span>

          <strong>
            {loading
              ? "..."
              : stats.totalMovies}
          </strong>
        </div>

      </div>

      {error && (
        <div className="movie-library-error">
          {error}
        </div>
      )}

      <div className="movie-library-grid">

        {sections.map((section) => (

          <article
            key={section.id}
            className="movie-library-card"
            onClick={() =>
              openSection(
                section.section
              )
            }
          >

            <div className="movie-library-card-top">

              <div className="movie-library-icon">
                {section.icon}
              </div>

              <div className="movie-library-count">
                {loading
                  ? "..."
                  : section.count}
              </div>

            </div>

            <div className="movie-library-content">

              <span>
                SECTION
              </span>

              <h2>
                {section.title}
              </h2>

              <p>
                {section.description}
              </p>

            </div>

            <button
              type="button"
              className="movie-library-open"
              onClick={(event) => {
                event.stopPropagation();

                openSection(
                  section.section
                );
              }}
            >
              <span>
                View Movies
              </span>

              <FaArrowRight />
            </button>

          </article>
        ))}

      </div>

    </div>
  );
}

export default MovieLibrary;