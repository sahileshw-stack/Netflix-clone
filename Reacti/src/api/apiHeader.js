const API_HEADER = {
  // Users
  START_SIGNUP: "/api/users/start-signup",
  SEND_SIGNUP_LINK: "/api/users/send-link",
  VERIFY_SIGNUP_TOKEN: "/api/users/verify-signup-token",
  CONTINUE_SIGNUP: "/api/users/continue-signup",
  SELECT_PLAN: "/api/users/select-plan",
  SAVE_PASSWORD: "/api/users/save-password",

  SEND_SIGNIN_OTP: "/api/users/send-signin-otp",
  VERIFY_SIGNIN_OTP: "/api/users/verify-signin-otp",

  SAVE_PROFILES: "/api/users/save-profiles",
  SAVE_LANGUAGE: "/api/users/save-language",
  SAVE_FAVORITE_MOVIES: "/api/users/save-favorite-movies",

  GET_USER_PROFILE: "/api/users/get-user-profile",
  GET_PROFILES: "/api/users/get-profiles",
  COMPLETE_ONBOARDING: "/api/users/complete-onboarding",
  GET_CURRENT_PROFILE: "/api/users/get-current-profile",

  // My List
  MYLIST_ADD: "/api/mylist/add",
  MYLIST_GET: "/api/mylist",
  MYLIST_REMOVE: "/api/mylist/remove",

  // Likes
  LIKES_TOGGLE: "/api/likes/toggle",
  LIKES_GET: "/api/likes/get",
  LIKES_RATING_STATUS: "/api/likes/rating-status",
  LIKES_SAVE_FIRST_RATING:
    "/api/likes/save-first-rating",

GET_PLANS: "/api/plans",

CHECK_AUTH: "/api/users/check-auth",

MOVIES_GET: "/api/movies",

RAZORPAY_CREATE_ORDER:
  "/api/payments/razorpay/create-order",

RAZORPAY_VERIFY:
  "/api/payments/razorpay/verify",

};

export default API_HEADER;