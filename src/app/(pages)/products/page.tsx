import { getAllProducts } from "@/services/products.services";
import { ProductI } from "@/types/products";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
import React from "react";
import Link from "next/link";
import AddToCartButton from "@/components/common/add-to-cart-button";
import WishlistButton from "@/components/common/wishlist-button";

// export const dynamic = "force-dynamic";

export default async function Products() {
  const { data } = await getAllProducts();
  const products: ProductI[] = data;

  return (
    <>
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <React.Fragment key={product._id}>
                <Card
                  key={product._id}
                  className="h-full overflow-hidden rounded-xl border shadow-sm"
                >
                  <div className="flex h-full flex-col">
                    <Link href={`/products/${product._id}`}>
                      <div>
                        <CardHeader className="p-4 pb-2">
                          <div className="flex h-64 items-center justify-center">
                            <Image
                              width={300}
                              height={300}
                              src={product.imageCover}
                              alt={product.title}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        </CardHeader>

                        <CardContent className="flex flex-1 flex-col px-4 pb-4 pt-0">
                          <p className="text-xs text-gray-500">
                            {product.brand.name}
                          </p>

                          <h3 className="mt-1 line-clamp-2 min-h-[48px] text-lg font-bold leading-6">
                            {product.title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {product.category.name}
                          </p>

                          <div className="mt-3 flex items-center gap-1">
                            {[0, 1, 2, 3, 4].map((star) => {
                              const filled =
                                star < Math.round(product.ratingsAverage);

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
                        </CardContent>
                      </div>
                    </Link>

                    <CardFooter className="mt-auto flex-col items-start gap-4 border-t p-4">
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
                    </CardFooter>
                  </div>
                </Card>
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
