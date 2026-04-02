import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { addOrder } from "../utils/orderStorage";

export default function CardPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  const state = location.state || null;
  const orderDraft = state?.orderDraft || null;

  const [form, setForm] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!orderDraft) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <main className="flex-1 px-6 py-12">
          <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Sipariş bilgisi bulunamadı
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Lütfen tekrar sipariş verin.
            </p>
            <Link
              to="/cart"
              className="mt-6 inline-flex items-center rounded-full bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md"
            >
              Sepete dön
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const validate = () => {
    if (!form.cardHolder.trim()) return "Kart üzerindeki isim zorunludur.";
    const digits = form.cardNumber.replace(/\s+/g, "");
    if (!digits || digits.length < 12) return "Kart numarası geçersiz.";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry.trim()))
      return "Son kullanma tarihi formatı geçersiz (AA/YY).";
    if (!/^\d{3,4}$/.test(form.cvc.trim())) return "CVC geçersiz.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 350));

    const finalOrder = {
      ...orderDraft,
      paymentMethod: "card",
      paymentDetails: {
        cardHolder: form.cardHolder.trim(),
        last4: form.cardNumber.replace(/\s+/g, "").slice(-4),
      },
      orderId: `GG-${Date.now()}`,
    };

    addOrder(finalOrder);
    clearCart();
    navigate("/order-success", { state: { order: finalOrder } });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <main className="flex-1 px-6 py-10 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold">Kart Bilgileri</h1>
            <p className="mt-2 text-xs text-slate-500">
              Ödeme için kart bilgilerini girin
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)]">
            <section className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                      Kart Üzerindeki İsim
                      <input
                        value={form.cardHolder}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            cardHolder: e.target.value,
                          }))
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none transition focus:border-violet-500"
                        placeholder="Örn: Ayşe Yılmaz"
                        required
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                      Kart Numarası
                      <input
                        value={form.cardNumber}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            cardNumber: e.target.value,
                          }))
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none transition focus:border-violet-500"
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                      Son Kullanma (AA/YY)
                      <input
                        value={form.expiry}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            expiry: e.target.value,
                          }))
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none transition focus:border-violet-500"
                        placeholder="12/30"
                        inputMode="numeric"
                        required
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                      CVC
                      <input
                        value={form.cvc}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            cvc: e.target.value,
                          }))
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none transition focus:border-violet-500"
                        placeholder="123"
                        inputMode="numeric"
                        required
                      />
                    </label>
                  </div>

                  {error && (
                    <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
                    <Link
                      to="/checkout"
                      state={{ orderDraft }}
                      className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Geri
                    </Link>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-violet-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                    >
                      Ödemeyi Tamamla
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Kart bilgileri örnek amaçlı alınır ve gerçek ödeme yapılmaz.
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
                    <span className="font-semibold">
                      {orderDraft.itemCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Toplam</span>
                    <span className="font-semibold">
                      {orderDraft.totalPrice.toLocaleString("tr-TR", {
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
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold text-slate-800">
                  Teslimat bilgileri
                </p>
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <p className="font-semibold text-slate-900">
                    {orderDraft.customer.name}
                  </p>
                  <p>{orderDraft.customer.phone}</p>
                  <p>{orderDraft.customer.email}</p>
                  <p className="text-slate-500">
                    {orderDraft.customer.address}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

