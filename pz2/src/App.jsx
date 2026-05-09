import { useState } from "react";
import { AppHeader } from "./components/layout/AppHeader.jsx";
import { TabSwitcher } from "./components/layout/TabSwitcher.jsx";
import { ShoppingTab } from "./features/shopping/ShoppingTab.jsx";
import { TodoTab } from "./features/todos/TodoTab.jsx";

const TABS = [
  { key: "shopping", label: "🛒 Список покупок", sub: "Рівень 1 + 2" },
  { key: "todos", label: "✅ Завдання", sub: "Рівень 3 + 4" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("shopping");

  return (
    <div className="app">
      <div className="app__container">
        <AppHeader />
        <TabSwitcher tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "shopping" ? <ShoppingTab /> : <TodoTab />}
      </div>
    </div>
  );
}
