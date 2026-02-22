"use client";

import { useState, useEffect, useTransition } from "react";
import { Button, Switch } from "@heroui/react";
import { getAllServices, toggleServiceStatus } from "./actions";

interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  active: boolean;
  plans: number;
  sales: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("");
  const [newServiceActive, setNewServiceActive] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setIsLoading(true);
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleToggleService = async (id: string) => {
    startTransition(async () => {
      const result = await toggleServiceStatus(id);
      if (result.success) {
        setServices(services.map(svc => 
          svc.id === id ? { ...svc, active: !svc.active } : svc
        ));
      }
    });
  };

  const handleCreateService = () => {
    if (!newServiceName.trim() || !newServiceCategory.trim()) return;
    
    const newService: Service = {
      id: `srv_${Date.now()}`,
      name: newServiceName,
      slug: newServiceName.toLowerCase().replace(/\s+/g, '-'),
      category: newServiceCategory,
      active: newServiceActive,
      plans: 0,
      sales: 0,
    };
    
    setServices([...services, newService]);
    setNewServiceName("");
    setNewServiceCategory("");
    setNewServiceActive(true);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Services & Packages</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Loading services...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bento-card p-6 h-48 animate-pulse bg-zinc-100 dark:bg-zinc-800/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Services & Packages</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage the catalog of services you offer to customers.</p>
        </div>
        <Button 
          onPress={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#9146FF', color: 'white' }} 
          className="font-bold shadow-[#9146FF]/30"
        >
          + Add Service
        </Button>
      </div>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc) => (
            <div key={svc.id} className={`bento-card p-6 flex flex-col relative overflow-hidden transition-all duration-300 ${!svc.active ? 'opacity-70 grayscale-[30%]' : ''}`}>
              {!svc.active && (
                 <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-bl-lg z-10">
                   Inactive / Paused
                 </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{svc.name}</h3>
                  <span className="text-sm font-semibold text-[#9146FF]">{svc.category}</span>
                </div>
                <Switch 
                  isSelected={svc.active} 
                  onValueChange={() => handleToggleService(svc.id)}
                  color="secondary"
                  isDisabled={isPending}
                />
              </div>
              
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Pricing Plans</p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">{svc.plans} Tiers</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Total Sales</p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">{svc.sales.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="bordered" className="flex-1 font-semibold border-zinc-200 dark:border-zinc-800">
                  Edit Packages
                </Button>
                <Button variant="flat" className="flex-1 font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
                  Settings
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bento-card p-12 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">No services configured yet.</p>
          <Button 
            onPress={() => setIsModalOpen(true)}
            style={{ backgroundColor: '#9146FF', color: 'white' }} 
            className="font-bold"
          >
            Create Your First Service
          </Button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Create New Service</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="e.g. Channel Subscriptions"
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                    placeholder="e.g. Engagement"
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Set Active Immediately</span>
                  <Switch 
                    isSelected={newServiceActive}
                    onValueChange={setNewServiceActive}
                    color="secondary" 
                    size="sm" 
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
                <Button 
                  variant="flat" 
                  className="font-semibold"
                  onPress={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  style={{ backgroundColor: '#9146FF', color: 'white' }} 
                  className="font-bold"
                  onPress={handleCreateService}
                  isDisabled={!newServiceName.trim() || !newServiceCategory.trim()}
                >
                  Create Service
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
