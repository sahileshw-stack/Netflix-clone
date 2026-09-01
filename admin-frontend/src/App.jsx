import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./Pages/AdminLogin";
import ForgotPassword from "./Pages/ForgotPassword";

import Dashboard from "./Pages/Dashboard";
import MovieManagement from "./Pages/MovieManagement";
import AddMovie from "./Pages/AddMovie";
import EditMovie from "./Pages/EditMovie";
import WishlistManagement from "./Pages/WishlistManagement";
import LikeManagement from "./Pages/LikeManagement";
import Profile from "./Pages/Profile";

import PrivateRoute from "./Components/PrivateRoute";
import AdminLayout from "./Layouts/AdminLayout";

import HomeHeroManagement from "./Pages/HomeHeroManagement";
import RecentlyAddedManagement from "./Pages/RecentlyAddedManagement";
import TrendingManagement from "./Pages/TrendingManagement";
import NetflixOriginalManagement from "./Pages/NetflixOriginalManagement";
import TopTenManagement from "./Pages/TopTenManagement";
import WorldwideManagement from "./Pages/WorldwideManagement";
import MovieLibrary from "./Pages/MovieLibrary";
import SectionMovieList from "./Pages/SectionMovieList";
import UserAnalytics from "./Pages/UserAnalytics";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={<AdminLogin />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/movies"
              element={<MovieManagement />}
            />

            <Route
              path="/movies/add"
              element={<AddMovie />}
            />

            <Route
              path="/movies/edit/:id"
              element={<EditMovie />}
            />

            <Route
              path="/wishlist"
              element={<WishlistManagement />}
            />

            <Route
              path="/likes"
              element={<LikeManagement />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/movies/home-hero"
              element={<HomeHeroManagement />}
            />

            <Route
              path="/movies/recently-added"
              element={<RecentlyAddedManagement />}
            />

            <Route
              path="/movies/trending"
              element={<TrendingManagement />}
            />

            <Route
              path="/movies/netflix-original"
              element={<NetflixOriginalManagement />}
            />

            <Route
              path="/movies/top-10"
              element={<TopTenManagement />}
            />

            <Route
              path="/movies/worldwide"
              element={<WorldwideManagement />}
            />

            <Route
              path="/movies/library"
              element={<MovieLibrary />}
            />

            <Route
              path="/movies/library/:section"
              element={<SectionMovieList />}
            />

            <Route
              path="/users/analytics"
              element={<UserAnalytics />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;