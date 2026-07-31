import { useState, useRef } from "react";
import { SectionTitle, TextInput, Btn, Card, CardTitle, Divider, C } from "../components/UI";
import { saveFreelancerProfile, validateLogo } from "../utils/calculate";

const ff = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export default function FreelancerProfile({ profile, setProfile }) {
  const [form, setForm] = useState(profile || {
    name: "", company: "", email: "", phone: "", website: "", gst: "", logo: null,
  });
  const [saved, setSaved] = useState(false);
  const [logoError, setLogoError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogo = (file) => {
    if (!file) return;
    const logoErr = validateLogo(file);
    if (logoErr) { setLogoError(logoErr); return; }
    setLogoError("");
    const reader = new FileReader();
    reader.onload = (ev) => set("logo", ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveFreelancerProfile(form);
    setProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = form.name
    ? form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div>
      <SectionTitle sub="Saved permanently — auto-fills every quote you create">
        Your Profile
      </SectionTitle>

      {/* Logo upload */}
      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Logo / Brand Mark</CardTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Avatar / Logo preview */}
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleLogo(e.dataTransfer.files[0]); }}
            style={{
              width: 88, height: 88, borderRadius: 16, flexShrink: 0,
              border: `2px dashed ${dragging ? C.accent : C.surfaceBorder}`,
              background: dragging ? C.accentGlow : C.surfaceHigh,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", cursor: "pointer", transition: "all 0.2s",
              boxShadow: dragging ? `0 0 0 3px ${C.accentGlow}` : "none",
            }}
          >
            {form.logo
              ? <img src={form.logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              : (
                <div style={{
                  width: "100%", height: "100%", display: "flex", alignItems: "center",
                  justifyContent: "center", flexDirection: "column",
                  background: form.name ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent",
                }}>
                  {form.name
                    ? <span style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: ff }}>{initials}</span>
                    : <span style={{ fontSize: 22, opacity: 0.3 }}>🏢</span>
                  }
                </div>
              )
            }
          </div>
          <div>
            <input type="file" accept="image/*" ref={fileRef} onChange={e => handleLogo(e.target.files[0])} style={{ display: "none" }} />
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <Btn onClick={() => fileRef.current.click()} variant="ghost">
                {form.logo ? "Change Logo" : "Upload Logo"}
              </Btn>
              {form.logo && (
                <Btn onClick={() => set("logo", null)} variant="danger" style={{ fontSize: 11, padding: "5px 12px" }}>
                  Remove
                </Btn>
              )}
            </div>
            {logoError && <div style={{ fontSize: 11, color: C.danger, marginBottom: 6 }}>⚠ {logoError}</div>}
            <div style={{ fontSize: 11, color: C.textMuted }}>
              Drag & drop or click · PNG, JPG, WebP · Max 5MB
            </div>
            {!form.logo && form.name && (
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                ✓ Using your initials as placeholder
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Personal / Agency Info</CardTitle>
        <div className="grid-2-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <TextInput label="Your Full Name"         value={form.name}    onChange={v => set("name", v)}    placeholder="Aryan Sharma" />
          <TextInput label="Company / Agency Name"  value={form.company} onChange={v => set("company", v)} placeholder="Aryan Dev Studio" />
          <TextInput label="Email"  type="email"    value={form.email}   onChange={v => set("email", v)}   placeholder="you@email.com" />
          <TextInput label="Phone"                  value={form.phone}   onChange={v => set("phone", v)}   placeholder="+91 98765 43210" />
          <TextInput label="Website"                value={form.website} onChange={v => set("website", v)} placeholder="https://yoursite.com" />
          <TextInput label="GST Number (optional)"  value={form.gst}     onChange={v => set("gst", v)}     placeholder="22AAAAA0000A1Z5" hint="Shown on PDF if filled" />
        </div>
      </Card>

      {/* Save */}
      <Btn
        onClick={handleSave}
        variant={saved ? "success" : "primary"}
        style={{ width: "100%", padding: 14, fontSize: 14, justifyContent: "center" }}
      >
        {saved ? "✓ Profile Saved!" : "Save Profile"}
      </Btn>

      {/* Info tip */}
      <div style={{
        marginTop: 12, fontSize: 12, color: C.textMuted,
        background: C.surfaceHigh, padding: "10px 14px",
        borderRadius: 8, border: `1px solid ${C.surfaceBorder}`,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span>💡</span>
        <span>Your profile is stored locally — it never leaves your device.</span>
      </div>
    </div>
  );
}