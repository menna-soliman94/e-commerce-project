"use client";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  clearCart,
  getLoggedUserCart,
  removeCartItem,
  updateCartItemCount,
} from "@/services/cart.services";
import { createCashOrder } from "@/services/orders.services";
import { getToken, notifyCartChanged } from "@/lib/storage";
import { CartResponseI } from "@/types/cart";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [cart, setCart] = useState<CartResponseI | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    details: "Alexandria, Egypt",
    phone: "01010001000",
    city: "Alexandria",
  });

  async function loadCart(currentToken: string) {
    try {
      const data = await getLoggedUserCart(currentToken);
      setCart(data);
      setError("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedToken = getToken();

      setToken(savedToken);
      setIsReady(true);

      if (!savedToken) {
        return;
      }

      setIsLoading(true);
      loadCart(savedToken);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  async function handleUpdateCount(productId: string, count: number) {
    if (!token) {
      return;
    }

    try {
      setMessage("");

      if (count <= 0) {
        await removeCartItem(productId, token);
      } else {
        await updateCartItemCount(productId, count, token);
      }

      await loadCart(token);
      notifyCartChanged();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }

  async function handleRemove(productId: string) {
    if (!token) {
      return;
    }

    try {
      setMessage("");
      await removeCartItem(productId, token);
      await loadCart(token);
      notifyCartChanged();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }

  async function handleClearCart() {
    if (!token) {
      return;
    }

    try {
      await clearCart(token);
      setCart(null);
      setMessage("Cart cleared successfully");
      notifyCartChanged();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }

  async function handleCheckout() {
    if (!token || !cart?.data?._id) {
      return;
    }

    try {
      setIsCheckingOut(true);
      setError("");
      await createCashOrder(cart.data._id, shippingAddress, token);
      notifyCartChanged();
      router.push("/allorders");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsCheckingOut(false);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setShippingAddress({
      ...shippingAddress,
      [event.target.name]: event.target.value,
    });
  }

  if (!isReady || isLoading) {
    return (
      <main className="min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-4 text-4xl font-bold">Shopping Cart</h1>
          <p className="mb-6 text-gray-600">Please login to view your cart.</p>
          <Button asChild className="rounded-xl bg-black px-8 py-6 text-white">
            <Link href="/login">Go To Login</Link>
          </Button>
        </div>
      </main>
    );
  }

  const products = cart?.data?.products || [];
  const subtotal = cart?.data?.totalCartPrice || 0;

  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-2 text-5xl font-bold">Shopping Cart</h1>
        <p className="mb-10 text-2xl text-gray-500">
          {products.length} items in your cart
        </p>

        {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}
        {message ? <p className="mb-4 text-sm text-green-600">{message}</p> : null}

        {products.length === 0 ? (
          <div className="rounded-3xl border p-10 text-center">
            <p className="mb-6 text-lg text-gray-600">Your cart is empty.</p>
            <Button
              asChild
              className="rounded-xl bg-black px-8 py-6 text-white hover:bg-black/90"
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                {products.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-3xl border p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-5">
                        <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-2xl bg-gray-50">
                          <Image
                            src={item.product.imageCover}
                            alt={item.product.title}
                            fill
                            className="object-contain p-2"
                          />
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h2 className="text-2xl font-bold leading-9">
                              {item.product.title}
                            </h2>
                            <p className="text-xl text-gray-500">
                              {item.product.brand.name} .{" "}
                              {item.product.category.name}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              className="flex size-11 items-center justify-center rounded-xl border text-2xl"
                              onClick={() =>
                                handleUpdateCount(
                                  item.product._id,
                                  item.count - 1
                                )
                              }
                            >
                              -
                            </button>

                            <span className="text-3xl">{item.count}</span>

                            <button
                              className="flex size-11 items-center justify-center rounded-xl border text-2xl"
                              onClick={() =>
                                handleUpdateCount(
                                  item.product._id,
                                  item.count + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8 text-right">
                        <div>
                          <p className="text-3xl font-bold">
                            EGP {item.price.toLocaleString()}
                          </p>
                          <p className="text-xl text-gray-500">each</p>
                        </div>

                        <button
                          className="text-2xl text-red-500"
                          onClick={() => handleRemove(item.product._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border p-6 shadow-sm">
                <h2 className="mb-8 text-4xl font-bold">Order Summary</h2>

                <div className="space-y-4 border-b pb-6 text-xl text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal ({products.length} items)</span>
                    <span className="font-semibold text-black">
                      EGP {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                </div>

                <div className="my-6 flex items-center justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span>{subtotal.toLocaleString()}</span>
                </div>

                <div className="mb-6 space-y-4">
                  <Input
                    name="details"
                    value={shippingAddress.details}
                    onChange={handleChange}
                    className="h-11 rounded-xl"
                    placeholder="Address Details"
                  />
                  <Input
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    className="h-11 rounded-xl"
                    placeholder="Phone Number"
                  />
                  <Input
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    className="h-11 rounded-xl"
                    placeholder="City"
                  />
                </div>

                <div className="space-y-4">
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 w-full rounded-2xl text-lg"
                  >
                    <Link href="/products">Continue Shopping</Link>
                  </Button>

                  <Button
                    className="h-12 w-full rounded-2xl bg-black text-lg text-white hover:bg-black/90"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="flex items-center gap-2 rounded-2xl border px-5 py-3 text-xl text-red-500"
                onClick={handleClearCart}
              >
                <Trash2 className="size-5" />
                clear cart
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
