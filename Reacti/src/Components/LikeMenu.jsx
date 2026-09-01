import React, { useState } from "react";
import "./LikeMenu.css";

function LikeMenu({
  currentReaction = "",
  onReactionSelect,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);

  function chooseReaction(reaction) {
    if (disabled) {
      return;
    }

    onReactionSelect(reaction);
    setOpen(false);
  }

  function renderReactionIcon(reaction) {
    if (reaction === "dislike") {
      return (
        <i className="fa-regular fa-thumbs-down"></i>
      );
    }

    if (reaction === "love") {
      return (
        <span className="double-thumbs-icon">
          <i className="fa-regular fa-thumbs-up"></i>
          <i className="fa-regular fa-thumbs-up"></i>
        </span>
      );
    }

    if (reaction === "like") {
      return (
        <i className="fa-solid fa-thumbs-up"></i>
      );
    }

    return (
      <i className="fa-regular fa-thumbs-up"></i>
    );
  }

  return (
    <div
      className="like-menu-wrapper"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className={`like-reaction-popup ${
          open ? "like-reaction-popup-open" : ""
        }`}
      >
        <button
          type="button"
          className={`like-reaction-button ${
            currentReaction === "dislike"
              ? "reaction-selected"
              : ""
          }`}
          onClick={() =>
            chooseReaction("dislike")
          }
          disabled={disabled}
          aria-label="Not for me"
        >
          <i className="fa-regular fa-thumbs-down"></i>

          <span className="reaction-tooltip">
            Not for me
          </span>
        </button>

        <button
          type="button"
          className={`like-reaction-button ${
            currentReaction === "like"
              ? "reaction-selected"
              : ""
          }`}
          onClick={() =>
            chooseReaction("like")
          }
          disabled={disabled}
          aria-label="I like this"
        >
          <i className="fa-regular fa-thumbs-up"></i>

          <span className="reaction-tooltip">
            I like this
          </span>
        </button>

        <button
          type="button"
          className={`like-reaction-button ${
            currentReaction === "love"
              ? "reaction-selected"
              : ""
          }`}
          onClick={() =>
            chooseReaction("love")
          }
          disabled={disabled}
          aria-label="Love this"
        >
          <span className="double-thumbs-icon">
            <i className="fa-regular fa-thumbs-up"></i>
            <i className="fa-regular fa-thumbs-up"></i>
          </span>

          <span className="reaction-tooltip">
            Love this!
          </span>
        </button>
      </div>

      <button
        type="button"
        className={`main-like-button ${
          currentReaction
            ? "main-like-selected"
            : ""
        }`}
        disabled={disabled}
        aria-label="Rate this title"
        onClick={() => setOpen((previous) => !previous)}
      >
        {renderReactionIcon(currentReaction)}
      </button>
    </div>
  );
}

export default LikeMenu;