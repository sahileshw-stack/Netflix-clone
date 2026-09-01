import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaImage,
  FaClockRotateLeft,
  FaFire,
  FaN,
  FaRankingStar,
  FaArrowRight,
  FaEarthAmericas,
} from "react-icons/fa6";

import "../Styles/MovieManagement.css";

function MovieManagement() {
  const navigate = useNavigate();

  const sections = [
    {
      id: 1,
      title: "Home Hero",
      description:
        "Manage the main featured movie displayed at the top of the home page.",
      icon: <FaImage />,
      route: "/movies/home-hero",
      type: "Hero Banner",
    },

    {
      id: 2,
      title: "Recently Added",
      description:
        "Manage movies displayed inside the Recently Added row.",
      icon: <FaClockRotateLeft />,
      route: "/movies/recently-added",
      type: "Movie Row",
    },

    {
      id: 3,
      title: "Trending Now",
      description:
        "Manage movies currently displayed in the Trending Now section.",
      icon: <FaFire />,
      route: "/movies/trending",
      type: "Movie Row",
    },

    {
      id: 4,
      title: "Only on Netflix",
      description:
        "Manage exclusive titles displayed in the Only on Netflix row.",
      icon: <FaN />,
      route: "/movies/netflix-original",
      type: "Movie Row",
    },

    {
      id: 5,
      title: "Top 10 Movies",
      description:
        "Manage Top 10 titles, rankings and numbered movie cards.",
      icon: <FaRankingStar />,
      route: "/movies/top-10",
      type: "Ranking Row",
    },

    // ==============================
    // WORLDWIDE
    // ==============================
    {
      id: 6,
      title: "Worldwide",
      description:
        "Manage 16:9 landscape movies displayed inside the In Worldwide row.",
      icon: <FaEarthAmericas />,
      route: "/movies/worldwide",
      type: "16:9 Movie Row",
    },
  ];

  return (
    <div className="movie-management-page">

      <div className="movie-management-heading">
        <div>

          <p className="movie-management-label">
            CONTENT
          </p>

          <h1>Movie Management</h1>

          <p>
            Choose which part of the user home page
            you want to manage.
          </p>

        </div>
      </div>

      <div className="movie-management-grid">

        {sections.map((section) => (

          <article
            className="management-section-card"
            key={section.id}
            onClick={() =>
              navigate(section.route)
            }
          >

            <div className="management-card-top">

              <div className="management-card-icon">
                {section.icon}
              </div>

              <span className="management-card-type">
                {section.type}
              </span>

            </div>

            <div className="management-card-content">

              <h2>
                {section.title}
              </h2>

              <p>
                {section.description}
              </p>

            </div>

            <button
              type="button"
              className="management-card-button"
              onClick={(event) => {
                event.stopPropagation();

                navigate(
                  section.route
                );
              }}
            >
              <span>
                Manage
              </span>

              <FaArrowRight />
            </button>

          </article>

        ))}

      </div>

    </div>
  );
}

export default MovieManagement;