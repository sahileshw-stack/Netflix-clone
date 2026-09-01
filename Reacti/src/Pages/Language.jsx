import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import logo from "../assets/pngwing.com (4).png";
import "./Language.css";

function Language() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = location.state?.token || "";
  const planId = location.state?.planId || "";
  const planName = location.state?.planName || "";

  console.log("Language token:", token);
  console.log("Language plan ID:", planId);
  console.log("Language plan name:", planName);

  const email =
    location.state?.email ||
    localStorage.getItem("signupEmail") ||
    "";

  const selectedPlan =
    location.state?.plan ||
    JSON.parse(localStorage.getItem("selectedPlan")) ||
    null;
  const languages = [
    "English",
    "Čeština",
    "Dansk",
    "Deutsch",
    "English (United Kingdom)",
    "Español",
    "Español (España)",
    "Filipino",
    "Français",
    "Hrvatski",
    "Indonesia",
    "Italiano",
    "Suomi",
    "Svenska",
    "Tiếng Việt",
    "Türkçe",
    "Ελληνικά",
    "Русский",
    "Українська",
    "עברית",
    "العربية",
    "العربية (مصر)",
    "हिन्दी",
    "தமிழ்",
  ];

  const [selectedLanguages, setSelectedLanguages] = useState([
    "English",
  ]);

  function handleLanguage(language) {
    setSelectedLanguages((currentLanguages) => {
      if (currentLanguages.includes(language)) {
        if (language === "English") {
          return currentLanguages;
        }

        return currentLanguages.filter(
          (item) => item !== language
        );
      }

      return [...currentLanguages, language];
    });
  }

async function handleNext() {
  if (!token) {
    console.error("Signup token is missing.");
    return;
  }

  try {
    const response = await POST(
      API_HEADER.SAVE_LANGUAGE,
      {
        token,
        language: selectedLanguages,
      }
    );

    console.log("Save language response:", response);

    if (response.success === true) {
      navigate("/pickmovies", {
        state: {
          token,
          planId,
          planName,
        },
      });
    }
  } catch (error) {
    console.error(
      "Save language error:",
      error.response?.data || error.message
    );
  }
}

  return (
    <div className="language-page">
      <header className="language-header">
        <img
          src={logo}
          alt="Netflix"
          className="language-logo"
        />

        <button
          type="button"
          className="language-help"
        >
          Help
        </button>
      </header>

      <main className="language-main">
        <section className="language-intro">
          <h1>
            Which languages do
            you like to watch
            shows and movies
            in?
          </h1>

          <p>
            Letting us know helps set up your audio and
            subtitles.
            <br />
            <strong>You can always change these.</strong>
          </p>
        </section>

        <section className="language-selection">
          <div className="default-language">
            <i className="fa-solid fa-check"></i>
            <span>English</span>
          </div>

          <div className="language-grid">
            {languages
              .filter((language) => language !== "English")
              .map((language) => (
                <label
                  key={language}
                  className="language-item"
                >
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(
                      language
                    )}
                    onChange={() =>
                      handleLanguage(language)
                    }
                  />

                  <span className="custom-checkbox">
                    <i className="fa-solid fa-check"></i>
                  </span>

                  <span className="language-name">
                    {language}
                  </span>
                </label>
              ))}
          </div>

          <button
            type="button"
            className="language-next-btn"
            onClick={handleNext}
          >
            Next
          </button>
        </section>
      </main>
    </div>
  );
}

export default Language;