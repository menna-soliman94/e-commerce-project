const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getAllProducts() {
  const response = await fetch(`${API_URL}/products`, {
    cache: "force-cache",
  });
  const data = await response.json();

  return data;
}
export { getAllProducts };

async function getSpecificProduct(id: string) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    cache: "force-cache",
  });
  const data = await response.json();

  return data;
}
export { getSpecificProduct };
