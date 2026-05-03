import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getAllBrands } from "@/services/brands.services";
import { BrandI } from "@/types/brands";

export const dynamic = "force-dynamic";

export default async function Brands() {
  const { data } = await getAllBrands();
  const brands: BrandI[] = data;

  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-8 text-4xl font-bold">Brands</h1>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link key={brand._id} href={`/brands/${brand._id}`}>
              <Card className="items-center justify-center rounded-2xl border bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-1">
                <div className="relative mb-6 flex h-40 w-full items-center justify-center">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                <p className="text-sm font-semibold">{brand.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
