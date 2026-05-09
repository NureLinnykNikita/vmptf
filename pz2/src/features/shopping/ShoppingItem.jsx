import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from "../../constants/colors.js";

export function ShoppingItem({ item }) {
  const categoryColor = CATEGORY_COLORS[item.category] || DEFAULT_CATEGORY_COLOR;

  return (
    <li
      style={{
        background: "var(--color-background-primary)",
        border: "1px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text-primary)" }}>{item.name}</span>
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 20,
            background: categoryColor.bg,
            color: categoryColor.text,
            border: `1px solid ${categoryColor.border}`,
            whiteSpace: "nowrap",
          }}
        >
          {item.category}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
        <span style={{ color: "var(--color-text-secondary)" }}>
          {item.quantity} {item.unit}
        </span>
        <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{item.price} грн</span>
      </div>
    </li>
  );
}
