import Link from "next/link";
import { ProductI } from "@/types/products";
import { getSpecificProduct } from "@/services/products.services";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Star } from "lucide-react";
import React from "react";
import AddToCartButton from "@/components/common/add-to-cart-button";
import WishlistButton from "@/components/common/wishlist-button";

export const dynamic = "force-dynamic";

interface ProductIdType {
  productId: string;
}

export default async function ProductDetails({
  params,
}: {
  params: Promise<ProductIdType>;
}) {
  const { productId } = await params;
  const { data } = await getSpecificProduct(productId);
  const product: ProductI = data;

  return (
    <main className="pt-24 min-h-screen">
      <div className="container mx-auto p-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-lg">
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-lg">
                <Link href="/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className="text-lg font-bold">
                Product Details
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="mt-6 grid gap-8 p-8 lg:grid-cols-2">
          <div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {product.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[420px] w-full">
                      <Image
                        fill
                        src={img}
                        alt={product.title}
                        className="object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full space-y-8">
              <CardHeader>
                <CardDescription className="text-xl">
                  {product.brand.name}
                </CardDescription>

                <CardTitle className="text-3xl font-bold leading-tight">
                  {product.title}
                </CardTitle>

                <CardDescription className="text-xl">
                  {product.category.name}
                </CardDescription>

                <CardDescription className="text-xl leading-10 text-black">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-4xl font-bold">
                  EGP: {product.price.toLocaleString()}
                </p>
              </CardContent>

              <CardContent className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map((star, index) => {
                  const filledStar = star < Math.round(product.ratingsAverage);

                  return (
                    <React.Fragment key={index}>
                      <Star
                        className={`size-8 ${
                          filledStar
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 fill-gray-300"
                        }`}
                      />
                    </React.Fragment>
                  );
                })}
                <span className="text-2xl text-gray-500">
                  ({product.ratingsAverage})
                </span>
              </CardContent>

              <CardFooter className="flex items-center gap-3">
                <AddToCartButton
                  productId={product._id}
                  label="Add to Cart"
                  className="h-12 grow rounded-xl bg-black text-lg text-white hover:bg-black/90"
                />

                <WishlistButton
                  productId={product._id}
                  className="flex size-12 items-center justify-center rounded-xl border"
                  iconClassName="size-6"
                />
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
