import { TodoItem } from "./TodoItem.jsx";

export function TodoList({ todos, onToggleStatus, onDeleteTodo }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleStatus={onToggleStatus}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}
