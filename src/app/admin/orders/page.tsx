import { Button, Card, Input } from "@heroui/react";

const mockOrders = [
  { id: "ORD-999", user: "john@example.com", service: "Twitch Followers", target: "https://twitch.tv/john", status: "pending", amount: 12.99, date: "2026-02-22" },
  { id: "ORD-998", user: "sarah@example.com", service: "Twitch Viewers", target: "https://twitch.tv/sarah", status: "completed", amount: 4.99, date: "2026-02-21" },
  { id: "ORD-997", user: "mike@example.com", service: "Chatbot", target: "https://twitch.tv/mike", status: "processing", amount: 9.99, date: "2026-02-20" },
];

export default function AdminOrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Orders</h1>
          <p className="text-muted-foreground mt-2">View and manage customer orders and external fulfillment.</p>
        </div>
        <div className="flex gap-4">
          <Input placeholder="Search by ID or User..." className="max-w-xs" />
        </div>
      </div>

      <Card>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Target</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id} className="border-b bg-background hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{order.id}</td>
                    <td className="px-6 py-4">{order.user}</td>
                    <td className="px-6 py-4">{order.service}</td>
                    <td className="px-6 py-4">
                      <a href={order.target} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        Link
                      </a>
                    </td>
                    <td className="px-6 py-4">\${order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={\`px-2 py-1 rounded-full text-xs font-semibold \${
                        order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }\`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button size="sm" variant="secondary">Details</Button>
                      <Button size="sm" variant="tertiary">Resend API</Button>
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
