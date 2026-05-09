import { PRIORITY_COLORS } from "../../constants/colors.js";

export function TodoItem({ todo, onToggleStatus, onDeleteTodo }) {
  const priorityColor = PRIORITY_COLORS[todo.priority];
  const isDone = todo.status === "completed";

  return (
    <li
      style={{
        background: "var(--color-background-primary)",
        border: "1px solid var(--color-border-tertiary)",
        borderLeft: isDone ? "3px solid #1D9E75" : "3px solid #E24B4A",
        borderRadius: "var(--border-radius-lg)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: isDone ? 0.75 : 1,
      }}
    >
      <button
        onClick={() => onToggleStatus(todo.id)}
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: isDone ? "none" : "1.5px solid var(--color-border-secondary)",
          background: isDone ? "#1D9E75" : "transparent",
          cursor: "pointer",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 13,
        }}
      >
        {isDone ? "✓" : ""}
      </button>

      <span
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: 500,
          color: isDone ? "var(--color-text-tertiary)" : "var(--color-text-primary)",
          textDecoration: isDone ? "line-through" : "none",
        }}
      >
        {todo.title}
      </span>

      <span
        style={{
          fontSize: 11,
          padding: "2px 8px",
          borderRadius: 20,
          background: priorityColor.bg,
          color: priorityColor.text,
          flexShrink: 0,
        }}
      >
        {priorityColor.label}
      </span>

      <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", flexShrink: 0 }}>{todo.createdAt}</span>

      <button
        onClick={() => onDeleteTodo(todo.id)}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--color-text-tertiary)",
          cursor: "pointer",
          fontSize: 16,
          lineHeight: 1,
          padding: "0 4px",
        }}
      >
        ×
      </button>
    </li>
  );
}
