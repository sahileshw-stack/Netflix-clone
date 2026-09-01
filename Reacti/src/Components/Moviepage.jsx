import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  GET,
  POST,
} from "../api/api";

import API_HEADER from "../api/apiHeader";
import { getAuthToken } from "../utils/auth";

import LikeMenu2 from "../Components/LikeMenu2";
import InfoModal from "../Components/InfoModal";

import hand from "../assets/hand.png";

import "./Moviepage.css";


const BACKEND_URL =
  "http://localhost:5000";


function getMediaUrl(path) {
  if (!path) {
    return "";
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


function Moviepage() {
  const token =
    getAuthToken() || "";


  /*
    =========================
    DATABASE MOVIES
    =========================
  */

  const [
    allMovies,
    setAllMovies,
  ] = useState([]);

  const [
    moviesLoading,
    setMoviesLoading,
  ] = useState(true);

  const [
    moviesError,
    setMoviesError,
  ] = useState("");


  /*
    =========================
    MY LIST
    =========================
  */

const [
  myListMovies,
  setMyListMovies,
] = useState({
  ids: [],
  titles: [],
});

  const [
    addingMovieId,
    setAddingMovieId,
  ] = useState(null);

  const [
    listError,
    setListError,
  ] = useState("");


  /*
    =========================
    LIKE / REACTIONS
    =========================
  */

  const [
    movieReactions,
    setMovieReactions,
  ] = useState({});

  const [
    reactingMovieId,
    setReactingMovieId,
  ] = useState(null);

  const [
    reactionError,
    setReactionError,
  ] = useState("");


  /*
    =========================
    INFO MODAL
    =========================
  */

  const [
    selectedInfoMovie,
    setSelectedInfoMovie,
  ] = useState(null);


  /*
    =========================
    HERO VIDEO
    =========================
  */

  const videoRef =
    useRef(null);

  const [
    muted,
    setMuted,
  ] = useState(true);

  const [
    playing,
    setPlaying,
  ] = useState(true);


  /*
    =========================
    SLIDERS
    =========================
  */

  const [
    slide1,
    setSlide1,
  ] = useState(0);

  const [
    slide2,
    setSlide2,
  ] = useState(0);


  /*
    =========================
    LOAD MOVIES
    =========================
  */

  useEffect(() => {
    async function loadMovies() {
      try {
        setMoviesLoading(true);
        setMoviesError("");

        const response =
          await GET(
            API_HEADER.MOVIES_GET
          );

        if (
          response.success === true
        ) {
          const formattedMovies =
            (
              response.movies || []
            ).map((movie) => ({
              id:
                movie._id,

              title:
                movie.title ||
                "Untitled",

              originalTitle:
                movie.originalTitle ||
                "",

              titleLogo:
                getMediaUrl(
                  movie.titleLogoUrl
                ),

              description:
                movie.description ||
                "",

              genre:
                movie.genres?.length
                  ? movie.genres.join(
                    ", "
                  )
                  : "Movie",

              genres:
                movie.genres ||
                [],

              image:
                getMediaUrl(
                  movie.thumbnailUrl ||
                  movie.posterUrl ||
                  movie.bannerUrl ||
                  ""
                ),

              poster:
                getMediaUrl(
                  movie.posterUrl
                ),

              banner:
                getMediaUrl(
                  movie.bannerUrl
                ),

              thumbnail:
                getMediaUrl(
                  movie.thumbnailUrl
                ),

              trailer:
                getMediaUrl(
                  movie.trailerUrl
                ),

              movieUrl:
                getMediaUrl(
                  movie.movieUrl
                ),

              year:
                movie.releaseYear ||
                "",

              duration:
                movie.duration ||
                "",

              rating:
                movie.ageRating ||
                "",

              language:
                movie.language ||
                "",

              director:
                movie.director ||
                "",

              creator:
                movie.creator ||
                "",

              cast:
                movie.cast ||
                [],

              section:
                movie.section ||
                "",

              order:
                Number(
                  movie.order
                ) || 1,

              rank:
                movie.rank
                  ? Number(
                    movie.rank
                  )
                  : null,

              displayOptions:
                movie.displayOptions ||
                {},

              status:
                movie.status ||
                "",

              publishDate:
                movie.publishDate ||
                "",

              createdAt:
                movie.createdAt ||
                "",
            }));

          setAllMovies(
            formattedMovies
          );
        }
      } catch (error) {
        console.error(
          "Load movies error:",
          error.response?.data ||
          error.message
        );

        setMoviesError(
          error.response?.data
            ?.message ||
          "Unable to load movies."
        );
      } finally {
        setMoviesLoading(false);
      }
    }

    loadMovies();
  }, []);


  /*
    =========================
    LOAD MY LIST
    =========================
  */
useEffect(() => {

  async function loadMyListIds() {

    if (!token) {
      return;
    }

    try {

      const response = await GET(
        API_HEADER.MYLIST_GET
      );


      const items =
        response.myList || [];


      // Get movie IDs
      const ids = items
        .map((item) => {

          if (
            item.movieId &&
            typeof item.movieId === "object"
          ) {
            return String(
              item.movieId._id
            );
          }

          return String(
            item.movieId
          );

        })
        .filter(Boolean);


      // Get movie titles
      const titles = items
        .map((item) =>
          String(
            item.title || ""
          )
            .trim()
            .toLowerCase()
        )
        .filter(Boolean);


      setMyListMovies({
        ids: ids,
        titles: titles,
      });


    } catch (error) {

      console.error(
        "Load My List error:",
        error.response?.data ||
        error.message
      );

    }
  }


  loadMyListIds();

}, [token]);

  /*
    =========================
    HOME HERO
    =========================
  */

  const homeHeroMovies =
    allMovies
      .filter(
        (movie) =>
          movie.section ===
          "home-hero"
      )
      .sort(
        (a, b) =>
          a.order -
          b.order
      );

const [heroMovie, setHeroMovie] =
  useState(null);

  useEffect(() => {

  if (
    homeHeroMovies.length === 0
  ) {
    setHeroMovie(null);
    return;
  }

  const randomIndex =
    Math.floor(
      Math.random() *
      homeHeroMovies.length
    );

  setHeroMovie(
    homeHeroMovies[randomIndex]
  );

}, [allMovies]);
/*
=========================
LOAD SAVED REACTIONS
=========================
*/

useEffect(() => {

  async function loadReactions() {

    if (!token) {
      return;
    }

    try {

      const response = await POST(
        API_HEADER.LIKES_GET
      );

      console.log(
        "SAVED REACTIONS:",
        response
      );


      const reactionMap = {};


      (
        response.likedMovies || []
      ).forEach((item) => {

        const movieId =
          item.movieId &&
          typeof item.movieId === "object"
            ? item.movieId._id
            : item.movieId;


        if (
          movieId &&
          item.reaction
        ) {

          reactionMap[
            String(movieId)
          ] = item.reaction;

        }

      });


      setMovieReactions(
        reactionMap
      );


    } catch (error) {

      console.error(
        "Load reactions error:",
        error.response?.data ||
        error.message
      );

    }

  }


  loadReactions();

}, [token]);  

  /*
    =========================
    RECENTLY ADDED
    =========================
  */

  const recentlyAddedMovies =
    allMovies
      .filter(
        (movie) =>
          movie.section ===
          "recently-added"
      )
      .sort(
        (a, b) =>
          a.order -
          b.order
      );


  /*
    =========================
    ONLY ON NETFLIX
    =========================
  */

  const netflixOriginalMovies =
    allMovies
      .filter(
        (movie) =>
          movie.section ===
          "netflix-original"
      )
      .sort(
        (a, b) =>
          a.order -
          b.order
      );


  /*
    =========================
    TRENDING
    =========================
  */

  const trendingMovies =
    allMovies
      .filter(
        (movie) =>
          movie.section ===
          "trending"
      )
      .sort(
        (a, b) =>
          a.order -
          b.order
      );


  /*
    =========================
    TOP 10
    =========================
  */

  const topTenMovies =
    allMovies
      .filter(
        (movie) =>
          movie.section ===
          "top-10"
      )
      .sort(
        (a, b) =>
          Number(a.rank) -
          Number(b.rank)
      );


  /*
    =========================
    HERO CONTROLS
    =========================
  */

  function toggleMute() {
    setMuted(
      (previous) =>
        !previous
    );
  }


  function toggleVideo() {
    const video =
      videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      video.play();

      setPlaying(true);
    } else {
      video.pause();

      setPlaying(false);
    }
  }


  /*
    =========================
    SLIDERS
    =========================
  */

  function nextSlide1() {
    setSlide1(
      (previous) =>
        previous < 2
          ? previous + 1
          : previous
    );
  }


  function prevSlide1() {
    setSlide1(
      (previous) =>
        previous > 0
          ? previous - 1
          : previous
    );
  }


  function nextSlide2() {
    setSlide2(
      (previous) =>
        previous < 2
          ? previous + 1
          : previous
    );
  }


  function prevSlide2() {
    setSlide2(
      (previous) =>
        previous > 0
          ? previous - 1
          : previous
    );
  }


  /*
    =========================
    MY LIST
    =========================
  */

  async function toggleMyList(
    movie
  ) {
    if (
      addingMovieId !== null
    ) {
      return;
    }

    if (!token) {
      setListError(
        "Login token is missing."
      );

      return;
    }

const normalizedTitle =
  String(movie.title || "")
    .trim()
    .toLowerCase();

const isAlreadyAdded =
  myListMovies.ids.includes(
    String(movie.id)
  ) ||
  myListMovies.titles.includes(
    normalizedTitle
  );

    setAddingMovieId(
      movie.id
    );

    setListError("");

    try {
      if (isAlreadyAdded) {
        const response =
          await POST(
            API_HEADER.MYLIST_REMOVE,
            {
              movieId:
                movie.id,
            }
          );

        if (
          response.success ===
          true
        ) {
          setMyListMovies(
  (previous) => ({
    ids: previous.ids.filter(
      (id) =>
        String(id) !==
        String(movie.id)
    ),

    titles: previous.titles.filter(
      (title) =>
        title !== normalizedTitle
    ),
  })
);
        }
      } else {
        const response =
          await POST(
            API_HEADER.MYLIST_ADD,
            {
              movieId:
                movie.id,

              title:
                movie.title,

              genre:
                movie.genre,

              image:
                movie.image,
            }
          );

        if (
          response.success ===
          true
        ) {
         setMyListMovies(
  (previous) => ({
    ids: previous.ids.includes(
      String(movie.id)
    )
      ? previous.ids
      : [
          ...previous.ids,
          String(movie.id),
        ],

    titles: previous.titles.includes(
      normalizedTitle
    )
      ? previous.titles
      : [
          ...previous.titles,
          normalizedTitle,
        ],
  })
);
        }
      }
    } catch (error) {
      console.error(
        "My List error:",
        error.response?.data ||
        error.message
      );

      setListError(
        error.response?.data
          ?.message ||
        "Unable to update My List."
      );
    } finally {
      setAddingMovieId(
        null
      );
    }
  }


  /*
    =========================
    REACTION
    =========================
  */

  async function handleReaction(
  movie,
  reaction
) {
  if (
    !token ||
    reactingMovieId !== null
  ) {
    return;
  }

  setReactingMovieId(
    movie.id
  );

  setReactionError("");

  try {
    const response = await POST(
      API_HEADER.LIKES_TOGGLE,
      {
        movieId:
          movie.id,

        title:
          movie.title,

        genre:
          movie.genre,

        image:
          movie.image,

        reaction,
      }
    );

    if (response.success) {
      setMovieReactions(
        (previous) => ({
          ...previous,

          [movie.id]:
            response.reaction || "",
        })
      );

      if (response.removed) {
        setMovieReactions(
          (previous) => {
            const updated = {
              ...previous,
            };

            delete updated[
              movie.id
            ];

            return updated;
          }
        );
      }
    }

  } catch (error) {
    console.error(
      "Reaction error:",
      error.response?.data ||
        error.message
    );

    setReactionError(
      error.response?.data?.message ||
        "Unable to update reaction."
    );

  } finally {
    setReactingMovieId(
      null
    );
  }
}


  /*
    =========================
    MOVIE CARD
    =========================
  */

  function renderMovieCard(
    movie,
    key
  ) {
    return (
      <div
        className="movie-item"
        key={key}
      >
        {movie.image ? (
          <img
            src={movie.image}
            alt={movie.title}
            className="movie-poster"
          />
        ) : (
          <div className="movie-poster movie-no-image">
            No Image
          </div>
        )}

        <div className="movie-hover">

          <div className="hover-media">

            {movie.trailer ? (
              <video
                src={
                  movie.trailer
                }
                poster={
                  movie.image
                }
                className="hover-image"
                muted
                loop
                playsInline
              />
            ) : movie.image ? (
              <img
                src={
                  movie.image
                }
                alt={
                  movie.title
                }
                className="hover-image"
              />
            ) : (
              <div className="hover-image movie-no-image">
                No Image
              </div>
            )}

          </div>

          <div className="hover-content">

            <div className="c-content">

              <p className="hover-meta">
                <span>
                  Film |
                </span>

                <span>
                  {movie.genre}
                </span>
              </p>

            </div>

            <p className="hover-year">

              {movie.year && (
                <span>
                  {movie.year}
                </span>
              )}

              {movie.duration && (
                <span>
                  {
                    movie.duration
                  }
                </span>
              )}

              {movie.rating && (
                <span className="rating-badge">
                  {
                    movie.rating
                  }
                </span>
              )}

              <span>
                HD
              </span>

            </p>

            <div className="hover-icons">

              <div className="hover-icons-left">

                <button
                  type="button"
                  className="icon-circle play-btn"
                >
                  <i className="fa-solid fa-play"></i>
                </button>

                <button
                  type="button"
                  className="icon-circles"
                  onClick={() =>
                    toggleMyList(
                      movie
                    )
                  }
                  disabled={
                    addingMovieId ===
                    movie.id
                  }
                  title={
  myListMovies.ids.includes(
    String(movie.id)
  ) ||
  myListMovies.titles.includes(
    String(movie.title || "")
      .trim()
      .toLowerCase()
  )
    ? "Added to My List"
    : "Add to My List"
}
                >
                  {addingMovieId ===
                    movie.id ? (
                    <span className="mylist-small-spinner"></span>
                  ) : (
                    <i
                      className={
  myListMovies.ids.includes(
    String(movie.id)
  ) ||
  myListMovies.titles.includes(
    String(movie.title || "")
      .trim()
      .toLowerCase()
  )
    ? "fa-solid fa-check"
    : "fa-solid fa-plus"
}
                    ></i>
                  )}
                </button>

                <LikeMenu2
                  currentReaction={
                    movieReactions[
                    movie.id
                    ] || ""
                  }
                  disabled={
                    reactingMovieId ===
                    movie.id
                  }
                  onReactionSelect={(
                    reaction
                  ) =>
                    handleReaction(
                      movie,
                      reaction
                    )
                  }
                />

              </div>

              <button
                type="button"
                className="icon-circles info-btn"
                onClick={() =>
                  setSelectedInfoMovie(
                    movie
                  )
                }
              >
                <i className="fa-solid fa-circle-info"></i>
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }


  /*
    =========================
    LOADING
    =========================
  */

  if (moviesLoading) {
    return (
      <div className="movie-api-loading">
        Loading movies...
      </div>
    );
  }


  if (moviesError) {
    return (
      <div className="movie-api-error">
        {moviesError}
      </div>
    );
  }


  return (
    <>

      {/* ================= HERO ================= */}

      {heroMovie && (
        <div className="movie-cards">

          {heroMovie.trailer ? (
            <video
              ref={videoRef}
              className="movie-video"
              src={
                heroMovie.trailer
              }
              poster={
                heroMovie.banner ||
                heroMovie.image
              }
              autoPlay
              muted={muted}
              loop
              playsInline
              onPlay={() =>
                setPlaying(true)
              }
              onPause={() =>
                setPlaying(false)
              }
            />
          ) : (
            <img
              src={
                heroMovie.banner ||
                heroMovie.image
              }
              alt={
                heroMovie.title
              }
              className="movie-video"
            />
          )}

          <div className="movie-overlay"></div>


          <div className="movie-content">

            {heroMovie.titleLogo ? (
              <img
                src={
                  heroMovie.titleLogo
                }
                alt={
                  heroMovie.title
                }
                className="dynamic-hero-logo"
              />
            ) : (
              <h1 className="dynamic-hero-title">
                {heroMovie.title}
              </h1>
            )}


            <p className="movie-meta">

              <span>
                Film
              </span>

              <span>
                {heroMovie.genre}
              </span>

              {heroMovie.year && (
                <span>
                  {
                    heroMovie.year
                  }
                </span>
              )}

              {heroMovie.duration && (
                <span>
                  {
                    heroMovie.duration
                  }
                </span>
              )}

              {heroMovie.rating && (
                <span>
                  {
                    heroMovie.rating
                  }
                </span>
              )}

            </p>


            <p className="movie-metas">
              {
                heroMovie.description
              }
            </p>


            <div className="movie-buttons">

              <button
                type="button"
                className="btn-play"
              >
                <i className="fa-solid fa-play"></i>

                Play
              </button>

              <button
                type="button"
                className="btn-info"
                onClick={() =>
                  setSelectedInfoMovie(
                    heroMovie
                  )
                }
              >
                More Info
              </button>

            </div>

          </div>


          <div className="movie-badges">

            <span className="badge">

              <img
                className="badge-icon"
                src={hand}
                alt=""
              />

              We think you'll love this!

            </span>

          </div>


          {heroMovie.trailer && (
            <div className="hero-video-controls">

              <button
                type="button"
                className="hero-control-button"
                onClick={
                  toggleVideo
                }
              >
                <i
                  className={
                    playing
                      ? "fa-solid fa-pause"
                      : "fa-solid fa-play"
                  }
                ></i>
              </button>


              <button
                type="button"
                className="hero-control-button"
                onClick={
                  toggleMute
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

            </div>
          )}

        </div>
      )}


      {/* ================= RECENTLY ADDED ================= */}

      {recentlyAddedMovies.length > 0 && (

        <section className="movie-section">

          <h2>
            Recently Added
          </h2>


          <div className="slider-wrapper">

            <button
              type="button"
              className="slider-btn left"
              onClick={
                prevSlide1
              }
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>


            <div
              className="movie-row"
              style={{
                transform: `translateX(-${slide1 * 1100
                  }px)`,
              }}
            >

              {recentlyAddedMovies.map(
                (
                  movie,
                  index
                ) =>
                  renderMovieCard(
                    movie,
                    `${movie.id}-recent-${index}`
                  )
              )}

            </div>


            <button
              type="button"
              className="slider-btn right"
              onClick={
                nextSlide1
              }
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>

          </div>

        </section>

      )}


      {/* ================= ONLY ON NETFLIX ================= */}

      {netflixOriginalMovies.length > 0 && (

        <section className="movie-section">

          <h2>
            Only on Netflix
          </h2>


          <div className="slider-wrapper">

            <button
              type="button"
              className="slider-btn left"
              onClick={
                prevSlide2
              }
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>


            <div
              className="movie-row"
              style={{
                transform: `translateX(-${slide2 * 1100
                  }px)`,
              }}
            >

              {netflixOriginalMovies.map(
                (
                  movie,
                  index
                ) =>
                  renderMovieCard(
                    movie,
                    `${movie.id}-netflix-${index}`
                  )
              )}

            </div>


            <button
              type="button"
              className="slider-btn right"
              onClick={
                nextSlide2
              }
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>

          </div>

        </section>

      )}


      {/* ================= ERRORS ================= */}

      {listError && (
        <p className="movie-api-error">
          {listError}
        </p>
      )}


      {reactionError && (
        <p className="movie-api-error">
          {reactionError}
        </p>
      )}


      {/* ================= INFO MODAL ================= */}

      <InfoModal
        movie={
          selectedInfoMovie
        }

        onClose={() =>
          setSelectedInfoMovie(
            null
          )
        }

        currentReaction={
          selectedInfoMovie
            ? movieReactions[
            selectedInfoMovie.id
            ] || ""
            : ""
        }

        onReactionSelect={(
          reaction
        ) => {
          if (
            !selectedInfoMovie
          ) {
            return;
          }

          handleReaction(
            selectedInfoMovie,
            reaction
          );
        }}

        isInMyList={
  selectedInfoMovie
    ? (
        myListMovies.ids.includes(
          String(
            selectedInfoMovie.id
          )
        ) ||
        myListMovies.titles.includes(
          String(
            selectedInfoMovie.title || ""
          )
            .trim()
            .toLowerCase()
        )
      )
    : false
}

        myListLoading={
          selectedInfoMovie
            ? addingMovieId ===
            selectedInfoMovie.id
            : false
        }

        onMyListToggle={
          toggleMyList
        }
      />

    </>
  );
}

export default Moviepage;