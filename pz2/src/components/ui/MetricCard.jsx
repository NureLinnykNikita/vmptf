export function MetricCard({ label, value, color, textColor }) {
  return (
    <div
      style={{
        background: color,
        borderRadius: "var(--border-radius-md)",
        padding: "14px 16px",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 11, color: textColor, margin: "0 0 4px", fontWeight: 500, opacity: 0.8 }}>
        {label}
      </p>
      <p
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: textColor,
          margin: 0,
          fontFamily: "'Unbounded', cursive",
        }}
      >
        {value}
      </p>
    </div>
  );
}
