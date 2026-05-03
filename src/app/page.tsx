import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="text-center py-28">
      <h1 className="text-5xl md:text-6xl mt-6 font-extrabold mb-6">
        Welcome to ShopMart
      </h1>

      <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
        Discover the latest technology, fashion, and lifestyle products. Quality
        guaranteed with fast shipping and excellent customer service.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10">
        <Button asChild className="px-10 py-6 text-lg rounded-xl ">
          <Link href="/products">Shop Now</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="px-10 py-6 text-lg rounded-xl border-2 border-black"
        >
          <Link href="/categories">Browse Categories</Link>
        </Button>
      </div>
    </section>
  );
}
