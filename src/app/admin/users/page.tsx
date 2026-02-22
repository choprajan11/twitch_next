import { Button, Card, Input } from "@heroui/react";

const mockUsers = [
  { id: "USR-001", name: "John Doe", email: "john@example.com", funds: 15.50, status: "active", registered: "2026-01-10" },
  { id: "USR-002", name: "Sarah Smith", email: "sarah@example.com", funds: 0.00, status: "banned", registered: "2026-01-12" },
  { id: "USR-003", name: "Mike Johnson", email: "mike@example.com", funds: 120.00, status: "active", registered: "2026-02-05" },
];

export default function AdminUsersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-muted-foreground mt-2">View and manage all registered users.</p>
        </div>
        <div className="flex gap-4">
          <Input placeholder="Search users..." className="max-w-xs" />
          <Button>Add User</Button>
        </div>
      </div>

      <Card>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Funds</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b bg-background hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{user.id}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">\${user.funds.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={\`px-2 py-1 rounded-full text-xs font-semibold \${
                        user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }\`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button size="sm" variant="secondary">Edit</Button>
                      <Button size="sm" variant={user.status === 'active' ? 'danger' : 'secondary'}>
                        {user.status === 'active' ? 'Ban' : 'Unban'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
