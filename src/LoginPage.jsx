import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        onLogin(data.email);
      }
    } catch {
      setError("Could not connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f6f8fc",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
    }}>
      {/* Card */}
      <div style={{
        background: "#fff",
        borderRadius: 28,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        padding: "48px 40px 36px",
        width: 400,
        maxWidth: "94vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        {/* Google logo */}
        <svg width="75" height="24" viewBox="0 0 75 24" style={{ marginBottom: 8 }}>
          <path d="M29.2 12.27c0-.76-.07-1.49-.19-2.19H17.83v4.14h6.38c-.28 1.48-1.1 2.74-2.34 3.58v2.98h3.79c2.21-2.04 3.49-5.04 3.49-8.51z" fill="#4285F4"/>
          <path d="M17.83 21.73c3.2 0 5.88-1.06 7.84-2.88l-3.79-2.94c-1.06.71-2.41 1.13-4.05 1.13-3.11 0-5.74-2.1-6.68-4.93H7.25v3.04c1.95 3.87 5.96 6.58 10.58 6.58z" fill="#34A853"/>
          <path d="M11.15 12.11c-.24-.71-.37-1.47-.37-2.25s.13-1.54.37-2.25V4.57H7.25C6.46 6.12 6 7.84 6 9.86s.46 3.74 1.25 5.29l3.9-3.04z" fill="#FBBC05"/>
          <path d="M17.83 4.68c1.75 0 3.32.6 4.56 1.79l3.41-3.41C23.7 1.19 21.03 0 17.83 0 13.21 0 9.2 2.71 7.25 6.58l3.9 3.04c.94-2.83 3.57-4.94 6.68-4.94z" fill="#EA4335"/>
          <text x="33" y="18" fontFamily="Arial" fontSize="20" fontWeight="400" fill="#202124">Mail</text>
        </svg>

        <h1 style={{ fontSize: 24, fontWeight: 400, color: "#202124", margin: "16px 0 8px", textAlign: "center" }}>
          Sign in
        </h1>
        <p style={{ fontSize: 14, color: "#5f6368", margin: "0 0 28px", textAlign: "center" }}>
          to continue to Mail
        </p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Email field */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder=" "
                required
                autoFocus
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "16px 14px 6px",
                  border: "1px solid #747775",
                  borderRadius: 4,
                  fontSize: 16,
                  outline: "none",
                  fontFamily: "inherit",
                  color: "#202124",
                  background: "transparent",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => { e.target.style.borderColor = "#1a73e8"; e.target.style.borderWidth = "2px"; }}
                onBlur={e => { e.target.style.borderColor = "#747775"; e.target.style.borderWidth = "1px"; }}
              />
              <label style={{
                position: "absolute", left: 14, top: email ? 6 : 16,
                fontSize: email ? 11 : 16, color: "#5f6368",
                pointerEvents: "none", transition: "all 0.15s",
                fontFamily: "inherit",
              }}>
                Email
              </label>
            </div>
          </div>

          {/* Password field */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder=" "
                required
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "16px 44px 6px 14px",
                  border: "1px solid #747775",
                  borderRadius: 4,
                  fontSize: 16,
                  outline: "none",
                  fontFamily: "inherit",
                  color: "#202124",
                  background: "transparent",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => { e.target.style.borderColor = "#1a73e8"; e.target.style.borderWidth = "2px"; }}
                onBlur={e => { e.target.style.borderColor = "#747775"; e.target.style.borderWidth = "1px"; }}
              />
              <label style={{
                position: "absolute", left: 14, top: password ? 6 : 16,
                fontSize: password ? 11 : 16, color: "#5f6368",
                pointerEvents: "none", transition: "all 0.15s",
                fontFamily: "inherit",
              }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#5f6368", padding: 4, display: "flex",
                }}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: "#fce8e6", color: "#c5221f", borderRadius: 4,
              padding: "10px 14px", fontSize: 14, marginBottom: 16,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
            <a href="https://support.google.com/accounts" target="_blank" rel="noreferrer"
              style={{ fontSize: 14, color: "#1a73e8", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"}
              onMouseLeave={e => e.target.style.textDecoration = "none"}>
              Forgot password?
            </a>
            <button
              type="submit"
              disabled={loading || !email || !password}
              style={{
                background: loading || !email || !password ? "#94b8f0" : "#1a73e8",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 500,
                cursor: loading || !email || !password ? "default" : "pointer",
                fontFamily: "inherit",
                minWidth: 88,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { if (!loading && email && password) e.currentTarget.style.background = "#1765cc"; }}
              onMouseLeave={e => { if (!loading && email && password) e.currentTarget.style.background = "#1a73e8"; }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                    style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                  </svg>
                  Signing in…
                </span>
              ) : "Next"}
            </button>
          </div>
        </form>
      </div>

      <p style={{ marginTop: 24, fontSize: 12, color: "#5f6368", textAlign: "center" }}>
        Use your IMAP email address and password (or app password) to sign in.
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus + label { top: 6px; font-size: 11px; color: #1a73e8; }
      `}</style>
    </div>
  );
}
