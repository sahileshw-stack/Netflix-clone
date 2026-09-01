import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Movies from "./Pages/Movies";
import Otp from "./Pages/Otp";
import Newsignin from "./Pages/Newsignin";
import Newmail from "./Pages/Newmail";
import Password from "./Pages/Password";
import Chooseplan from "./Pages/Chooseplan";
import Plan from "./Pages/Plan";
import VerifyEmail from "./Pages/VerifyEmail";
import Payment from "./Pages/Payment";
import CardPayment from "./Pages/Cardpayment";
import Upi from "./Pages/Upi";
import UpiPayment from "./Pages/UpiPayment";
import Language from "./Pages/Language";
import PickMovies from "./Pages/PickMovies";
import LoadingMovies from "./Pages/LoadingMovies";
import Profile from "./Pages/Profile";
import ProfileSetup from "./Pages/ProfileSetup";
import MyList from "./Pages/MyList";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/signin"
          element={<Signin />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/otp"
          element={<Otp />}
        />

        <Route
          path="/newsignin"
          element={<Newsignin />}
        />

        <Route
          path="/newmail"
          element={<Newmail />}
        />

        <Route
          path="/password"
          element={<Password />}
        />

        <Route
          path="/chooseplan"
          element={<Chooseplan />}
        />

        <Route
          path="/plan"
          element={<Plan />}
        />

        <Route
          path="/verifyemail"
          element={<VerifyEmail />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        <Route
          path="/cardpayment"
          element={<CardPayment />}
        />

        <Route
          path="/upi"
          element={<Upi />}
        />

        <Route
          path="/upipayment"
          element={<UpiPayment />}
        />

        <Route
          path="/profilesetup"
          element={<ProfileSetup />}
        />

        <Route
          path="/language"
          element={<Language />}
        />

        <Route
          path="/pickmovies"
          element={<PickMovies />}
        />

        <Route
          path="/loadingmovies"
          element={<LoadingMovies />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/movies"
          element={
            <PrivateRoute>
              <Movies />
            </PrivateRoute>
          }
        />

        <Route
          path="/mylist"
          element={
            <PrivateRoute>
              <MyList />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );  
}

export default App;