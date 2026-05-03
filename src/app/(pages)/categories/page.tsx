import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getAllCategories } from "@/services/categories.services";
import { CategoryI } from "@/types/categories";

export const dynamic = "force-dynamic";

export default async function Categories() {
  const { data } = await getAllCategories();
  const categories: CategoryI[] = data;

  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-8 text-4xl font-bold">Categories</h1>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${category._id}`}>
              <Card className="items-center justify-center rounded-2xl border bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-1">
                <div className="relative mb-6 flex h-40 w-full items-center justify-center">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                <p className="text-sm font-semibold">{category.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
