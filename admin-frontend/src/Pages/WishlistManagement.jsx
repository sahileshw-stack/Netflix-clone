import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import {
  FaMagnifyingGlass,
  FaTrash,
  FaEye,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";

import {
  GET,
  DELETE,
} from "../api/api";

import "../Styles/WishlistManagement.css";


function WishlistManagement() {

  const navigate = useNavigate();

  const [wishlist, setWishlist] =
    useState([]);

  const [
    totalWishlist,
    setTotalWishlist,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  const [search, setSearch] =
    useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  const itemsPerPage = 5;


  /*
  =========================
  LOAD WISHLIST
  =========================
  */

  useEffect(() => {

    async function loadWishlist() {

      try {

        setLoading(true);
        setError("");

        const response = await GET(
          "/api/admin/wishlist"
        );

        console.log(
          "ADMIN WISHLIST:",
          response
        );

        if (response.success) {

          setWishlist(
            response.wishlist || []
          );

          setTotalWishlist(
            response.total || 0
          );

        }

      } catch (error) {

        console.error(
          "Admin wishlist error:",
          error.response?.data ||
          error.message
        );

        setError(
          error.response?.data?.message ||
          "Unable to load wishlist."
        );

      } finally {

        setLoading(false);

      }

    }


    loadWishlist();

  }, []);


  /*
  =========================
  DELETE WISHLIST ITEM
  =========================
  */

  async function deleteWishlistItem(
    item
  ) {

    try {

      setDeletingId(
        item._id
      );


      const response = await DELETE(
        `/api/admin/wishlist/${item._id}`
      );


      if (response.success) {

        setWishlist(
          (previous) =>
            previous.filter(
              (wishlistItem) =>
                wishlistItem._id !==
                item._id
            )
        );


        setTotalWishlist(
          (previous) =>
            Math.max(
              previous - 1,
              0
            )
        );


        toast.success(
          "Movie removed from My List"
        );

      }

    } catch (error) {

      console.error(
        "Delete wishlist error:",
        error.response?.data ||
        error.message
      );


      toast.error(
        error.response?.data?.message ||
        "Unable to remove movie"
      );

    } finally {

      setDeletingId(null);

    }

  }
  function handleViewMovie(item) {

    if (!item.movieId) {
      toast.error(
        "Movie information not found"
      );

      return;
    }

    navigate(
      `/movies/edit/${item.movieId}`
    );
  }


  /*
  =========================
  DELETE CONFIRM TOAST
  =========================
  */

  function handleDelete(item) {

    toast(
      ({ closeToast }) => (

        <div
          className="wishlist-delete-confirm"
        >

          <strong>
            Remove from My List?
          </strong>


          <p>
            Are you sure you want
            to remove{" "}

            <b>
              {item.movieTitle}
            </b>

            ?
          </p>


          <div
            className=
            "wishlist-confirm-actions"
          >

            <button
              type="button"
              className=
              "wishlist-confirm-cancel"
              onClick={closeToast}
            >
              Cancel
            </button>


            <button
              type="button"
              className=
              "wishlist-confirm-delete"
              onClick={() => {

                closeToast();

                deleteWishlistItem(
                  item
                );

              }}
            >
              Yes, Remove
            </button>

          </div>

        </div>

      ),
      {
        autoClose: false,

        closeButton: false,

        closeOnClick: false,

        draggable: false,

        position:
          "top-center",

        className:
          "wishlist-confirm-toast",
      }
    );

  }


  /*
  =========================
  SEARCH FILTER
  =========================
  */

  const filteredItems =
    wishlist.filter(
      (item) => {

        const value =
          search
            .trim()
            .toLowerCase();


        return (

          String(
            item.userName || ""
          )
            .toLowerCase()
            .includes(value)

          ||

          String(
            item.email || ""
          )
            .toLowerCase()
            .includes(value)

          ||

          String(
            item.movieTitle || ""
          )
            .toLowerCase()
            .includes(value)

        );

      }
    );


  /*
  =========================
  PAGINATION
  =========================
  */

  const totalPages =
    Math.ceil(
      filteredItems.length /
      itemsPerPage
    );


  const startIndex =
    (currentPage - 1) *
    itemsPerPage;


  const paginatedItems =
    filteredItems.slice(
      startIndex,
      startIndex +
      itemsPerPage
    );


  /*
  =========================
  PAGE
  =========================
  */

  return (

    <div className="wishlist-page">


      {/* HEADING */}

      <section
        className="wishlist-heading"
      >

        <div>

          <p
            className=
            "wishlist-eyebrow"
          >
            User Activity
          </p>


          <h1>
            Wishlist Management
          </h1>


          <p>
            View and manage movies
            added to user wishlists.
          </p>

        </div>


        <div
          className="wishlist-summary"
        >

          <div>
            <FaHeart />
          </div>


          <div>

            <span>
              Total Wishlist Items
            </span>


            <strong>
              {loading
                ? "..."
                : totalWishlist}
            </strong>

          </div>

        </div>

      </section>


      {/* MAIN PANEL */}

      <section
        className="wishlist-panel"
      >


        {/* TOOLBAR */}

        <div
          className="wishlist-toolbar"
        >

          <div
            className="wishlist-search"
          >

            <FaMagnifyingGlass />


            <input
              type="text"
              value={search}
              placeholder=
              "Search user, email or movie..."
              onChange={(event) => {

                setSearch(
                  event.target.value
                );

                setCurrentPage(1);

              }}
            />

          </div>


          <select defaultValue="all">

            <option value="all">
              All Dates
            </option>

            <option value="today">
              Today
            </option>

            <option value="week">
              This Week
            </option>

            <option value="month">
              This Month
            </option>

          </select>

        </div>


        {/* ERROR */}

        {error && (

          <p className="wishlist-error">
            {error}
          </p>

        )}


        {/* TABLE */}

        <div
          className=
          "wishlist-table-wrapper"
        >

          <table
            className="wishlist-table"
          >

            <thead>

              <tr>

                <th>User</th>

                <th>Profile</th>

                <th>Movie</th>

                <th>Genre</th>

                <th>
                  Added Date
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>


              {paginatedItems.map(
                (item) => (

                  <tr
                    key={item._id}
                  >


                    {/* USER */}

                    <td>

                      <div
                        className=
                        "wishlist-user"
                      >

                        <div
                          className=
                          "wishlist-avatar"
                        >

                          {item.userName
                            ?.charAt(0)
                            ?.toUpperCase()
                            || "U"}

                        </div>


                        <div>

                          <strong>
                            {item.userName}
                          </strong>


                          <span>
                            {item.email}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* PROFILE */}

                    <td>

                      <span
                        className=
                        "wishlist-profile"
                      >
                        {
                          item.profileName
                        }
                      </span>

                    </td>


                    {/* MOVIE */}

                    <td>

                      <div
                        className=
                        "wishlist-movie"
                      >

                        <div
                          className=
                          "wishlist-poster"
                        >
                          <FaHeart />
                        </div>


                        <strong>
                          {
                            item.movieTitle
                          }
                        </strong>

                      </div>

                    </td>


                    {/* GENRE */}

                    <td>
                      {item.genre}
                    </td>


                    {/* DATE */}

                    <td>

                      {item.addedDate

                        ? new Date(
                          item.addedDate
                        )
                          .toLocaleDateString(
                            "en-GB",
                            {
                              day:
                                "2-digit",

                              month:
                                "short",

                              year:
                                "numeric",
                            }
                          )

                        : "-"
                      }

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div
                        className=
                        "wishlist-actions"
                      >

                        <button
                          type="button"
                          className="wishlist-view"
                          title="View movie"
                          onClick={() =>
                            handleViewMovie(item)
                          }
                        >
                          <FaEye />
                        </button>


                        <button
                          type="button"
                          className=
                          "wishlist-delete"
                          title=
                          "Remove from wishlist"
                          onClick={() =>
                            handleDelete(
                              item
                            )
                          }
                          disabled={
                            deletingId ===
                            item._id
                          }
                        >

                          {deletingId ===
                            item._id

                            ? "..."

                            : <FaTrash />
                          }

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}


              {!loading &&
                filteredItems.length ===
                0 && (

                  <tr>

                    <td
                      colSpan="6"
                      className=
                      "wishlist-empty"
                    >
                      No wishlist items
                      found.
                    </td>

                  </tr>

                )}


            </tbody>

          </table>

        </div>


        {/* FOOTER */}

        <div
          className="wishlist-footer"
        >

          <p>

            Showing{" "}

            {filteredItems.length === 0
              ? 0
              : startIndex + 1}

            {" "}to{" "}

            {Math.min(
              startIndex +
              itemsPerPage,

              filteredItems.length
            )}

            {" "}of{" "}

            {filteredItems.length}

            {" "}items

          </p>


          {/* PAGINATION */}

          {totalPages > 0 && (

            <div
              className=
              "wishlist-pagination"
            >


              {/* PREVIOUS */}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage(
                    (previous) =>
                      Math.max(
                        previous - 1,
                        1
                      )
                  )
                }
                disabled={
                  currentPage === 1
                }
              >

                <FaChevronLeft />

              </button>


              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length:
                    totalPages,
                },
                (_, index) =>
                  index + 1
              ).map(
                (page) => (

                  <button
                    key={page}
                    type="button"
                    className={
                      currentPage ===
                        page
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                  >
                    {page}
                  </button>

                )
              )}


              {/* NEXT */}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage(
                    (previous) =>
                      Math.min(
                        previous + 1,
                        totalPages
                      )
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
              >

                <FaChevronRight />

              </button>


            </div>

          )}

        </div>

      </section>

    </div>

  );

}


export default WishlistManagement;