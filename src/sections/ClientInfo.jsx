import { SectionTitle, TextInput, Card, C } from "../components/UI";
import { validateEmail, validatePhone } from "../utils/calculate";

export default function ClientInfo({ answers, setAnswers }) {
  const set = (k, v) => setAnswers(a => ({ ...a, [k]: v }));
  const errors = {
    clientEmail: validateEmail(answers.clientEmail),
    clientPhone: validatePhone(answers.clientPhone),
  };

  return (
    <div>
      <SectionTitle sub="Who is this quote for?">Client Information</SectionTitle>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>
          Client Details
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <TextInput
            label="Client Name" value={answers.clientName || ""}
            onChange={v => set("clientName", v)} placeholder="Rahul Sharma"
          />
          <TextInput
            label="Company Name" value={answers.clientCompany || ""}
            onChange={v => set("clientCompany", v)} placeholder="Rahul Enterprises"
          />
          <TextInput
            label="Email" value={answers.clientEmail || ""}
            onChange={v => set("clientEmail", v)} placeholder="rahul@company.com"
            type="email" error={answers.clientEmail ? errors.clientEmail : null}
          />
          <TextInput
            label="Phone" value={answers.clientPhone || ""}
            onChange={v => set("clientPhone", v)} placeholder="+91 98765 43210"
            error={answers.clientPhone ? errors.clientPhone : null}
          />
        </div>
      </Card>

      <div style={{ fontSize: 12, color: C.textMuted, padding: "10px 14px", background: C.surfaceHigh, borderRadius: 10, border: `1px solid ${C.surfaceBorder}`, display: "flex", alignItems: "center", gap: 8 }}>
        <span>💡</span><span>All fields are optional — only filled fields appear on the PDF.</span>
      </div>
    </div>
  );
}