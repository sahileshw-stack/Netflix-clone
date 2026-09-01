import React, {
  useEffect,
  useState,
} from "react";

import {
  FaMagnifyingGlass,
  FaThumbsUp,
  FaThumbsDown,
  FaEye,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";

import {
  GET,
  DELETE,
} from "../api/api";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import "../Styles/LikeManagement.css";


function LikeManagement() {

  const [
  deletingId,
  setDeletingId,
] = useState(null); 

const [
  dateFilter,
  setDateFilter,
] = useState("all");

  const navigate = useNavigate();


  /*
  =========================
  REACTION DATA
  =========================
  */

  const [
    reactions,
    setReactions,
  ] = useState([]);


  const [
    stats,
    setStats,
  ] = useState({
    totalLikes: 0,
    totalLoves: 0,
    totalDislikes: 0,
  });


  /*
  =========================
  LOADING / ERROR
  =========================
  */

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /*
  =========================
  SEARCH
  =========================
  */

  const [
    search,
    setSearch,
  ] = useState("");


  /*
  =========================
  REACTION FILTER
  =========================
  */

  const [
    reactionFilter,
    setReactionFilter,
  ] = useState("all");


  /*
  =========================
  PAGINATION
  =========================
  */

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  const itemsPerPage = 5;


  /*
  =========================
  LOAD REACTIONS
  =========================
  */

  useEffect(() => {

    async function loadReactions() {

      try {

        setLoading(true);

        setError("");


        const response =
          await GET(
            "/api/admin/reactions"
          );


        console.log(
          "ADMIN REACTIONS:",
          response
        );


        if (
          response.success === true
        ) {

          setReactions(
            response.reactions || []
          );


          setStats({

            totalLikes:
              response.totalLikes || 0,

            totalLoves:
              response.totalLoves || 0,

            totalDislikes:
              response.totalDislikes || 0,

          });

        }


      } catch (error) {

        console.error(
          "Admin reactions error:",
          error.response?.data ||
          error.message
        );


        setError(
          error.response?.data
            ?.message ||
          "Unable to load reactions."
        );


      } finally {

        setLoading(false);

      }

    }


    loadReactions();

  }, []);


/*
=========================
SEARCH + FILTER
=========================
*/

const filteredReactions =
  reactions.filter((item) => {

    const value =
      search
        .trim()
        .toLowerCase();


    const matchesSearch =
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
        .includes(value);


    const matchesReaction =
      reactionFilter === "all"
      ||
      item.reaction === reactionFilter;


    /*
    =========================
    DATE FILTER
    =========================
    */

    let matchesDate = true;


    if (
      dateFilter !== "all" &&
      item.reactedDate
    ) {

      const reactedDate =
        new Date(
          item.reactedDate
        );


      const now =
        new Date();


      if (
        dateFilter === "today"
      ) {

        matchesDate =
          reactedDate.getDate() ===
            now.getDate()

          &&

          reactedDate.getMonth() ===
            now.getMonth()

          &&

          reactedDate.getFullYear() ===
            now.getFullYear();

      }


      if (
        dateFilter === "week"
      ) {

        const sevenDaysAgo =
          new Date();

        sevenDaysAgo.setDate(
          now.getDate() - 7
        );


        matchesDate =
          reactedDate >=
          sevenDaysAgo;

      }


      if (
        dateFilter === "month"
      ) {

        matchesDate =
          reactedDate.getMonth() ===
            now.getMonth()

          &&

          reactedDate.getFullYear() ===
            now.getFullYear();

      }

    }


    return (
      matchesSearch &&
      matchesReaction &&
      matchesDate
    );

  });


/*
=========================
PAGINATION
=========================
*/

const totalPages =
  Math.ceil(
    filteredReactions.length /
    itemsPerPage
  );


const startIndex =
  (currentPage - 1) *
  itemsPerPage;


const paginatedReactions =
  filteredReactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  
  /*
  =========================
  VIEW MOVIE
  =========================
  */

  function handleViewMovie(
    item
  ) {

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
  REACTION ICON
  =========================
  */

  function renderReactionIcon(
    reaction
  ) {

    if (
      reaction === "dislike"
    ) {

      return (
        <FaThumbsDown />
      );

    }


    if (
      reaction === "love"
    ) {

      return (

        <span
          className=
            "like-management-double"
        >

          <FaThumbsUp />

          <FaThumbsUp />

        </span>

      );

    }


    return (
      <FaThumbsUp />
    );

  }


  /*
  =========================
  REACTION NAME
  =========================
  */

  function formatReaction(
    reaction
  ) {

    if (!reaction) {
      return "-";
    }


    return (
      reaction
        .charAt(0)
        .toUpperCase() +
      reaction.slice(1)
    );

  }

  async function deleteReaction(item) {
  try {
    setDeletingId(item._id);

    const response = await DELETE(
      `/api/admin/reactions/${item._id}`
    );

    if (response.success) {
      setReactions((previous) =>
        previous.filter(
          (reaction) =>
            reaction._id !== item._id
        )
      );

      setStats((previous) => ({
        ...previous,

        totalLikes:
          item.reaction === "like"
            ? Math.max(previous.totalLikes - 1, 0)
            : previous.totalLikes,

        totalLoves:
          item.reaction === "love"
            ? Math.max(previous.totalLoves - 1, 0)
            : previous.totalLoves,

        totalDislikes:
          item.reaction === "dislike"
            ? Math.max(previous.totalDislikes - 1, 0)
            : previous.totalDislikes,
      }));

      toast.success(
        "Reaction removed successfully"
      );
    }
  } catch (error) {
    console.error(
      "Delete reaction error:",
      error.response?.data ||
      error.message
    );

    toast.error(
      error.response?.data?.message ||
      "Unable to remove reaction"
    );
  } finally {
    setDeletingId(null);
  }
}

function handleDelete(item) {
  toast(
    ({ closeToast }) => (
      <div className="like-delete-confirm">

        <strong>
          Remove Reaction?
        </strong>

        <p>
          Are you sure you want to remove{" "}
          <b>
            {formatReaction(item.reaction)}
          </b>
          {" "}from{" "}
          <b>{item.movieTitle}</b>?
        </p>

        <div className="like-confirm-actions">

          <button
            type="button"
            className="like-confirm-cancel"
            onClick={closeToast}
          >
            Cancel
          </button>

          <button
            type="button"
            className="like-confirm-delete"
            onClick={() => {
              closeToast();
              deleteReaction(item);
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
      position: "top-center",
      className: "like-confirm-toast",
    }
  );
}

  /*
  =========================
  PAGE
  =========================
  */

  return (

    <div
      className=
        "like-management-page"
    >


      {/* =========================
          HEADING
         ========================= */}

      <section
        className=
          "like-management-heading"
      >


        <div>

          <p
            className=
              "like-management-eyebrow"
          >
            User Feedback
          </p>


          <h1>
            Like Management
          </h1>


          <p>
            View and manage user
            reactions for movies
            and shows.
          </p>

        </div>


        {/* =========================
            SUMMARY CARDS
           ========================= */}

        <div
          className=
            "like-management-summary-grid"
        >


          {/* LIKES */}

          <article>

            <div
              className=
                "like-summary-icon like-icon"
            >

              <FaThumbsUp />

            </div>


            <div>

              <span>
                Total Likes
              </span>


              <strong>

                {loading
                  ? "..."
                  : stats.totalLikes}

              </strong>

            </div>

          </article>


          {/* LOVES */}

          <article>

            <div
              className=
                "like-summary-icon love-icon"
            >

              <span
                className=
                  "like-management-double"
              >

                <FaThumbsUp />

                <FaThumbsUp />

              </span>

            </div>


            <div>

              <span>
                Total Loves
              </span>


              <strong>

                {loading
                  ? "..."
                  : stats.totalLoves}

              </strong>

            </div>

          </article>


          {/* DISLIKES */}

          <article>

            <div
              className=
                "like-summary-icon dislike-icon"
            >

              <FaThumbsDown />

            </div>


            <div>

              <span>
                Total Dislikes
              </span>


              <strong>

                {loading
                  ? "..."
                  : stats.totalDislikes}

              </strong>

            </div>

          </article>


        </div>

      </section>


      {/* =========================
          MAIN PANEL
         ========================= */}

      <section
        className=
          "like-management-panel"
      >


        {/* =========================
            TOOLBAR
           ========================= */}

        <div
          className=
            "like-management-toolbar"
        >


          {/* SEARCH */}

          <div
            className=
              "like-management-search"
          >

            <FaMagnifyingGlass />


            <input
              type="text"
              value={search}
              placeholder=
                "Search user, email or movie..."
              onChange={(
                event
              ) => {

                setSearch(
                  event.target.value
                );

                setCurrentPage(1);

              }}
            />

          </div>


          {/* FILTERS */}

          <div
            className=
              "like-management-filters"
          >


            {/* REACTION FILTER */}

            <select
              value={
                reactionFilter
              }
              onChange={(
                event
              ) => {

                setReactionFilter(
                  event.target.value
                );

                setCurrentPage(1);

              }}
            >

              <option
                value="all"
              >
                All Reactions
              </option>


              <option
                value="like"
              >
                Like
              </option>


              <option
                value="love"
              >
                Love
              </option>


              <option
                value="dislike"
              >
                Dislike
              </option>

            </select>


            {/* DATE FILTER */}

            <select
  value={dateFilter}
  onChange={(event) => {
    setDateFilter(
      event.target.value
    );

    setCurrentPage(1);
  }}
>

              <option
                value="all"
              >
                All Dates
              </option>


              <option
                value="today"
              >
                Today
              </option>


              <option
                value="week"
              >
                This Week
              </option>


              <option
                value="month"
              >
                This Month
              </option>

            </select>

          </div>

        </div>


        {/* =========================
            ERROR
           ========================= */}

        {error && (

          <p
            className=
              "like-management-error"
          >
            {error}
          </p>

        )}


        {/* =========================
            TABLE
           ========================= */}

        <div
          className=
            "like-management-table-wrapper"
        >

          <table
            className=
              "like-management-table"
          >


            <thead>

              <tr>

                <th>
                  User
                </th>

                <th>
                  Profile
                </th>

                <th>
                  Movie
                </th>

                <th>
                  Genre
                </th>

                <th>
                  Reaction
                </th>

                <th>
                  Date
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>


              {paginatedReactions.map(
                (item) => (

                  <tr
                    key={
                      item._id
                    }
                  >


                    {/* =========================
                        USER
                       ========================= */}

                    <td>

                      <div
                        className=
                          "like-management-user"
                      >


                        <div
                          className=
                            "like-management-avatar"
                        >

                          {item.userName
                            ?.charAt(0)
                            ?.toUpperCase()
                            || "U"}

                        </div>


                        <div>

                          <strong>
                            {
                              item.userName
                            }
                          </strong>


                          <span>
                            {
                              item.email
                            }
                          </span>

                        </div>


                      </div>

                    </td>


                    {/* =========================
                        PROFILE
                       ========================= */}

                    <td>

                      <span
                        className=
                          "like-management-profile"
                      >
                        {
                          item.profileName
                        }
                      </span>

                    </td>


                    {/* =========================
                        MOVIE
                       ========================= */}

                    <td>

                      <div
                        className=
                          "like-management-movie"
                      >


                        <div
                          className=
                            "like-management-poster"
                        >

                          {
                            renderReactionIcon(
                              item.reaction
                            )
                          }

                        </div>


                        <strong>
                          {
                            item.movieTitle
                          }
                        </strong>


                      </div>

                    </td>


                    {/* =========================
                        GENRE
                       ========================= */}

                    <td>

                      {
                        item.genre
                      }

                    </td>


                    {/* =========================
                        REACTION
                       ========================= */}

                    <td>

                      <span
                        className={
                          `like-management-reaction ${item.reaction || ""}`
                        }
                      >

                        {
                          renderReactionIcon(
                            item.reaction
                          )
                        }


                        {
                          formatReaction(
                            item.reaction
                          )
                        }

                      </span>

                    </td>


                    {/* =========================
                        DATE
                       ========================= */}

                    <td>

                      {item.reactedDate

                        ? new Date(
                            item.reactedDate
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


                    {/* =========================
                        ACTIONS
                       ========================= */}

                    <td>

                      <div
                        className=
                          "like-management-actions"
                      >


                        {/* VIEW */}

                        <button
                          type="button"
                          className=
                            "like-management-view"
                          title=
                            "View movie"
                          onClick={() =>
                            handleViewMovie(
                              item
                            )
                          }
                        >

                          <FaEye />

                        </button>


                        {/* DELETE
                            We connect API next
                        */}

                        <button
  type="button"
  className="like-management-delete"
  title="Delete reaction"
  onClick={() =>
    handleDelete(item)
  }
  disabled={
    deletingId === item._id
  }
>
  {deletingId === item._id
    ? "..."
    : <FaTrash />
  }
</button>

                      </div>

                    </td>


                  </tr>

                )
              )}


              {/* EMPTY */}

              {!loading &&
                filteredReactions.length ===
                  0 && (

                  <tr>

                    <td
                      colSpan="7"
                      className=
                        "like-management-empty"
                    >

                      No reactions found.

                    </td>

                  </tr>

                )}


            </tbody>

          </table>

        </div>


        {/* =========================
            FOOTER
           ========================= */}

        <div
          className=
            "like-management-footer"
        >


          <p>

            Showing{" "}

            {filteredReactions.length ===
            0

              ? 0

              : startIndex + 1}

            {" "}to{" "}

            {Math.min(
              startIndex +
                itemsPerPage,

              filteredReactions.length
            )}

            {" "}of{" "}

            {
              filteredReactions.length
            }

            {" "}reactions

          </p>


          {/* =========================
              PAGINATION
             ========================= */}

          {totalPages > 0 && (

            <div
              className=
                "like-management-pagination"
            >


              {/* PREVIOUS */}

              <button
                type="button"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (previous) =>
                      Math.max(
                        previous - 1,
                        1
                      )
                  )
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
                (
                  _,
                  index
                ) =>
                  index + 1
              ).map(
                (page) => (

                  <button
                    key={
                      page
                    }
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
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (previous) =>
                      Math.min(
                        previous + 1,
                        totalPages
                      )
                  )
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


export default LikeManagement;