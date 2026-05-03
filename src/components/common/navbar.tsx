"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  AUTH_EVENT,
  CART_EVENT,
  clearAuthData,
  getToken,
  getUserName,
  getWishlistIds,
  saveWishlistIds,
  WISHLIST_EVENT,
} from "@/lib/storage";
import { getLoggedUserCart } from "@/services/cart.services";
import { getLoggedUserWishlist } from "@/services/wishlist.services";

export default function Navbar() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    async function syncNavbarData() {
      const currentToken = getToken();
      const currentUserName = getUserName();

      setToken(currentToken);
      setUserName(currentUserName);
      setWishlistCount(getWishlistIds().length);

      if (!currentToken) {
        setCartCount(0);
        return;
      }

      try {
        const response = await getLoggedUserCart(currentToken);
        setCartCount(response.numOfCartItems || 0);
      } catch {
        setCartCount(0);
      }

      try {
        const response = await getLoggedUserWishlist(currentToken);
        const data = Array.isArray(response.data) ? response.data : [];
        const ids = data.map((item) =>
          typeof item === "string" ? item : item._id
        );

        saveWishlistIds(ids, false);
        setWishlistCount(ids.length);
      } catch {
        setWishlistCount(0);
      }
    }

    function handleSync() {
      syncNavbarData();
    }

    handleSync();

    window.addEventListener(AUTH_EVENT, handleSync);
    window.addEventListener(CART_EVENT, handleSync);
    window.addEventListener(WISHLIST_EVENT, handleSync);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleSync);
      window.removeEventListener(CART_EVENT, handleSync);
      window.removeEventListener(WISHLIST_EVENT, handleSync);
    };
  }, []);

  function handleLogout() {
    clearAuthData();
    router.push("/login");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F5F5E5] backdrop-blur-md border-b px-5 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="nav-logo flex items-center gap-1">
          <Avatar className="rounded-lg">
            <AvatarImage src="/logo.png" alt="ShopMart" />
            <AvatarFallback className="rounded-lg bg-black font-bold text-white">
              S
            </AvatarFallback>
          </Avatar>

          <Link href="/" className="font-bold text-xl">
            ShopMart
          </Link>
        </div>

        <div className="nav-links">
          <NavigationMenu className="gap-3">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/products"
                    className="rounded-md font-bold px-4 py-2 hover:bg-black hover:text-white"
                  >
                    Products
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/brands"
                    className="rounded-md font-bold px-4 py-2 hover:bg-black hover:text-white"
                  >
                    Brands
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/categories"
                    className="rounded-md font-bold px-4 py-2 hover:bg-black hover:text-white"
                  >
                    Categories
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="nav-actions flex items-center gap-4">
          {token ? (
            <p className="hidden text-sm text-gray-600 md:block">
              Welcome, {userName || "User"}
            </p>
          ) : null}

          <Link href="/wishlist" className="relative">
            <Heart className="size-6" />
            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-black text-xs text-white">
              {wishlistCount}
            </span>
          </Link>

          <Link href="/cart" className="relative">
            <ShoppingCart className="size-6" />
            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-black text-xs text-white">
              {cartCount}
            </span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <User className="size-6 cursor-pointer" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40">
              <DropdownMenuGroup>
                {token ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/cart">Cart</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/allorders">Your Orders</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/register">Register</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {token ? (
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
