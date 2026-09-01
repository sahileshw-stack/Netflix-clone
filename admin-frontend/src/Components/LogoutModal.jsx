import React from "react";
import { FaRightFromBracket, FaXmark } from "react-icons/fa6";

import "../Styles/LogoutModal.css";

function LogoutModal({
  open,
  onClose,
  onConfirm,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="logout-modal-overlay"
      onClick={onClose}
    >
      <div
        className="logout-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="logout-modal-close"
          onClick={onClose}
          aria-label="Close logout modal"
        >
          <FaXmark />
        </button>

        <div className="logout-modal-icon">
          <FaRightFromBracket />
        </div>

        <h2>Logout from Admin Panel?</h2>

        <p>
          You will need to sign in again to access
          dashboard and management pages.
        </p>

        <div className="logout-modal-actions">
          <button
            type="button"
            className="logout-modal-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="logout-modal-confirm"
            onClick={onConfirm}
          >
            <FaRightFromBracket />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;