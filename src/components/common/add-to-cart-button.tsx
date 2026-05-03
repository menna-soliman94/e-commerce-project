"use client";

import { MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProductToCart } from "@/services/cart.services";
import { getToken, notifyCartChanged } from "@/lib/storage";

interface AddToCartButtonProps {
  productId: string;
  className?: string;
  label?: string;
}

export default function AddToCartButton({
  productId,
  className,
  label = "Add To Cart",
}: AddToCartButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  async function handleAddToCart(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);
      await addProductToCart(productId, token);
      setIsAdded(true);
      notifyCartChanged();

      setTimeout(() => {
        setIsAdded(false);
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        window.alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button className={className} onClick={handleAddToCart} disabled={isLoading}>
      <ShoppingCart className="size-4" />
      {isLoading ? "Adding..." : isAdded ? "Added" : label}
    </Button>
  );
}
