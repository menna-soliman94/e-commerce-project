import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import AddToCartButton from "@/components/common/add-to-cart-button";
import WishlistButton from "@/components/common/wishlist-button";
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
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getAllBrands } from "@/services/brands.services";
import { getAllProducts } from "@/services/products.services";
import { BrandI } from "@/types/brands";
import { ProductI } from "@/types/products";

// export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const brandsResponse = await getAllBrands();
  const brands: BrandI[] = brandsResponse.data;

  return brands.map((brand) => ({
    brandId: brand._id,
  }));
}

interface BrandPageProps {
  params: Promise<{
    brandId: string;
  }>;
}

export default async function BrandDetails({ params }: BrandPageProps) {
  const { brandId } = await params;
  const brandsResponse = await getAllBrands();
  const productsResponse = await getAllProducts();
  const brands: BrandI[] = brandsResponse.data;
  const products: ProductI[] = productsResponse.data;

  const brand = brands.find((item) => item._id === brandId);

  if (!brand) {
    notFound();
  }

  const filteredProducts = products.filter(
    (product) => product.brand._id === brandId
  );

  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
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
                <Link href="/brands">Brands</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className="text-lg font-bold">
                {brand.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-10 mt-6 flex items-center gap-4 rounded-3xl border p-6">
          <div className="relative h-28 w-28 shrink-0">
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold">{brand.name}</h1>
            <p className="mt-2 text-lg text-gray-500">
              {filteredProducts.length} products found
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border p-10 text-center">
            <p className="text-lg text-gray-600">
              No products found for this brand.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
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
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
