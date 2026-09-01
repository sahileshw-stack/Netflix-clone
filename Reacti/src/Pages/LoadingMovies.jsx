import React, {
  useEffect,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

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

import "./LoadingMovies.css";

function LoadingMovies() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = location.state?.token || "";
  const planId = location.state?.planId || "";
  const planName = location.state?.planName || "";

  const favoriteMovies =
    location.state?.favoriteMovies || [];

  const [error, setError] = useState("");

  const topMovies = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
  ];

  const bottomMovies = [
    img10,
    img9,
    img8,
    img7,
    img6,
    img5,
    img4,
    img3,
    img2,
    img1,
  ];
useEffect(() => {

  if (!token) {
    setError(
      "Signup token is missing."
    );

    return;
  }


  if (
    !Array.isArray(
      favoriteMovies
    ) ||
    favoriteMovies.length !== 3
  ) {
    setError(
      "Selected movies are missing."
    );

    return;
  }


  const timer =
    setTimeout(() => {

      navigate(
        "/profile",
        {
          state: {
            token,
            planId,
            planName,
          },

          replace: true,
        }
      );

    }, 3000);


  return () => {
    clearTimeout(timer);
  };

}, [
  token,
  planId,
  planName,
  favoriteMovies,
  navigate,
]);

  return (
    <div className="recommend-loading-page">
      <header className="recommend-header">
        <img
          src={logo}
          alt="Netflix"
          className="recommend-logo"
        />

        <button
          type="button"
          className="recommend-help"
        >
          Help
        </button>
      </header>

      <div className="top-movies">
        {topMovies.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Movie ${index + 1}`}
          />
        ))}
      </div>

      <main className="recommend-content">
        {error ? (
          <>
            <h1>Unable to finish your setup.</h1>

            <p className="recommend-error">
              {error}
            </p>
          </>
        ) : (
          <>
            <h1>
              Selecting shows and movies just for you.
            </h1>

            <div className="netflix-loading-spinner"></div>
          </>
        )}
      </main>

      <div className="bottom-movies">
        {bottomMovies.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Movie ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default LoadingMovies; 