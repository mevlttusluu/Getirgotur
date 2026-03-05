import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Buraya gerçek giriş isteğini (API) ekleyebilirsin
      onLogin({ email, password });
    } catch (err) {
      setError("Giriş yapılamadı, lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#e5e7ff,_#eef2ff_40%,_#e5e7eb)] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white px-7 py-8 shadow-2xl shadow-slate-900/30 ring-1 ring-slate-200/70">
        <div className="mb-4 flex justify-center">
          <img
            src="/logo.jpeg"
            alt="Getirgötür"
            className="h-18 w-18 rounded-full object-cover shadow-xl shadow-slate-900/50"
          />
        </div>
        <h1 className="mb-1 text-center text-2xl font-bold text-slate-900">
          Getirgötür’e Hoş Geldin
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Devam etmek için hesabına giriş yap.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            E‑posta
            <input
              type="email"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/30"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            Şifre
            <input
              type="password"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/30"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && (
            <div className="mt-1 rounded-2xl bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            className="mt-2 w-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:brightness-110 hover:shadow-xl disabled:cursor-default disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <button
          className="mt-4 w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700"
          type="button"
        >
          Şifremi unuttum
        </button>
      </div>
    </div>
  );
}