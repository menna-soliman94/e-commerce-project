"use client";

import { MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getToken,
  getWishlistIds,
  saveWishlistIds,
  WISHLIST_EVENT,
} from "@/lib/storage";
import {
  addProductToWishlist,
  getLoggedUserWishlist,
  removeProductFromWishlist,
} from "@/services/wishlist.services";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  iconClassName?: string;
}

export default function WishlistButton({
  productId,
  className,
  iconClassName,
}: WishlistButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    function syncWishlistState() {
      const ids = getWishlistIds();
      setIsWishlisted(ids.includes(productId));
    }

    syncWishlistState();
    window.addEventListener(WISHLIST_EVENT, syncWishlistState);

    return () => {
      window.removeEventListener(WISHLIST_EVENT, syncWishlistState);
    };
  }, [productId]);

  async function syncWishlistIds(token: string) {
    const response = await getLoggedUserWishlist(token);
    const data = Array.isArray(response.data) ? response.data : [];
    const ids = data.map((item) =>
      typeof item === "string" ? item : item._id
    );

    saveWishlistIds(ids);
  }

  async function handleToggleWishlist(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);

      if (isWishlisted) {
        await removeProductFromWishlist(productId, token);
      } else {
        await addProductToWishlist(productId, token);
      }

      await syncWishlistIds(token);
    } catch (error) {
      if (error instanceof Error) {
        window.alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      className={cn(
        "transition-colors",
        isWishlisted ? "border-red-200 bg-red-50 text-red-500" : "",
        className
      )}
      onClick={handleToggleWishlist}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          iconClassName || "size-4",
          isWishlisted ? "fill-red-500 text-red-500" : "text-black"
        )}
      />
    </button>
  );
}
