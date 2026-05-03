"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  syncAuthDataFromToken,
  WISHLIST_EVENT,
} from "@/lib/storage";
import { getLoggedUserWishlist } from "@/services/wishlist.services";
import { ProductI } from "@/types/products";
import AddToCartButton from "@/components/common/add-to-cart-button";
import WishlistButton from "@/components/common/wishlist-button";
import { Star } from "lucide-react";

export default function WishlistPage() {
  const [token, setToken] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<ProductI[]>([]);

  useEffect(() => {
    async function loadWishlist(currentToken: string) {
      try {
        const response = await getLoggedUserWishlist(currentToken);
        const data = Array.isArray(response.data) ? response.data : [];
        const wishlistProducts = data.filter(
          (item): item is ProductI => typeof item !== "string"
        );

        setProducts(wishlistProducts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    const frame = requestAnimationFrame(() => {
      const authData = syncAuthDataFromToken();

      setToken(authData.token);
      setIsReady(true);

      if (!authData.token) {
        return;
      }

      setIsLoading(true);
      loadWishlist(authData.token);
    });

    async function handleWishlistChange() {
      const authData = syncAuthDataFromToken();

      if (!authData.token) {
        setProducts([]);
        return;
      }

      await loadWishlist(authData.token);
    }

    window.addEventListener(WISHLIST_EVENT, handleWishlistChange);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(WISHLIST_EVENT, handleWishlistChange);
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

  if (!token) {
    return (
      <main className="min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-4 text-4xl font-bold">Wishlist</h1>
          <p className="mb-6 text-gray-600">
            Please login to view your wishlist.
          </p>
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
        <h1 className="mb-2 text-5xl font-bold">Wishlist</h1>
        <p className="mb-10 text-2xl text-gray-500">
          {products.length} items in your wishlist
        </p>

        {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}

        {products.length === 0 ? (
          <div className="rounded-3xl border p-10 text-center">
            <p className="mb-6 text-lg text-gray-600">Your wishlist is empty.</p>
            <Button
              asChild
              className="rounded-xl bg-black px-8 py-6 text-white hover:bg-black/90"
            >
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="h-full overflow-hidden rounded-xl border shadow-sm"
              >
                <div className="flex h-full flex-col">
                  <Link href={`/products/${product._id}`}>
                    <div className="p-4 pb-2">
                      <div className="flex h-64 items-center justify-center">
                        <Image
                          width={300}
                          height={300}
                          src={product.imageCover}
                          alt={product.title}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col px-4 pb-4 pt-0">
                    <p className="text-xs text-gray-500">{product.brand.name}</p>

                    <h3 className="mt-1 line-clamp-2 min-h-[48px] text-lg font-bold leading-6">
                      {product.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {product.category.name}
                    </p>

                    <div className="mt-3 flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((star) => {
                        const filled = star < Math.round(product.ratingsAverage);

                        return (
                          <Star
                            key={star}
                            className={`size-4 ${
                              filled
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        );
                      })}

                      <span className="ml-1 text-sm text-gray-500">
                        ({product.ratingsQuantity})
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col items-start gap-4 border-t p-4">
                    <p className="text-2xl font-bold">
                      EGP {product.price.toLocaleString()}
                    </p>

                    <div className="flex w-full items-center gap-3">
                      <AddToCartButton
                        productId={product._id}
                        className="h-10 flex-1 rounded-xl bg-black text-white hover:bg-black/90"
                      />

                      <WishlistButton
                        productId={product._id}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
