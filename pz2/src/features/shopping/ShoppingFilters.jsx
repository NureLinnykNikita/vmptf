import { FilterPill } from "../../components/ui/FilterPill.jsx";

export function ShoppingFilters({
  categories,
  filterField,
  filterValue,
  onFilterFieldChange,
  onFilterValueChange,
}) {
  const handleFieldChange = (event) => {
    onFilterFieldChange(event.target.value);
    onFilterValueChange("");
  };

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <select
        value={filterField}
        onChange={handleFieldChange}
        style={{
          fontSize: 13,
          padding: "6px 10px",
          borderRadius: "var(--border-radius-md)",
          border: "1px solid var(--color-border-tertiary)",
          background: "var(--color-background-secondary)",
          color: "var(--color-text-primary)",
        }}
      >
        <option value="category">Категорія</option>
        <option value="name">Назва</option>
        <option value="unit">Одиниця</option>
      </select>

      {filterField === "category" ? (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <FilterPill active={filterValue === ""} onClick={() => onFilterValueChange("")}>
            Всі
          </FilterPill>
          {categories.map((category) => (
            <FilterPill
              key={category}
              active={filterValue === category}
              onClick={() => onFilterValueChange(category)}
            >
              {category}
            </FilterPill>
          ))}
        </div>
      ) : (
        <input
          type="text"
          placeholder={`Фільтр за ${filterField}…`}
          value={filterValue}
          onChange={(event) => onFilterValueChange(event.target.value)}
          style={{
            fontSize: 13,
            padding: "6px 12px",
            borderRadius: "var(--border-radius-md)",
            border: "1px solid var(--color-border-tertiary)",
            background: "var(--color-background-secondary)",
            color: "var(--color-text-primary)",
            minWidth: 200,
          }}
        />
      )}
    </div>
  );
}
