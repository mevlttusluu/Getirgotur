import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./home/Header";
import Footer from "./home/footer";
import { readOrders } from "../utils/orderStorage";


function readUserFromStorage() {
  try {
    const rawUser = localStorage.getItem("gg_user");
    const loggedIn = localStorage.getItem("gg_loggedIn") === "true";
    if (!rawUser || !loggedIn) return null;
    const parsed = JSON.parse(rawUser);
    return {
      name: parsed.name || "",
      email: parsed.email || "",
      phone: parsed.phone || "",
    };
  } catch {
    return null;
  }
}

export default function UserPanelPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => readUserFromStorage());
  const [form, setForm] = useState(() => readUserFromStorage() ?? ({ name: "", email: "", phone: "" }));
  const [message, setMessage] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const initials = useMemo(() => {
    if (!form.name) return "U";
    return form.name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [form.name]);

  const userOrders = useMemo(() => {
    const email = (user?.email || "").trim().toLowerCase();
    if (!email) return [];
    return readOrders().filter(
      (order) => (order?.customer?.email || "").trim().toLowerCase() === email
    );
  }, [user?.email]);

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return userOrders.find((o) => o.orderId === selectedOrderId) ?? null;
  }, [selectedOrderId, userOrders]);

  const orderCount = userOrders.length;

  const handleSave = (e) => {
    e.preventDefault();
    try {
      const existingRaw = localStorage.getItem("gg_user");
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      localStorage.setItem(
        "gg_user",
        JSON.stringify({
          ...existing,
          name: form.name,
          email: form.email,
          phone: form.phone,
        })
      );
      setUser({ ...form });
      setMessage("Profil bilgileri kaydedildi.");
      setTimeout(() => setMessage(""), 1800);
    } catch {
      setMessage("Kaydetme sırasında bir hata oluştu.");
    }
  };

  const handleLogout = () => {
    try {
      localStorage.setItem("gg_loggedIn", "false");
    } catch {
      // ignore
    }
    navigate("/page/1");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1 px-6 py-10 md:px-12">
          <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Kullanıcı Paneli
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Paneli görüntülemek için önce giriş yapmalısın.
            </p>
            <Link
              to="/page/1"
              className="mt-6 inline-flex items-center rounded-full bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1 px-6 py-8 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-lg font-bold text-white">
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{form.name}</p>
                <p className="text-xs text-slate-500">{form.email}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <p className="font-semibold text-slate-700">Toplam Sipariş</p>
                <p className="text-slate-500">{orderCount}</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <p className="font-semibold text-slate-700">Favori Ürün</p>
                <p className="text-slate-500">8</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <p className="font-semibold text-slate-700">Kayıtlı Adres</p>
                <p className="text-slate-500">2</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 w-full rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-600"
            >
              Çıkış Yap
            </button>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900">
                Profil Bilgileri
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Bilgilerini güncelle, değişiklikler tarayıcıda saklansın.
              </p>
              <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleSave}>
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                  Ad Soyad
                  <input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none focus:border-violet-500"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                  Telefon
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none focus:border-violet-500"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700 md:col-span-2">
                  E-posta
                  <input
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none focus:border-violet-500"
                  />
                </label>
                <div className="md:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="rounded-full bg-violet-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
                  >
                    Kaydet
                  </button>
                  {message && <p className="text-xs text-emerald-600">{message}</p>}
                </div>
              </form>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Siparişlerim
                  </h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {orderCount} sipariş
                  </span>
                </div>

                {orderCount === 0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                    Henüz siparişiniz yok. Sipariş vermek için{" "}
                    <Link to="/page/1" className="font-semibold text-violet-700">
                      ürünleri keşfedin
                    </Link>
                    .
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    {userOrders.slice(0, 10).map((order) => (
                      <button
                        key={order.orderId}
                        type="button"
                        onClick={() =>
                          setSelectedOrderId((prev) =>
                            prev === order.orderId ? null : order.orderId
                          )
                        }
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-xs transition ${
                          selectedOrderId === order.orderId
                            ? "border-violet-300 bg-violet-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-900">
                              #{order.orderId}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-600">
                              {new Date(order.createdAt).toLocaleString("tr-TR")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-slate-900">
                              {Number(order.totalPrice ?? 0).toLocaleString("tr-TR", {
                                style: "currency",
                                currency: "TRY",
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className="mt-1 text-[11px] font-semibold text-slate-600">
                              {order.paymentMethod === "cash"
                                ? "Kapıda ödeme"
                                : "Kart"}
                            </p>
                          </div>
                        </div>

                        {selectedOrderId === order.orderId && (
                          <div className="mt-3 rounded-xl bg-white/70 px-3 py-2">
                            <p className="text-[11px] font-semibold text-slate-700">
                              Ürünler
                            </p>
                            <div className="mt-2 space-y-1">
                              {(order.items ?? []).slice(0, 6).map((it) => (
                                <div
                                  key={`${order.orderId}-${it.id}`}
                                  className="flex items-center justify-between text-[11px] text-slate-700"
                                >
                                  <span className="truncate pr-2">
                                    {it.name} x{it.quantity}
                                  </span>
                                  <span className="font-semibold text-slate-900">
                                    {Number((it.price ?? 0) * (it.quantity ?? 0)).toLocaleString(
                                      "tr-TR",
                                      {
                                        style: "currency",
                                        currency: "TRY",
                                        maximumFractionDigits: 2,
                                      }
                                    )}
                                  </span>
                                </div>
                              ))}
                              {(order.items ?? []).length > 6 && (
                                <p className="text-[11px] text-slate-500">
                                  +{(order.items ?? []).length - 6} ürün daha
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900">
                  Sipariş Detayı
                </h3>
                {!selectedOrder ? (
                  <p className="mt-3 text-xs text-slate-600">
                    Soldan bir sipariş seçerek detayları görebilirsiniz.
                  </p>
                ) : (
                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="rounded-2xl bg-slate-50 px-3 py-2">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Sipariş
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        #{selectedOrder.orderId}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Ödeme
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {selectedOrder.paymentMethod === "cash"
                          ? "Kapıda ödeme"
                          : `Kart (•••• ${selectedOrder.paymentDetails?.last4 ?? "****"})`}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Teslimat Adresi
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {selectedOrder.customer?.address ?? "-"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Toplam
                      </p>
                      <p className="mt-1 font-extrabold text-slate-900">
                        {Number(selectedOrder.totalPrice ?? 0).toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

