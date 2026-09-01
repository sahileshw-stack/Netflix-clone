const AUTH_TOKEN_KEY = "authToken";

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (!token) {
    return;
  }

  localStorage.setItem(
    AUTH_TOKEN_KEY,
    token
  );
}

export function removeAuthToken() {
  localStorage.removeItem(
    AUTH_TOKEN_KEY
  );
}