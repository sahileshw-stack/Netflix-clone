import React, { useEffect, useState } from "react";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import { getAuthToken } from "../utils/auth";
import { useLocation } from "react-router-dom";

import Movienav from "../Components/Movienav";
import Moviepage from "../Components/Moviepage";
import Movielist from "../Components/Movielist";
import Footer from "../Components/Footer";


function Movies() {
  const location = useLocation();

  const token = getAuthToken() || "";

  const [currentProfile, setCurrentProfile] = useState(
    location.state?.selectedProfile || null
  );

  useEffect(() => {
  async function loadCurrentProfile() {
    if (!token) {
      console.log("Movies token is missing.");
      return;
    }

    try {
      const response = await POST(
        API_HEADER.GET_CURRENT_PROFILE,
      );

      console.log(
        "Current profile response:",
        response
      );

      setCurrentProfile(response.profile);
    } catch (error) {
      console.error(
        "Load current profile error:",
        error.response?.data || error.message
      );
    }
  }

  loadCurrentProfile();
}, [token]);

return (
    <div
      style={{
        background: "#141414",
        minHeight: "100vh",
      }}
    >
      <Movienav
        currentProfile={currentProfile}
      />

      <div style={{ paddingTop: "30px", overflow: "hidden" }}>
        <Moviepage/>
        < Movielist/>
        <Footer />
      </div>
    </div>
  );
}

export default Movies;