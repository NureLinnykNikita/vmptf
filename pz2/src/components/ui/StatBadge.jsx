export function StatBadge({ label, value }) {
  return (
    <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
      {label}: <strong style={{ color: "var(--color-text-primary)" }}>{value}</strong>
    </span>
  );
}
