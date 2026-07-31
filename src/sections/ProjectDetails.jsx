import { SectionTitle, TextInput, TextArea, SelectInput, CheckboxGroup, Card, Divider, C } from "../components/UI";

const CATEGORIES = [
  { value: "", label: "Select a category..." },
  { value: "website", label: "Website Development" },
  { value: "mobileApp", label: "Mobile App Development" },
  { value: "uiux", label: "UI/UX Design" },
  { value: "ecommerce", label: "E-commerce Store" },
  { value: "branding", label: "Logo & Branding" },
  { value: "backend", label: "Backend / API Development" },
  { value: "seo", label: "SEO & Digital Marketing" },
  { value: "other", label: "Other" },
];

const PLATFORM_OPTIONS = [
  { value: "web", label: "Web", icon: "🌐" },
  { value: "mobile", label: "Mobile", icon: "📱" },
  { value: "desktop", label: "Desktop", icon: "🖥️" },
  { value: "tablet", label: "Tablet", icon: "📱" },
];

export default function ProjectDetails({ answers, setAnswers }) {
  const set = (k, v) => setAnswers(a => ({ ...a, [k]: v }));

  return (
    <div>
      <SectionTitle sub="What exactly are you building?">Project Details</SectionTitle>

      {/* Basic Info */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>Basic Info</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <TextInput
            label="Project Name" value={answers.projectName || ""}
            onChange={v => set("projectName", v)} placeholder="e.g. Rahul Enterprises Website"
          />
          <SelectInput
            label="Project Category" value={answers.projectCategory || ""}
            onChange={v => set("projectCategory", v)} options={CATEGORIES}
          />
          <TextArea
            label="Project Description" value={answers.projectDescription || ""}
            onChange={v => set("projectDescription", v)}
            placeholder="Describe the project in a few lines — what it is, who it's for, what problem it solves..."
            rows={4}
          />
        </div>
      </Card>

      {/* Dates */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>Timeline</div>
        <div className="grid-2-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <TextInput
            label="Start Date" value={answers.startDate || ""}
            onChange={v => set("startDate", v)} type="date"
          />
          <TextInput
            label="Estimated Completion" value={answers.endDate || ""}
            onChange={v => set("endDate", v)} type="date"
          />
        </div>
      </Card>

      {/* Platform */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>Target Platform</div>
        <CheckboxGroup
          options={PLATFORM_OPTIONS}
          selected={answers.platforms || []}
          onChange={v => set("platforms", v)}
        />
      </Card>

      {/* Scope */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>Scope of Work</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <TextArea
            label="✅ Features Included" value={answers.scopeIncluded || ""}
            onChange={v => set("scopeIncluded", v)}
            placeholder="List what's included, one per line:&#10;- Homepage with hero section&#10;- Contact form&#10;- Mobile responsive"
            rows={5}
            hint="Be specific — prevents scope creep disputes"
          />
          <TextArea
            label="❌ Explicitly Excluded" value={answers.scopeExcluded || ""}
            onChange={v => set("scopeExcluded", v)}
            placeholder="List what's NOT included:&#10;- Backend development&#10;- Content writing&#10;- SEO setup"
            rows={4}
            hint="This protects you legally"
          />
          <TextArea
            label="📦 Deliverables" value={answers.deliverables || ""}
            onChange={v => set("deliverables", v)}
            placeholder="What the client will receive:&#10;- Figma source files&#10;- Deployed website&#10;- 30-day support"
            rows={4}
          />
        </div>
      </Card>
    </div>
  );
}