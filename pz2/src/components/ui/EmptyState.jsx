import { Card } from "./Card.jsx";

export function EmptyState({ children }) {
  return (
    <Card>
      <p style={{ textAlign: "center", color: "var(--color-text-secondary)", fontSize: 14, margin: "1rem 0" }}>
        {children}
      </p>
    </Card>
  );
}
