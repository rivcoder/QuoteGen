import { useState, useEffect } from "react";
import { getQuoteHistory, deleteQuoteFromHistory, clearQuoteHistory, fmt } from "../utils/calculate";

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
      <div style={{ color: "#8b9cf4", fontWeight: 700, marginBottom: 6 }}>No quotes yet</div>
      <div style={{ color: "#4a5080", fontSize: 13 }}>
        Generate a quote and click "Save Quote" to store it here.
      </div>
    </div>
  );
}

export default function QuoteHistory({ onClose, onReload }) {
  const [history, setHistory] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setHistory(getQuoteHistory());
  }, []);

  const handleDelete = (id) => {
    deleteQuoteFromHistory(id);
    setHistory(getQuoteHistory());
  };

  const handleClear = () => {
    if (confirmClear) {
      clearQuoteHistory();
      setHistory([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 800, color: "#fff" }}>Quote History</div>
          <div style={{ fontSize: 12, color: "#4a5080", marginTop: 2 }}>
            {history.length} saved quote{history.length !== 1 ? "s" : ""} (last 20)
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent", border: "2px solid #1e2140",
            color: "#8b9cf4", borderRadius: 10, padding: "7px 14px",
            cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
          }}
        >
          ✕ Close
        </button>
      </div>

      {history.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 420, overflowY: "auto", paddingRight: 4 }}>
            {history.map((entry) => (
              <div
                key={entry.id}
                style={{
                  background: "#12152e", borderRadius: 14, padding: "14px 16px",
                  border: "1px solid #1e2140",
                  display: "flex", alignItems: "center", gap: 14,
                }}
              >
                {/* Service icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg,#1a1f4b,#3b3f8c)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>
                  {getServiceIcon(entry.serviceLabel)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
                    {entry.serviceLabel}
                  </div>
                  <div style={{
                    fontSize: 12, color: "#4a5080",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {entry.clientName !== "—" ? `For: ${entry.clientName} · ` : ""}
                    {entry.createdOn}
                  </div>
                  <div style={{ fontSize: 11, color: "#3a3f6e", marginTop: 2, letterSpacing: 0.5 }}>
                    {entry.id}
                  </div>
                </div>

                {/* Total */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#a78bfa" }}>
                    {fmt(entry.total, entry.currency)}
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    style={{
                      background: "transparent", border: "none",
                      color: "#3a3f6e", fontSize: 11, cursor: "pointer",
                      marginTop: 4, fontFamily: "inherit",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => e.target.style.color = "#f87171"}
                    onMouseLeave={e => e.target.style.color = "#3a3f6e"}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Clear all */}
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button
              onClick={handleClear}
              style={{
                background: "transparent",
                border: `2px solid ${confirmClear ? "#f87171" : "#1e2140"}`,
                color: confirmClear ? "#f87171" : "#4a5080",
                borderRadius: 10, padding: "8px 18px",
                cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              {confirmClear ? "⚠ Tap again to confirm clear all" : "Clear all history"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function getServiceIcon(label) {
  if (label.includes("Website")) return "🌐";
  if (label.includes("Mobile")) return "📱";
  if (label.includes("UI") || label.includes("UX")) return "🎨";
  if (label.includes("E-commerce")) return "🛒";
  if (label.includes("Brand") || label.includes("Logo")) return "✨";
  return "📋";
}