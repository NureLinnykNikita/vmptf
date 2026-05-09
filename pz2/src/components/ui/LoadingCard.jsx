import { Card } from "./Card.jsx";

export function LoadingCard({ color = "#378ADD", text }) {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "2rem" }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: `2px solid ${color}`,
            borderTopColor: "transparent",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <span style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>{text}</span>
      </div>
    </Card>
  );
}
