import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import LikeMenuModal from "./LikeMenuModal";

import "./InfoModal.css";

function InfoModal({
  movie,
  onClose,
  currentReaction = "",
  onReactionSelect,
  isInMyList = false,
  myListLoading = false,
  onMyListToggle,
}) {
  const [muted, setMuted] =
    useState(true);

  const [
    videoReady,
    setVideoReady,
  ] = useState(false);

  const videoRef =
    useRef(null);

  useEffect(() => {
    if (!movie) {
      return;
    }

    document.body.style.overflow =
      "hidden";

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [movie, onClose]);

  useEffect(() => {
    setMuted(true);
    setVideoReady(false);

    const video =
      videoRef.current;

    if (
      !movie ||
      !movie.trailer ||
      !video
    ) {
      return;
    }

    function handleCanPlay() {
      setVideoReady(true);

      const playPromise =
        video.play();

      if (playPromise) {
        playPromise.catch(
          (error) => {
            console.log(
              "Trailer autoplay unavailable:",
              error.message
            );
          }
        );
      }
    }

    function handleVideoError() {
      setVideoReady(false);

      console.log(
        "Unsupported trailer source:",
        movie.trailer
      );
    }

    video.addEventListener(
      "canplay",
      handleCanPlay
    );

    video.addEventListener(
      "error",
      handleVideoError
    );

    return () => {
      video.removeEventListener(
        "canplay",
        handleCanPlay
      );

      video.removeEventListener(
        "error",
        handleVideoError
      );

      video.pause();

      try {
        video.currentTime = 0;
      } catch {
        // ignore
      }
    };
  }, [movie]);

  async function playVideo() {
    const video =
      videoRef.current;

    if (
      !video ||
      !movie?.trailer
    ) {
      return;
    }

    try {
      video.currentTime = 0;

      await video.play();

      if (
        video.requestFullscreen
      ) {
        await video.requestFullscreen();
      }
    } catch (error) {
      console.log(
        "Unable to play trailer:",
        error.message
      );
    }
  }

  if (!movie) {
    return null;
  }

  const heroImage =
    movie.preview ||
    movie.banner ||
    movie.image ||
    null;

  return (
    <div
      className="info-modal-overlay"
      onClick={onClose}
    >
      <article
        className="info-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="info-modal-close"
          onClick={onClose}
          aria-label="Close movie information"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <section className="info-modal-hero">

          {heroImage && (
            <img
              src={heroImage}
              alt={movie.title}
              className={`info-modal-hero-image ${
                videoReady
                  ? "info-modal-image-hidden"
                  : ""
              }`}
            />
          )}

          {movie.trailer && (
            <video
              ref={videoRef}
              className={`info-modal-hero-video ${
                videoReady
                  ? "info-modal-video-visible"
                  : ""
              }`}
              src={movie.trailer}
              poster={
                heroImage ||
                undefined
              }
              muted={muted}
              loop
              playsInline
              preload="metadata"
            />
          )}

          <div className="info-modal-hero-gradient"></div>

          <div className="info-modal-hero-content">
            <h1>
              {movie.title}
            </h1>

            <div className="info-modal-actions">

              <button
                type="button"
                className="info-modal-play"
                onClick={
                  playVideo
                }
                disabled={
                  !movie.trailer
                }
              >
                <i className="fa-solid fa-play"></i>

                <span>
                  Play
                </span>
              </button>

              <button
                type="button"
                className="info-modal-action-button"
                onClick={() =>
                  onMyListToggle?.(
                    movie
                  )
                }
                disabled={
                  myListLoading
                }
                title={
                  isInMyList
                    ? "Remove from My List"
                    : "Add to My List"
                }
              >
                {myListLoading ? (
                  <span className="mylist-small-spinner"></span>
                ) : (
                  <i
                    className={
                      isInMyList
                        ? "fa-solid fa-check"
                        : "fa-solid fa-plus"
                    }
                  ></i>
                )}
              </button>

              <LikeMenuModal
                currentReaction={
                  currentReaction
                }
                onReactionSelect={
                  onReactionSelect
                }
              />
            </div>
          </div>

          {movie.trailer && (
            <button
              type="button"
              className="info-modal-volume"
              onClick={() =>
                setMuted(
                  (previous) =>
                    !previous
                )
              }
              aria-label={
                muted
                  ? "Unmute trailer"
                  : "Mute trailer"
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
          )}
        </section>

        <div className="info-modal-body">

          <section className="info-modal-details">

            <div className="info-modal-main">

              <div className="info-modal-meta">

                <span className="info-modal-match">
                  98% Match
                </span>

                <span>
                  {movie.year ||
                    "2026"}
                </span>

                <span>
                  {movie.duration ||
                    "2h 29m"}
                </span>

                <span className="info-modal-age">
                  {movie.rating ||
                    "U/A 13+"}
                </span>

                <span className="info-modal-hd">
                  HD
                </span>

              </div>

              <p className="info-modal-description">
                {movie.description ||
                  "A gripping story of courage, relationships and unexpected challenges that change the characters forever."}
              </p>

            </div>

            <aside className="info-modal-sidebar">

              <p>
                <span>
                  Cast:
                </span>{" "}

                {movie.cast?.length
                  ? movie.cast.join(
                      ", "
                    )
                  : "Lead actors and supporting cast"}
              </p>

              <p>
                <span>
                  Genres:
                </span>{" "}

                {movie.genre ||
                  movie.category ||
                  "Drama"}
              </p>

              <p>
                <span>
                  This movie is:
                </span>{" "}
                Emotional, exciting,
                inspiring
              </p>

            </aside>

          </section>

          <section className="info-modal-section">

            <h2>
              {movie.title} Collection
            </h2>

            <div className="info-modal-grid">

              <article className="info-related-card">

                {movie.image && (
                  <img
                    src={
                      movie.image
                    }
                    alt={
                      movie.title
                    }
                  />
                )}

                <div className="info-related-content">

                  <div>
                    <span>
                      {movie.rating ||
                        "U/A 13+"}
                    </span>

                    <span>
                      {movie.year ||
                        "2026"}
                    </span>
                  </div>

                  <p>
                    Discover more stories
                    from this collection.
                  </p>

                </div>

              </article>

            </div>

          </section>

          <section className="info-modal-section">

            <h2>
              More Like This
            </h2>

            <div className="info-modal-grid">

              <article className="info-related-card">

                {movie.image && (
                  <img
                    src={
                      movie.image
                    }
                    alt="Related title"
                  />
                )}

                <div className="info-related-content">

                  <div>
                    <span>
                      {movie.rating ||
                        "U/A 13+"}
                    </span>

                    <span>
                      {movie.duration ||
                        "2h 15m"}
                    </span>
                  </div>

                  <p>
                    A story with similar
                    themes and unforgettable
                    characters.
                  </p>

                </div>

              </article>

            </div>

          </section>

          <section className="info-modal-about">

            <h2>
              About{" "}
              <strong>
                {movie.title}
              </strong>
            </h2>

            <p>
              <span>
                Creator:
              </span>{" "}

              {movie.creator ||
                "Popular filmmaker"}
            </p>

            <p>
              <span>
                Cast:
              </span>{" "}

              {movie.cast?.length
                ? movie.cast.join(
                    ", "
                  )
                : "Lead actors and supporting cast"}
            </p>

            <p>
              <span>
                Genres:
              </span>{" "}

              {movie.genre ||
                movie.category ||
                "Drama"}
            </p>

            <p>
              <span>
                Maturity rating:
              </span>{" "}

              {movie.rating ||
                "U/A 13+"}
            </p>

          </section>

        </div>
      </article>
    </div>
  );
}

export default InfoModal;