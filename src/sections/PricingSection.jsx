import { useState } from "react";
import { SERVICES as DEFAULT_SERVICES, TIMELINE as DEFAULT_TIMELINE } from "../data/pricing";
import { getPricingForMode } from "../data/pricingLoader";
import { calculateQuote, fmt } from "../utils/calculate";
import {
  SectionTitle, TextInput, SelectInput, ChoiceCard, FeatureToggle,
  Toggle, Card, CardTitle, Btn, PriceRow, Divider, Slider, C
} from "../components/UI";

const LINE_ITEM_TYPES = [
  { value: "fixed", label: "Fixed Price", icon: "🔒" },
  { value: "hourly", label: "Hourly Rate", icon: "⏱" },
  { value: "quantity", label: "Quantity Based", icon: "🔢" },
  { value: "custom", label: "Custom", icon: "✏️" },
];

function LineItemRow({ item, index, onChange, onDelete }) {
  const set = (k, v) => onChange(index, { ...item, [k]: v });
  return (
    <div style={{ background: C.surfaceHigh, borderRadius: 12, padding: 14, border: `1px solid ${C.surfaceBorder}`, marginBottom: 10 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
        <SelectInput
          value={item.type}
          onChange={v => set("type", v)}
          options={LINE_ITEM_TYPES}
        />
        <button onClick={() => onDelete(index)} style={{
          background: "transparent", border: `1px solid ${C.danger}`, color: C.danger,
          borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontFamily: "inherit",
          fontSize: 12, fontWeight: 700, flexShrink: 0,
        }}>✕</button>
      </div>

      <TextInput
        label="Description" value={item.description || ""}
        onChange={v => set("description", v)} placeholder="e.g. Frontend development"
      />

      <div style={{ marginTop: 10 }}>
        {item.type === "hourly" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <TextInput label="Hours" value={item.hours || ""} onChange={v => set("hours", v)} placeholder="40" type="number" />
            <TextInput label="Rate (₹/hr)" value={item.rate || ""} onChange={v => set("rate", v)} placeholder="1500" type="number" />
          </div>
        )}
        {item.type === "quantity" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <TextInput label="Quantity" value={item.qty || ""} onChange={v => set("qty", v)} placeholder="5" type="number" />
            <TextInput label="Unit Price (₹)" value={item.unitPrice || ""} onChange={v => set("unitPrice", v)} placeholder="8000" type="number" />
          </div>
        )}
        {(item.type === "fixed" || item.type === "custom") && (
          <TextInput label="Amount (₹)" value={item.amount || ""} onChange={v => set("amount", v)} placeholder="25000" type="number" />
        )}
      </div>

      {/* Line item subtotal */}
      <div style={{ marginTop: 10, textAlign: "right", fontSize: 13, color: C.accentLight, fontWeight: 700 }}>
        = ₹{getLineItemTotal(item).toLocaleString("en-IN")}
      </div>
    </div>
  );
}

function getLineItemTotal(item) {
  if (item.type === "hourly") return (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0);
  if (item.type === "quantity") return (parseFloat(item.qty) || 0) * (parseFloat(item.unitPrice) || 0);
  return parseFloat(item.amount) || 0;
}

export default function PricingSection({ answers, setAnswers, mode }) {
  const { SERVICES, TIMELINE } = getPricingForMode(mode || "freelancer");
  const set = (k, v) => setAnswers(a => ({ ...a, [k]: v }));
  const service = SERVICES[answers.service];
  const currency = answers.currency || "INR";
  const quote = calculateQuote(answers);

  const lineItems = answers.lineItems || [];
  const updateLineItem = (i, item) => {
    const updated = [...lineItems];
    updated[i] = item;
    set("lineItems", updated);
  };
  const addLineItem = () => set("lineItems", [...lineItems, { type: "fixed", description: "", amount: "" }]);
  const deleteLineItem = (i) => set("lineItems", lineItems.filter((_, idx) => idx !== i));

  return (
    <div>
      <SectionTitle sub="Base service + custom line items + discounts">Pricing</SectionTitle>

      {/* Service picker */}
      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Service Type</CardTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(SERVICES).map(([key, s]) => (
            <ChoiceCard key={key}
              option={{ value: key, label: s.label, icon: s.icon }}
              selected={answers.service === key}
              onClick={() => setAnswers(a => ({ ...a, service: key, baseType: null, pages: null, revisions: "2" }))}
            />
          ))}
        </div>
      </Card>

      {/* Base type */}
      {service && (
        <Card style={{ marginBottom: 16 }}>
          <CardTitle>Package Type</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(service.base).map(([key, v]) => (
              <ChoiceCard key={key}
                option={{ value: key, label: v.label, desc: v.desc, price: v.price }}
                selected={answers.baseType === key}
                onClick={() => set("baseType", key)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Pages (website only) */}
      {answers.service === "website" && (
        <Card style={{ marginBottom: 16 }}>
          <CardTitle>Number of Pages</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(SERVICES.website.pages).map(([k, v]) => (
              <ChoiceCard key={k}
                option={{ value: k, label: v.label, desc: v.price === 0 ? "Included" : `+₹${v.price.toLocaleString("en-IN")}` }}
                selected={answers.pages === k}
                onClick={() => set("pages", k)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Add-ons */}
      {service && (
        <Card style={{ marginBottom: 16 }}>
          <CardTitle>Add-on Features</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
            {Object.entries(service.addons).map(([key, addon]) => {
              if (key === "contentWriting" && answers.service === "website") {
                return (
                  <div key={key}>
                    <FeatureToggle option={{ ...addon, label: "Content Writing (per page)" }} checked={!!answers[key]} onChange={v => set(key, v)} />
                    {answers[key] && (
                      <div style={{ marginTop: 8, paddingLeft: 4 }}>
                        <TextInput label="Pages needing content" value={answers.pageCount || ""} onChange={v => set("pageCount", v)} placeholder="e.g. 5" type="number" />
                      </div>
                    )}
                  </div>
                );
              }
              return <FeatureToggle key={key} option={addon} checked={!!answers[key]} onChange={v => set(key, v)} />;
            })}
          </div>
        </Card>
      )}

      {/* Revisions */}
      {service?.revisions && (
        <Card style={{ marginBottom: 16 }}>
          <CardTitle>Revision Rounds</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(service.revisions).map(([k, v]) => (
              <ChoiceCard key={k}
                option={{ value: k, label: v.label, desc: v.price === 0 ? "Included" : `+₹${v.price.toLocaleString("en-IN")}` }}
                selected={answers.revisions === k}
                onClick={() => set("revisions", k)}
              />
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <TextInput
              label="Extra revision cost (per additional round)"
              value={answers.extraRevisionCost || ""}
              onChange={v => set("extraRevisionCost", v)}
              placeholder="e.g. 2000"
              type="number"
              hint="Shown in terms — charged if client exceeds included revisions"
            />
          </div>
        </Card>
      )}

      {/* Timeline */}
      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Delivery Timeline</CardTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(TIMELINE).map(([k, v]) => (
            <ChoiceCard key={k}
              option={{ value: k, label: v.label, desc: `${v.duration} — ${v.desc}` }}
              selected={answers.timeline === k}
              onClick={() => set("timeline", k)}
            />
          ))}
        </div>
      </Card>

      {/* Custom line items */}
      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Additional Line Items</CardTitle>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>
          Mix hourly, fixed, and quantity items on top of your base service.
        </div>
        {lineItems.map((item, i) => (
          <LineItemRow key={i} item={item} index={i} onChange={updateLineItem} onDelete={deleteLineItem} />
        ))}
        <Btn onClick={addLineItem} variant="ghost" style={{ width: "100%", padding: 12 }}>
          + Add Line Item
        </Btn>
      </Card>

      {/* Discounts & Tax */}
      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Discount & Tax</CardTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Slider
            label="Discount"
            value={answers.discountPct || 0}
            onChange={v => set("discountPct", v)}
            min={0} max={50} step={1}
            format={v => v === 0 ? "No discount" : `${v}% off`}
          />
          <Toggle
            label="Include GST (18%)"
            sublabel="Required for Indian clients with GSTIN"
            checked={!!answers.includeGst}
            onChange={v => set("includeGst", v)}
          />
          <Toggle
            label="Currency: US Dollar ($)"
            sublabel="Toggle off for Indian Rupee (₹)"
            checked={answers.currency === "USD"}
            onChange={v => set("currency", v ? "USD" : "INR")}
          />
        </div>
      </Card>

      {/* Live total */}
      {quote && (
        <Card style={{ border: `1px solid rgba(124,58,237,0.3)`, boxShadow: `0 0 20px rgba(124,58,237,0.08)` }}>
          <CardTitle>Live Total</CardTitle>
          <PriceRow label="Base service" value={fmt(quote.basePrice + quote.pagesCost, currency)} />
          {quote.addonTotal > 0 && <PriceRow label={`Add-ons (${quote.selectedAddons.length})`} value={`+${fmt(quote.addonTotal + quote.revisionCost, currency)}`} color={C.accentLight} />}
          {quote.lineItemTotal > 0 && <PriceRow label="Line items" value={`+${fmt(quote.lineItemTotal, currency)}`} color={C.accentLight} />}
          <Divider style={{ margin: "10px 0" }} />
          <PriceRow label="Subtotal" value={fmt(quote.subtotal, currency)} bold />
          {quote.discount > 0 && <PriceRow label={`Discount (${quote.discountPct}%)`} value={`−${fmt(quote.discount, currency)}`} color={C.success} />}
          {quote.gst > 0 && <PriceRow label="GST (18%)" value={`+${fmt(quote.gst, currency)}`} />}
          <Divider style={{ margin: "10px 0" }} />
          <PriceRow label="Total" value={fmt(quote.total, currency)} bold big />
        </Card>
      )}
    </div>
  );
}