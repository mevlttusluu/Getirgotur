import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orders";

function isValidEmail(email) {
  // Basit doğrulama yeterli: gerçek projede API doğrulaması önerilir.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, itemCount, totalPrice, clearCart } = useCart();

  const hasItems = items.length > 0;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    paymentMethod: "cash", // "cash" | "card"
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const orderPreview = useMemo(() => {
    return {
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        quantity: it.quantity,
        price: it.price,
        img: it.img,
      })),
      itemCount,
      totalPrice,
    };
  }, [items, itemCount, totalPrice]);

  const validate = () => {
    if (!form.name.trim()) return "Ad soyad zorunludur.";
    if (!form.phone.trim()) return "Telefon zorunludur.";
    if (!form.email.trim()) return "E-posta zorunludur.";
    if (!isValidEmail(form.email.trim())) return "E-posta formatı geçersiz.";
    if (!form.address.trim()) return "Ev adresi zorunludur.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasItems) {
      navigate("/cart");
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);

    const orderDraft = {
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
      },
      paymentMethod: form.paymentMethod,
      ...orderPreview,
      createdAt: Date.now(),
    };

    // Fake işlem: kullanıcıya akış hissi vermek için küçük bekleme.
    await new Promise((r) => setTimeout(r, 300));

    if (form.paymentMethod === "cash") {
      const order = await createOrder({
        ...orderDraft,
        paymentMethod: "cash",
      });
      clearCart();
      navigate("/order-success", { state: { order } });
      return;
    }

    navigate("/checkout/kart", { state: { orderDraft } });
  };

  if (!hasItems) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <main className="flex-1 px-6 py-12">
          <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Sepetiniz Boş
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Devam edebilmek için önce ürün ekleyin.
            </p>
            <Link
              to="/page/1"
              className="mt-6 inline-flex items-center rounded-full bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md"
            >
              Ürünleri Gör
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <main className="flex-1 px-6 py-10 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold">Sipariş Bilgileri</h1>
            <p className="mt-2 text-xs text-slate-500">
              Sipariş özeti ve iletişim bilgileri
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)]">
            <section className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                      Ad Soyad
                      <input
                        value={form.name}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none transition focus:border-violet-500"
                        placeholder="Örn: Adnan Altıntaş"
                        required
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                      Telefon
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none transition focus:border-violet-500"
                        placeholder="+90 5xx xxx xx xx"
                        required
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                    E-posta
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none transition focus:border-violet-500"
                      placeholder="ornek@mail.com"
                      required
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                    Ev Adresi
                    <input
                      value={form.address}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none transition focus:border-violet-500"
                      placeholder="Mahalle, sokak, no, daire"
                      required
                    />
                  </label>

                  <div>
                    <p className="mb-2 text-xs font-semibold text-slate-700">
                      Ödeme Yöntemi
                    </p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={form.paymentMethod === "cash"}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              paymentMethod: "cash",
                            }))
                          }
                        />
                        Kapıda Ödeme
                      </label>

                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={form.paymentMethod === "card"}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              paymentMethod: "card",
                            }))
                          }
                        />
                        Kart ile Ödeme
                      </label>
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
                    <Link
                      to="/cart"
                      className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Geri
                    </Link>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-violet-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                    >
                      {form.paymentMethod === "cash"
                        ? "Kapıda Ödeme ile Tamamla"
                        : "Kart ile Devam Et"}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Ödeme işlemleri örnek amaçlı simüle edilmektedir.
                  </p>
                </form>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-sm font-bold text-slate-900">
                  Sipariş Özeti
                </h2>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Ürün Adedi</span>
                    <span className="font-semibold">{itemCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ara Toplam</span>
                    <span className="font-semibold">
                      {totalPrice.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gönderim Ücreti</span>
                    <span className="font-semibold text-emerald-600">
                      Ücretsiz
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs font-semibold text-slate-900">
                    Toplam
                  </span>
                  <span className="text-base font-extrabold text-slate-900">
                    {totalPrice.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold text-slate-800">
                  Siparişinizdeki ürünler
                </p>
                <div className="mt-3 space-y-2 max-h-[240px] overflow-auto">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold text-slate-900">
                          {it.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          x{it.quantity}
                        </p>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800">
                        {((it.price ?? 0) * it.quantity).toLocaleString(
                          "tr-TR",
                          {
                            style: "currency",
                            currency: "TRY",
                            maximumFractionDigits: 2,
                          },
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
