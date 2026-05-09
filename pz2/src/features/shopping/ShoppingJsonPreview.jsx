import { Card } from "../../components/ui/Card.jsx";
import { SectionLabel } from "../../components/ui/SectionLabel.jsx";

export function ShoppingJsonPreview({ items }) {
  return (
    <Card>
      <SectionLabel level={2} title="Відфільтровані JSON-дані" />
      <pre
        style={{
          fontSize: 11,
          lineHeight: 1.6,
          overflowX: "auto",
          margin: "0.5rem 0 0",
          color: "var(--color-text-secondary)",
          background: "var(--color-background-tertiary)",
          padding: "1rem",
          borderRadius: "var(--border-radius-md)",
          maxHeight: 260,
          overflowY: "auto",
        }}
      >
        {JSON.stringify(items, null, 2)}
      </pre>
    </Card>
  );
}
