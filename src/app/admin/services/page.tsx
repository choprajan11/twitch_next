import { Button, Card, Input } from "@heroui/react";

const mockServices = [
  { id: "1", name: "Twitch Followers", category: "Followers", type: "standard", api: "Provider A", status: "active" },
  { id: "2", name: "Twitch Viewers", category: "Views", type: "standard", api: "Provider B", status: "active" },
  { id: "3", name: "Twitch Chatbot", category: "Engagement", type: "standard", api: "Provider A", status: "inactive" },
];

export default function AdminServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Services</h1>
          <p className="text-muted-foreground mt-2">Configure services and map them to API providers.</p>
        </div>
        <div className="flex gap-4">
          <Input placeholder="Search services..." className="max-w-xs" />
          <Button>Add Service</Button>
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
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">API Provider</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockServices.map((service) => (
                  <tr key={service.id} className="border-b bg-background hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{service.id}</td>
                    <td className="px-6 py-4">{service.name}</td>
                    <td className="px-6 py-4">{service.category}</td>
                    <td className="px-6 py-4">{service.api}</td>
                    <td className="px-6 py-4">
                      <span className={\`px-2 py-1 rounded-full text-xs font-semibold \${
                        service.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }\`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button size="sm" variant="secondary">Edit</Button>
                      <Button size="sm" variant="danger">Delete</Button>
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
