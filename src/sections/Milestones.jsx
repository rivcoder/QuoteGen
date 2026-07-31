import { SectionTitle, Card, CardTitle, TextInput, Btn, C } from "../components/UI";
import { fmt, calculateQuote } from "../utils/calculate";

function MilestoneRow({ milestone, index, onChange, onDelete }) {
  const set = (k, v) => onChange(index, { ...milestone, [k]: v });
  return (
    <div style={{ background: C.surfaceHigh, borderRadius: 12, padding: 14, border: `1px solid ${C.surfaceBorder}`, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>Milestone {index + 1}</div>
        <button onClick={() => onDelete(index)} style={{
          background: "transparent", border: `1px solid ${C.danger}`, color: C.danger,
          borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 11,
        }}>✕ Remove</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
        <TextInput label="Milestone Name" value={milestone.name || ""} onChange={v => set("name", v)} placeholder="e.g. Design Approval" />
        <TextInput label="Due Date" value={milestone.date || ""} onChange={v => set("date", v)} type="date" />
        <TextInput label="Amount (₹)" value={milestone.amount || ""} onChange={v => set("amount", v)} type="number" placeholder="15000" />
      </div>
      {milestone.description !== undefined && (
        <div style={{ marginTop: 10 }}>
          <TextInput label="Description (optional)" value={milestone.description || ""} onChange={v => set("description", v)} placeholder="What gets delivered at this milestone" />
        </div>
      )}
    </div>
  );
}

export default function Milestones({ answers, setAnswers }) {
  const set = (k, v) => setAnswers(a => ({ ...a, [k]: v }));
  const milestones = answers.milestones || [];
  const quote = calculateQuote(answers);
  const currency = answers.currency || "INR";
  const total = quote?.total || 0;

  const milestonesTotal = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
  const remaining = total - milestonesTotal;
  const isBalanced = Math.abs(remaining) < 1;

  const addMilestone = () => setAnswers(a => ({
    ...a,
    milestones: [...(a.milestones || []), { name: "", date: "", amount: "", description: "" }],
  }));

  const updateMilestone = (i, m) => {
    const updated = [...milestones];
    updated[i] = m;
    set("milestones", updated);
  };

  const deleteMilestone = (i) => set("milestones", milestones.filter((_, idx) => idx !== i));

  const autoSplit = () => {
    if (!total || milestones.length === 0) return;
    const perMilestone = Math.round(total / milestones.length);
    set("milestones", milestones.map((m, i) => ({
      ...m,
      amount: i === milestones.length - 1
        ? String(total - perMilestone * (milestones.length - 1))
        : String(perMilestone),
    })));
  };

  return (
    <div>
      <SectionTitle sub="Break the project into paid milestones">Milestones</SectionTitle>

      {/* Summary bar */}
      {total > 0 && milestones.length > 0 && (
        <Card style={{ marginBottom: 16, border: isBalanced ? "1px solid #34d399" : "1px solid #f59e0b" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Milestones total</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: isBalanced ? C.success : C.warning }}>
                {fmt(milestonesTotal, currency)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Quote total</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{fmt(total, currency)}</div>
            </div>
          </div>
          {!isBalanced && (
            <div style={{ marginTop: 10, fontSize: 12, color: C.warning }}>
              ⚠ {remaining > 0 ? `₹${Math.round(remaining).toLocaleString("en-IN")} unallocated` : `₹${Math.abs(Math.round(remaining)).toLocaleString("en-IN")} over total`}
            </div>
          )}
          {isBalanced && (
            <div style={{ marginTop: 10, fontSize: 12, color: C.success }}>✓ Milestones match quote total</div>
          )}
        </Card>
      )}

      {milestones.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🗓</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No milestones yet</div>
          <div style={{ fontSize: 13 }}>Break the project into phases with separate payment dates</div>
        </div>
      ) : (
        milestones.map((m, i) => (
          <MilestoneRow key={i} milestone={m} index={i} onChange={updateMilestone} onDelete={deleteMilestone} />
        ))
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <Btn onClick={addMilestone} variant="ghost" style={{ flex: 1, padding: 12 }}>+ Add Milestone</Btn>
        {milestones.length > 1 && total > 0 && (
          <Btn onClick={autoSplit} variant="outline" style={{ padding: 12 }}>⚡ Auto Split</Btn>
        )}
      </div>
    </div>
  );
}