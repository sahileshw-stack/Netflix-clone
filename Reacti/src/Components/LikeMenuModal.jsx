import React, { useState } from "react";
import "./LikeMenuModal.css";

function LikeMenuModal({
    currentReaction = "",
    onReactionSelect,
    disabled = false,
}) {
    const [open, setOpen] = useState(false);

    function chooseReaction(reaction) {
        if (disabled) return;

        onReactionSelect?.(reaction);
        setOpen(false);
    }

    function renderMainIcon() {
        if (currentReaction === "dislike") {
            return <i className="fa-regular fa-thumbs-down"></i>;
        }

        if (currentReaction === "love") {
            return (
                <span className="modal-like-double">
                    <i className="fa-regular fa-thumbs-up"></i>
                    <i className="fa-regular fa-thumbs-up"></i>
                </span>
            );
        }

        if (currentReaction === "like") {
            return <i className="fa-solid fa-thumbs-up"></i>;
        }

        return <i className="fa-regular fa-thumbs-up"></i>;
    }

    return (
        <div
            className="modal-like-wrapper"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <div
                className={`modal-like-popup ${open ? "modal-like-popup-open" : ""
                    }`}
            >
                <button
                    type="button"
                    className={`modal-like-reaction ${currentReaction === "dislike"
                        ? "modal-like-selected"
                        : ""
                        }`}
                    onClick={() => chooseReaction("dislike")}
                    disabled={disabled}
                >
                    <i className="fa-regular fa-thumbs-down"></i>
                </button>

                <button
                    type="button"
                    className={`modal-like-reaction ${currentReaction === "like"
                        ? "modal-like-selected"
                        : ""
                        }`}
                    onClick={() => chooseReaction("like")}
                    disabled={disabled}
                >
                    <i className="fa-regular fa-thumbs-up"></i>
                </button>

                <button
                    type="button"
                    className={`modal-like-reaction ${currentReaction === "love"
                            ? "modal-like-selected"
                            : ""
                        }`}
                    onClick={() => chooseReaction("love")}
                    disabled={disabled}
                >
                    <span className="modal-like-double">
                        <i className="fa-regular fa-thumbs-up"></i>
                        <i className="fa-regular fa-thumbs-up"></i>
                    </span>
                </button>
            </div>

            <button
                type="button"
                className="modal-like-main"
                disabled={disabled}
                onClick={() => setOpen((previous) => !previous)}
            >
                {renderMainIcon()}
            </button>
        </div>
    );
}

export default LikeMenuModal;