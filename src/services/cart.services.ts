import { CartResponseI } from "@/types/cart";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function addProductToCart(productId: string, token: string) {
  const response = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify({ productId }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add product to cart");
  }

  return data;
}

async function getLoggedUserCart(token: string): Promise<CartResponseI> {
  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      token,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load cart");
  }

  return data;
}

async function updateCartItemCount(id: string, count: number, token: string) {
  const response = await fetch(`${API_URL}/cart/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify({ count }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update cart item");
  }

  return data;
}

async function removeCartItem(id: string, token: string) {
  const response = await fetch(`${API_URL}/cart/${id}`, {
    method: "DELETE",
    headers: {
      token,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove cart item");
  }

  return data;
}

async function clearCart(token: string) {
  const response = await fetch(`${API_URL}/cart`, {
    method: "DELETE",
    headers: {
      token,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to clear cart");
  }

  return data;
}

export {
  addProductToCart,
  getLoggedUserCart,
  updateCartItemCount,
  removeCartItem,
  clearCart,
};
