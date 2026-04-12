import { useState, useEffect } from "react";
import {
  MdInbox,
  MdStar,
  MdStarBorder,
  MdSchedule,
  MdSend,
  MdDrafts,
  MdDelete,
  MdSearch,
  MdEdit,
  MdAttachFile,
  MdArrowBack,
  MdReply,
  MdForward,
  MdArchive,
  MdMarkEmailRead,
  MdMarkEmailUnread,
  MdClose,
  MdMenu,
  MdLabel,
  MdArrowDropDown,
  MdMoreVert,
  MdRefresh,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdDownload,
  MdInsertDriveFile,
  MdImage,
  MdPictureAsPdf,
  MdUnsubscribe,
  MdAccessTime,
  MdReport,
  MdDriveFileMove,
  MdOutbox,
} from "react-icons/md";

const LABEL_STYLES = {
  work: { bg: "#fce8e6", color: "#c5221f" },
  personal: { bg: "#e6f4ea", color: "#137333" },
  finance: { bg: "#e8f0fe", color: "#1967d2" },
};

const NAV_ITEMS = [
  { icon: MdInbox, label: "Inbox", badge: 5 },
  { icon: MdStar, label: "Starred" },
  { icon: MdSchedule, label: "Snoozed" },
  { icon: MdSend, label: "Sent" },
  { icon: MdDrafts, label: "Drafts", badge: 3 },
  { icon: MdDelete, label: "Trash" },
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
        <div style={{ display: "flex", gap: 14, cursor: "pointer", alignItems: "center" }}>
          <MdKeyboardArrowDown size={18} style={{ opacity: 0.8 }} />
          <MdClose onClick={onClose} size={18} style={{ opacity: 0.8 }} />
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
        {[MdAttachFile, MdMoreVert].map((Icon) => (
          <button
            key={Icon.name}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 8px",
              borderRadius: "50%",
              color: "#5f6368",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icon size={18} />
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 8px",
            color: "#5f6368",
            display: "flex",
            alignItems: "center",
          }}
        >
          <MdDelete size={18} />
        </button>
      </div>
    </div>
  );
}

function EmailDetail({ email, onClose, onReply, onDelete, onMarkUnread, onPrev, onNext, emailPosition, totalEmails }) {
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [downloadingIdx, setDownloadingIdx] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [mailboxes, setMailboxes] = useState([]);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft"  && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onPrev, onNext]);

  const act = async (endpoint, method = "POST") => {
    setActing(true);
    try {
      await fetch(`/emails/${email.id}/${endpoint}`, { method });
    } catch (e) {
      console.error(e);
    } finally {
      setActing(false);
    }
  };

  const handleArchive = async () => { await act("archive"); onDelete(); };
  const handleSpam    = async () => { await act("spam");    onDelete(); };
  const handleDelete  = async () => { await act("trash");   onDelete(); };
  const handleUnread  = async () => { await act("mark-unread"); onMarkUnread(); };
  const handleRead    = async () => { await act("mark-read"); onClose(); setShowMoreMenu(false); };
  const handleStar    = async () => { await act("star"); setShowMoreMenu(false); };

  const openMoveMenu = async () => {
    setShowMoveMenu(true);
    if (mailboxes.length === 0) {
      const res = await fetch("/mailboxes");
      const data = await res.json();
      setMailboxes(data.filter(m => !m.specialUse?.includes("\\Sent") && !m.specialUse?.includes("\\Drafts")));
    }
  };

  const handleMove = async (mailboxPath) => {
    setActing(true);
    setShowMoveMenu(false);
    try {
      await fetch(`/emails/${email.id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mailbox: mailboxPath }),
      });
      onDelete();
    } catch (e) {
      console.error(e);
    } finally {
      setActing(false);
    }
  };

  const downloadAttachment = async (index, filename) => {
    setDownloadingIdx(index);
    try {
      const res = await fetch(`/emails/${email.id}/attachments/${index}`);
      if (!res.ok) throw new Error("Failed to fetch attachment");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloadingIdx(null);
    }
  };

  useEffect(() => {
    setLoadingDetail(true);
    setDetail(null);
    fetch(`/emails/${email.id}`)
      .then((r) => r.json())
      .then((data) => { setDetail(data); setLoadingDetail(false); })
      .catch(() => setLoadingDetail(false));
  }, [email.id]);

  const senderName = detail?.senderName || email.senderName || email.sender;
  const senderEmail = detail?.senderEmail || email.senderEmail || "";
  const toEmail = detail?.toEmail || "";
  const fullDate = detail?.date
    ? new Date(detail.date).toLocaleString([], {
        weekday: "short", month: "short", day: "numeric",
        year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : email.time;

  const iconBtn = (onClick, title, children) => (
    <button
      key={title}
      title={title}
      onClick={onClick}
      style={{ background: "none", border: "none", cursor: "pointer", color: "#5f6368", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      {children}
    </button>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", minWidth: 0 }}>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", padding: "4px 8px", borderBottom: "0.5px solid #e0e0e0", gap: 0, flexShrink: 0, position: "relative" }}>

        {/* Back */}
        {iconBtn(onClose, "Back to Inbox", <MdArrowBack size={20} />)}

        <div style={{ width: 8 }} />

        {/* Primary actions */}
        {iconBtn(handleArchive, "Archive",      <MdArchive size={20} />)}
        {iconBtn(handleSpam,    "Report spam",  <MdReport size={20} />)}
        {iconBtn(handleDelete,  "Delete",       <MdDelete size={20} />)}

        <div style={{ width: 1, height: 24, background: "#e0e0e0", margin: "0 4px" }} />

        {/* Secondary actions */}
        {iconBtn(handleUnread, "Mark as unread", <MdMarkEmailUnread size={20} />)}
        {iconBtn(() => {}, "Snooze", <MdAccessTime size={20} />)}

        <div style={{ width: 1, height: 24, background: "#e0e0e0", margin: "0 4px" }} />

        {/* Move to */}
        <div style={{ position: "relative" }}>
          {iconBtn(openMoveMenu, "Move to", <MdDriveFileMove size={20} />)}
          {showMoveMenu && (
            <>
              <div onClick={() => setShowMoveMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
              <div style={{ position: "absolute", top: 44, left: 0, background: "#fff", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.18)", zIndex: 100, minWidth: 220, maxHeight: 320, overflowY: "auto", padding: "4px 0", border: "0.5px solid #e0e0e0" }}>
                <div style={{ padding: "8px 16px 4px", fontSize: 12, color: "#5f6368", fontWeight: 500 }}>Move to</div>
                {mailboxes.length === 0
                  ? <div style={{ padding: "10px 20px", fontSize: 14, color: "#5f6368" }}>Loading...</div>
                  : mailboxes.map(mb => (
                    <div
                      key={mb.path}
                      onClick={() => handleMove(mb.path)}
                      style={{ padding: "10px 20px", fontSize: 14, color: "#202124", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f4")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <MdOutbox size={16} color="#5f6368" />
                      {mb.name}
                    </div>
                  ))
                }
              </div>
            </>
          )}
        </div>

        {iconBtn(() => {}, "Labels", <MdLabel size={20} />)}

        <div style={{ width: 1, height: 24, background: "#e0e0e0", margin: "0 4px" }} />

        {/* More */}
        <div style={{ position: "relative" }}>
          {iconBtn(() => setShowMoreMenu(v => !v), "More", <MdMoreVert size={20} />)}
          {showMoreMenu && (
            <>
              <div onClick={() => setShowMoreMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
              <div style={{ position: "absolute", top: 44, left: 0, background: "#fff", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.18)", zIndex: 100, minWidth: 220, padding: "4px 0", border: "0.5px solid #e0e0e0" }}>
                {[
                  { label: "Mark as read",              action: handleRead },
                  { label: "Add star",                   action: handleStar },
                  { label: "Print",                      action: () => { window.print(); setShowMoreMenu(false); } },
                  { label: "Report phishing",            action: () => { handleSpam(); } },
                  { label: "Filter messages like these", action: () => setShowMoreMenu(false) },
                  { label: "Mute",                       action: () => setShowMoreMenu(false) },
                ].map(({ label, action }) => (
                  <div
                    key={label}
                    onClick={action}
                    style={{ padding: "10px 20px", fontSize: 14, color: "#202124", cursor: "pointer" }}
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

        {/* Spacer + prev/next navigation */}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 2, color: "#5f6368", fontSize: 13 }}>
          <span style={{ marginRight: 4, whiteSpace: "nowrap" }}>
            {emailPosition} of {totalEmails}
          </span>
          <button
            onClick={onPrev}
            disabled={!onPrev}
            title="Newer"
            style={{
              background: "none", border: "none",
              cursor: onPrev ? "pointer" : "default",
              borderRadius: "50%", width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: onPrev ? "#5f6368" : "#bdbdbd",
            }}
            onMouseEnter={(e) => { if (onPrev) e.currentTarget.style.background = "rgba(0,0,0,0.08)"; }}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <MdKeyboardArrowLeft size={20} />
          </button>
          <button
            onClick={onNext}
            disabled={!onNext}
            title="Older"
            style={{
              background: "none", border: "none",
              cursor: onNext ? "pointer" : "default",
              borderRadius: "50%", width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: onNext ? "#5f6368" : "#bdbdbd",
            }}
            onMouseEnter={(e) => { if (onNext) e.currentTarget.style.background = "rgba(0,0,0,0.08)"; }}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <MdKeyboardArrowRight size={20} />
          </button>
        </div>

        {/* Disable overlay while acting */}
        {acting && (
          <div style={{ position: "absolute", inset: 0, zIndex: 50, cursor: "wait" }} />
        )}
      </div>

      {/* Subject line */}
      <div style={{ display: "flex", alignItems: "center", padding: "12px 24px 4px", gap: 12, flexShrink: 0 }}>
        <span style={{ fontSize: 22, fontWeight: 500, color: "#202124", flex: 1, lineHeight: 1.3 }}>
          {email.subject}
        </span>
        {email.label && email.label !== "inbox" && (
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 500, background: LABEL_STYLES[email.label]?.bg, color: LABEL_STYLES[email.label]?.color, flexShrink: 0 }}>
            {email.label.charAt(0).toUpperCase() + email.label.slice(1)}
          </span>
        )}
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px" }}>

        {/* Message card */}
        <div style={{ border: "0.5px solid #e0e0e0", borderRadius: 8, padding: "20px 24px", marginBottom: 16 }}>

          {/* Sender row */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
            <Avatar initials={email.avatar} color={email.avatarColor} size={40} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, minWidth: 0, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#202124" }}>{senderName}</span>
                  {senderEmail && (
                    <span style={{ fontSize: 12, color: "#5f6368" }}>&lt;{senderEmail}&gt;</span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: "#5f6368", flexShrink: 0 }}>{fullDate}</span>
              </div>

              {/* to me / details toggle */}
              <div
                style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, cursor: "pointer" }}
                onClick={() => setShowDetails((v) => !v)}
              >
                <span style={{ fontSize: 12, color: "#5f6368" }}>
                  to {toEmail || "me"}
                </span>
                <MdKeyboardArrowDown
                  size={16}
                  color="#5f6368"
                  style={{ transform: showDetails ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                />
              </div>

              {/* Expanded details */}
              {showDetails && (
                <div style={{ marginTop: 8, fontSize: 12, color: "#5f6368", lineHeight: 1.8 }}>
                  <div><span style={{ display: "inline-block", minWidth: 40 }}>from:</span> {senderName} &lt;{senderEmail}&gt;</div>
                  <div><span style={{ display: "inline-block", minWidth: 40 }}>to:</span> {toEmail || "me"}</div>
                  <div><span style={{ display: "inline-block", minWidth: 40 }}>date:</span> {fullDate}</div>
                  <div><span style={{ display: "inline-block", minWidth: 40 }}>subject:</span> {email.subject}</div>
                </div>
              )}
            </div>

            {/* Action icons */}
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              <button onClick={onReply} title="Reply" style={{ background: "none", border: "none", cursor: "pointer", color: "#5f6368", borderRadius: "50%", padding: 6, display: "flex" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f4")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              ><MdReply size={18} /></button>
              <button title="Forward" style={{ background: "none", border: "none", cursor: "pointer", color: "#5f6368", borderRadius: "50%", padding: 6, display: "flex" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f4")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              ><MdForward size={18} /></button>
            </div>
          </div>

          {/* Body */}
          {loadingDetail ? (
            <div style={{ color: "#5f6368", fontSize: 13, padding: "20px 0" }}>Loading message...</div>
          ) : detail?.html ? (
            <div
              style={{ fontSize: 14, color: "#202124", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: detail.html }}
            />
          ) : (
            <div style={{ fontSize: 14, color: "#202124", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {detail?.text || "(No message content)"}
            </div>
          )}

          {/* Attachments */}
          {!loadingDetail && detail?.attachments?.length > 0 && (
            <div style={{ marginTop: 24, borderTop: "0.5px solid #e0e0e0", paddingTop: 16 }}>
              <div style={{ fontSize: 13, color: "#5f6368", marginBottom: 10 }}>
                {detail.attachments.length} attachment{detail.attachments.length > 1 ? "s" : ""}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {detail.attachments.map((att) => {
                  const isImage = att.contentType.startsWith("image/");
                  const isPdf = att.contentType === "application/pdf";
                  const AttIcon = isImage ? MdImage : isPdf ? MdPictureAsPdf : MdInsertDriveFile;
                  const iconColor = isImage ? "#34A853" : isPdf ? "#EA4335" : "#1a73e8";
                  const sizeLabel = att.size >= 1024 * 1024
                    ? `${(att.size / (1024 * 1024)).toFixed(1)} MB`
                    : att.size >= 1024
                    ? `${(att.size / 1024).toFixed(0)} KB`
                    : `${att.size} B`;

                  return (
                    <div
                      key={att.index}
                      style={{
                        border: "0.5px solid #e0e0e0",
                        borderRadius: 8,
                        width: 220,
                        overflow: "hidden",
                        background: "#f8f9fa",
                      }}
                    >
                      {/* Preview area */}
                      <div style={{
                        height: 80,
                        background: "#f1f3f4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottom: "0.5px solid #e0e0e0",
                      }}>
                        <AttIcon size={36} color={iconColor} />
                      </div>

                      {/* Info + download row */}
                      <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
                        <AttIcon size={16} color={iconColor} style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: "#202124", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {att.filename}
                          </div>
                          <div style={{ fontSize: 11, color: "#5f6368" }}>{sizeLabel}</div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); downloadAttachment(att.index, att.filename); }}
                          title="Download"
                          disabled={downloadingIdx === att.index}
                          style={{ background: "none", border: "none", cursor: downloadingIdx === att.index ? "default" : "pointer", color: "#5f6368", display: "flex", flexShrink: 0, padding: 0, opacity: downloadingIdx === att.index ? 0.4 : 1 }}
                        >
                          <MdDownload size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Reply / Forward buttons */}
        <div style={{ display: "flex", gap: 12, paddingLeft: 4 }}>
          <button
            onClick={onReply}
            style={{ border: "0.5px solid #ccc", background: "#fff", borderRadius: 20, padding: "8px 20px", fontSize: 13, cursor: "pointer", color: "#202124", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}
          >
            <MdReply size={16} /> Reply
          </button>
          <button
            style={{ border: "0.5px solid #ccc", background: "#fff", borderRadius: 20, padding: "8px 20px", fontSize: 13, cursor: "pointer", color: "#202124", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}
          >
            <MdForward size={16} /> Forward
          </button>
        </div>
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
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [unsubscribeTarget, setUnsubscribeTarget] = useState(null); // { id, sender }
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);
  const PAGE_SIZE = 50;

  const [activeNav, setActiveNav] = useState("Inbox");

  useEffect(() => {
    setLoading(true);
    setEmails([]);
    const url = activeNav === "Starred"
      ? "/emails/starred"
      : `/emails?page=${currentPage}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmails(data);
          setTotalEmails(data.length);
        } else {
          setEmails(data.emails || []);
          setTotalEmails(data.total || 0);
        }
        setLoading(false);
      })
      .catch((err) => { console.error("Failed to fetch emails:", err); setLoading(false); });
  }, [activeNav, currentPage]);
  const [showCompose, setShowCompose] = useState(false);
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

  const filteredEmails = emails.filter((e) => {
    const matchesSearch =
      search === "" ||
      e.sender.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase());

    // backend already returns the right set for each nav;
    // client-side filter only needed for views not yet backed by a dedicated endpoint
    const matchesNav = true;

    return matchesSearch && matchesNav;
  });

  const totalPages = Math.ceil(totalEmails / PAGE_SIZE) || 1;
  const paginatedEmails = filteredEmails; // server already returns the current page's slice
  const pageStart = totalEmails === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, totalEmails);

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

  const refreshEmails = () => {
    setRefreshing(true);
    setLoading(true);
    const url = activeNav === "Starred"
      ? "/emails/starred"
      : `/emails?page=${currentPage}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmails(data);
          setTotalEmails(data.length);
        } else {
          setEmails(data.emails || []);
          setTotalEmails(data.total || 0);
        }
        setLoading(false);
        setRefreshing(false);
      })
      .catch(() => { setLoading(false); setRefreshing(false); });
  };

  const markAllRead = () => {
    setEmails((prev) => prev.map((em) => ({ ...em, unread: false })));
    setShowMoreMenu(false);
  };

  const confirmUnsubscribe = async () => {
    if (!unsubscribeTarget) return;
    setUnsubscribing(true);
    try {
      await fetch(`/emails/${unsubscribeTarget.id}/unsubscribe`, { method: "POST" });
      setEmails((prev) => prev.filter((em) => em.id !== unsubscribeTarget.id));
    } catch (err) {
      console.error("Unsubscribe failed:", err);
    } finally {
      setUnsubscribing(false);
      setUnsubscribeTarget(null);
    }
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
          <MdMenu size={22} color="#5f6368" />
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
          <MdSearch size={20} color="#5f6368" />
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
            <MdClose
              onClick={() => setSearch("")}
              size={18}
              color="#5f6368"
              style={{ cursor: "pointer", flexShrink: 0 }}
            />
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
              <MdEdit size={20} style={{ flexShrink: 0 }} />
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
                setCurrentPage(1);
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
              <item.icon size={20} style={{ flexShrink: 0 }} />
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
                <MdLabel size={18} style={{ color: style.color, flexShrink: 0 }} />
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
            {(() => {
              const emailIdx = paginatedEmails.findIndex(e => e.id === selectedId);
              const emailPosition = pageStart + emailIdx;
              return selectedEmail ? (
              <EmailDetail
                email={selectedEmail}
                onClose={() => setSelectedId(null)}
                onReply={() => setShowCompose(true)}
                onDelete={() => {
                  setEmails(prev => prev.filter(em => em.id !== selectedEmail.id));
                  setSelectedId(null);
                }}
                onMarkUnread={() => {
                  setEmails(prev => prev.map(em => em.id === selectedEmail.id ? { ...em, unread: true } : em));
                  setSelectedId(null);
                }}
                emailPosition={emailPosition}
                totalEmails={totalEmails}
                onPrev={emailIdx > 0 ? () => setSelectedId(paginatedEmails[emailIdx - 1].id) : null}
                onNext={emailIdx < paginatedEmails.length - 1 ? () => setSelectedId(paginatedEmails[emailIdx + 1].id) : null}
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
                        userSelect: "none",
                      }}
                    >
                      <MdArrowDropDown size={18} />
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
                        { label: "Archive", Icon: MdArchive, action: deleteChecked },
                        { label: "Delete", Icon: MdDelete, action: deleteChecked },
                        { label: "Mark read", Icon: MdMarkEmailRead, action: markCheckedRead },
                        { label: "Mark unread", Icon: MdMarkEmailUnread, action: markCheckedUnread },
                      ].map(({ label, Icon, action }) => (
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
                            color: "#5f6368",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#d2e3fc")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        >
                          <Icon size={18} />
                        </button>
                      ))}
                    </>
                  ) : null}

                  {/* Refresh + more menu — right next to multiselect */}
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* Refresh */}
                    <button
                      onClick={refreshEmails}
                      title="Refresh"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#5f6368",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f4")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      <MdRefresh
                        size={20}
                        style={{
                          transition: "transform 0.5s",
                          transform: refreshing ? "rotate(360deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>

                    {/* Three-dots menu */}
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => setShowMoreMenu((v) => !v)}
                        title="More"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "50%",
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#5f6368",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f4")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                      >
                        <MdMoreVert size={20} />
                      </button>

                      {showMoreMenu && (
                        <>
                          <div
                            onClick={() => setShowMoreMenu(false)}
                            style={{ position: "fixed", inset: 0, zIndex: 99 }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 38,
                              left: 0,
                              background: "#fff",
                              borderRadius: 8,
                              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
                              zIndex: 100,
                              minWidth: 180,
                              padding: "4px 0",
                              border: "0.5px solid #e0e0e0",
                            }}
                          >
                            {[
                              { label: "Mark all as read", action: markAllRead },
                            ].map(({ label, action }) => (
                              <div
                                key={label}
                                onClick={action}
                                style={{ padding: "10px 20px", fontSize: 14, color: "#202124", cursor: "pointer" }}
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
                  </div>

                  {/* Spacer pushes pagination to the right */}
                  <div style={{ flex: 1 }} />

                  {/* Pagination — "1–50 of X" + prev/next arrows */}
                  <div style={{ display: "flex", alignItems: "center", gap: 2, color: "#5f6368", fontSize: 13 }}>
                    <span style={{ marginRight: 6, whiteSpace: "nowrap" }}>
                      {pageStart}–{pageEnd} of {totalEmails}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      title="Newer"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: currentPage === 1 ? "default" : "pointer",
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: currentPage === 1 ? "#bdbdbd" : "#5f6368",
                      }}
                      onMouseEnter={(e) => { if (currentPage > 1) e.currentTarget.style.background = "#f1f3f4"; }}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      <MdKeyboardArrowLeft size={20} />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      title="Older"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: currentPage === totalPages ? "default" : "pointer",
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: currentPage === totalPages ? "#bdbdbd" : "#5f6368",
                      }}
                      onMouseEnter={(e) => { if (currentPage < totalPages) e.currentTarget.style.background = "#f1f3f4"; }}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      <MdKeyboardArrowRight size={20} />
                    </button>
                  </div>
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
                      {activeNav === "Starred"
                        ? "No starred messages"
                        : activeNav === "Sent"
                        ? "No sent messages"
                        : activeNav === "Drafts"
                        ? "No drafts"
                        : activeNav === "Trash"
                        ? "Trash is empty"
                        : activeNav === "Snoozed"
                        ? "No snoozed messages"
                        : "No emails found"}
                    </div>
                  )}
                  {paginatedEmails.map((email) => {
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
                          cursor: "pointer",
                          flexShrink: 0,
                          color: email.starred ? "#F4B400" : "#ccc",
                          display: "flex",
                          alignItems: "center",
                          transition: "color 0.15s",
                        }}
                      >
                        {email.starred
                          ? <MdStar size={18} />
                          : <MdStarBorder size={18} />}
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
                          flexDirection: "column",
                          gap: 3,
                          overflow: "hidden",
                          minWidth: 0,
                        }}
                      >
                        {/* Subject + preview line */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
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
                          <span style={{ color: "#ccc", fontSize: 12, flexShrink: 0 }}>—</span>
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

                        {/* Attachment chips */}
                        {email.attachments?.length > 0 && (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {email.attachments.slice(0, 3).map((att, i) => {
                              const isPdf = att.contentType === "application/pdf" ||
                                att.filename?.toLowerCase().endsWith(".pdf");
                              const isImage = att.contentType?.startsWith("image/");
                              const Icon = isPdf ? MdPictureAsPdf : isImage ? MdImage : MdAttachFile;
                              return (
                                <div
                                  key={i}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    borderRadius: 12,
                                    padding: "3px 10px 3px 7px",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    maxWidth: 180,
                                    overflow: "hidden",
                                    flexShrink: 0,
                                    background: "#f1f3f4",
                                    color: "#444746",
                                  }}
                                >
                                  <Icon
                                    size={15}
                                    style={{
                                      flexShrink: 0,
                                      color: isPdf ? "#c5221f" : "#5f6368",
                                    }}
                                  />
                                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {att.filename}
                                  </span>
                                </div>
                              );
                            })}
                            {email.attachments.length > 3 && (
                              <div
                                style={{
                                  borderRadius: 12,
                                  padding: "3px 9px",
                                  background: "#f1f3f4",
                                  fontSize: 12,
                                  color: "#444746",
                                  fontWeight: 500,
                                  flexShrink: 0,
                                }}
                              >
                                +{email.attachments.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flexShrink: 0,
                          minWidth: 190,
                          justifyContent: "flex-end",
                        }}
                      >
                        {isHovered ? (
                          /* Hover action buttons */
                          <>
                            {/* Unsubscribe — text only */}
                            <button
                              title="Unsubscribe"
                              onClick={(e) => { e.stopPropagation(); setUnsubscribeTarget({ id: email.id, sender: email.sender }); }}
                              onMouseDown={(e) => e.stopPropagation()}
                              style={{
                                background: "none",
                                border: "0.5px solid #c5c5c5",
                                borderRadius: 4,
                                cursor: "pointer",
                                color: "#444746",
                                fontSize: 12,
                                fontWeight: 500,
                                padding: "2px 8px",
                                marginRight: 4,
                                whiteSpace: "nowrap",
                                lineHeight: "20px",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#f1f3f4";
                                e.currentTarget.style.borderColor = "#444746";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "none";
                                e.currentTarget.style.borderColor = "#c5c5c5";
                              }}
                            >
                              Unsubscribe
                            </button>

                            {/* Icon action buttons */}
                            {[
                              { Icon: MdArchive,         title: "Archive",        action: async (e) => {
                                  e.stopPropagation();
                                  setEmails(prev => prev.filter(em => em.id !== email.id));
                                  await fetch(`/emails/${email.id}/archive`, { method: "POST" });
                              }},
                              { Icon: MdDelete,          title: "Delete",         action: async (e) => {
                                  e.stopPropagation();
                                  setEmails(prev => prev.filter(em => em.id !== email.id));
                                  await fetch(`/emails/${email.id}/trash`, { method: "POST" });
                              }},
                              { Icon: MdMarkEmailUnread, title: "Mark as unread", action: async (e) => {
                                  e.stopPropagation();
                                  setEmails(prev => prev.map(em => em.id === email.id ? { ...em, unread: true } : em));
                                  await fetch(`/emails/${email.id}/mark-unread`, { method: "POST" });
                              }},
                              { Icon: MdAccessTime,      title: "Snooze",         action: (e) => { e.stopPropagation(); } },
                            ].map(({ Icon, title, action }) => (
                              <button
                                key={title}
                                title={title}
                                onClick={action}
                                onMouseDown={(e) => e.stopPropagation()}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#5f6368",
                                  width: 28,
                                  height: 28,
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                                onMouseEnter={(e) => { e.stopPropagation(); e.currentTarget.style.background = "rgba(0,0,0,0.08)"; }}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                              >
                                <Icon size={16} />
                              </button>
                            ))}
                          </>
                        ) : (
                          /* Normal: label chip + time */
                          <>
                            {email.label && email.label !== "inbox" && (
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
                                {email.label.charAt(0).toUpperCase() + email.label.slice(1)}
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
                          </>
                        )}
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            );
          })()}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} />}

      {/* Unsubscribe Confirmation Dialog */}
      {unsubscribeTarget && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => !unsubscribing && setUnsubscribeTarget(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300 }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 8px 40px rgba(0,0,0,0.28)",
              zIndex: 301,
              width: 420,
              padding: "28px 28px 20px",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 500, color: "#202124", marginBottom: 12 }}>
              Unsubscribe from {unsubscribeTarget.sender}?
            </div>
            <div style={{ fontSize: 14, color: "#5f6368", lineHeight: 1.6, marginBottom: 24 }}>
              {unsubscribeTarget.sender} will be unsubscribed and the message will be moved to Spam.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => setUnsubscribeTarget(null)}
                disabled={unsubscribing}
                style={{
                  background: "none",
                  border: "none",
                  borderRadius: 20,
                  padding: "8px 20px",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: unsubscribing ? "default" : "pointer",
                  color: "#1a73e8",
                  opacity: unsubscribing ? 0.5 : 1,
                }}
                onMouseEnter={(e) => { if (!unsubscribing) e.currentTarget.style.background = "#e8f0fe"; }}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                Cancel
              </button>
              <button
                onClick={confirmUnsubscribe}
                disabled={unsubscribing}
                style={{
                  background: "#1a73e8",
                  color: "#fff",
                  border: "none",
                  borderRadius: 20,
                  padding: "8px 20px",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: unsubscribing ? "default" : "pointer",
                  opacity: unsubscribing ? 0.7 : 1,
                  minWidth: 110,
                }}
              >
                {unsubscribing ? "Unsubscribing…" : "Unsubscribe"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
