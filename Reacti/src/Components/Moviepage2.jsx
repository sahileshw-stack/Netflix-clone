import React, {
  useEffect,
  useState,
} from "react";
import LikeMenu2 from "../Components/LikeMenu2";
import {
  GET,
  POST,
} from "../api/api";

import API_HEADER from "../api/apiHeader";

import {
  getAuthToken,
} from "../utils/auth";

import InfoModal from "../Components/InfoModal";

import "./Moviepage.css";

function Moviepages() {

  

  const BACKEND_URL =
    "http://localhost:5000";

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

  const token =
    getAuthToken() || "";

  /*
    ==============================
    INFO MODAL
    ==============================
  */

  const [
    selectedInfoMovie,
    setSelectedInfoMovie,
  ] = useState(null);

  /*
    ==============================
    MY LIST
    ==============================
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
    ==============================
    ALL MOVIES
    ==============================
  */

  const [
    allMovies,
    setAllMovies,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    movieError,
    setMovieError,
  ] = useState("");

  /*
    ==============================
    RECENTLY ADDED
    ==============================
  */

  const [
    recentMovies,
    setRecentMovies,
  ] = useState([]);

  const [
    recentLoading,
    setRecentLoading,
  ] = useState(true);

  const [
    recentError,
    setRecentError,
  ] = useState("");

  /*
    ==============================
    SLIDERS
    ==============================
  */

  const [
    recentSlide,
    setRecentSlide,
  ] = useState(0);

  const [
    slide3,
    setSlide3,
  ] = useState(0);

  const [
    slide4,
    setSlide4,
  ] = useState(0);

  /*
    ==============================
    LOAD ALL PUBLISHED MOVIES
    ==============================
  */

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setMovieError("");

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
              id: movie._id,

              title:
                movie.title ||
                "Untitled",

              genre:
                movie.genres?.length
                  ? movie.genres.join(
                    ", "
                  )
                  : "Movie",

              image: getMediaUrl(
                movie.thumbnailUrl ||
                movie.posterUrl ||
                movie.bannerUrl
              ),

              poster: getMediaUrl(
                movie.posterUrl
              ),

              banner: getMediaUrl(
                movie.bannerUrl
              ),

              trailer: getMediaUrl(
                movie.trailerUrl
              ),

              description:
                movie.description ||
                "",

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

              cast:
                movie.cast || [],

              displayOptions:
                movie.displayOptions ||
                {},

              section:
                movie.section ||
                "",

              order:
                movie.order || 1,

              rank:
                movie.rank || null,
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

        setMovieError(
          error.response?.data
            ?.message ||
          "Unable to load movies."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  /*
    ==============================
    LOAD RECENTLY ADDED
    ==============================
  */

  useEffect(() => {
    async function loadRecentlyAdded() {
      try {
        setRecentLoading(true);
        setRecentError("");

        const response =
          await GET(
            `${API_HEADER.MOVIES_GET}?section=recently-added`
          );

        if (
          response.success === true
        ) {
          const formattedMovies =
            (
              response.movies || []
            ).map((movie) => ({
              id: movie._id,

              title:
                movie.title ||
                "Untitled",

              genre:
                movie.genres?.length >
                  0
                  ? movie.genres.join(
                    ", "
                  )
                  : "Movie",

              image: getMediaUrl(
                movie.thumbnailUrl ||
                movie.posterUrl ||
                movie.bannerUrl
              ),

              poster: getMediaUrl(
                movie.posterUrl
              ),

              banner: getMediaUrl(
                movie.bannerUrl
              ),

              trailer: getMediaUrl(
                movie.trailerUrl
              ),

              description:
                movie.description ||
                "",

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

              cast:
                movie.cast || [],

              order:
                movie.order || 1,

              section:
                movie.section ||
                "",
            }));

          setRecentMovies(
            formattedMovies
          );
        }
      } catch (error) {
        console.error(
          "Load Recently Added error:",
          error.response?.data ||
          error.message
        );

        setRecentError(
          error.response?.data
            ?.message ||
          "Unable to load Recently Added movies."
        );
      } finally {
        setRecentLoading(false);
      }
    }

    loadRecentlyAdded();
  }, []);

  /*
    ==============================
    LOAD MY LIST
    ==============================
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

useEffect(() => {

  async function loadReactions() {

    if (!token) {
      return;
    }

    try {

      const response = await POST(
        API_HEADER.LIKES_GET
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
    ==============================
    OLD DISPLAY OPTION FILTERS

    We keep these for now.
    Later we connect each section
    separately just like Recently Added.
    ==============================
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
          Number(a.order || 1) -
          Number(b.order || 1)
      );


  const trendingMovies =
    allMovies
      .filter(
        (movie) =>
          movie.section ===
          "trending"
      )
      .sort(
        (a, b) =>
          Number(a.order || 1) -
          Number(b.order || 1)
      );

  const rowThreeMovies =
    netflixOriginalMovies;

  const rowFourMovies =
    trendingMovies;



  /*
    ==============================
    SLIDER FUNCTIONS
    ==============================
  */

  const maxSlide = 2;

  function nextRecentSlide() {
    if (
      recentSlide < maxSlide
    ) {
      setRecentSlide(
        recentSlide + 1
      );
    }
  }

  function prevRecentSlide() {
    if (
      recentSlide > 0
    ) {
      setRecentSlide(
        recentSlide - 1
      );
    }
  }

  function nextSlide3() {
    if (
      slide3 < maxSlide
    ) {
      setSlide3(
        slide3 + 1
      );
    }
  }

  function prevSlide3() {
    if (
      slide3 > 0
    ) {
      setSlide3(
        slide3 - 1
      );
    }
  }

  function nextSlide4() {
    if (
      slide4 < maxSlide
    ) {
      setSlide4(
        slide4 + 1
      );
    }
  }

  function prevSlide4() {
    if (
      slide4 > 0
    ) {
      setSlide4(
        slide4 - 1
      );
    }
  }

  /*
    ==============================
    MY LIST
    ==============================
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
        "My List toggle error:",
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

      } else {

        setMovieReactions(
          (previous) => ({
            ...previous,

            [movie.id]:
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
    ==============================
    MOVIE CARD
    ==============================
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
            <p className="hover-meta">
              <span>
                Film |
              </span>

              <span>
                {movie.genre}
              </span>
            </p>

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
    ==============================
    MAIN LOADING
    ==============================
  */

  if (loading) {
    return (
      <p className="movie-api-loading">
        Loading movies...
      </p>
    );
  }

  if (movieError) {
    return (
      <p className="movie-api-error">
        {movieError}
      </p>
    );
  }

  return (
    <>
      {/* =========================
          RECENTLY ADDED
         ========================= */}

      <section className="movie-section">
        <h2>
          Recently Added
        </h2>

        {recentLoading && (
          <p className="movie-api-loading">
            Loading Recently Added...
          </p>
        )}

        {recentError && (
          <p className="movie-api-error">
            {recentError}
          </p>
        )}

        {!recentLoading &&
          !recentError &&
          recentMovies.length ===
          0 && (
            <p className="movie-api-empty-row">
              No recently added
              movies.
            </p>
          )}

        {recentMovies.length >
          0 && (
            <div className="slider-wrapper">
              <button
                type="button"
                className="slider-btn left"
                onClick={
                  prevRecentSlide
                }
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <div
                className="movie-row"
                style={{
                  transform: `translateX(-${recentSlide *
                    1100
                    }px)`,
                }}
              >
                {recentMovies.map(
                  (movie) =>
                    renderMovieCard(
                      movie,
                      `recent-${movie.id}`
                    )
                )}
              </div>

              <button
                type="button"
                className="slider-btn right"
                onClick={
                  nextRecentSlide
                }
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
      </section>

      {/* =========================
          ONLY ON NETFLIX
         ========================= */}

      {rowThreeMovies.length >
        0 && (
          <section className="movie-section">
            <h2>
              Only on Netflix
            </h2>

            <div className="slider-wrapper">
              <button
                type="button"
                className="slider-btn left"
                onClick={
                  prevSlide3
                }
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <div
                className="movie-row"
                style={{
                  transform: `translateX(-${slide3 * 1100
                    }px)`,
                }}
              >
                {rowThreeMovies.map(
                  (movie) =>
                    renderMovieCard(
                      movie,
                      `original-${movie.id}`
                    )
                )}
              </div>

              <button
                type="button"
                className="slider-btn right"
                onClick={
                  nextSlide3
                }
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </section>
        )}

      {/* =========================
          TRENDING NOW
         ========================= */}

      {rowFourMovies.length >
        0 && (
          <section className="movie-section">
            <h2>
              Trending Now
            </h2>

            <div className="slider-wrapper">
              <button
                type="button"
                className="slider-btn left"
                onClick={
                  prevSlide4
                }
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <div
                className="movie-row"
                style={{
                  transform: `translateX(-${slide4 * 1100
                    }px)`,
                }}
              >
                {rowFourMovies.map(
                  (movie) =>
                    renderMovieCard(
                      movie,
                      `trending-${movie.id}`
                    )
                )}
              </div>

              <button
                type="button"
                className="slider-btn right"
                onClick={
                  nextSlide4
                }
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </section>
        )}

      {/* MY LIST ERROR */}

      {listError && (
        <p className="movie-api-error">
          {listError}
        </p>
      )}

      {/* =========================
          INFO MODAL
         ========================= */}

      <InfoModal
        movie={
          selectedInfoMovie
        }
        onClose={() =>
          setSelectedInfoMovie(
            null
          )
        }
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

export default Moviepages;