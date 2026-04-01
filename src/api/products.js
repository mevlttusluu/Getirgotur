import axiosClient from './axiosClient';

const PRODUCTS_STORAGE_KEY = "gg_products";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

export const getProducts = async () => {
  const localProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (localProducts) {
    return safeParse(localProducts, []);
  }

  const response = await axiosClient.get('/db.json');
  const products = response.data?.products ?? [];
  saveProducts(products);
  return products;
};

export const addProduct = async (payload) => {
  const products = await getProducts();
  const nextId =
    products.length > 0
      ? Math.max(...products.map((item) => Number(item.id) || 0)) + 1
      : 1;

  const newProduct = {
    id: nextId,
    name: payload.name,
    category: payload.category,
    price: Number(payload.price) || 0,
    stock: Number(payload.stock) || 0,
    description: payload.description,
    img: payload.img || "",
  };

  const updated = [newProduct, ...products];
  saveProducts(updated);
  return newProduct;
};

export const updateProduct = async (id, payload) => {
  const products = await getProducts();
  const updated = products.map((item) =>
    String(item.id) === String(id)
      ? {
          ...item,
          ...payload,
          price: Number(payload.price ?? item.price) || 0,
          stock: Number(payload.stock ?? item.stock ?? 0) || 0,
        }
      : item
  );
  saveProducts(updated);
  return updated.find((item) => String(item.id) === String(id)) ?? null;
};

export const deleteProduct = async (id) => {
  const products = await getProducts();
  const updated = products.filter((item) => String(item.id) !== String(id));
  saveProducts(updated);
  return true;
};

