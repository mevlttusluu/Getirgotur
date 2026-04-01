import { useEffect, useMemo, useState } from "react";
import Header from "./home/Header";
import Footer from "./home/footer";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../api/products";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  img: "",
  description: "",
};

function readUsers() {
  try {
    const usersRaw = localStorage.getItem("gg_users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    if (users.length) return users;

    const singleUserRaw = localStorage.getItem("gg_user");
    return singleUserRaw ? [JSON.parse(singleUserRaw)] : [];
  } catch {
    return [];
  }
}

export default function AdminPanelPage() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const reloadData = async () => {
    const [productData] = await Promise.all([getProducts()]);
    setProducts(productData);
    setUsers(readUsers());
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await reloadData();
      setLoading(false);
    };
    init();
  }, []);

  const lowStockProducts = useMemo(
    () => products.filter((item) => Number(item.stock ?? 0) <= 5),
    [products]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price || !form.description) {
      setMessage("Lutfen zorunlu alanlari doldurun.");
      return;
    }

    if (editingId) {
      await updateProduct(editingId, form);
      setMessage("Urun guncellendi.");
    } else {
      await addProduct(form);
      setMessage("Yeni urun eklendi.");
    }

    setForm(emptyForm);
    setEditingId(null);
    await reloadData();
    setTimeout(() => setMessage(""), 1500);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name ?? "",
      category: product.category ?? "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? 0),
      img: product.img ?? "",
      description: product.description ?? "",
    });
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
    setMessage("Urun silindi.");
    await reloadData();
    setTimeout(() => setMessage(""), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1 px-6 py-8 md:px-12">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-5 text-white shadow-lg">
            <h1 className="text-2xl font-extrabold">Admin Paneli</h1>
            <p className="mt-1 text-xs text-slate-200">
              Urun yonetimi, stok takibi ve kullanici goruntuleme
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(340px,1fr)_minmax(0,2fr)]">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">
                {editingId ? "Urun Guncelle" : "Yeni Urun Ekle"}
              </h2>
              <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                <input
                  placeholder="Urun adi"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-500"
                />
                <input
                  placeholder="Kategori"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Fiyat"
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-500"
                  />
                  <input
                    placeholder="Stok"
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, stock: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-500"
                  />
                </div>
                <input
                  placeholder="Resim yolu (or: /images/fare.jpg)"
                  value={form.img}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, img: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-500"
                />
                <textarea
                  placeholder="Aciklama"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
                  >
                    {editingId ? "Guncelle" : "Ekle"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setForm(emptyForm);
                      }}
                      className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Iptal
                    </button>
                  )}
                  {message && <span className="text-xs text-emerald-600">{message}</span>}
                </div>
              </form>
            </section>

            <section className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">Tum Urunler</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {products.length} urun
                  </span>
                </div>

                {loading ? (
                  <p className="text-xs text-slate-500">Yukleniyor...</p>
                ) : (
                  <div className="max-h-[350px] overflow-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 bg-slate-100 text-slate-700">
                        <tr>
                          <th className="px-3 py-2">Urun</th>
                          <th className="px-3 py-2">Kategori</th>
                          <th className="px-3 py-2">Fiyat</th>
                          <th className="px-3 py-2">Stok</th>
                          <th className="px-3 py-2">Islem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((item) => (
                          <tr key={item.id} className="border-t border-slate-100">
                            <td className="px-3 py-2 font-semibold text-slate-800">
                              {item.name}
                            </td>
                            <td className="px-3 py-2 text-slate-600">{item.category}</td>
                            <td className="px-3 py-2 text-slate-600">
                              {Number(item.price ?? 0).toLocaleString("tr-TR", {
                                style: "currency",
                                currency: "TRY",
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`rounded-full px-2 py-1 font-semibold ${
                                  Number(item.stock ?? 0) <= 5
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {Number(item.stock ?? 0)}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEdit(item)}
                                  className="rounded-lg bg-indigo-500 px-2 py-1 text-[11px] font-semibold text-white hover:bg-indigo-600"
                                >
                                  Duzenle
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.id)}
                                  className="rounded-lg bg-rose-500 px-2 py-1 text-[11px] font-semibold text-white hover:bg-rose-600"
                                >
                                  Sil
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900">Stok Takibi</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Stok 5 ve alti olan urunler
                  </p>
                  <div className="mt-3 space-y-2">
                    {lowStockProducts.length === 0 && (
                      <p className="text-xs text-emerald-600">
                        Kritik stokta urun yok.
                      </p>
                    )}
                    {lowStockProducts.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2 text-xs"
                      >
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="font-bold text-rose-700">
                          Stok: {Number(item.stock ?? 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900">Kullanicilar</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Sistemde kayitli kullanicilar
                  </p>
                  <div className="mt-3 space-y-2">
                    {users.length === 0 && (
                      <p className="text-xs text-slate-500">Kayitli kullanici yok.</p>
                    )}
                    {users.map((user, index) => (
                      <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={`${user.email}-${index}`}
                        className="rounded-xl bg-slate-50 px-3 py-2 text-xs"
                      >
                        <p className="font-semibold text-slate-800">{user.name || "-"}</p>
                        <p className="text-slate-600">{user.email || "-"}</p>
                        <p className="text-slate-500">{user.phone || "-"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

