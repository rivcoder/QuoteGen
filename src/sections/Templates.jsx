import { useState } from "react";
import { SectionTitle, Card, CardTitle, TextInput, Btn } from "../components/UI";
import { getTemplates, saveTemplate, deleteTemplate } from "../utils/calculate";

export default function Templates({ answers, setAnswers, onLoad }) {
  const [templates, setTemplates] = useState(getTemplates());
  const [newName, setNewName] = useState("");
  const [saved, setSaved] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = () => {
    if (!newName.trim()) return;
    saveTemplate(newName.trim(), answers);
    setTemplates(getTemplates());
    setSaved(newName.trim());
    setNewName("");
    setTimeout(() => setSaved(""), 2500);
  };

  const handleDelete = (name) => {
    if (confirmDelete === name) {
      deleteTemplate(name);
      setTemplates(getTemplates());
      setConfirmDelete(null);
    } else {
      setConfirmDelete(name);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleLoad = (template) => {
    onLoad(template.answers);
  };

  const formatDate = (ts) => new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <SectionTitle sub="Save and reuse common quote configurations">Templates</SectionTitle>

      {/* Save current */}
      <Card style={{ marginBottom: 20 }}>
        <CardTitle>Save Current Quote as Template</CardTitle>
        <div style={{ display: "flex", gap: 10 }}>
          <TextInput
            value={newName}
            onChange={setNewName}
            placeholder="e.g. Standard Website Package"
          />
          <Btn
            onClick={handleSave}
            variant={saved ? "success" : "primary"}
            style={{ flexShrink: 0, padding: "10px 20px" }}
            disabled={!newName.trim()}
          >
            {saved ? "✓ Saved!" : "Save"}
          </Btn>
        </div>
        <div style={{ fontSize: 11, color: "#3a3f6e", marginTop: 8 }}>
          Saves all current selections — service, add-ons, pricing, terms. Max 15 templates stored.
        </div>
      </Card>

      {/* Template list */}
      {templates.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0", color: "#4a5080" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No templates yet</div>
          <div style={{ fontSize: 13 }}>Save your first template above to reuse it later</div>
        </div>
      ) : (
        <Card>
          <CardTitle>Saved Templates ({templates.length}/15)</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {templates.map((t) => (
              <div key={t.name} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "#12152e", borderRadius: 12, padding: "12px 16px",
                border: "1px solid #1e2140",
              }}>
                <div style={{ fontSize: 22 }}>📋</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#4a5080" }}>
                    {t.answers?.service ? t.answers.service.charAt(0).toUpperCase() + t.answers.service.slice(1) : "—"}
                    {" · "}Saved {formatDate(t.savedAt)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Btn onClick={() => handleLoad(t)} variant="outline" style={{ fontSize: 12, padding: "6px 14px" }}>
                    Load
                  </Btn>
                  <Btn
                    onClick={() => handleDelete(t.name)}
                    variant="danger"
                    style={{ fontSize: 12, padding: "6px 14px" }}
                  >
                    {confirmDelete === t.name ? "Sure?" : "Delete"}
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}