import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./home/Header";
import Footer from "./home/footer";

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
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const current = readUserFromStorage();
    setUser(current);
    if (current) {
      setForm(current);
    }
  }, []);

  const initials = useMemo(() => {
    if (!form.name) return "U";
    return form.name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [form.name]);

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
                <p className="text-slate-500">12</p>
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900">Son Siparişler</h3>
                <ul className="mt-3 space-y-2 text-xs text-slate-600">
                  <li className="rounded-xl bg-slate-50 px-3 py-2">#GG-1208 - Tamamlandı</li>
                  <li className="rounded-xl bg-slate-50 px-3 py-2">#GG-1202 - Tamamlandı</li>
                  <li className="rounded-xl bg-slate-50 px-3 py-2">#GG-1196 - İptal</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900">Kayıtlı Adresler</h3>
                <ul className="mt-3 space-y-2 text-xs text-slate-600">
                  <li className="rounded-xl bg-slate-50 px-3 py-2">Ev - Kadikoy / Istanbul</li>
                  <li className="rounded-xl bg-slate-50 px-3 py-2">Ofis - Sisli / Istanbul</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

