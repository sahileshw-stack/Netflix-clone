import React, { useEffect, useState } from "react";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/pngwing.com (4).png";

import img1 from "../assets/img1.webp";
import img2 from "../assets/img2.webp";
import img3 from "../assets/img3.webp";
import img4 from "../assets/img4.webp";
import img5 from "../assets/img5.webp";
import img6 from "../assets/img6.webp";
import img7 from "../assets/img7.webp";
import img8 from "../assets/img8.webp";
import img9 from "../assets/img9.webp";
import img10 from "../assets/img10.webp";

import "./PickMovies.css";

function PickMovies() {
  const navigate = useNavigate();
  const location = useLocation();


  const token = location.state?.token || "";
  const planId = location.state?.planId || "";
  const planName = location.state?.planName || "";

  const [selectedMovies, setSelectedMovies] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function loadMainProfile() {
      if (!token) {
        return;
      }

      try {
        const response = await POST(
          API_HEADER.GET_USER_PROFILE,
          {
            token,
          }
        );

        console.log(
          "Main profile response:",
          response
        );

        setUsername(
          response.username || "User"
        );
      } catch (error) {
        console.error(
          "Load profile error:",
          error.response?.data || error.message
        );
      }
    }

    loadMainProfile();
  }, [token]);

  const movies = [
    { id: 1, title: "Movie 1", image: img1 },
    { id: 2, title: "Movie 2", image: img2 },
    { id: 3, title: "Movie 3", image: img3 },
    { id: 4, title: "Movie 4", image: img4 },
    { id: 5, title: "Movie 5", image: img5 },
    { id: 6, title: "Movie 6", image: img6 },
    { id: 7, title: "Movie 7", image: img7 },
    { id: 8, title: "Movie 8", image: img8 },
    { id: 9, title: "Movie 9", image: img9 },
    { id: 10, title: "Movie 10", image: img10 },

    // Repeating for design/testing
    { id: 11, title: "Movie 11", image: img3 },
    { id: 12, title: "Movie 12", image: img6 },
    { id: 13, title: "Movie 13", image: img9 },
    { id: 14, title: "Movie 14", image: img2 },
    { id: 15, title: "Movie 15", image: img7 },
    { id: 16, title: "Movie 16", image: img4 },
    { id: 17, title: "Movie 17", image: img8 },
    { id: 18, title: "Movie 18", image: img1 },
    { id: 19, title: "Movie 19", image: img5 },
    { id: 20, title: "Movie 20", image: img10 },
  ];



  function selectMovie(movieId) {
    setSelectedMovies((previousMovies) => {
      if (previousMovies.includes(movieId)) {
        return previousMovies.filter((id) => id !== movieId);
      }

      if (previousMovies.length === 3) {
        return previousMovies;
      }

      return [...previousMovies, movieId];
    });
  }

 async function handleContinue() {
  if (selectedMovies.length !== 3) {
    return;
  }

  if (!token) {
    console.error("Signup token is missing.");
    return;
  }

  const selectedMovieTitles = movies
    .filter((movie) =>
      selectedMovies.includes(movie.id)
    )
    .map((movie) => movie.title);

  try {
    const response = await POST(
      API_HEADER.SAVE_FAVORITE_MOVIES,
      {
        token,
        favoriteMovies: selectedMovieTitles,
      }
    );

    console.log(
      "Save favorite movies response:",
      response
    );

    if (response.success === true) {
      navigate("/loadingmovies", {
        state: {
          token,
          planId,
          planName,
          favoriteMovies: selectedMovieTitles,
        },
      });
    }
  } catch (error) {
    console.error(
      "Save favorite movies error:",
      error.response?.data || error.message
    );
  }
}

  return (
    <div className="pick-page">
      <header className="pick-header">
        <img src={logo} alt="Netflix" className="pick-logo" />

        <button
          type="button"
          className="pick-help"
        >
          Help
        </button>
      </header>

      <main className="pick-main">
        <section className="pick-intro">
          <h1>
            {username}, select 3
            <br />
            you like.
          </h1>

          <p>
            This helps us to find shows and movies you will love.
            <br />
            <strong>Select the ones you like.</strong>
          </p>
        </section>

        <section className="pick-content">
          <div className="pick-grid">
            {movies.map((movie) => {
              const isSelected = selectedMovies.includes(movie.id);

              return (
                <button
                  type="button"
                  key={movie.id}
                  className={
                    isSelected
                      ? "pick-card pick-card-selected"
                      : "pick-card"
                  }
                  onClick={() => selectMovie(movie.id)}
                >
                  <img
                    src={movie.image}
                    alt={movie.title}
                  />

                  {isSelected && (
                    <span className="pick-check">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className={
              selectedMovies.length === 3
                ? "pick-continue pick-continue-active"
                : "pick-continue"
            }
            disabled={selectedMovies.length !== 3}
            onClick={handleContinue}
          >
            {selectedMovies.length === 3
              ? "Continue"
              : `Pick ${3 - selectedMovies.length} to Continue`}
          </button>
        </section>
      </main>
    </div>
  );
}

export default PickMovies;