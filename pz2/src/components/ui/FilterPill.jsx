export function FilterPill({ children, active, onClick, color = "blue" }) {
  const colors = {
    blue: { activeBg: "#E6F1FB", activeText: "#185FA5", activeBorder: "#378ADD" },
    amber: { activeBg: "#FAEEDA", activeText: "#854F0B", activeBorder: "#EF9F27" },
  };
  const currentColor = colors[color] || colors.blue;

  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12,
        padding: "3px 12px",
        borderRadius: 20,
        border: active
          ? `1px solid ${currentColor.activeBorder}`
          : "1px solid var(--color-border-tertiary)",
        background: active ? currentColor.activeBg : "transparent",
        color: active ? currentColor.activeText : "var(--color-text-secondary)",
        cursor: "pointer",
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}
