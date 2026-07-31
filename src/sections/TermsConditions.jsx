import { useState } from "react";
import { SectionTitle, TextArea, Card, CardTitle, Btn, Toggle, C } from "../components/UI";

const DEFAULT_TERMS = (answers) => {
  const freelancer = answers.freelancerName || "The Freelancer";
  const extra = answers.extraRevisionCost ? `₹${Number(answers.extraRevisionCost).toLocaleString("en-IN")}` : "an agreed rate";
  const revisions = answers.revisions || "2";
  const late = answers.latePaymentCharge ? `${answers.latePaymentCharge}%` : "2%";
  const grace = answers.latePaymentGrace ? `${answers.latePaymentGrace} days` : "3 days";

  return `1. REVISIONS
The client is entitled to ${revisions === "unlimited" ? "unlimited" : revisions} round(s) of revisions as included in this quote. Any revisions beyond this will be charged at ${extra} per round.

2. PAYMENT
Payment must be made as per the schedule outlined in this quotation. ${freelancer} reserves the right to pause or stop work if payments are delayed.

3. LATE PAYMENT
A late payment fee of ${late} per week will be applied on invoices unpaid beyond ${grace} of the due date.

4. CANCELLATION
If the client cancels after work has begun, all completed work will be billed at the agreed rate. The advance payment is non-refundable.

5. INTELLECTUAL PROPERTY
All intellectual property rights for the final deliverables transfer to the client only upon receipt of full payment. Work-in-progress files remain the property of ${freelancer}.

6. CONFIDENTIALITY
Both parties agree to keep all project details, pricing, and communications confidential and not disclose them to third parties without written consent.

7. SCOPE
Work is limited to what is described in this quotation. Any additional features or changes outside the agreed scope will require a separate quotation.

8. DELIVERY
Estimated delivery dates are subject to timely client feedback and approval. Delays caused by the client will not be the responsibility of ${freelancer}.

9. DISPUTES
Any disputes will first be attempted to be resolved amicably. This agreement is governed by the laws of India.`;
};

export default function TermsConditions({ answers, setAnswers }) {
  const set = (k, v) => setAnswers(a => ({ ...a, [k]: v }));
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleReset = () => {
    if (resetConfirm) {
      set("termsText", DEFAULT_TERMS(answers));
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    }
  };

  // Auto-populate if empty
  const terms = answers.termsText !== undefined
    ? answers.termsText
    : DEFAULT_TERMS(answers);

  return (
    <div>
      <SectionTitle sub="Edit per client — auto-filled from your quote data">Terms & Conditions</SectionTitle>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <CardTitle>Contract Terms</CardTitle>
          <Btn onClick={handleReset} variant={resetConfirm ? "danger" : "ghost"} style={{ fontSize: 11, padding: "5px 12px" }}>
            {resetConfirm ? "Tap to reset" : "↺ Reset to default"}
          </Btn>
        </div>
        <TextArea
          value={terms}
          onChange={v => set("termsText", v)}
          rows={18}
          hint="These terms are auto-filled based on your quote. Edit freely for each client."
        />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Additional Policies</CardTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <TextArea
            label="Cancellation Policy (optional)"
            value={answers.cancellationPolicy || ""}
            onChange={v => set("cancellationPolicy", v)}
            placeholder="e.g. 50% of remaining balance due if cancelled after design phase..."
            rows={3}
          />
          <TextArea
            label="Confidentiality Clause (optional)"
            value={answers.confidentialityClause || ""}
            onChange={v => set("confidentialityClause", v)}
            placeholder="e.g. Both parties agree not to disclose project details..."
            rows={3}
          />
        </div>
      </Card>

      {/* Approval */}
      <Card>
        <CardTitle>Client Approval</CardTitle>
        <Toggle
          label="Include approval section on PDF"
          sublabel="Adds a signature/date line at the bottom of the PDF"
          checked={answers.includeApproval !== false}
          onChange={v => set("includeApproval", v)}
        />
        <div style={{ marginTop: 14, fontSize: 12, color: C.textMuted, lineHeight: 1.7, padding: "10px 14px", background: C.surfaceHigh, borderRadius: 10, border: `1px solid ${C.surfaceBorder}`, display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span>💡</span><span>The approval section includes: client name, date, and a signature line. For legally binding contracts, consider a proper eSign service like DocuSign or SignNow.</span>
        </div>
      </Card>
    </div>
  );
}