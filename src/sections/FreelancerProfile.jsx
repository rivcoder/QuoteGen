import { useState, useRef } from "react";
import { SectionTitle, TextInput, Btn, Card, Divider } from "../components/UI";
import { saveFreelancerProfile, validateLogo } from "../utils/calculate";

export default function FreelancerProfile({ profile, setProfile }) {
  const [form, setForm] = useState(profile || {
    name: "", company: "", email: "", phone: "", website: "", gst: "", logo: null,
  });
  const [saved, setSaved] = useState(false);
  const [logoError, setLogoError] = useState("");
  const fileRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogo = (e) => {
    const file = e.target.files[0];
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

  return (
    <div>
      <SectionTitle sub="Saved permanently — auto-fills every quote you create">
        Your Profile
      </SectionTitle>

      {/* Logo */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#8b9cf4", marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>
          Logo / Brand Mark
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 14, border: "2px dashed #1e2140",
            background: "#12152e", display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", flexShrink: 0,
          }}>
            {form.logo
              ? <img src={form.logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              : <span style={{ fontSize: 28, opacity: 0.3 }}>🏢</span>
            }
          </div>
          <div>
            <input type="file" accept="image/*" ref={fileRef} onChange={handleLogo} style={{ display: "none" }} />
            <Btn onClick={() => fileRef.current.click()} variant="ghost" style={{ marginBottom: 8, display: "block" }}>
              {form.logo ? "Change Logo" : "Upload Logo"}
            </Btn>
            {form.logo && (
              <Btn onClick={() => set("logo", null)} variant="danger" style={{ fontSize: 11, padding: "5px 12px" }}>
                Remove
              </Btn>
            )}
            {logoError && <div style={{ fontSize: 11, color: "#f87171", marginTop: 6 }}>⚠ {logoError}</div>}
            <div style={{ fontSize: 11, color: "#3a3f6e", marginTop: 6 }}>PNG, JPG, WebP only · Max 5MB</div>
          </div>
        </div>
      </Card>

      {/* Info */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#8b9cf4", marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>
          Personal / Agency Info
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <TextInput label="Your Full Name" value={form.name} onChange={v => set("name", v)} placeholder="Aryan Sharma" />
          <TextInput label="Company / Agency Name" value={form.company} onChange={v => set("company", v)} placeholder="Aryan Dev Studio" />
          <TextInput label="Email" value={form.email} onChange={v => set("email", v)} placeholder="you@email.com" type="email" />
          <TextInput label="Phone" value={form.phone} onChange={v => set("phone", v)} placeholder="+91 98765 43210" />
          <TextInput label="Website" value={form.website} onChange={v => set("website", v)} placeholder="https://yoursite.com" />
          <TextInput label="GST Number (optional)" value={form.gst} onChange={v => set("gst", v)} placeholder="22AAAAA0000A1Z5" hint="Shown on PDF if filled" />
        </div>
      </Card>

      <Btn
        onClick={handleSave}
        variant={saved ? "success" : "primary"}
        style={{ width: "100%", padding: 14, fontSize: 15 }}
      >
        {saved ? "✓ Profile Saved!" : "Save Profile"}
      </Btn>
    </div>
  );
}