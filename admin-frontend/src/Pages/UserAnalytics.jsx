import React, {
  useEffect,
  useState,
} from "react";

import {
  FaArrowLeft,
  FaUsers,
  FaArrowTrendUp,
  FaMagnifyingGlass,
} from "react-icons/fa6";

import {
  useNavigate,
} from "react-router-dom";

import {
  GET,
} from "../api/api";

import "../Styles/UserAnalytics.css";

function UserAnalytics() {
  const navigate =
    useNavigate();

  const [stats, setStats] =
    useState({
      totalUsers: 0,
      thisMonthUsers: 0,
      previousMonthUsers: 0,
      monthlyPercentage: 0,
      monthlyTrend: "same",
      monthlyUsers: [],
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError("");

        const response =
          await GET(
            "/api/admin/users/stats"
          );

        if (response.success) {
          setStats({
            totalUsers:
              response.totalUsers || 0,

            thisMonthUsers:
              response.thisMonthUsers || 0,

            previousMonthUsers:
              response.previousMonthUsers || 0,

            monthlyPercentage:
              response.monthlyPercentage || 0,

            monthlyTrend:
              response.monthlyTrend ||
              "same",

            monthlyUsers:
              response.monthlyUsers || [],
          });
        }
      } catch (error) {
        console.error(
          "User analytics error:",
          error.response?.data ||
            error.message
        );

        setError(
          error.response?.data?.message ||
            "Unable to load user analytics."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="user-analytics-page">

      <button
        type="button"
        className="user-analytics-back"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        <FaArrowLeft />

        Back to Dashboard
      </button>

      <div className="user-analytics-heading">

        <div>
          <p>
            USER ANALYTICS
          </p>

          <h1>
            Total Users
          </h1>

          <span>
            View registered user
            growth and activity.
          </span>
        </div>

      </div>

      {error && (
        <div className="user-analytics-error">
          {error}
        </div>
      )}

      <div className="user-analytics-summary">

        <article className="user-analytics-card">

          <div className="user-analytics-icon">
            <FaUsers />
          </div>

          <p>
            Total Users
          </p>

          <h2>
            {loading
              ? "..."
              : stats.totalUsers}
          </h2>

        </article>


        <article className="user-analytics-card">

          <div className="user-analytics-icon">
            <FaArrowTrendUp />
          </div>

          <p>
            This Month
          </p>

          <h2>
            {loading
              ? "..."
              : stats.thisMonthUsers}
          </h2>

          <span>
            {stats.monthlyTrend ===
            "increase"
              ? `+${stats.monthlyPercentage}%`
              : stats.monthlyTrend ===
                "decrease"
              ? `${stats.monthlyPercentage}%`
              : "0%"}
          </span>

        </article>


        <article className="user-analytics-card">

          <div className="user-analytics-icon">
            <FaUsers />
          </div>

          <p>
            Previous Month
          </p>

          <h2>
            {loading
              ? "..."
              : stats.previousMonthUsers}
          </h2>

        </article>

      </div>


      <section className="user-search-panel">

        <div className="user-search-heading">

          <div>
            <h2>
              Most Searched Movies
            </h2>

            <p>
              Movies users are
              searching most.
            </p>
          </div>

          <FaMagnifyingGlass />

        </div>

        <div className="user-search-empty">
          Search tracking is not
          connected yet.
        </div>

      </section>

    </div>
  );
}

export default UserAnalytics;