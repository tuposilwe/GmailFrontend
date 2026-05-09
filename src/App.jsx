import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import GmailUI from "./Gmail";
import LoginPage from "./LoginPage";
import AdminPage from "./AdminPage";

const API_URL = import.meta.env.VITE_API_URL || "";

function App() {
  if (window.location.pathname === "/admin") return <AdminPage />;

  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState("loading"); // "loading" | "authenticated" | "unauthenticated" | "adding"
  const [activeEmail, setActiveEmail] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/accounts`);
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetch(`${API_URL}/auth/me`)
      .then(r => {
        if (r.ok) return r.json();
        throw new Error("unauthenticated");
      })
      .then(async data => {
        setActiveEmail(data.email);
        await fetchAccounts();
        setAuthState("authenticated");
      })
      .catch(() => {
        setAuthState("unauthenticated");
      });
  }, []);

  const handleLogin = async (email) => {
    setActiveEmail(email);
    await fetchAccounts();
    setAuthState("authenticated");
  };

  const handleLogout = async (emailToLogout) => {
    const target = emailToLogout || activeEmail;

    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: target }),
    });

    const remaining = accounts.filter(a => a.email !== target);
    setAccounts(remaining);

    if (target === activeEmail) {
      if (remaining.length > 0) {
        await handleSwitchAccount(remaining[0].email);
      } else {
        setActiveEmail(null);
        setAuthState("unauthenticated");
      }
    }
  };

  const handleSwitchAccount = async (email) => {
    try {
      const res = await fetch(`${API_URL}/auth/switch-to`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        queryClient.clear();
        setActiveEmail(data.email || email);
      }
    } catch {}
  };

  if (authState === "loading") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f8fc",
        fontFamily: "Arial, sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2"
            style={{ animation: "spin 0.8s linear infinite" }}>
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
          </svg>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (authState === "adding") {
    return (
      <LoginPage
        onLogin={async (email) => {
          await handleLogin(email);
          await handleSwitchAccount(email);
        }}
        onCancel={() => setAuthState("authenticated")}
        mode="add"
      />
    );
  }

  return (
    <GmailUI
      key={activeEmail}
      userEmail={activeEmail}
      accounts={accounts}
      onLogout={handleLogout}
      onSwitchAccount={handleSwitchAccount}
      onAddAccount={() => setAuthState("adding")}
    />
  );
}

export default App;
