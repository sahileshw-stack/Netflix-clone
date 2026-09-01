import React, {
  useEffect,
  useState,
} from "react";

import {
  FaFilm,
  FaUsers,
  FaHeart,
  FaThumbsUp,
  FaArrowTrendUp,
  FaPlus,
  FaEllipsis,
  FaPlay,
} from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

import { GET } from "../api/api";
import API_HEADER from "../api/apiHeader";

import "../Styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalMovies: 0,
    sections: {
      homeHero: 0,
      recentlyAdded: 0,
      trending: 0,
      netflixOriginal: 0,
      topTen: 0,
      worldwide: 0,
    },
    recentMovies: [],
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

    const [wishlistStats, setWishlistStats] =
  useState({
    total: 0,
  });

    const [userStats, setUserStats] = useState({
  totalUsers: 0,
  thisMonthUsers: 0,
  previousMonthUsers: 0,
  monthlyPercentage: 0,
  monthlyTrend: "same",
  monthlyUsers: [],
});

const [reactionStats, setReactionStats] =
  useState({
    totalReactions: 0,
    totalLikes: 0,
    totalLoves: 0,
    totalDislikes: 0,
    percentage: 0,
    trend: "normal",
  });

  /*
    =========================
    LOAD DASHBOARD STATS
    =========================
  */
useEffect(() => {

  async function loadDashboardStats() {
    try {
      setLoading(true);
      setError("");

      const response = await GET(
        API_HEADER.ADMIN_MOVIE_DASHBOARD_STATS
      );

      if (response.success === true) {
        setStats({
          totalMovies:
            response.totalMovies || 0,

          sections:
            response.sections || {},

          recentMovies:
            response.recentMovies || [],
        });
      }

    } catch (error) {
      console.error(
        "Dashboard stats error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard."
      );
    }
  }


  async function loadUserStats() {
    try {
      const userResponse = await GET(
        "/api/admin/users/stats"
      );

      console.log(
        "USER STATS:",
        userResponse
      );

      if (userResponse.success) {
        setUserStats({
          totalUsers:
            userResponse.totalUsers || 0,

          thisMonthUsers:
            userResponse.thisMonthUsers || 0,

          previousMonthUsers:
            userResponse.previousMonthUsers || 0,

          monthlyPercentage:
            userResponse.monthlyPercentage || 0,

          monthlyTrend:
            userResponse.monthlyTrend || "same",

          monthlyUsers:
            userResponse.monthlyUsers || [],
        });
      }

    } catch (error) {
      console.error(
        "User stats error:",
        error.response?.data ||
          error.message
      );
    }
  }


  async function loadDashboard() {
await Promise.all([
  loadDashboardStats(),
  loadUserStats(),
  loadWishlistStats(),
  loadReactionStats(),
]);

    setLoading(false);
  }


  loadDashboard();

}, []);

useEffect(() => {
  async function loadUserStats() {
    try {
      const userResponse = await GET(
        "/api/admin/users/stats"
      );

      console.log(
        "USER STATS:",
        userResponse
      );

      if (userResponse.success) {
        setUserStats({
          totalUsers:
            userResponse.totalUsers || 0,

          thisMonthUsers:
            userResponse.thisMonthUsers || 0,

          previousMonthUsers:
            userResponse.previousMonthUsers || 0,

          monthlyPercentage:
            userResponse.monthlyPercentage || 0,

          monthlyTrend:
            userResponse.monthlyTrend || "same",

          monthlyUsers:
            userResponse.monthlyUsers || [],
        });
      }
    } catch (error) {
      console.error(
        "User stats error:",
        error.response?.data ||
          error.message
      );
    }
  }

  loadUserStats();
}, []);

async function loadWishlistStats() {
  try {
    const response = await GET(
      "/api/admin/wishlist"
    );

    if (response.success) {
      setWishlistStats({
        total:
          response.total || 0,
      });
    }

  } catch (error) {
    console.error(
      "Wishlist stats error:",
      error.response?.data ||
        error.message
    );
  }
}

async function loadReactionStats() {
  try {
    const response = await GET(
      "/api/admin/reactions"
    );

    if (response.success) {
      setReactionStats({
        totalReactions:
          response.totalReactions || 0,

        totalLikes:
          response.totalLikes || 0,

        totalLoves:
          response.totalLoves || 0,

        totalDislikes:
          response.totalDislikes || 0,

        percentage:
          response.percentage || 0,

        trend:
          response.trend || "normal",
      });
    }

  } catch (error) {
    console.error(
      "Reaction stats error:",
      error.response?.data ||
      error.message
    );
  }
}
  /*
    =========================
    SUMMARY CARDS
    =========================
  */

  const summaryCards = [
    {
      id: 1,
      title: "Total Movies",
      value: loading
        ? "..."
        : stats.totalMovies,

      change:
        "View all movie sections",

      icon: <FaFilm />,

      className:
        "dashboard-card-red",

      clickable: true,
    },

{
  id: 2,
  title: "Total Users",

  value:
    userStats.totalUsers,

  change:
    userStats.monthlyTrend === "increase"
      ? `+${userStats.monthlyPercentage}% this month`
      : userStats.monthlyTrend === "decrease"
      ? `${userStats.monthlyPercentage}% this month`
      : "0% this month",

  icon: <FaUsers />,

  className:
    "dashboard-card-blue",

  clickable: true,
},
{
  id: 3,
  title: "Wishlist Items",

  value: loading
    ? "..."
    : wishlistStats.total,

  change:
    "View user wishlist activity",

  icon: <FaHeart />,

  className:
    "dashboard-card-pink",

  clickable: true,
},

{
  id: 4,
  title: "Total Reactions",

  value:
    loading
      ? "..."
      : reactionStats.totalReactions,

  change:
    reactionStats.trend === "increase"
      ? `+${reactionStats.percentage}% this month`
      : reactionStats.trend === "decrease"
      ? `-${reactionStats.percentage}% this month`
      : "-- this month",

  icon: <FaThumbsUp />,

  className:
    "dashboard-card-purple",

  clickable: true,
},
  ];

  /*
    =========================
    RECENT MOVIES
    =========================
  */

  const recentMovies =
    stats.recentMovies.map(
      (movie) => ({
        id: movie._id,

        title:
          movie.title ||
          "Untitled",

        section:
          movie.section ||
          "",

        createdAt:
          movie.createdAt ||
          "",

        updatedAt:
          movie.updatedAt ||
          "",
      })
    );

  /*
    =========================
    RECENT ACTIVITY
    =========================
  */

  const activities =
    recentMovies.map(
      (movie) => ({
        id: movie.id,

        title:
          "New movie added",

        text:
          `${movie.title} was added to ${getSectionName(
            movie.section
          )}`,

        time:
          formatTimeAgo(
            movie.createdAt
          ),
      })
    );

  function getSectionName(section) {
    const names = {
      "home-hero":
        "Home Hero",

      "recently-added":
        "Recently Added",

      trending:
        "Trending Now",

      "netflix-original":
        "Only on Netflix",

      "top-10":
        "Top 10",

      worldwide:
        "Worldwide",
    };

    return names[section] ||
      "Movies";
  }

  function formatTimeAgo(date) {
    if (!date) {
      return "";
    }

    const created =
      new Date(date);

    const now =
      new Date();

    const difference =
      now - created;

    const minutes =
      Math.floor(
        difference /
          (1000 * 60)
      );

    const hours =
      Math.floor(
        minutes / 60
      );

    const days =
      Math.floor(
        hours / 24
      );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }

    if (hours < 24) {
      return `${hours} hours ago`;
    }

    return `${days} days ago`;
  }

function handleSummaryClick(card) {
  if (
  card.title ===
  "Wishlist Items"
) {
  navigate(
    "/wishlist"
  );
}

if (
  card.title === "Total Reactions"
) {
  navigate("/likes");
}
  if (card.title === "Total Movies") {
    navigate(
      "/movies/library"
    );
  }

  if (card.title === "Total Users") {
    navigate(
      "/users/analytics"
    );
  }
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];


function getLastSixMonths() {
  const result = [];

  const today = new Date();

  let previousTotal = 0;

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - i,
      1
    );

    const year =
      date.getFullYear();

    const month =
      date.getMonth() + 1;


    const found =
      userStats.monthlyUsers.find(
        (item) =>
          item.year === year &&
          item.month === month
      );


    if (found) {
      previousTotal =
        found.totalUsers;
    }


    result.push({
      year,
      month,

      monthName:
        monthNames[month - 1],

      newUsers:
        found?.newUsers || 0,

      totalUsers:
        found
          ? found.totalUsers
          : previousTotal,
    });
  }

  return result;
}


const chartUsers =
  getLastSixMonths();


const maxChartUsers =
  Math.max(
    ...chartUsers.map(
      (item) => item.totalUsers
    ),
    1
  );

  return (
    <div className="dashboard-page">

      {error && (
        <p className="dashboard-api-error">
          {error}
        </p>
      )}

      <section className="dashboard-welcome">

        <div>

          <p className="dashboard-eyebrow">
            Overview
          </p>

          <h1>
            Welcome back, Admin
          </h1>

          <p>
            Here’s what is happening
            with your Netflix platform
            today.
          </p>

        </div>

        <button
          type="button"
          className="dashboard-add-movie"
          onClick={() =>
            navigate("/movies")
          }
        >
          <FaPlus />

          <span>
            Add New Movie
          </span>
        </button>

      </section>

      <section className="dashboard-summary-grid">

        {summaryCards.map(
          (card) => (

            <article
              key={card.id}
              className={`dashboard-summary-card ${card.className} ${
                card.clickable
                  ? "dashboard-summary-clickable"
                  : ""
              }`}
              onClick={() =>
                handleSummaryClick(
                  card
                )
              }
            >

              <div className="dashboard-card-top">

                <div className="dashboard-card-icon">
                  {card.icon}
                </div>

                

              </div>

              <div className="dashboard-card-content">

                <p>
                  {card.title}
                </p>

                <h2>
                  {card.value}
                </h2>

                <span>
                  <FaArrowTrendUp />

                  {card.change}
                </span>

              </div>

            </article>
          )
        )}

      </section>

      <section className="dashboard-middle-grid">

        <article className="dashboard-panel dashboard-chart-panel">

          <div className="dashboard-panel-heading">

            <div>
              <h2>
                Platform Activity
              </h2>

              <p>
                Monthly engagement
                overview
              </p>
            </div>

            <select defaultValue="6months">
              <option value="6months">
                Last 6 months
              </option>

              <option value="12months">
                Last 12 months
              </option>
            </select>

          </div>

          <div className="dashboard-chart-placeholder">

            {userStats.monthlyUsers.length === 0 ? (
  <div className="dashboard-chart-empty">
    No user activity yet.
  </div>
) : (
  <>
   <div className="dashboard-chart-lines">

  {chartUsers.map((item) => {

    const height =
      item.totalUsers === 0
        ? 0
        : Math.max(
            8,
            (
              item.totalUsers /
              maxChartUsers
            ) * 100
          );

    return (
      <div
        className="dashboard-chart-column"
        key={`${item.year}-${item.month}`}
      >

        <div
          className="dashboard-chart-bar"
          style={{
            height: `${height}%`,
          }}
        >

          {item.totalUsers > 0 && (
            <span className="dashboard-chart-value">
              {item.totalUsers}
            </span>
          )}

        </div>

      </div>
    );
  })}

</div>


<div className="dashboard-chart-labels">

  {chartUsers.map((item) => (
    <span
      key={`${item.year}-${item.month}`}
    >
      {item.monthName}
    </span>
  ))}

</div>
  </>
)}
          </div>

        </article>

        <article className="dashboard-panel dashboard-activity-panel">

          <div className="dashboard-panel-heading">

            <div>
              <h2>
                Recent Activity
              </h2>

              <p>
                Latest admin movie
                activity
              </p>
            </div>

          </div>

          <div className="dashboard-activity-list">

            {activities.length ===
            0 ? (
              <div className="dashboard-empty-activity">
                No recent movie
                activity.
              </div>
            ) : (
              activities.map(
                (activity) => (

                  <div
                    key={
                      activity.id
                    }
                    className="dashboard-activity-item"
                  >

                    <div className="dashboard-activity-dot"></div>

                    <div>

                      <strong>
                        {
                          activity.title
                        }
                      </strong>

                      <p>
                        {
                          activity.text
                        }
                      </p>

                      <span>
                        {
                          activity.time
                        }
                      </span>

                    </div>

                  </div>
                )
              )
            )}

          </div>

        </article>

      </section>

      <section className="dashboard-panel dashboard-movies-panel">

        <div className="dashboard-panel-heading">

          <div>
            <h2>
              Recently Added Movies
            </h2>

            <p>
              Latest titles added
              to the platform
            </p>
          </div>

          <button
            type="button"
            className="dashboard-view-all"
            onClick={() =>
              navigate(
                "/movies/library"
              )
            }
          >
            View all
          </button>

        </div>

        <div className="dashboard-table-wrapper">

          <table className="dashboard-movie-table">

            <thead>
              <tr>
                <th>
                  Movie
                </th>

                <th>
                  Section
                </th>

                <th>
                  Added
                </th>

                <th>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {recentMovies.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="dashboard-empty-table"
                  >
                    No movies added
                    yet.
                  </td>
                </tr>
              ) : (
                recentMovies.map(
                  (movie) => (

                    <tr
                      key={
                        movie.id
                      }
                    >

                      <td>

                        <div className="dashboard-movie-info">

                          <div className="dashboard-movie-thumbnail">
                            <FaPlay />
                          </div>

                          <div>

                            <strong>
                              {
                                movie.title
                              }
                            </strong>

                            <span>
                              Movie ID #
                              {
                                movie.id
                              }
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>
                        {getSectionName(
                          movie.section
                        )}
                      </td>

                      <td>
                        {formatTimeAgo(
                          movie.createdAt
                        )}
                      </td>

                      <td>

                        <button
                          type="button"
                          className="dashboard-table-action"
                        >
                          <FaEllipsis />
                        </button>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;