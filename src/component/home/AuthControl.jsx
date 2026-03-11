import React, { useState, useEffect } from "react";

const AuthControl = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("gg_user");
      const storedLoggedIn = localStorage.getItem("gg_loggedIn");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (storedLoggedIn === "true") {
          setCurrentUser({
            name: parsed.name,
            email: parsed.email,
            phone: parsed.phone,
          });
        }
      }
    } catch {
      // localStorage erişim hatası olursa sessizce geç
    }
  }, []);

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setAuthError("");
    setAuthMessage("");
  };

  const openRegister = () => {
    resetForm();
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const openLogin = () => {
    resetForm();
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const closeModals = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(false);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");

    if (isRegisterOpen) {
      if (!name || !phone || !email || !password) {
        setAuthError("Lütfen tüm alanları doldurun.");
        return;
      }

      const userData = { name, phone, email, password };

      try {
        localStorage.setItem("gg_user", JSON.stringify(userData));
        setAuthMessage("Kayıt başarılı. Giriş yapmak için bilgilerinizi kullanın.");
      } catch {
        setAuthError(
          "Bilgiler kaydedilemedi. Tarayıcı ayarlarını kontrol edin.",
        );
      }
    } else if (isLoginOpen) {
      if (!email || !password) {
        setAuthError("Lütfen e-posta ve şifreyi girin.");
        return;
      }

      try {
        const storedUser = localStorage.getItem("gg_user");
        if (!storedUser) {
          setAuthError("Kayıtlı bir kullanıcı bulunamadı. Önce kayıt olun.");
          return;
        }

        const parsed = JSON.parse(storedUser);
        if (parsed.email === email && parsed.password === password) {
          localStorage.setItem("gg_loggedIn", "true");
          setCurrentUser({
            name: parsed.name,
            email: parsed.email,
            phone: parsed.phone,
          });
          setAuthMessage("Giriş başarılı.");
          setTimeout(() => {
            closeModals();
          }, 800);
        } else {
          setAuthError("E-posta veya şifre hatalı.");
        }
      } catch {
        setAuthError("Giriş sırasında bir hata oluştu.");
      }
    }
  };

  const handleLogout = () => {
    try {
      localStorage.setItem("gg_loggedIn", "false");
    } catch {
      // yok say
    }
    setCurrentUser(null);
    setIsProfileOpen(false);
  };

  return (
    <>
      {currentUser ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 text-xs font-semibold text-white shadow-sm hover:brightness-110"
          >
            {currentUser.name?.charAt(0)?.toUpperCase() || "P"}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 z-50 mt-3 w-60 rounded-2xl border border-slate-100 bg-white p-3 text-xs shadow-xl">
              <div className="mb-3 flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-base text-slate-500">
                  {/* Profil resmi yoksa varsayılan insan ikonu */}
                  👤
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    {currentUser.name}
                  </div>
                  {currentUser.email && (
                    <div className="text-[11px] text-slate-500">
                      {currentUser.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700">
                    İsim Soyisim
                  </span>
                  <span>{currentUser.name}</span>
                </div>
                {currentUser.email && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-700">
                      E‑posta
                    </span>
                    <span>{currentUser.email}</span>
                  </div>
                )}
                {currentUser.phone && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-700">
                      Telefon Numarası
                    </span>
                    <span>{currentUser.phone}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center rounded-xl bg-rose-500 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-rose-600"
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={openRegister}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-[13px] font-bold text-white">
              ✓
            </span>
            <span>Kayıt Ol</span>
          </button>

          <button
            type="button"
            onClick={openLogin}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-indigo-500 hover:bg-indigo-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[13px] font-bold text-white">
              🔑
            </span>
            <span>Giriş Yap</span>
          </button>
        </>
      )}

      {(isRegisterOpen || isLoginOpen) && (
        <div className="fixed inset-0 z-[60] flex min-h-screen items-center justify-center bg-black/40 px-4 backdrop-blur-sm md:backdrop-blur">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {isRegisterOpen ? "Kayıt Ol" : "Giriş Yap"}
              </h2>
              <button
                type="button"
                onClick={closeModals}
                className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form className="space-y-3" onSubmit={handleAuthSubmit}>
              {isRegisterOpen && (
                <>
                  <input
                    type="text"
                    placeholder="Ad Soyad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon Numarası"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </>
              )}
              <input
                type="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />

              {authError && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  {authError}
                </div>
              )}
              {authMessage && (
                <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  {authMessage}
                </div>
              )}

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-violet-500 hover:to-indigo-400"
              >
                {isRegisterOpen ? "Kayıt Ol" : "Giriş Yap"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthControl;

