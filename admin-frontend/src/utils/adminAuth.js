const ADMIN_TOKEN_KEY = "adminAuthToken";

export function setAdminAuthToken(token) {
  if (!token) {
    return;
  }

  localStorage.setItem(
    ADMIN_TOKEN_KEY,
    token
  );
}

export function getAdminAuthToken() {
  return (
    localStorage.getItem(
      ADMIN_TOKEN_KEY
    ) || ""
  );
}

export function removeAdminAuthToken() {
  localStorage.removeItem(
    ADMIN_TOKEN_KEY
  );
}