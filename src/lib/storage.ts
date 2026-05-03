export const TOKEN_KEY = "shopmart_token";
export const USER_ID_KEY = "shopmart_user_id";
export const USER_NAME_KEY = "shopmart_user_name";
export const AUTH_EVENT = "shopmart-auth-changed";
export const CART_EVENT = "shopmart-cart-changed";
export const WISHLIST_EVENT = "shopmart-wishlist-changed";
export const WISHLIST_IDS_KEY = "shopmart_wishlist_ids";

interface TokenPayload {
  id?: string;
  name?: string;
}

function parseToken(token: string): TokenPayload {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return {};
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);

    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

export function getToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(TOKEN_KEY) || "";
}

export function getUserId() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(USER_ID_KEY) || "";
}

export function getUserName() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(USER_NAME_KEY) || "";
}

export function saveAuthData(
  token: string,
  userId: string,
  userName: string = ""
) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = parseToken(token);
  const finalUserId = userId || payload.id || "";
  const finalUserName = userName || payload.name || "";

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, finalUserId);
  localStorage.setItem(USER_NAME_KEY, finalUserName);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function syncAuthDataFromToken() {
  if (typeof window === "undefined") {
    return {
      token: "",
      userId: "",
      userName: "",
    };
  }

  const token = getToken();
  const storedUserId = getUserId();
  const storedUserName = getUserName();

  if (!token) {
    return {
      token: "",
      userId: "",
      userName: "",
    };
  }

  const payload = parseToken(token);
  const userId = storedUserId || payload.id || "";
  const userName = storedUserName || payload.name || "";

  if (userId) {
    localStorage.setItem(USER_ID_KEY, userId);
  }

  if (userName) {
    localStorage.setItem(USER_NAME_KEY, userName);
  }

  return {
    token,
    userId,
    userName,
  };
}

export function clearAuthData() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(WISHLIST_IDS_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
  window.dispatchEvent(new Event(CART_EVENT));
  window.dispatchEvent(new Event(WISHLIST_EVENT));
}

export function notifyCartChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CART_EVENT));
}

export function getWishlistIds() {
  if (typeof window === "undefined") {
    return [];
  }

  const value = localStorage.getItem(WISHLIST_IDS_KEY);

  if (!value) {
    return [];
  }

  try {
    return JSON.parse(value) as string[];
  } catch {
    return [];
  }
}

export function saveWishlistIds(ids: string[], shouldNotify: boolean = true) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(WISHLIST_IDS_KEY, JSON.stringify(ids));

  if (shouldNotify) {
    window.dispatchEvent(new Event(WISHLIST_EVENT));
  }
}
