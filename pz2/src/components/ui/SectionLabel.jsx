export function SectionLabel({ level, title }) {
  const colors = {
    1: { bg: "#E6F1FB", text: "#185FA5" },
    2: { bg: "#FAEEDA", text: "#854F0B" },
    3: { bg: "#E1F5EE", text: "#0F6E56" },
    4: { bg: "#EEEDFE", text: "#534AB7" },
  };
  const currentColor = colors[level];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 20,
          background: currentColor.bg,
          color: currentColor.text,
        }}
      >
        Рівень {level}
      </span>
      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>
        {title}
      </span>
    </div>
  );
}
