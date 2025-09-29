"use client";

const items = [
  { key: "overview", label: "Overview" },
  { key: "projects", label: "Projects" },
  { key: "tasks", label: "Tasks" },
  { key: "settings", label: "Settings" },
];

export default function Sidebar({ activeItem, setActiveItem }) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-4 space-y-4">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => setActiveItem(item.key)}
          className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors
            ${
              activeItem === item.key
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}
