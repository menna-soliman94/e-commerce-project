import { OrderI, ShippingAddressI } from "@/types/orders";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function createCashOrder(
  cartId: string,
  shippingAddress: ShippingAddressI,
  token: string
) {
  const response = await fetch(`${API_URL}/orders/${cartId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify({ shippingAddress }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create order");
  }

  return data;
}

async function getUserOrders(userId: string, token: string): Promise<OrderI[]> {
  const response = await fetch(`${API_URL}/orders/user/${userId}`, {
    headers: {
      token,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load orders");
  }

  return Array.isArray(data) ? data : data.data || [];
}

export { createCashOrder, getUserOrders };
