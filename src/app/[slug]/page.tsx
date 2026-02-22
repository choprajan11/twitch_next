import { notFound } from "next/navigation";
import { Button, Card, Input } from "@heroui/react";
import Link from "next/link";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// This is mock data mimicking what would come from the database
const mockServices = [
  {
    id: "1",
    name: "Twitch Followers",
    slug: "buy-followers",
    desc: "Get real, high-quality followers delivered instantly to your channel. Boost your credibility.",
    plans: [
      { id: "100_followers", name: "100 Followers", price: 2.99, quantity: 100 },
      { id: "500_followers", name: "500 Followers", price: 12.99, quantity: 500 },
      { id: "1000_followers", name: "1000 Followers", price: 22.99, quantity: 1000 },
    ]
  },
  {
    id: "2",
    name: "Twitch Viewers",
    slug: "buy-viewers",
    desc: "Increase your live concurrent viewers. Great for ranking higher in your game category.",
    plans: [
      { id: "50_viewers", name: "50 Viewers (1 Hour)", price: 4.99, quantity: 50 },
      { id: "100_viewers", name: "100 Viewers (1 Hour)", price: 8.99, quantity: 100 },
    ]
  },
  {
    id: "3",
    name: "Twitch Chatbot",
    slug: "buy-chatbot",
    desc: "Automated realistic chat interaction for your stream. Keeps your audience engaged.",
    plans: [
      { id: "basic_chat", name: "Basic Chat (1 Hour)", price: 9.99, quantity: 1 },
    ]
  },
  {
    id: "4",
    name: "Clip Views",
    slug: "buy-clip-views",
    desc: "Make your best moments go viral with high-quality clip views.",
    plans: [
      { id: "1000_clip_views", name: "1000 Clip Views", price: 1.99, quantity: 1000 },
    ]
  }
];

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Example of Prisma integration (uncomment when DB is connected):
  // const service = await prisma.service.findUnique({ where: { slug } });
  
  const service = mockServices.find(s => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{service.desc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Choose a Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.plans.map((plan) => (
              <Card key={plan.id} className="cursor-pointer hover:border-primary transition-colors">
                <Card.Header>
                  <Card.Title className="text-lg">{plan.name}</Card.Title>
                </Card.Header>
                <Card.Content>
                  <p className="text-2xl font-bold">${plan.price.toFixed(2)}</p>
                </Card.Content>
                <Card.Footer>
                  <Link href={`/checkout?service=${service.slug}&plan=${plan.id}`} className="w-full block">
                  <Button className="w-full">
                    Select Plan
                  </Button>
                </Link>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          <Card className="sticky top-6">
            <Card.Header>
              <Card.Title>Why choose us?</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="font-semibold">🚀 Instant Start</span>
                <span className="text-sm text-muted-foreground">Orders begin processing immediately.</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">🔒 No Password Required</span>
                <span className="text-sm text-muted-foreground">We never ask for your Twitch password.</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">🛡️ 30 Days Refill Guarantee</span>
                <span className="text-sm text-muted-foreground">If any followers drop, we refill them for free.</span>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
