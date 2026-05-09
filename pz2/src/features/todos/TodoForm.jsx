export function TodoForm({ newTitle, newPriority, onTitleChange, onPriorityChange, onAddTodo }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <input
        type="text"
        placeholder="Нове завдання…"
        value={newTitle}
        onChange={(event) => onTitleChange(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && onAddTodo()}
        style={{
          flex: 1,
          minWidth: 220,
          padding: "8px 12px",
          fontSize: 14,
          borderRadius: "var(--border-radius-md)",
          border: "1px solid var(--color-border-tertiary)",
          background: "var(--color-background-secondary)",
          color: "var(--color-text-primary)",
        }}
      />
      <select
        value={newPriority}
        onChange={(event) => onPriorityChange(event.target.value)}
        style={{
          fontSize: 13,
          padding: "6px 10px",
          borderRadius: "var(--border-radius-md)",
          border: "1px solid var(--color-border-tertiary)",
          background: "var(--color-background-secondary)",
          color: "var(--color-text-primary)",
        }}
      >
        <option value="high">Високий</option>
        <option value="medium">Середній</option>
        <option value="low">Низький</option>
      </select>
      <button
        onClick={onAddTodo}
        style={{
          padding: "8px 18px",
          borderRadius: "var(--border-radius-md)",
          border: "none",
          background: "#1D9E75",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        + Додати
      </button>
    </div>
  );
}
