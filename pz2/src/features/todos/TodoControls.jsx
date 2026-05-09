import { Card } from "../../components/ui/Card.jsx";
import { FilterPill } from "../../components/ui/FilterPill.jsx";
import { SectionLabel } from "../../components/ui/SectionLabel.jsx";

const STATUS_FILTERS = [
  { value: "all", label: "Всі" },
  { value: "pending", label: "Незавершені" },
  { value: "completed", label: "Завершені" },
];

const PRIORITY_FILTERS = [
  { value: "all", label: "Всі" },
  { value: "high", label: "Високий" },
  { value: "medium", label: "Середній" },
  { value: "low", label: "Низький" },
];

export function TodoControls({
  search,
  statusFilter,
  priorityFilter,
  sortBy,
  filteredCount,
  totalCount,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onSortChange,
}) {
  return (
    <Card>
      <SectionLabel level={4} title="Пошук, фільтр і сортування" />

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        <input
          type="text"
          placeholder="🔍 Пошук за назвою завдання…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          style={{
            width: "100%",
            padding: "8px 14px",
            fontSize: 14,
            borderRadius: "var(--border-radius-md)",
            border: "1px solid var(--color-border-tertiary)",
            background: "var(--color-background-secondary)",
            color: "var(--color-text-primary)",
          }}
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginRight: 2 }}>Статус:</span>
            {STATUS_FILTERS.map(({ value, label }) => (
              <FilterPill
                key={value}
                active={statusFilter === value}
                onClick={() => onStatusFilterChange(value)}
                color="blue"
              >
                {label}
              </FilterPill>
            ))}
          </div>

          <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginRight: 2 }}>Пріоритет:</span>
            {PRIORITY_FILTERS.map(({ value, label }) => (
              <FilterPill
                key={value}
                active={priorityFilter === value}
                onClick={() => onPriorityFilterChange(value)}
                color="amber"
              >
                {label}
              </FilterPill>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Сортування:</span>
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            style={{
              fontSize: 13,
              padding: "6px 10px",
              borderRadius: "var(--border-radius-md)",
              border: "1px solid var(--color-border-tertiary)",
              background: "var(--color-background-secondary)",
              color: "var(--color-text-primary)",
            }}
          >
            <option value="date_desc">Дата (нові спочатку)</option>
            <option value="date_asc">Дата (старі спочатку)</option>
            <option value="title_asc">Назва А → Я</option>
            <option value="title_desc">Назва Я → А</option>
            <option value="priority">Пріоритет</option>
          </select>
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginLeft: "auto" }}>
            Показано: <strong>{filteredCount}</strong> / {totalCount}
          </span>
        </div>
      </div>
    </Card>
  );
}
