const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getAllCategories() {
  const response = await fetch(`${API_URL}/categories`, {
    cache: "force-cache",
  });
  const data = await response.json();

  return data;
}

export { getAllCategories };
