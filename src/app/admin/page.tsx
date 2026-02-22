import { Card } from "@heroui/react";

export default function AdminDashboardPage() {
  // Mock data for statistics
  const stats = [
    { title: "Total Revenue", value: "$4,231.89", description: "All time" },
    { title: "Active Orders", value: "24", description: "Processing currently" },
    { title: "Total Users", value: "1,204", description: "Registered users" },
    { title: "Providers Balance", value: "$124.50", description: "Across all APIs" },
  ];

  const recentOrders = [
    { id: "ORD-999", user: "john@example.com", service: "Twitch Followers", status: "pending", amount: "$12.99" },
    { id: "ORD-998", user: "sarah@example.com", service: "Twitch Viewers", status: "completed", amount: "$4.99" },
    { id: "ORD-997", user: "mike@example.com", service: "Chatbot", status: "processing", amount: "$9.99" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <Card key={i}>
            <Card.Header>
              <Card.Title className="text-sm font-medium text-muted-foreground">{stat.title}</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Card.Content>
            <Card.Footer>
              <span className="text-xs text-muted-foreground">{stat.description}</span>
            </Card.Footer>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2">
          <Card>
            <Card.Header>
              <Card.Title>Recent Orders</Card.Title>
              <Card.Description>Latest transactions across all services</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Service</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b bg-background">
                        <td className="px-6 py-4 font-medium">{order.id}</td>
                        <td className="px-6 py-4">{order.user}</td>
                        <td className="px-6 py-4">{order.service}</td>
                        <td className="px-6 py-4">
                          <span className={\`px-2 py-1 rounded-full text-xs font-semibold \${
                            order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }\`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="col-span-1">
          <Card>
            <Card.Header>
              <Card.Title>Quick Actions</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <a href="/admin/users" className="block p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <h4 className="font-semibold mb-1">Manage Users</h4>
                <p className="text-sm text-muted-foreground">View, ban, or edit user balances.</p>
              </a>
              <a href="/admin/services" className="block p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <h4 className="font-semibold mb-1">Manage Services</h4>
                <p className="text-sm text-muted-foreground">Add new services or update pricing.</p>
              </a>
              <a href="/admin/providers" className="block p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <h4 className="font-semibold mb-1">API Providers</h4>
                <p className="text-sm text-muted-foreground">Check API balances and status.</p>
              </a>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
