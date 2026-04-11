import { useState, useEffect } from "react";

const LABEL_STYLES = {
  work: { bg: "#fce8e6", color: "#c5221f" },
  personal: { bg: "#e6f4ea", color: "#137333" },
  finance: { bg: "#e8f0fe", color: "#1967d2" },
};

const NAV_ITEMS = [
  { icon: "📥", label: "Inbox", badge: 5 },
  { icon: "⭐", label: "Starred" },
  { icon: "🕐", label: "Snoozed" },
  { icon: "📤", label: "Sent" },
  { icon: "📝", label: "Drafts", badge: 3 },
  { icon: "🗑️", label: "Trash" },
];

function Avatar({ initials, color, size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size < 32 ? 11 : 13,
        fontWeight: 600,
        flexShrink: 0,
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

function ComposeModal({ onClose }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      await fetch("/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, text: body }),
      });
      onClose();
    } catch (err) {
      console.error("Failed to send email:", err);
    } finally {
      setSending(false);
    }
  };

  const fieldStyle = {
    display: "flex",
    alignItems: "center",
    borderBottom: "0.5px solid #e0e0e0",
    padding: "7px 16px",
    gap: 8,
  };
  const inputStyle = {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: 13,
    color: "#202124",
    background: "transparent",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 24,
        width: 520,
        zIndex: 200,
        borderRadius: "12px 12px 0 0",
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
        border: "0.5px solid #ccc",
        background: "#fff",
      }}
    >
      <div
        style={{
          background: "#404040",
          color: "#fff",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        <span>New Message</span>
        <div style={{ display: "flex", gap: 14, cursor: "pointer" }}>
          <span style={{ opacity: 0.8 }}>—</span>
          <span style={{ opacity: 0.8 }}>⤢</span>
          <span onClick={onClose} style={{ opacity: 0.8 }}>
            ✕
          </span>
        </div>
      </div>

      <div style={fieldStyle}>
        <span style={{ fontSize: 13, color: "#5f6368", minWidth: 28 }}>To</span>
        <input
          style={inputStyle}
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <div style={fieldStyle}>
        <span style={{ fontSize: 13, color: "#5f6368", minWidth: 28 }}>
          Subject
        </span>
        <input
          style={inputStyle}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{
          width: "100%",
          minHeight: 200,
          padding: "12px 16px",
          border: "none",
          outline: "none",
          resize: "none",
          fontSize: 14,
          color: "#202124",
          background: "#fff",
          fontFamily: "inherit",
          lineHeight: 1.6,
        }}
        placeholder="Write your message..."
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderTop: "0.5px solid #e0e0e0",
        }}
      >
        <button
          onClick={handleSend}
          disabled={sending}
          style={{
            background: "#1a73e8",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            padding: "8px 24px",
            fontSize: 14,
            fontWeight: 500,
            cursor: sending ? "default" : "pointer",
            opacity: sending ? 0.7 : 1,
          }}
        >
          {sending ? "Sending..." : "Send"}
        </button>
        {["📎", "🔗", "😊", "🖼️"].map((icon) => (
          <button
            key={icon}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              padding: "6px 8px",
              borderRadius: "50%",
              color: "#5f6368",
            }}
          >
            {icon}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            padding: "6px 8px",
            color: "#5f6368",
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

function EmailDetail({ email, onClose, onReply }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 20px",
          borderBottom: "0.5px solid #e0e0e0",
          gap: 12,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            color: "#5f6368",
            padding: "4px 8px",
            borderRadius: 4,
          }}
        >
          ←
        </button>
        <span
          style={{ fontSize: 16, fontWeight: 600, color: "#202124", flex: 1 }}
        >
          {email.subject}
        </span>
        {email.label && (
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 4,
              fontWeight: 500,
              background: LABEL_STYLES[email.label]?.bg,
              color: LABEL_STYLES[email.label]?.color,
            }}
          >
            {email.label.charAt(0).toUpperCase() + email.label.slice(1)}
          </span>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <Avatar initials={email.avatar} color={email.avatarColor} size={42} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 15, color: "#202124" }}>
                {email.sender}
              </span>
              <span style={{ fontSize: 13, color: "#5f6368" }}>
                {email.time}
              </span>
            </div>
            <span style={{ fontSize: 12, color: "#5f6368" }}>to me</span>
          </div>
        </div>

        <div
          style={{
            fontSize: 14,
            color: "#202124",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
            paddingLeft: 58,
          }}
        >
          {email.body}
        </div>

        {email.hasAttachment && (
          <div
            style={{
              marginTop: 28,
              marginLeft: 58,
              display: "flex",
              gap: 12,
            }}
          >
            {["document.pdf", "attachment.zip"].slice(0, 1).map((f) => (
              <div
                key={f}
                style={{
                  border: "0.5px solid #e0e0e0",
                  borderRadius: 8,
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "#202124",
                  cursor: "pointer",
                  background: "#f8f9fa",
                }}
              >
                📎 <span>{f}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          padding: "16px 28px 20px 86px",
          borderTop: "0.5px solid #e0e0e0",
          display: "flex",
          gap: 12,
        }}
      >
        <button
          onClick={onReply}
          style={{
            border: "0.5px solid #ccc",
            background: "#fff",
            borderRadius: 20,
            padding: "8px 20px",
            fontSize: 13,
            cursor: "pointer",
            color: "#202124",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ↩ Reply
        </button>
        <button
          style={{
            border: "0.5px solid #ccc",
            background: "#fff",
            borderRadius: 20,
            padding: "8px 20px",
            fontSize: 13,
            cursor: "pointer",
            color: "#202124",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ↪ Forward
        </button>
      </div>
    </div>
  );
}

export default function GmailUI() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [hoveredId, setHoveredId] = useState(null);
  const [showSelectDropdown, setShowSelectDropdown] = useState(false);

  useEffect(() => {
    fetch("/emails")
      .then((res) => res.json())
      .then((data) => {
        setEmails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch emails:", err);
        setLoading(false);
      });
  }, []);
  const [activeNav, setActiveNav] = useState("Inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [activeTab, setActiveTab] = useState("Primary");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const isExpanded = sidebarOpen || sidebarHovered;

  const selectedEmail = emails.find((e) => e.id === selectedId);

  const toggleStar = (id, e) => {
    e.stopPropagation();
    setEmails((prev) =>
      prev.map((em) => (em.id === id ? { ...em, starred: !em.starred } : em))
    );
  };

  const openEmail = (id) => {
    if (checkedIds.size > 0) {
      toggleCheck(id);
      return;
    }
    setSelectedId(id);
    setEmails((prev) =>
      prev.map((em) => (em.id === id ? { ...em, unread: false } : em))
    );
  };

  const toggleCheck = (id, e) => {
    if (e) e.stopPropagation();
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredEmails = emails.filter(
    (e) =>
      search === "" ||
      e.sender.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase())
  );

  const allChecked =
    filteredEmails.length > 0 &&
    filteredEmails.every((e) => checkedIds.has(e.id));
  const someChecked = checkedIds.size > 0;

  const toggleSelectAll = () => {
    if (allChecked) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(filteredEmails.map((e) => e.id)));
    }
  };

  const markCheckedRead = () => {
    setEmails((prev) =>
      prev.map((em) =>
        checkedIds.has(em.id) ? { ...em, unread: false } : em
      )
    );
    setCheckedIds(new Set());
  };

  const markCheckedUnread = () => {
    setEmails((prev) =>
      prev.map((em) =>
        checkedIds.has(em.id) ? { ...em, unread: true } : em
      )
    );
    setCheckedIds(new Set());
  };

  const deleteChecked = () => {
    setEmails((prev) => prev.filter((em) => !checkedIds.has(em.id)));
    setCheckedIds(new Set());
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
        background: "#f6f8fc",
        overflow: "hidden",
      }}
    >
      {/* ── TOP BAR (hamburger + logo + search + avatar) ── always full width, never moves */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px 8px 4px",
          background: "#f6f8fc",
          flexShrink: 0,
          height: 64,
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => {
            setSidebarOpen((o) => !o);
            setSidebarHovered(false);
          }}
          title="Main menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            width: 48,
            height: 48,
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            flexShrink: 0,
            transition: "background 0.1s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e0e0e0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <span
            style={{
              display: "block",
              width: 18,
              height: 2,
              background: "#5f6368",
              borderRadius: 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: 18,
              height: 2,
              background: "#5f6368",
              borderRadius: 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: 18,
              height: 2,
              background: "#5f6368",
              borderRadius: 1,
            }}
          />
        </button>

        {/* Gmail logo */}
        <span
          style={{
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: "-0.5px",
            whiteSpace: "nowrap",
            marginRight: 16,
            userSelect: "none",
          }}
        >
          <span style={{ color: "#4285F4" }}>G</span>
          <span style={{ color: "#EA4335" }}>m</span>
          <span style={{ color: "#FBBC05" }}>a</span>
          <span style={{ color: "#4285F4" }}>i</span>
          <span style={{ color: "#34A853" }}>l</span>
        </span>

        {/* Search bar */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            background: "#eaf1fb",
            borderRadius: 24,
            padding: "8px 16px",
            gap: 10,
            maxWidth: 720,
          }}
        >
          <span style={{ fontSize: 16, color: "#5f6368" }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mail"
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: 16,
              color: "#202124",
              width: "100%",
              fontFamily: "inherit",
            }}
          />
          {search && (
            <span
              onClick={() => setSearch("")}
              style={{ cursor: "pointer", color: "#5f6368", fontSize: 16 }}
            >
              ✕
            </span>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* Avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#1a73e8",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          A
        </div>
      </div>

      {/* ── BODY ROW (sidebar + main) ── */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Sidebar nav — always absolute when collapsed so main content never moves */}
        <div
          onMouseEnter={() => {
            if (!sidebarOpen) setSidebarHovered(true);
          }}
          onMouseLeave={() => setSidebarHovered(false)}
          style={{
            width: isExpanded ? 256 : 72,
            background: "#f6f8fc",
            display: "flex",
            flexDirection: "column",
            padding: "4px 0 8px",
            flexShrink: 0,
            transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)",
            overflow: "hidden",
            ...(!sidebarOpen
              ? {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  zIndex: 20,
                  boxShadow: isExpanded
                    ? "4px 0 16px rgba(0,0,0,0.14)"
                    : "none",
                }
              : {
                  position: "relative",
                }),
          }}
        >
          {/* Compose */}
          <div style={{ padding: "8px 12px 12px" }}>
            <button
              onClick={() => setShowCompose(true)}
              title="Compose"
              style={{
                width: isExpanded ? "100%" : 48,
                padding: isExpanded ? "14px 20px" : "14px 0",
                background: "#c2e7ff",
                border: "none",
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: isExpanded ? "flex-start" : "center",
                gap: 12,
                color: "#001d35",
                transition:
                  "width 0.2s cubic-bezier(0.4,0,0.2,1), padding 0.2s",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>✏️</span>
              <span
                style={{
                  opacity: isExpanded ? 1 : 0,
                  transition: "opacity 0.1s",
                  overflow: "hidden",
                }}
              >
                Compose
              </span>
            </button>
          </div>

          {/* Nav items */}
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              onClick={() => {
                setActiveNav(item.label);
                setSelectedId(null);
              }}
              title={!isExpanded ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: isExpanded ? 12 : 0,
                padding: isExpanded ? "7px 16px 7px 20px" : "7px 0",
                justifyContent: isExpanded ? "flex-start" : "center",
                fontSize: 14,
                cursor: "pointer",
                borderRadius: isExpanded ? "0 20px 20px 0" : "0 16px 16px 0",
                marginRight: isExpanded ? 16 : 8,
                marginLeft: isExpanded ? 0 : 8,
                background:
                  activeNav === item.label ? "#c2e7ff" : "transparent",
                color: activeNav === item.label ? "#001d35" : "#202124",
                fontWeight: activeNav === item.label ? 600 : 400,
                transition:
                  "background 0.1s, padding 0.2s, margin 0.2s, border-radius 0.2s",
                overflow: "hidden",
                whiteSpace: "nowrap",
                position: "relative",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              <span
                style={{
                  flex: 1,
                  opacity: isExpanded ? 1 : 0,
                  transition: "opacity 0.1s",
                  overflow: "hidden",
                }}
              >
                {item.label}
              </span>
              {item.badge && isExpanded && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: activeNav === item.label ? "#001d35" : "#202124",
                  }}
                >
                  {item.badge}
                </span>
              )}
              {item.badge && !isExpanded && (
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 6,
                    background: "#1a73e8",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: "50%",
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          ))}

          {/* Labels */}
          <div
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: "0.5px solid #e0e0e0",
              overflow: "hidden",
            }}
          >
            {isExpanded && (
              <div
                style={{
                  padding: "4px 20px",
                  fontSize: 12,
                  color: "#5f6368",
                  fontWeight: 500,
                  letterSpacing: "0.3px",
                }}
              >
                Labels
              </div>
            )}
            {Object.entries(LABEL_STYLES).map(([label, style]) => (
              <div
                key={label}
                title={!isExpanded ? label : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isExpanded ? 12 : 0,
                  padding: isExpanded ? "6px 16px 6px 20px" : "6px 0",
                  justifyContent: isExpanded ? "flex-start" : "center",
                  fontSize: 14,
                  cursor: "pointer",
                  borderRadius: isExpanded ? "0 20px 20px 0" : "0 16px 16px 0",
                  marginRight: isExpanded ? 16 : 8,
                  marginLeft: isExpanded ? 0 : 8,
                  color: "#202124",
                  transition: "padding 0.2s, margin 0.2s",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    fontSize: isExpanded ? 12 : 14,
                    color: style.color,
                    flexShrink: 0,
                  }}
                >
                  ●
                </span>
                <span
                  style={{
                    opacity: isExpanded ? 1 : 0,
                    transition: "opacity 0.1s",
                  }}
                >
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed spacer when collapsed — main content never moves regardless of hover */}
        {!sidebarOpen && (
          <div style={{ width: 72, flexShrink: 0, flexGrow: 0 }} />
        )}

        {/* ── MAIN CONTENT ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            borderRadius: "16px 16px 0 0",
            overflow: "hidden",
            margin: "0 0 0 0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            minWidth: 0,
          }}
        >
          {/* Content */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {selectedEmail ? (
              <EmailDetail
                email={selectedEmail}
                onClose={() => setSelectedId(null)}
                onReply={() => setShowCompose(true)}
              />
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Tabs */}
                <div
                  style={{
                    display: "flex",
                    borderBottom: "0.5px solid #e0e0e0",
                  }}
                >
                  {[
                    {
                      icon: "📥",
                      label: "Primary",
                      count: emails.filter((e) => e.unread).length,
                    },
                    { icon: "🏷️", label: "Promotions", count: 4 },
                    { icon: "👥", label: "Social", count: 2 },
                  ].map((tab) => (
                    <div
                      key={tab.label}
                      onClick={() => setActiveTab(tab.label)}
                      style={{
                        padding: "12px 20px",
                        fontSize: 14,
                        cursor: "pointer",
                        borderBottom:
                          activeTab === tab.label
                            ? "2px solid #1a73e8"
                            : "2px solid transparent",
                        color: activeTab === tab.label ? "#1a73e8" : "#5f6368",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        transition: "all 0.15s",
                      }}
                    >
                      {tab.icon} {tab.label}
                      {tab.count > 0 && (
                        <span
                          style={{
                            fontSize: 12,
                            background: "#f1f3f4",
                            padding: "1px 7px",
                            borderRadius: 10,
                            color: "#5f6368",
                          }}
                        >
                          {tab.count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Toolbar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 16px",
                    gap: 4,
                    borderBottom: "0.5px solid #e0e0e0",
                    minHeight: 40,
                    background: someChecked ? "#e8f0fe" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Select-all checkbox + dropdown caret */}
                  <div style={{ display: "flex", alignItems: "center", position: "relative", flexShrink: 0 }}>
                    {/* Checkbox */}
                    <div
                      onClick={toggleSelectAll}
                      style={{
                        width: 18,
                        height: 18,
                        border: `2px solid ${allChecked ? "#1a73e8" : someChecked ? "#1a73e8" : "#5f6368"}`,
                        borderRadius: 3,
                        background: allChecked ? "#1a73e8" : "transparent",
                        cursor: "pointer",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      {allChecked && (
                        <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>✓</span>
                      )}
                      {!allChecked && someChecked && (
                        <span style={{ color: "#1a73e8", fontSize: 14, lineHeight: 1, position: "absolute" }}>—</span>
                      )}
                    </div>

                    {/* Dropdown caret */}
                    <div
                      onClick={(e) => { e.stopPropagation(); setShowSelectDropdown((v) => !v); }}
                      style={{
                        width: 16,
                        height: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#5f6368",
                        fontSize: 10,
                        userSelect: "none",
                      }}
                    >
                      ▾
                    </div>

                    {/* Dropdown menu */}
                    {showSelectDropdown && (
                      <>
                        {/* Backdrop to close */}
                        <div
                          onClick={() => setShowSelectDropdown(false)}
                          style={{ position: "fixed", inset: 0, zIndex: 99 }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 26,
                            left: 0,
                            background: "#fff",
                            borderRadius: 8,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
                            zIndex: 100,
                            minWidth: 140,
                            padding: "4px 0",
                            border: "0.5px solid #e0e0e0",
                          }}
                        >
                          {[
                            {
                              label: "All",
                              action: () => setCheckedIds(new Set(filteredEmails.map((e) => e.id))),
                            },
                            {
                              label: "None",
                              action: () => setCheckedIds(new Set()),
                            },
                            {
                              label: "Read",
                              action: () => setCheckedIds(new Set(filteredEmails.filter((e) => !e.unread).map((e) => e.id))),
                            },
                            {
                              label: "Unread",
                              action: () => setCheckedIds(new Set(filteredEmails.filter((e) => e.unread).map((e) => e.id))),
                            },
                            {
                              label: "Starred",
                              action: () => setCheckedIds(new Set(filteredEmails.filter((e) => e.starred).map((e) => e.id))),
                            },
                            {
                              label: "Unstarred",
                              action: () => setCheckedIds(new Set(filteredEmails.filter((e) => !e.starred).map((e) => e.id))),
                            },
                          ].map(({ label, action }) => (
                            <div
                              key={label}
                              onClick={() => { action(); setShowSelectDropdown(false); }}
                              style={{
                                padding: "8px 20px",
                                fontSize: 14,
                                color: "#202124",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f4")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {someChecked ? (
                    <>
                      <span style={{ fontSize: 13, color: "#202124", marginLeft: 8, marginRight: 4 }}>
                        {checkedIds.size} selected
                      </span>
                      {[
                        { label: "Archive", icon: "📦", action: deleteChecked },
                        { label: "Delete", icon: "🗑️", action: deleteChecked },
                        { label: "Mark read", icon: "✉️", action: markCheckedRead },
                        { label: "Mark unread", icon: "📩", action: markCheckedUnread },
                      ].map(({ label, icon, action }) => (
                        <button
                          key={label}
                          onClick={action}
                          title={label}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "50%",
                            width: 32,
                            height: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                            color: "#5f6368",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#d2e3fc")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        >
                          {icon}
                        </button>
                      ))}
                    </>
                  ) : null}
                </div>

                {/* Email List */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {loading && (
                    <div
                      style={{
                        padding: 40,
                        textAlign: "center",
                        color: "#5f6368",
                        fontSize: 14,
                      }}
                    >
                      Loading emails...
                    </div>
                  )}
                  {!loading && filteredEmails.length === 0 && (
                    <div
                      style={{
                        padding: 40,
                        textAlign: "center",
                        color: "#5f6368",
                        fontSize: 14,
                      }}
                    >
                      No emails found
                    </div>
                  )}
                  {filteredEmails.map((email) => {
                    const isChecked = checkedIds.has(email.id);
                    const isHovered = hoveredId === email.id;
                    const showCheckbox = isChecked || isHovered;
                    return (
                    <div
                      key={email.id}
                      onClick={() => openEmail(email.id)}
                      onMouseEnter={() => setHoveredId(email.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 16px",
                        borderBottom: "0.5px solid #f0f0f0",
                        cursor: "pointer",
                        background: isChecked
                          ? "#e8f0fe"
                          : isHovered
                          ? "#f2f6fc"
                          : email.unread
                          ? "#fff"
                          : "#f6f8fc",
                        transition: "background 0.1s",
                        fontWeight: email.unread ? 600 : 400,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: email.unread ? "#1a73e8" : "transparent",
                          flexShrink: 0,
                        }}
                      />
                      {/* Avatar / Checkbox toggle */}
                      <div
                        onClick={(e) => toggleCheck(email.id, e)}
                        style={{
                          width: 32,
                          height: 32,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {showCheckbox ? (
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              border: `2px solid ${isChecked ? "#1a73e8" : "#5f6368"}`,
                              borderRadius: 3,
                              background: isChecked ? "#1a73e8" : "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {isChecked && (
                              <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>✓</span>
                            )}
                          </div>
                        ) : (
                          <Avatar
                            initials={email.avatar}
                            color={email.avatarColor}
                            size={32}
                          />
                        )}
                      </div>
                      <span
                        onClick={(e) => toggleStar(email.id, e)}
                        style={{
                          fontSize: 16,
                          cursor: "pointer",
                          flexShrink: 0,
                          color: email.starred ? "#F4B400" : "#ccc",
                          transition: "color 0.15s",
                        }}
                      >
                        {email.starred ? "★" : "☆"}
                      </span>
                      <span
                        style={{
                          minWidth: 148,
                          maxWidth: 148,
                          fontSize: 14,
                          color: "#202124",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {email.sender}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          overflow: "hidden",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            color: "#202124",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {email.subject}
                        </span>
                        <span
                          style={{ color: "#ccc", fontSize: 12, flexShrink: 0 }}
                        >
                          —
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            color: "#5f6368",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {email.preview}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexShrink: 0,
                        }}
                      >
                        {email.hasAttachment && (
                          <span style={{ fontSize: 14, color: "#5f6368" }}>
                            📎
                          </span>
                        )}
                        {email.label && (
                          <span
                            style={{
                              fontSize: 11,
                              padding: "2px 7px",
                              borderRadius: 4,
                              fontWeight: 500,
                              background: LABEL_STYLES[email.label]?.bg,
                              color: LABEL_STYLES[email.label]?.color,
                            }}
                          >
                            {email.label.charAt(0).toUpperCase() +
                              email.label.slice(1)}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: 12,
                            color: "#5f6368",
                            minWidth: 52,
                            textAlign: "right",
                            fontWeight: email.unread ? 700 : 400,
                          }}
                        >
                          {email.time}
                        </span>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} />}
    </div>
  );
}
