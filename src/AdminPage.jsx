import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

const css = `
  @keyframes spin { to { transform: rotate(360deg); } }

  .adm-wrap {
    min-height: 100vh;
    background: #f0f4f9;
    font-family: 'Google Sans', Roboto, Arial, sans-serif;
    padding: 32px 16px;
    box-sizing: border-box;
  }

  .adm-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.1);
    padding: 32px;
    max-width: 680px;
    margin: 0 auto;
  }

  .adm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .adm-title {
    font-size: 22px;
    font-weight: 500;
    color: #202124;
    margin: 0;
  }

  .adm-btn {
    padding: 8px 18px;
    border-radius: 4px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
  }

  .adm-btn-primary { background: #1a73e8; color: #fff; }
  .adm-btn-primary:hover { background: #1765cc; }
  .adm-btn-primary:disabled { background: #94b8f0; cursor: default; }

  .adm-btn-danger  { background: #d93025; color: #fff; }
  .adm-btn-danger:hover  { background: #b52d22; }

  .adm-btn-ghost   { background: none; color: #1a73e8; border: 1px solid #dadce0; }
  .adm-btn-ghost:hover   { background: #f1f3f4; }

  .adm-btn-logout  { background: none; color: #5f6368; border: 1px solid #dadce0; }
  .adm-btn-logout:hover  { background: #f1f3f4; }

  .adm-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  .adm-table th { text-align: left; font-size: 12px; font-weight: 600; color: #5f6368; border-bottom: 1px solid #e8eaed; padding: 8px 12px; text-transform: uppercase; }
  .adm-table td { padding: 12px; border-bottom: 1px solid #f1f3f4; font-size: 14px; color: #202124; vertical-align: middle; }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr:hover td { background: #f8f9fa; }

  .adm-badge { display: inline-block; background: #e8f0fe; color: #1a73e8; border-radius: 4px; padding: 2px 8px; font-size: 12px; font-weight: 500; }

  .adm-empty { text-align: center; color: #80868b; padding: 40px 0; font-size: 14px; }

  /* Modal */
  .adm-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center; z-index: 999;
  }
  .adm-modal {
    background: #fff; border-radius: 12px; padding: 28px 32px;
    width: 440px; max-width: 96vw; box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  }
  .adm-modal-title { font-size: 18px; font-weight: 500; color: #202124; margin: 0 0 20px; }

  .adm-field { margin-bottom: 16px; }
  .adm-label { display: block; font-size: 12px; font-weight: 600; color: #5f6368; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.4px; }
  .adm-input {
    width: 100%; box-sizing: border-box; padding: 10px 12px;
    border: 1px solid #dadce0; border-radius: 4px; font-size: 14px;
    font-family: inherit; color: #202124; outline: none;
    transition: border-color 0.15s;
  }
  .adm-input:focus { border-color: #1a73e8; border-width: 2px; }

  .adm-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }

  .adm-error { background: #fce8e6; color: #c5221f; border-radius: 4px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px; }
  .adm-success { background: #e6f4ea; color: #137333; border-radius: 4px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px; }

  /* Login card */
  .adm-login-wrap {
    min-height: 100vh; background: #f0f4f9;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Google Sans', Roboto, Arial, sans-serif;
  }
  .adm-login-card {
    background: #fff; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.12);
    padding: 40px 36px; width: 360px; max-width: 94vw;
  }
`;

// ── Login form ─────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/admin/login`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Login failed");
      else onLogin();
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login-wrap">
      <style>{css}</style>
      <div className="adm-login-card">
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "#202124", margin: "0 0 6px" }}>Admin Panel</h1>
        <p style={{ fontSize: 14, color: "#5f6368", margin: "0 0 24px" }}>Sign in to manage IMAP servers</p>
        <form onSubmit={handleSubmit}>
          <div className="adm-field">
            <label className="adm-label">Admin Password</label>
            <input
              className="adm-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>
          {error && <div className="adm-error">{error}</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <button
              type="submit"
              className="adm-btn adm-btn-primary"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Server form modal ─────────────────────────────────────────────────────────
function ServerModal({ server, onClose, onSave }) {
  const [label, setLabel]   = useState(server?.label || "");
  const [host, setHost]     = useState(server?.host  || "");
  const [port, setPort]     = useState(server?.port  || 993);
  const [error, setError]   = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const url    = server ? `${API_URL}/admin/imap-servers/${server.id}` : `${API_URL}/admin/imap-servers`;
    const method = server ? "PUT" : "POST";
    try {
      const res  = await fetch(url, {
        method, credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, host, port: parseInt(port) || 993 }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save"); return; }
      onSave(data);
    } catch {
      setError("Could not connect to server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="adm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="adm-modal">
        <p className="adm-modal-title">{server ? "Edit IMAP Server" : "Add IMAP Server"}</p>
        <form onSubmit={handleSubmit}>
          <div className="adm-field">
            <label className="adm-label">Label</label>
            <input className="adm-input" value={label} onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Company Mail" required autoFocus />
          </div>
          <div className="adm-field">
            <label className="adm-label">IMAP Host</label>
            <input className="adm-input" value={host} onChange={e => setHost(e.target.value)}
              placeholder="e.g. imap.company.com" required />
          </div>
          <div className="adm-field">
            <label className="adm-label">Port</label>
            <input className="adm-input" type="number" value={port}
              onChange={e => setPort(e.target.value)} min="1" max="65535" required />
          </div>
          {error && <div className="adm-error">{error}</div>}
          <div className="adm-modal-actions">
            <button type="button" className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main admin dashboard ──────────────────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const [servers, setServers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null); // null | "add" | {server}
  const [deleteId, setDeleteId]   = useState(null);
  const [flash, setFlash]         = useState(null); // { type, msg }
  const [deleting, setDeleting]   = useState(false);

  const showFlash = (type, msg) => {
    setFlash({ type, msg });
    setTimeout(() => setFlash(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/admin/imap-servers`, { credentials: "include" });
      const data = await res.json();
      setServers(data);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = (saved) => {
    setServers(prev => {
      const exists = prev.find(s => s.id === saved.id);
      return exists ? prev.map(s => s.id === saved.id ? saved : s) : [...prev, saved];
    });
    setModal(null);
    showFlash("success", modal?.id ? "Server updated." : "Server added.");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`${API_URL}/admin/imap-servers/${deleteId}`, {
        method: "DELETE", credentials: "include",
      });
      setServers(prev => prev.filter(s => s.id !== deleteId));
      showFlash("success", "Server deleted.");
    } catch {
      showFlash("error", "Failed to delete.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/admin/logout`, { method: "POST", credentials: "include" });
    onLogout();
  };

  return (
    <div className="adm-wrap">
      <style>{css}</style>
      <div className="adm-card">
        <div className="adm-header">
          <h1 className="adm-title">IMAP Servers</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="adm-btn adm-btn-primary" onClick={() => setModal("add")}>
              + Add Server
            </button>
            <button className="adm-btn adm-btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {flash && (
          <div className={flash.type === "success" ? "adm-success" : "adm-error"}>
            {flash.msg}
          </div>
        )}

        {loading ? (
          <div className="adm-empty">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2"
              style={{ animation: "spin 0.8s linear infinite", marginBottom: 8 }}>
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
            </svg>
            <div>Loading…</div>
          </div>
        ) : servers.length === 0 ? (
          <div className="adm-empty">
            No IMAP servers configured yet.<br />
            <button className="adm-btn adm-btn-ghost" style={{ marginTop: 12 }} onClick={() => setModal("add")}>
              Add your first server
            </button>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Label</th>
                <th>Host</th>
                <th>Port</th>
                <th style={{ width: 100 }}></th>
              </tr>
            </thead>
            <tbody>
              {servers.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.label}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 13 }}>{s.host}</td>
                  <td><span className="adm-badge">{s.port}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="adm-btn adm-btn-ghost" style={{ padding: "5px 12px" }}
                        onClick={() => setModal(s)}>Edit</button>
                      <button className="adm-btn adm-btn-danger" style={{ padding: "5px 12px" }}
                        onClick={() => setDeleteId(s.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ fontSize: 12, color: "#80868b", marginTop: 8 }}>
          These servers are servers configured.
        </div>
      </div>

      {/* Add / Edit modal */}
      {modal && (
        <ServerModal
          server={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm modal */}
      {deleteId !== null && (
        <div className="adm-overlay" onClick={e => { if (e.target === e.currentTarget) setDeleteId(null); }}>
          <div className="adm-modal" style={{ maxWidth: 360 }}>
            <p className="adm-modal-title">Delete IMAP Server?</p>
            <p style={{ fontSize: 14, color: "#5f6368", margin: "0 0 20px" }}>
              This cannot be undone. Existing user sessions will keep using this server until they log in again.
            </p>
            <div className="adm-modal-actions">
              <button className="adm-btn adm-btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="adm-btn adm-btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [state, setState] = useState("loading"); // loading | login | dashboard

  useEffect(() => {
    fetch(`${API_URL}/admin/me`, { credentials: "include" })
      .then(r => setState(r.ok ? "dashboard" : "login"))
      .catch(() => setState("login"));
  }, []);

  if (state === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4f9" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2"
          style={{ animation: "spin 0.8s linear infinite" }}>
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
        </svg>
      </div>
    );
  }

  if (state === "login") return <AdminLogin onLogin={() => setState("dashboard")} />;
  return <AdminDashboard onLogout={() => setState("login")} />;
}
