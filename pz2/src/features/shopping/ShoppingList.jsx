import { ShoppingItem } from "./ShoppingItem.jsx";

export function ShoppingList({ items }) {
  return (
    <ul
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 10,
      }}
    >
      {items.map((item) => (
        <ShoppingItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
