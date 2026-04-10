import { useState } from "react";

const EMAILS = [
  {
    id: 1,
    unread: true,
    starred: true,
    sender: "GitHub",
    avatar: "GH",
    avatarColor: "#24292e",
    subject: "[github/myproject] PR #42 merged",
    preview: "Your pull request has been successfully merged into main branch.",
    time: "10:32 AM",
    label: "work",
    hasAttachment: false,
    body: "Your pull request #42 has been successfully merged into the main branch.\n\nMerged by: alex-dev\nBranch: feature/auth-refactor → main\nCommit: a3f92b1\n\nView the pull request on GitHub.",
  },
  {
    id: 2,
    unread: true,
    starred: false,
    sender: "Alex Johnson",
    avatar: "AJ",
    avatarColor: "#1a73e8",
    subject: "Re: Team lunch tomorrow?",
    preview: "Sounds great! I'll book the table at 1pm. See you all there 🎉",
    time: "9:14 AM",
    label: "personal",
    hasAttachment: false,
    body: "Sounds great! I'll book the table at 1pm.\n\nThe restaurant is at 45 Market Street — should be easy to find. Let me know if anyone needs a lift.\n\nSee you all there 🎉",
  },
  {
    id: 3,
    unread: true,
    starred: false,
    sender: "Notion",
    avatar: "N",
    avatarColor: "#000",
    subject: "Your weekly digest is ready",
    preview:
      "Here's what happened across your workspaces this week — 14 new pages, 3 comments.",
    time: "8:47 AM",
    label: null,
    hasAttachment: false,
    body: "Here's your weekly digest for the week of Oct 27 – Nov 2.\n\n📄 14 new pages created\n💬 3 new comments\n✅ 7 tasks completed\n\nVisit Notion to see your full activity.",
  },
  {
    id: 4,
    unread: false,
    starred: true,
    sender: "Chase Bank",
    avatar: "CB",
    avatarColor: "#117ACA",
    subject: "Your statement is ready",
    preview:
      "Your October 2025 statement for account ending in 4821 is now available.",
    time: "Yesterday",
    label: "finance",
    hasAttachment: true,
    body: "Your October 2025 bank statement for the account ending in 4821 is now available.\n\nStatement period: Oct 1 – Oct 31, 2025\nAccount: Checking ••••4821\n\nLog in to Chase online banking to view and download your statement.",
  },
  {
    id: 5,
    unread: false,
    starred: false,
    sender: "Stripe",
    avatar: "S",
    avatarColor: "#635BFF",
    subject: "Payout of $2,340.00 initiated",
    preview:
      "A payout of $2,340.00 USD has been initiated to your bank account.",
    time: "Yesterday",
    label: "finance",
    hasAttachment: false,
    body: "A payout has been initiated to your bank account.\n\nAmount: $2,340.00 USD\nEstimated arrival: 2 business days\nAccount: Bank of America ••••9201\n\nView this payout in your Stripe dashboard.",
  },
  {
    id: 6,
    unread: true,
    starred: false,
    sender: "Sara Williams",
    avatar: "SW",
    avatarColor: "#E91E63",
    subject: "Design feedback on the new landing page",
    preview:
      "Hi! I went through the mockups — overall looking great, just a few small tweaks needed.",
    time: "Tue",
    label: "work",
    hasAttachment: true,
    body: "Hi!\n\nI went through the mockups and overall they're looking really great. Just a few small tweaks:\n\n1. The hero section CTA button feels a bit small on mobile\n2. The testimonials section needs more whitespace\n3. Font size on footer links could be bumped up slightly\n\nI've attached a PDF with annotated screenshots. Let me know what you think!\n\n— Sara",
  },
  {
    id: 7,
    unread: false,
    starred: false,
    sender: "Google Workspace",
    avatar: "GW",
    avatarColor: "#4285F4",
    subject: "Storage alert: 80% used",
    preview:
      "Your Google Workspace storage is almost full. Manage storage to prevent issues.",
    time: "Tue",
    label: null,
    hasAttachment: false,
    body: "Your Google Workspace storage is 80% full.\n\nUsed: 12.8 GB of 15 GB\n\nTo prevent service interruptions, consider deleting files you no longer need or upgrading your storage plan.",
  },
  {
    id: 8,
    unread: false,
    starred: true,
    sender: "Mom",
    avatar: "M",
    avatarColor: "#FF7043",
    subject: "Weekend plans",
    preview: "Don't forget dinner on Sunday! Dad made his famous lasagna 🍝",
    time: "Mon",
    label: "personal",
    hasAttachment: false,
    body: "Hi sweetheart!\n\nDon't forget dinner on Sunday evening. Dad is making his famous lasagna 🍝 We're thinking around 6pm — let me know if that works for you.\n\nLove you!\nMom",
  },
  {
    id: 9,
    unread: false,
    starred: false,
    sender: "Vercel",
    avatar: "V",
    avatarColor: "#000",
    subject: "Deployment succeeded: myapp-prod",
    preview:
      "Your deployment to production is live. Branch: main • Commit: a3f92b1",
    time: "Mon",
    label: "work",
    hasAttachment: false,
    body: "Your deployment is live! 🚀\n\nProject: myapp-prod\nBranch: main\nCommit: a3f92b1 — 'fix: resolve auth token refresh bug'\nDuration: 43s\n\nVisit your deployment at https://myapp.vercel.app",
  },
  {
    id: 10,
    unread: false,
    starred: false,
    sender: "Netflix",
    avatar: "NF",
    avatarColor: "#E50914",
    subject: "New on Netflix this month",
    preview:
      "Discover what's new: new seasons, movies, and exclusives just added.",
    time: "Sun",
    label: null,
    hasAttachment: false,
    body: "Here's what's new on Netflix this November:\n\n🎬 New Movies\n• The Last Frontier (Action)\n• Midnight Bloom (Romance)\n\n📺 New Series\n• Echoes Season 2\n• The Code (Thriller)\n\nSign in to start watching.",
  },
  {
    id: 11,
    unread: true,
    starred: false,
    sender: "Figma",
    avatar: "F",
    avatarColor: "#A259FF",
    subject: "James shared a file with you",
    preview:
      "James Chen has shared 'Product Redesign v2' with you. Click to view.",
    time: "Sun",
    label: "work",
    hasAttachment: false,
    body: "James Chen has shared a Figma file with you.\n\nFile: Product Redesign v2\nShared with: you@example.com\nPermission: Can view\n\nOpen in Figma to collaborate.",
  },
  {
    id: 12,
    unread: false,
    starred: false,
    sender: "AWS",
    avatar: "AWS",
    avatarColor: "#FF9900",
    subject: "Your invoice for October 2025",
    preview: "Invoice #INV-20251001 — Total: $94.32. Thank you for using AWS.",
    time: "Oct 31",
    label: "finance",
    hasAttachment: true,
    body: "Thank you for using Amazon Web Services.\n\nInvoice #INV-20251001\nPeriod: October 1–31, 2025\n\nServices:\n• EC2: $54.20\n• S3: $18.12\n• CloudFront: $22.00\n\nTotal: $94.32 USD\n\nPayment will be charged to your card on file.",
  },
];

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
          style={{
            background: "#1a73e8",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            padding: "8px 24px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Send
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
  const [emails, setEmails] = useState(EMAILS);
  const [selectedId, setSelectedId] = useState(null);
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
    setSelectedId(id);
    setEmails((prev) =>
      prev.map((em) => (em.id === id ? { ...em, unread: false } : em))
    );
  };

  const filteredEmails = emails.filter(
    (e) =>
      search === "" ||
      e.sender.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase())
  );

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

                {/* Email List */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {filteredEmails.length === 0 && (
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
                  {filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => openEmail(email.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 16px",
                        borderBottom: "0.5px solid #f0f0f0",
                        cursor: "pointer",
                        background: email.unread ? "#fff" : "#f6f8fc",
                        transition: "background 0.1s",
                        fontWeight: email.unread ? 600 : 400,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f2f6fc")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = email.unread
                          ? "#fff"
                          : "#f6f8fc")
                      }
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
                      <Avatar
                        initials={email.avatar}
                        color={email.avatarColor}
                        size={32}
                      />
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
                  ))}
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
