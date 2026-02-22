"use client";

import { useState, useEffect, useTransition } from "react";
import { Button, Switch } from "@heroui/react";
import { getAllServices, toggleServiceStatus, updateService } from "./actions";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSlug, setEditSlug] = useState("");
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

  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setEditName(service.name);
    setEditCategory(service.category);
    setEditSlug(service.slug);
    setIsEditModalOpen(true);
  };

  const handleUpdateService = async () => {
    if (!selectedService || !editName.trim() || !editCategory.trim()) return;
    
    startTransition(async () => {
      const result = await updateService(selectedService.id, {
        name: editName.trim(),
        category: editCategory.trim(),
        slug: editSlug.trim() || editName.toLowerCase().replace(/\s+/g, '-'),
      });
      
      if (result.success) {
        setServices(services.map(svc => 
          svc.id === selectedService.id 
            ? { ...svc, name: editName.trim(), category: editCategory.trim(), slug: editSlug.trim() || editName.toLowerCase().replace(/\s+/g, '-') } 
            : svc
        ));
        setIsEditModalOpen(false);
        setSelectedService(null);
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Services & Packages</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Loading services...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bento-card p-6 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Services & Packages</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Manage the catalog of services you offer to customers.</p>
        </div>
        <Button 
          onPress={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#9146FF', color: 'white' }} 
          className="font-bold shadow-lg shadow-[#9146FF]/20 rounded-xl"
        >
          + Add Service
        </Button>
      </div>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((svc) => (
            <div key={svc.id} className={`bento-card p-6 flex flex-col relative overflow-hidden transition-all duration-300 ${!svc.active ? 'opacity-60 grayscale-[30%]' : ''}`}>
              {!svc.active && (
                 <div className="absolute top-0 right-0 bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-bl-xl z-10">
                   Paused
                 </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{svc.name}</h3>
                  <span className="text-xs font-bold text-[#9146FF] uppercase tracking-wider">{svc.category}</span>
                </div>
                <Switch 
                  isSelected={svc.active} 
                  onValueChange={() => handleToggleService(svc.id)}
                  color="secondary"
                  isDisabled={isPending}
                />
              </div>
              
              <div className="mt-auto pt-4 border-t border-[rgba(145,70,255,0.08)] grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">Pricing Plans</p>
                  <p className="text-lg font-black text-zinc-900 dark:text-white mt-0.5 tabular-nums">{svc.plans} Tiers</p>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">Total Sales</p>
                  <p className="text-lg font-black text-zinc-900 dark:text-white mt-0.5 tabular-nums">{svc.sales.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button 
                  variant="bordered" 
                  className="flex-1 font-semibold border-[rgba(145,70,255,0.15)] rounded-xl hover:border-[#9146FF]/30"
                  onPress={() => window.location.href = `/admin/services/${svc.id}/packages`}
                >
                  Edit Packages
                </Button>
                <Button 
                  variant="flat" 
                  className="flex-1 font-semibold bg-[var(--bento-bg)] text-zinc-900 dark:text-white rounded-xl"
                  onPress={() => openEditModal(svc)}
                >
                  Settings
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bento-card-static p-12 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 mb-4 text-sm">No services configured yet.</p>
          <Button 
            onPress={() => setIsModalOpen(true)}
            style={{ backgroundColor: '#9146FF', color: 'white' }} 
            className="font-bold rounded-xl shadow-lg shadow-[#9146FF]/20"
          >
            Create Your First Service
          </Button>
        </div>
      )}

      {isModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <div className="bento-card-static w-full max-w-md">
              <div className="px-6 py-5 border-b border-[rgba(145,70,255,0.08)]">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Create New Service</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="e.g. Channel Subscriptions"
                    className="w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                    placeholder="e.g. Engagement"
                    className="w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-[rgba(145,70,255,0.1)] rounded-xl">
                  <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Set Active Immediately</span>
                  <Switch 
                    isSelected={newServiceActive}
                    onValueChange={setNewServiceActive}
                    color="secondary" 
                    size="sm" 
                  />
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-[rgba(145,70,255,0.08)] flex justify-end gap-2">
                <Button 
                  variant="flat" 
                  className="font-semibold rounded-xl bg-[var(--bento-bg)]"
                  onPress={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  style={{ backgroundColor: '#9146FF', color: 'white' }} 
                  className="font-bold rounded-xl shadow-sm shadow-[#9146FF]/20"
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

      {isEditModalOpen && selectedService && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <div className="bento-card-static w-full max-w-md">
              <div className="px-6 py-5 border-b border-[rgba(145,70,255,0.08)]">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Edit Service Settings</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Channel Subscriptions"
                    className="w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="e.g. channel-subscriptions"
                    className="w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm font-mono"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Used in the URL: /buy-{editSlug || 'service-name'}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="e.g. Engagement"
                    className="w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm"
                  />
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-[rgba(145,70,255,0.08)] flex justify-end gap-2">
                <Button 
                  variant="flat" 
                  className="font-semibold rounded-xl bg-[var(--bento-bg)]"
                  onPress={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  style={{ backgroundColor: '#9146FF', color: 'white' }} 
                  className="font-bold rounded-xl shadow-sm shadow-[#9146FF]/20"
                  onPress={handleUpdateService}
                  isDisabled={!editName.trim() || !editCategory.trim() || isPending}
                  isLoading={isPending}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
