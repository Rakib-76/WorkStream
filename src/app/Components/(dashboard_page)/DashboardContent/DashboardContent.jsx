"use client";

export default function DashboardContent({ activeItem }) {
  const renderContent = () => {
    switch (activeItem) {
      case "overview":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Overview</h2>
            <p className="text-muted-foreground">
              Welcome to your dashboard! Here you can track projects and tasks.
            </p>
          </div>
        );
      case "projects":
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {["Project Alpha", "Project Beta"].map((name, i) => (
              <div
                key={i}
                className="p-6 bg-card border border-border rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold">{name}</h3>
                <p className="text-muted-foreground mt-2">
                  Fake description for {name}.
                </p>
              </div>
            ))}
          </div>
        );
      case "tasks":
        return (
          <ul className="list-disc pl-6 space-y-2">
            <li>Design landing page</li>
            <li>Implement authentication</li>
            <li>Integrate API</li>
          </ul>
        );
      case "settings":
        return <p className="text-muted-foreground">⚙️ Settings panel here.</p>;
      default:
        return null;
    }
  };

  return <div className="animate-fadeIn">{renderContent()}</div>;
}
