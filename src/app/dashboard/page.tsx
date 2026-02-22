import { Button, Card, Input } from "@heroui/react";

const mockOrders = [
  { id: "ORD-001", service: "100 Twitch Followers", status: "completed", price: 2.99, date: "2026-02-20" },
  { id: "ORD-002", service: "50 Twitch Viewers (1hr)", status: "pending", price: 4.99, date: "2026-02-21" },
  { id: "ORD-003", service: "Basic Chatbot (1hr)", status: "processing", price: 9.99, date: "2026-02-22" },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="col-span-1 space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Wallet Balance</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-4xl font-bold mb-4">$15.50</p>
              <form className="space-y-4" action={async (formData) => {
                "use server";
                console.log("Add funds:", formData.get("amount"));
              }}>
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">Add Funds</label>
                  <Input id="amount" name="amount" type="number" min="5" placeholder="Amount ($)" required />
                </div>
                <Button type="submit" className="w-full">Add via Stripe</Button>
              </form>
            </Card.Content>
          </Card>
        </div>

        <div className="col-span-1 lg:col-span-3">
          <Card>
            <Card.Header>
              <Card.Title>Order History</Card.Title>
              <Card.Description>Recent orders and their current status</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Service</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order) => (
                      <tr key={order.id} className="border-b bg-background">
                        <td className="px-6 py-4 font-medium">{order.id}</td>
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
                        <td className="px-6 py-4">\${order.price.toFixed(2)}</td>
                        <td className="px-6 py-4">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
