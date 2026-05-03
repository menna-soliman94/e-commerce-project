const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getAllBrands() {
  const response = await fetch(`${API_URL}/brands`, {
    cache: "force-cache",
  });
  const data = await response.json();

  return data;
}

export { getAllBrands };
