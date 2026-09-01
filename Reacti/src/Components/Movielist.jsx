import React, { useEffect, useState } from "react";

import { GET, POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import { getAuthToken } from "../utils/auth";

import Moviepage2 from "../Components/Moviepage2";
import LikeMenu from "../Components/LikeMenu";
import InfoModal from "../Components/InfoModal";

import "./Movielist.css";



function MovieCard({
  item,
  index,
  likingMovieId,
  movieReactions,
  onReactionSelect,
  onInfoClick,
}) {
  const [muted, setMuted] = useState(true);

  const isLiking = likingMovieId === item.id;

  const type =
    item.duration?.includes("Episode") ||
    item.duration?.includes("Episodes")
      ? "Series"
      : "Film";

  return (
    <div className="top10-rank-item">
      <span className="top10-rank-number">
  {item.rank || index + 1}
</span>

      <div className="top10-movie-card">
        <img
          className="top10-poster-image"
          src={item.image}
          alt={item.title}
        />

        {item.badge && (
          <span className="top10-movie-badge">
            {item.badge}
          </span>
        )}

        <div className="top10-preview-card">
          <div className="top10-preview-image-box">
            <img
              className="top10-preview-image"
              src={item.preview || item.image}
              alt={item.title}
            />

            <button
              type="button"
              className="top10-preview-center-play"
              aria-label={`Play ${item.title}`}
            >
              <i className="fa-solid fa-play"></i>
            </button>

            <button
              type="button"
              className="top10-mute-button"
              onClick={() =>
                setMuted((previous) => !previous)
              }
              aria-label={
                muted
                  ? "Unmute preview"
                  : "Mute preview"
              }
            >
              <i
                className={
                  muted
                    ? "fa-solid fa-volume-xmark"
                    : "fa-solid fa-volume-high"
                }
              ></i>
            </button>

            <div className="top10-preview-gradient"></div>

            <h2 className="top10-preview-title">
              {item.title}
            </h2>
          </div>

          <div className="top10-preview-content">
            <div className="top10-preview-type">
              <strong>{type}</strong>

              <span></span>

              <strong>{item.category}</strong>
            </div>

            <div className="top10-preview-details">
              <span>{item.year}</span>
              <span>•</span>
              <span>{item.duration}</span>
              <span>•</span>
              <span className="top10-age-rating">
                A
              </span>
              <span>•</span>
              <span className="top10-quality">
                HD
              </span>
            </div>

            <div className="top10-preview-actions">
              <button
                type="button"
                className="top10-play-button"
              >
                <i className="fa-solid fa-play"></i>
                <span>Play</span>
              </button>

              <LikeMenu
                currentReaction={
                  movieReactions[item.id] || ""
                }
                disabled={isLiking}
                onReactionSelect={(reaction) =>
                  onReactionSelect(item, reaction)
                }
              />

              <button
                type="button"
                className="top10-circle-button top10-info-button"
                onClick={() => onInfoClick(item)}
                aria-label={`More information about ${item.title}`}
              >
                <i className="fa-solid fa-circle-info"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopTenRow({
  title,
  items,
  likingMovieId,
  movieReactions,
  onReactionSelect,
  onInfoClick,
}) {
  return (
    <section className="top10-section">
      <h1 className="stop10-title">
        {title}
      </h1>

      <div className="top10-slider">
        <div className="top10-track">
          {items.map((item, index) => (
            <MovieCard
              key={item.id}
              item={item}
              index={index}
              likingMovieId={likingMovieId}
              movieReactions={movieReactions}
              onReactionSelect={onReactionSelect}
              onInfoClick={onInfoClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TopTen() {

  const BACKEND_URL = "http://localhost:5000";

function getMediaUrl(path) {
  if (!path) {
    return null;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${BACKEND_URL}${path}`;
}

  const token = getAuthToken() || "";


  const [movieReactions, setMovieReactions] =
    useState({});

  const [likingMovieId, setLikingMovieId] =
    useState(null);

  const [feedbackCompleted, setFeedbackCompleted] =
    useState(false);

  const [selectedInfoMovie, setSelectedInfoMovie] =
    useState(null);

  const [error, setError] = useState("");
  
  const [topTenMovies, setTopTenMovies] = useState([]);
const [worldwideMovies, setWorldwideMovies] = useState([]);
const [moviesLoading, setMoviesLoading] = useState(true);

useEffect(() => {
  async function loadMovies() {
    try {
      setMoviesLoading(true);

      const response = await GET(
        API_HEADER.MOVIES_GET
      );

      const formattedMovies =
        (response.movies || []).map(
          (movie) => ({
            section:
  movie.section || "",

rank:
  movie.rank
    ? Number(movie.rank)
    : null,

order:
  Number(movie.order) || 1,

            id: movie._id,

            title: movie.title,

            image: getMediaUrl(
  movie.posterUrl ||
  movie.thumbnailUrl ||
  movie.bannerUrl
),

preview: getMediaUrl(
  movie.bannerUrl ||
  movie.thumbnailUrl ||
  movie.posterUrl
),

trailer: getMediaUrl(
  movie.trailerUrl
),

            category:
              movie.genres?.length
                ? movie.genres[0]
                : "Movie",

            year:
              movie.releaseYear || "",

            duration:
              movie.duration || "",

            rating:
              movie.ageRating || "",

            badge:
  movie.section === "recently-added"
    ? "Recently added"
    : "",

            displayOptions:
              movie.displayOptions || {},
          })
        );

const topTen = formattedMovies
  .filter(
    (movie) =>
      movie.section === "top-10"
  )
  .sort(
    (a, b) =>
      Number(a.rank || 999) -
      Number(b.rank || 999)
  )
  .slice(0, 10);


const worldwide = formattedMovies
  .filter(
    (movie) =>
      movie.section === "worldwide"
  )
  .sort(
    (a, b) =>
      Number(a.order || 1) -
      Number(b.order || 1)
  )
  .slice(0, 10);

      setTopTenMovies(topTen);
      setWorldwideMovies(worldwide);
    } catch (error) {
      console.error(
        "Load Top 10 movies error:",
        error.response?.data ||
          error.message
      );
    } finally {
      setMoviesLoading(false);
    }
  }

  loadMovies();
}, []);

  useEffect(() => {
    async function loadLikeData() {
      if (!token) {
        return;
      }

      try {
        const [statusResponse, likedResponse] =
          await Promise.all([
            POST(
              API_HEADER.LIKES_RATING_STATUS
            ),
            POST(
              API_HEADER.LIKES_GET
            ),
          ]);

        setFeedbackCompleted(
          statusResponse.feedbackCompleted === true
        );

       const likedMovies =
  likedResponse.likedMovies || [];

const loadedReactions = {};

likedMovies.forEach((movie) => {

  const movieId =
    movie.movieId &&
    typeof movie.movieId === "object"
      ? movie.movieId._id
      : movie.movieId;

  if (
    movieId &&
    movie.reaction
  ) {
    loadedReactions[
      String(movieId)
    ] = movie.reaction;
  }

});

setMovieReactions(
  loadedReactions
);
      } catch (error) {
        console.error(
          "Load likes error:",
          error.response?.data ||
            error.message
        );

        setError(
          error.response?.data?.message ||
            "Unable to load likes."
        );
      }
    }

    loadLikeData();
  }, [token]);

async function handleReaction(
  item,
  reaction
) {

  if (!token) {
    setError(
      "Login token is missing."
    );

    return;
  }

  if (
    likingMovieId !== null
  ) {
    return;
  }

  setLikingMovieId(
    item.id
  );

  setError("");

  try {

    if (
      feedbackCompleted === false
    ) {

      const firstRatingResponse =
        await POST(
          API_HEADER.LIKES_SAVE_FIRST_RATING,
          {
            feedbackType:
              reaction,
          }
        );

      if (
        firstRatingResponse.success ===
        true
      ) {
        setFeedbackCompleted(
          true
        );
      }
    }


    const response =
      await POST(
        API_HEADER.LIKES_TOGGLE,
        {
          movieId:
            item.id,

          title:
            item.title,

          genre:
            item.category,

          image:
            item.image,

          reaction,
        }
      );


    if (response.success) {

      if (
        response.removed
      ) {

        setMovieReactions(
          (previous) => {

            const updated = {
              ...previous,
            };

            delete updated[
              item.id
            ];

            return updated;
          }
        );

      } else {

        setMovieReactions(
          (previous) => ({
            ...previous,

            [item.id]:
              response.reaction,
          })
        );

      }
    }

  } catch (error) {

    console.error(
      "Reaction error:",
      error.response?.data ||
      error.message
    );

    setError(
      error.response?.data?.message ||
      "Unable to update reaction."
    );

  } finally {

    setLikingMovieId(
      null
    );

  }
}

function openInfoModal(item) {
  setSelectedInfoMovie(item);
}


function closeInfoModal() {
  setSelectedInfoMovie(null);
}

  return (
    <main className="top-ten-page">
      {error && (
        <p className="top10-like-error">
          {error}
        </p>
      )}

      <TopTenRow
  title="Top 10 Movies in India Today"
  items={topTenMovies}
        likingMovieId={likingMovieId}
        movieReactions={movieReactions}
        onReactionSelect={handleReaction}
        onInfoClick={openInfoModal}
      />

      <Moviepage2 />

     <TopTenRow
  title="In Worldwide"
  items={worldwideMovies}
        likingMovieId={likingMovieId}
        movieReactions={movieReactions}
        onReactionSelect={handleReaction}
        onInfoClick={openInfoModal}
      />

      <InfoModal
        movie={selectedInfoMovie}
        onClose={closeInfoModal}
        currentReaction={
          selectedInfoMovie
            ? movieReactions[
                selectedInfoMovie.id
              ] || ""
            : ""
        }
        onReactionSelect={(reaction) => {
          if (!selectedInfoMovie) {
            return;
          }

          handleReaction(
            selectedInfoMovie,
            reaction
          );
        }}
      />
    </main>
  );
}

export default TopTen;