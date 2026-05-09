import { MetricCard } from "../../components/ui/MetricCard.jsx";

export function TodoMetrics({ total, completed, pending }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
      <MetricCard label="Всього" value={total} color="#E6F1FB" textColor="#185FA5" />
      <MetricCard label="Виконано" value={completed} color="#E1F5EE" textColor="#0F6E56" />
      <MetricCard label="Залишилось" value={pending} color="#FAECE7" textColor="#993C1D" />
    </div>
  );
}
