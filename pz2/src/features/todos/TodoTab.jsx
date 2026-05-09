import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { LoadingCard } from "../../components/ui/LoadingCard.jsx";
import { SectionLabel } from "../../components/ui/SectionLabel.jsx";
import { TODO_ITEMS } from "../../data/todoItems.js";
import { mockFetch } from "../../services/mockFetch.js";
import { TodoControls } from "./TodoControls.jsx";
import { TodoForm } from "./TodoForm.jsx";
import { TodoList } from "./TodoList.jsx";
import { TodoMetrics } from "./TodoMetrics.jsx";

export function TodoTab() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("medium");

  useEffect(() => {
    setLoading(true);
    mockFetch(TODO_ITEMS).then((json) => {
      setTodos(JSON.parse(json));
      setLoading(false);
    });
  }, []);

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (statusFilter !== "all") {
      result = result.filter((todo) => todo.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter((todo) => todo.priority === priorityFilter);
    }

    if (search.trim()) {
      result = result.filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()));
    }

    result.sort((firstTodo, secondTodo) => {
      if (sortBy === "date_asc") return firstTodo.createdAt.localeCompare(secondTodo.createdAt);
      if (sortBy === "date_desc") return secondTodo.createdAt.localeCompare(firstTodo.createdAt);
      if (sortBy === "title_asc") return firstTodo.title.localeCompare(secondTodo.title, "uk");
      if (sortBy === "title_desc") return secondTodo.title.localeCompare(firstTodo.title, "uk");

      if (sortBy === "priority") {
        const order = { high: 0, medium: 1, low: 2 };
        return order[firstTodo.priority] - order[secondTodo.priority];
      }

      return 0;
    });

    return result;
  }, [todos, statusFilter, priorityFilter, search, sortBy]);

  const toggleStatus = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, status: todo.status === "completed" ? "pending" : "completed" }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const addTodo = () => {
    if (!newTitle.trim()) return;

    setTodos((prevTodos) => [
      ...prevTodos,
      {
        id: Date.now(),
        title: newTitle.trim(),
        status: "pending",
        priority: newPriority,
        createdAt: new Date().toISOString().split("T")[0],
      },
    ]);
    setNewTitle("");
  };

  const completedCount = todos.filter((todo) => todo.status === "completed").length;
  const pendingCount = todos.filter((todo) => todo.status === "pending").length;

  if (loading) {
    return <LoadingCard color="#1D9E75" text="Завантаження завдань через fetch()…" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <SectionLabel level={3} title="Список завдань" />

      <TodoMetrics total={todos.length} completed={completedCount} pending={pendingCount} />

      <TodoControls
        search={search}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        sortBy={sortBy}
        filteredCount={filteredTodos.length}
        totalCount={todos.length}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onPriorityFilterChange={setPriorityFilter}
        onSortChange={setSortBy}
      />

      <Card>
        <TodoForm
          newTitle={newTitle}
          newPriority={newPriority}
          onTitleChange={setNewTitle}
          onPriorityChange={setNewPriority}
          onAddTodo={addTodo}
        />
      </Card>

      <TodoList todos={filteredTodos} onToggleStatus={toggleStatus} onDeleteTodo={deleteTodo} />

      {filteredTodos.length === 0 && <EmptyState>Завдань не знайдено за поточними фільтрами</EmptyState>}
    </div>
  );
}
