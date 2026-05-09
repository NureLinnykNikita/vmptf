import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { LoadingCard } from "../../components/ui/LoadingCard.jsx";
import { SectionLabel } from "../../components/ui/SectionLabel.jsx";
import { StatBadge } from "../../components/ui/StatBadge.jsx";
import { SHOPPING_ITEMS } from "../../data/shoppingItems.js";
import { mockFetch } from "../../services/mockFetch.js";
import { ShoppingFilters } from "./ShoppingFilters.jsx";
import { ShoppingJsonPreview } from "./ShoppingJsonPreview.jsx";
import { ShoppingList } from "./ShoppingList.jsx";

export function ShoppingTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [filterField, setFilterField] = useState("category");
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    setLoading(true);
    mockFetch(SHOPPING_ITEMS).then((json) => {
      setItems(JSON.parse(json));
      setLoading(false);
    });
  }, []);

  const categories = [...new Set(SHOPPING_ITEMS.map((item) => item.category))];

  const filteredItems = useMemo(() => {
    if (!filterValue) return items;

    return items.filter((item) => {
      const value = String(item[filterField] || "").toLowerCase();
      return value.includes(filterValue.toLowerCase());
    });
  }, [items, filterField, filterValue]);

  const totalPrice = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return <LoadingCard text="Завантаження JSON через fetch()…" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <SectionLabel level={1} title="Список покупок із JSON" />

      <Card>
        <ShoppingFilters
          categories={categories}
          filterField={filterField}
          filterValue={filterValue}
          onFilterFieldChange={setFilterField}
          onFilterValueChange={setFilterValue}
        />

        <div style={{ marginTop: "1rem", display: "flex", gap: 8, alignItems: "center" }}>
          <StatBadge label="Знайдено" value={filteredItems.length} />
          <StatBadge label="Сума" value={`${totalPrice} грн`} />
          <button
            onClick={() => setShowJson((prev) => !prev)}
            style={{
              marginLeft: "auto",
              fontSize: 12,
              padding: "4px 12px",
              borderRadius: 6,
              border: "1px solid var(--color-border-secondary)",
              background: "transparent",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
            }}
          >
            {showJson ? "Сховати JSON" : "Показати JSON"}
          </button>
        </div>
      </Card>

      {showJson && <ShoppingJsonPreview items={filteredItems} />}

      <ShoppingList items={filteredItems} />

      {filteredItems.length === 0 && <EmptyState>Нічого не знайдено за фільтром «{filterValue}»</EmptyState>}
    </div>
  );
}
