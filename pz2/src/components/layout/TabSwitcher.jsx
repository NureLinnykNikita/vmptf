export function TabSwitcher({ tabs, activeTab, onTabChange }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          style={{
            padding: "10px 20px",
            borderRadius: "var(--border-radius-lg)",
            border:
              activeTab === tab.key
                ? "2px solid #378ADD"
                : "1px solid var(--color-border-tertiary)",
            background: activeTab === tab.key ? "#E6F1FB" : "var(--color-background-primary)",
            color: activeTab === tab.key ? "#185FA5" : "var(--color-text-secondary)",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {tab.label}
          <span style={{ fontSize: 11, marginLeft: 6, opacity: 0.7 }}>{tab.sub}</span>
        </button>
      ))}
    </div>
  );
}
