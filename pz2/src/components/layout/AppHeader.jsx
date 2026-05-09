export function AppHeader() {
  return (
    <header style={{ marginBottom: "2rem" }}>
      <h1
        style={{
          fontFamily: "'Unbounded', cursive",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: "var(--color-text-primary)",
          margin: "0 0 0.25rem",
        }}
      >
        JSON Lab
      </h1>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: 0 }}>
        Робота з JSON · Рівні 1–4
      </p>
    </header>
  );
}
