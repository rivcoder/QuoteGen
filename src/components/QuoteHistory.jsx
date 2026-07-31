import { useState } from "react";
import { getQuoteHistory, deleteQuoteFromHistory, clearQuoteHistory, fmt } from "../utils/calculate";
import { SectionTitle, Card, Btn, Divider, C } from "./UI";

export default function QuoteHistory({ onClose, onLoadQuote }) {
  const [history, setHistory] = useState(() => getQuoteHistory());
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteQuoteFromHistory(id);
      setHistory(getQuoteHistory());
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
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

  const formatDate = (ts) => {
    try {
      return new Date(ts).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <SectionTitle sub="Manage and reload previously generated quotations">Quote History</SectionTitle>
        <Btn onClick={onClose} variant="ghost" style={{ padding: "6px 12px" }}>
          ✕ Close
        </Btn>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: C.textMuted }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🕒</div>
          <div style={{ fontWeight: 600, color: C.text, marginBottom: 6 }}>No history found</div>
          <div style={{ fontSize: 13 }}>Quotes you save on the Preview screen will appear here.</div>
        </div>
      ) : (
        <div>
          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <Btn
              onClick={handleClear}
              variant={confirmClear ? "danger" : "ghost"}
              style={{ fontSize: 12, padding: "6px 14px" }}
            >
              {confirmClear ? "Are you sure? Clear All" : "🗑 Clear History"}
            </Btn>
          </div>

          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {history.map((item) => {
              const currency = item.currency || "INR";
              const totalAmount = item.total || item.quote?.total || 0;
              return (
                <Card key={item.id} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                          {item.clientName !== "—" ? item.clientName : "Draft"}
                        </span>
                        <span style={{ fontSize: 10, background: C.surfaceHigh, color: C.accentLight, padding: "2px 6px", borderRadius: 4, fontWeight: 600, border: `1px solid ${C.surfaceBorder}` }}>
                          {item.id}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: C.textSub }}>
                        {item.serviceLabel || "Custom Project"}
                      </div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                        Saved on {formatDate(item.createdAt || item.date || Date.now())}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.success, fontVariantNumeric: "tabular-nums" }}>
                        {fmt(totalAmount, currency)}
                      </div>
                      {item.answers?.projectName && (
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.answers.projectName}
                        </div>
                      )}
                    </div>
                  </div>

                  <Divider style={{ margin: "4px 0 8px 0" }} />

                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <Btn
                      onClick={() => onLoadQuote && onLoadQuote(item)}
                      variant="primary"
                      style={{ fontSize: 12, padding: "6px 14px", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      ↩ Load & Edit
                    </Btn>
                    <Btn
                      onClick={() => handleDelete(item.id)}
                      variant="danger"
                      style={{ fontSize: 12, padding: "6px 14px" }}
                    >
                      {confirmDelete === item.id ? "Sure?" : "Delete"}
                    </Btn>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
