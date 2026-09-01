import React, {
    useEffect,
    useState,
} from "react";

import {
    GET,
    POST,
} from "../api/api";

import API_HEADER from "../api/apiHeader";

import {
    getAuthToken,
} from "../utils/auth";

import {
    useLocation,
} from "react-router-dom";

import Movienav from "../Components/Movienav";

import "./MyList.css";


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


function MyList() {
    const location =
        useLocation();

    const token =
        getAuthToken() || "";

    const currentProfile =
        location.state?.selectedProfile ||
        null;


    const [movies, setMovies] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [
        removingMovieId,
        setRemovingMovieId,
    ] = useState(null);


    /*
      =========================
      LOAD MY LIST
      =========================
    */

    useEffect(() => {
        async function loadMyList() {
            if (!token) {
                setError(
                    "Login token is missing."
                );

                setLoading(false);

                return;
            }

            try {
                setLoading(true);

                setError("");

                const response = await GET(
                    API_HEADER.MYLIST_GET
                );

                console.log(
                    "MY LIST FULL RESPONSE:",
                    response
                );

                console.log(
                    "MY LIST ITEMS:",
                    response.myList
                );

                setMovies(
                    response.myList || []
                );

            } catch (error) {
                console.error(
                    "Load My List error:",
                    error.response?.data ||
                    error.message
                );

                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to load My List."
                );

            } finally {
                setLoading(false);
            }
        }

        loadMyList();

    }, [token]);


    /*
      =========================
      REMOVE MOVIE
      =========================
    */

    async function removeMovie(
        movieId
    ) {
        if (removingMovieId !== null) {
            return;
        }

        setRemovingMovieId(
            movieId
        );

        setError("");

        try {
            const response =
                await POST(
                    API_HEADER.MYLIST_REMOVE,
                    {
                        movieId,
                    }
                );

            console.log(
                "Remove My List response:",
                response
            );

            if (
                response.success === true
            ) {
                setMovies(
                    (previousMovies) =>
                        previousMovies.filter(
                            (item) => {
                                const currentMovieId =
                                    item.movieId?._id ||
                                    item.movieId;

                                return (
                                    String(
                                        currentMovieId
                                    ) !==
                                    String(movieId)
                                );
                            }
                        )
                );
            }

        } catch (error) {
            console.error(
                "Remove My List error:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data
                    ?.message ||
                "Unable to remove movie from My List."
            );

        } finally {
            setRemovingMovieId(
                null
            );
        }
    }


    /*
      =========================
      JSX
      =========================
    */

    return (
        <div className="mylist-page">

            <Movienav
                token={token}
                currentProfile={
                    currentProfile
                }
            />


            <main className="mylist-main">

                <h1>
                    My List
                </h1>


                {/* =====================
            LOADING
        ===================== */}

                {loading && (
                    <div className="mylist-loading">

                        <div className="mylist-loader"></div>

                        <p>
                            Loading your list...
                        </p>

                    </div>
                )}


                {/* =====================
            ERROR
        ===================== */}

                {error && (
                    <p className="mylist-error">
                        {error}
                    </p>
                )}


                {/* =====================
            EMPTY
        ===================== */}

                {!loading &&
                    !error &&
                    movies.length === 0 && (

                        <div className="mylist-empty">

                            <h2>
                                Your list is empty
                            </h2>

                            <p>
                                Add shows and movies
                                using the + button.
                            </p>

                        </div>
                    )}


                {/* =====================
            MOVIES
        ===================== */}

                {!loading &&
                    movies.length > 0 && (

                        <div className="mylist-grid">

                            {movies.map(
                                (item) => {

                                    /*
                                      movieId may now be
                                      populated from MongoDB
                                    */

                                    const movieData =
                                        item.movieId &&
                                            typeof item.movieId ===
                                            "object"
                                            ? item.movieId
                                            : null;


                                    const movieMongoId =
                                        movieData?._id ||
                                        item.movieId;


                                    const title =
                                        movieData?.title ||
                                        item.title ||
                                        "Movie";


                                    const genre =
                                        movieData?.genres
                                            ?.join(", ") ||
                                        item.genre ||
                                        "Movie";


                                    const rawImage =
                                        movieData?.posterUrl ||
                                        movieData?.thumbnailUrl ||
                                        movieData?.bannerUrl ||
                                        item.image ||
                                        "";


                                    const image =
                                        getMediaUrl(
                                            rawImage
                                        );


                                    const isRemoving =
                                        String(
                                            removingMovieId
                                        ) ===
                                        String(
                                            movieMongoId
                                        );


                                    return (
                                        <article
                                            className="mylist-card"
                                            key={item._id}
                                        >

                                            {/* IMAGE */}

                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={title}
                                                    className="mylist-image"
                                                />
                                            ) : (
                                                <div className="mylist-image mylist-no-image">
                                                    No Image
                                                </div>
                                            )}


                                            {/* OVERLAY */}

                                            <div className="mylist-card-overlay">

                                                <h3>
                                                    {title}
                                                </h3>

                                                <p>
                                                    {genre}
                                                </p>


                                                <div className="mylist-actions">

                                                    {/* PLAY */}

                                                    <button
                                                        type="button"
                                                        className="mylist-play"
                                                        title="Play"
                                                    >
                                                        <i className="fa-solid fa-play"></i>
                                                    </button>


                                                    {/* REMOVE */}

                                                    <button
                                                        type="button"
                                                        className="mylist-remove"
                                                        onClick={() =>
                                                            removeMovie(
                                                                movieMongoId
                                                            )
                                                        }
                                                        disabled={
                                                            isRemoving
                                                        }
                                                        title="Remove from My List"
                                                    >

                                                        {isRemoving ? (
                                                            <span className="mylist-small-spinner"></span>
                                                        ) : (
                                                            <i className="fa-solid fa-check"></i>
                                                        )}

                                                    </button>


                                                    {/* INFO */}

                                                    <button
                                                        type="button"
                                                        className="mylist-info"
                                                        title="More Info"
                                                    >
                                                        <i className="fa-solid fa-circle-info"></i>
                                                    </button>

                                                </div>

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </div>
                    )}

            </main>

        </div>
    );
}


export default MyList;