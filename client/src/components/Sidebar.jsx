import { BarChart3, BrainCircuit, CalendarDays, KanbanSquare, ShieldCheck } from "lucide-react";

const navItems = [
  { id: "board", label: "Board", icon: KanbanSquare },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "suggestions", label: "AI Focus", icon: BrainCircuit },
];

function Sidebar({ activeView, onChangeView, user }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p className="eyebrow">TaskFlow Pro</p>
        <h2>Workspace</h2>
      </div>

      <div className="user-pill">
        <div>
          <strong>{user?.name}</strong>
          <p>{user?.email}</p>
        </div>
        <span className="role-badge">
          <ShieldCheck size={14} />
          {user?.role || "user"}
        </span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => onChangeView(item.id)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
