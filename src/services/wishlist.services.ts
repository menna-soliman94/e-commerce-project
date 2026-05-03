import { WishlistResponseI } from "@/types/wishlist";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function addProductToWishlist(productId: string, token: string) {
  const response = await fetch(`${API_URL}/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify({ productId }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add product to wishlist");
  }

  return data as WishlistResponseI;
}

async function removeProductFromWishlist(productId: string, token: string) {
  const response = await fetch(`${API_URL}/wishlist/${productId}`, {
    method: "DELETE",
    headers: {
      token,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove product from wishlist");
  }

  return data as WishlistResponseI;
}

async function getLoggedUserWishlist(token: string) {
  const response = await fetch(`${API_URL}/wishlist`, {
    headers: {
      token,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load wishlist");
  }

  return data as WishlistResponseI;
}

export {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
};
