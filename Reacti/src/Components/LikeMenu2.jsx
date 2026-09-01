// src/Components/LikeMenu2.jsx

import React, { useState } from "react";
import "./LikeMenu2.css";

function LikeMenu2({
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

  function renderMainIcon() {
    if (currentReaction === "dislike") {
      return (
        <i className="fa-regular fa-thumbs-down"></i>
      );
    }

    if (currentReaction === "love") {
      return (
        <span className="like2-double-icon">
          <i className="fa-regular fa-thumbs-up"></i>
          <i className="fa-regular fa-thumbs-up"></i>
        </span>
      );
    }

    if (currentReaction === "like") {
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
      className="like2-wrapper"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className={`like2-popup ${
          open ? "like2-popup-open" : ""
        }`}
      >
        <button
          type="button"
          className={`like2-reaction ${
            currentReaction === "dislike"
              ? "like2-selected"
              : ""
          }`}
          onClick={() =>
            chooseReaction("dislike")
          }
          disabled={disabled}
          title="Not for me"
        >
          <i className="fa-regular fa-thumbs-down"></i>
        </button>

        <button
          type="button"
          className={`like2-reaction ${
            currentReaction === "like"
              ? "like2-selected"
              : ""
          }`}
          onClick={() =>
            chooseReaction("like")
          }
          disabled={disabled}
          title="I like this"
        >
          <i className="fa-regular fa-thumbs-up"></i>
        </button>

        <button
          type="button"
          className={`like2-reaction ${
            currentReaction === "love"
              ? "like2-selected"
              : ""
          }`}
          onClick={() =>
            chooseReaction("love")
          }
          disabled={disabled}
          title="Love this"
        >
          <span className="like2-double-icon">
            <i className="fa-regular fa-thumbs-up"></i>
            <i className="fa-regular fa-thumbs-up"></i>
          </span>
        </button>
      </div>

      <button
        type="button"
        className={`like2-main ${
          currentReaction
            ? "like2-main-selected"
            : ""
        }`}
        disabled={disabled}
        onClick={() =>
          setOpen((previous) => !previous)
        }
        aria-label="Rate this title"
      >
        {renderMainIcon()}
      </button>
    </div>
  );
}

export default LikeMenu2;