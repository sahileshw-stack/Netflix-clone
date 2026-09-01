require("dotenv").config();

console.log(
  "Mongo URI loaded:",
  Boolean(process.env.MONGO_URI)
);

console.log(
  "Razorpay Key ID loaded:",
  Boolean(process.env.RAZORPAY_KEY_ID)
);

console.log(
  "Razorpay Secret loaded:",
  Boolean(process.env.RAZORPAY_KEY_SECRET)
);


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");


/*
=========================
ROUTES
=========================
*/

const userRoutes =
  require("./Routes/userRoutes");

const planRoutes =
  require("./Routes/planRoutes");

const paymentRoutes =
  require("./Routes/paymentRoutes");

const myListRoutes =
  require("./Routes/myListRoutes");

const likedMovieRoutes =
  require("./Routes/likedMovieRoutes");

const adminAuthRoutes =
  require("./Routes/adminAuthRoutes");

const movieRoutes =
  require("./Routes/movieRoutes");

const adminMovieRoutes =
  require("./Routes/adminMovieRoutes");

const adminWishlistRoutes =
  require("./Routes/adminWishlistRoutes");

const adminUserRoutes =
  require("./Routes/adminUserRoutes");

const adminReactionRoutes =
  require("./Routes/adminReactionRoutes");


/*
=========================
WEBHOOK CONTROLLER
=========================
*/

const {
  razorpayWebhook,
} = require(
  "./Controllers/paymentController"
);


const app = express();


/*
=========================
CORS
=========================
*/

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],

    credentials: true,
  })
);


/*
=========================
RAZORPAY WEBHOOK

IMPORTANT:
Must be BEFORE express.json()
=========================
*/

app.post(
  "/api/payments/razorpay/webhook",

  express.raw({
    type: "application/json",
  }),

  razorpayWebhook
);


/*
=========================
NORMAL MIDDLEWARE
=========================
*/

app.use(express.json());

app.use(cookieParser());


/*
=========================
USER ROUTES
=========================
*/

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/plans",
  planRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/mylist",
  myListRoutes
);

app.use(
  "/api/likes",
  likedMovieRoutes
);


/*
=========================
MOVIE ROUTES
=========================
*/

app.use(
  "/api/movies",
  movieRoutes
);


/*
=========================
ADMIN ROUTES
=========================
*/

app.use(
  "/api/admin/movies",
  adminMovieRoutes
);

app.use(
  "/api/admin/auth",
  adminAuthRoutes
);

app.use(
  "/api/admin/users",
  adminUserRoutes
);

app.use(
  "/api/admin/wishlist",
  adminWishlistRoutes
);

app.use(
  "/api/admin/reactions",
  adminReactionRoutes
);


/*
=========================
UPLOADS
=========================
*/

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);


/*
=========================
TEST ROUTE
=========================
*/

app.get(
  "/",
  (req, res) => {
    res.send(
      "Netflix backend is working"
    );
  }
);


/*
=========================
DATABASE + SERVER
=========================
*/

const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log(
      "MongoDB Atlas Connected"
    );

    app.listen(
      PORT,
      () => {

        console.log(
          `Server running on http://localhost:${PORT}`
        );

      }
    );

  })

  .catch((error) => {

    console.error(
      "MongoDB connection error:",
      error
    );

  });