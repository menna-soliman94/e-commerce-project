"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { syncAuthDataFromToken } from "@/lib/storage";
import { getUserOrders } from "@/services/orders.services";
import { OrderI } from "@/types/orders";
import Link from "next/link";

export default function AllOrdersPage() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [orders, setOrders] = useState<OrderI[]>([]);
  const [openedOrder, setOpenedOrder] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const authData = syncAuthDataFromToken();

      setToken(authData.token);
      setUserId(authData.userId);
      setIsReady(true);

      if (!authData.token || !authData.userId) {
        return;
      }

      setIsLoading(true);

      async function loadOrders() {
        try {
          const data = await getUserOrders(authData.userId, authData.token);
          setOrders(data);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      loadOrders();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!isReady || isLoading) {
    return (
      <main className="min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!token || !userId) {
    return (
      <main className="min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-4 text-4xl font-bold">All Orders</h1>
          <p className="mb-6 text-gray-600">Please login to view your orders.</p>
          <Button asChild className="rounded-xl bg-black px-8 py-6 text-white">
            <Link href="/login">Go To Login</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-8 text-4xl font-bold">All Orders</h1>

        {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}

        {orders.length === 0 ? (
          <div className="rounded-3xl border p-10 text-center">
            <p className="mb-6 text-lg text-gray-600">No orders found yet.</p>
            <Button
              asChild
              className="rounded-xl bg-black px-8 py-6 text-white hover:bg-black/90"
            >
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isOpen = openedOrder === order._id;
              const orderNumber = order.id || order._id.slice(-6);

              return (
                <div key={order._id} className="rounded-3xl border p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-6 md:flex-row">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold">Order #{orderNumber}</h2>

                      <p className="text-sm text-gray-500">
                        Order Date: {new Date(order.createdAt).toLocaleString()}
                      </p>

                      <p className="text-sm text-gray-500">
                        Payment: {order.paymentMethodType} (
                        <span className={order.isPaid ? "text-green-600" : "text-red-500"}>
                          {order.isPaid ? "Paid" : "Not Paid"}
                        </span>
                        )
                      </p>

                      <p className="text-sm text-gray-500">
                        Delivered:{" "}
                        <span
                          className={order.isDelivered ? "text-green-600" : "text-orange-500"}
                        >
                          {order.isDelivered ? "Yes" : "No"}
                        </span>
                      </p>

                      <p className="text-sm font-semibold">
                        Total: {order.totalOrderPrice} EGP
                      </p>

                      <div className="pt-2">
                        <h3 className="mb-2 text-lg font-semibold">Shipping Address</h3>
                        <p className="text-sm text-gray-500">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.details}
                        </p>
                        <p className="text-sm text-gray-500">
                          Phone: {order.shippingAddress.phone}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        className="rounded-lg"
                        onClick={() =>
                          setOpenedOrder(isOpen ? "" : order._id)
                        }
                      >
                        View Order Items
                      </Button>

                      {isOpen ? (
                        <div className="space-y-2 rounded-2xl bg-gray-50 p-4">
                          {order.cartItems.map((item) => (
                            <div
                              key={`${order._id}-${item.product._id}`}
                              className="flex items-center justify-between gap-4 text-sm"
                            >
                              <p className="line-clamp-1">{item.product.title}</p>
                              <p>
                                {item.count} x {item.price} EGP
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-end text-sm text-gray-400">
                      <p>
                        Last updated: {new Date(order.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
