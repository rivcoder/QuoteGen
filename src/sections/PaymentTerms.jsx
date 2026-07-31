import { SectionTitle, Card, CardTitle, Slider, CheckboxGroup, TextInput, C } from "../components/UI";
import { fmt, calculateQuote } from "../utils/calculate";

const PAYMENT_METHODS = [
  { value: "upi",    label: "UPI",           icon: "📲" },
  { value: "bank",   label: "Bank Transfer", icon: "🏦" },
  { value: "paypal", label: "PayPal",        icon: "💙" },
  { value: "stripe", label: "Stripe",        icon: "💳" },
  { value: "cash",   label: "Cash",          icon: "💵" },
  { value: "cheque", label: "Cheque",        icon: "📄" },
];

export default function PaymentTerms({ answers, setAnswers }) {
  const set = (k, v) => setAnswers(a => ({ ...a, [k]: v }));
  const quote       = calculateQuote(answers);
  const currency    = answers.currency || "INR";
  const advancePct  = answers.advancePct ?? 50;
  const advanceAmt  = quote ? quote.total * (advancePct / 100) : 0;
  const remainAmt   = quote ? quote.total - advanceAmt : 0;

  return (
    <div>
      <SectionTitle sub="How and when you get paid">Payment Terms</SectionTitle>

      {/* Advance split */}
      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Payment Schedule</CardTitle>
        <Slider
          label="Advance Payment"
          value={advancePct}
          onChange={v => set("advancePct", v)}
          min={0} max={100} step={5}
          format={v => `${v}%`}
          sublabel="Percentage due before work begins"
        />

        {quote && (
          <div className="grid-2-col" style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {/* Advance */}
            <div style={{
              background: "rgba(34,197,94,0.06)",
              borderRadius: 12, padding: 16,
              border: "1px solid rgba(34,197,94,0.15)", textAlign: "center",
            }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Advance ({advancePct}%)
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.success, letterSpacing: -0.5 }}>
                {fmt(advanceAmt, currency)}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Due before work starts</div>
            </div>
            {/* Remaining */}
            <div style={{
              background: "rgba(124,58,237,0.06)",
              borderRadius: 12, padding: 16,
              border: "1px solid rgba(124,58,237,0.15)", textAlign: "center",
            }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Remaining ({100 - advancePct}%)
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.accentLight, letterSpacing: -0.5 }}>
                {fmt(remainAmt, currency)}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Due on delivery</div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <TextInput
            label="Payment Due (days after invoice)"
            value={answers.paymentDueDays || ""}
            onChange={v => set("paymentDueDays", v)}
            placeholder="e.g. 7"
            type="number"
            hint="Client must pay within this many days of invoice"
          />
        </div>
      </Card>

      {/* Methods */}
      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Accepted Payment Methods</CardTitle>
        <CheckboxGroup
          options={PAYMENT_METHODS}
          selected={answers.paymentMethods || []}
          onChange={v => set("paymentMethods", v)}
        />
        <div style={{ marginTop: 14 }}>
          <TextInput
            label="UPI ID / Bank Details (shown on PDF)"
            value={answers.paymentDetails || ""}
            onChange={v => set("paymentDetails", v)}
            placeholder="yourname@upi or Account: 1234567890, IFSC: HDFC0001234"
          />
        </div>
      </Card>

      {/* Late payment */}
      <Card>
        <CardTitle>Late Payment Charge</CardTitle>
        <div className="grid-2-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <TextInput
            label="Charge (%)"
            value={answers.latePaymentCharge || ""}
            onChange={v => set("latePaymentCharge", v)}
            placeholder="e.g. 2"
            type="number"
            hint="% charged per week/month after due date"
          />
          <TextInput
            label="Grace Period (days)"
            value={answers.latePaymentGrace || ""}
            onChange={v => set("latePaymentGrace", v)}
            placeholder="e.g. 3"
            type="number"
            hint="Days before late fee kicks in"
          />
        </div>
      </Card>
    </div>
  );
}