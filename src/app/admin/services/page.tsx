"use client";

import { useState, useEffect, useTransition } from "react";
import { Button, Switch } from "@heroui/react";
import { getAllServices, toggleServiceStatus, updateService, getProviders, syncProviderCosts } from "./actions";

const STREAMRISE_TYPES = ["viewers", "clip_views", "video_views", "profile_views", "story_views", "chat_bots"];

interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  active: boolean;
  plans: number;
  sales: number;
  apiId: string | null;
  apiServiceId: string | null;
  type: string | null;
  startPrice: number | null;
  avgProfit: number | null;
  avgMarkup: number | null;
  costedPlanCount: number;
}

interface Provider {
  id: string;
  name: string;
  url: string;
  isStreamRise: boolean;
}

function formatCurrency(value: number | null) {
  return value == null ? "--" : `$${value.toFixed(2)}`;
}

function formatPercent(value: number | null) {
  return value == null ? "--" : `${Math.round(value)}%`;
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
  const [editApiId, setEditApiId] = useState<string>("");
  const [editApiServiceId, setEditApiServiceId] = useState("");
  const [editType, setEditType] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("");
  const [newServiceActive, setNewServiceActive] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setIsLoading(true);
    try {
      const [data, providerData] = await Promise.all([
        getAllServices(),
        getProviders(),
      ]);
      setServices(data);
      setProviders(providerData);
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
    setEditApiId(service.apiId || "");
    setEditApiServiceId(service.apiServiceId || "");
    setEditType(service.type || "");
    setIsEditModalOpen(true);
  };

  const handleSyncCosts = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const result = await syncProviderCosts();
      if (result.success) {
        setSyncMessage(`Synced ${result.updated} service(s), ${result.skipped} skipped.`);
        await loadServices();
      } else {
        setSyncMessage(`Sync failed: ${result.error}`);
      }
    } catch {
      setSyncMessage("Sync failed unexpectedly.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const handleUpdateService = async () => {
    if (!selectedService || !editName.trim() || !editCategory.trim()) return;
    
    startTransition(async () => {
      const result = await updateService(selectedService.id, {
        name: editName.trim(),
        category: editCategory.trim(),
        slug: editSlug.trim() || editName.toLowerCase().replace(/\s+/g, '-'),
        apiId: editApiId || null,
        apiServiceId: editApiServiceId.trim() || null,
        type: editType.trim() || null,
      });
      
      if (result.success) {
        setServices(services.map(svc => 
          svc.id === selectedService.id 
            ? { 
                ...svc, 
                name: editName.trim(), 
                category: editCategory.trim(), 
                slug: editSlug.trim() || editName.toLowerCase().replace(/\s+/g, '-'),
                apiId: editApiId || null,
                apiServiceId: editApiServiceId.trim() || null,
                type: editType.trim() || null,
              } 
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
      apiId: null,
      apiServiceId: null,
      type: null,
      startPrice: null,
      avgProfit: null,
      avgMarkup: null,
      costedPlanCount: 0,
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="font-semibold border-[rgba(145,70,255,0.2)] rounded-xl text-sm"
            onPress={handleSyncCosts}
            isDisabled={isSyncing}
          >
            {isSyncing ? "Syncing..." : "Sync Costs from API"}
          </Button>
          <Button 
            onPress={() => setIsModalOpen(true)}
            style={{ backgroundColor: '#9146FF', color: 'white' }} 
            className="font-bold shadow-lg shadow-[#9146FF]/20 rounded-xl"
          >
            + Add Service
          </Button>
        </div>
      </div>

      {syncMessage && (
        <div className="px-4 py-3 rounded-xl bg-[#9146FF]/10 border border-[#9146FF]/20 text-sm text-[#9146FF] font-medium">
          {syncMessage}
        </div>
      )}

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
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-[#9146FF] uppercase tracking-wider">{svc.category}</span>
                    {svc.type && STREAMRISE_TYPES.includes(svc.type) ? (
                      <span className="text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded-md">StreamRise ({svc.type})</span>
                    ) : svc.apiId && svc.apiServiceId ? (
                      <span className="text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-md">
                        {providers.find(p => p.id === svc.apiId)?.name || "API"} #{svc.apiServiceId}
                      </span>
                    ) : svc.apiId ? (
                      <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded-md">
                        {providers.find(p => p.id === svc.apiId)?.name || "API"}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-md">No API</span>
                    )}
                  </div>
                </div>
                <Switch 
                  isSelected={svc.active} 
                  onChange={() => handleToggleService(svc.id)}
                  isDisabled={isPending}
                />
              </div>
              
              <div className="mt-auto pt-4 border-t border-[rgba(145,70,255,0.08)] grid grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">Pricing Plans</p>
                  <p className="text-lg font-black text-zinc-900 dark:text-white mt-0.5 tabular-nums">{svc.plans} Tiers</p>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">Starts At</p>
                  <p className="text-lg font-black text-zinc-900 dark:text-white mt-0.5 tabular-nums">{formatCurrency(svc.startPrice)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">Avg Markup</p>
                  <p className="text-lg font-black text-zinc-900 dark:text-white mt-0.5 tabular-nums">{formatPercent(svc.avgMarkup)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">Avg Profit</p>
                  <p className="text-lg font-black text-zinc-900 dark:text-white mt-0.5 tabular-nums">{formatCurrency(svc.avgProfit)}</p>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                {svc.costedPlanCount > 0
                  ? `Based on provider costs set for ${svc.costedPlanCount}/${svc.plans} package tiers.`
                  : "Add provider cost values in package settings to calculate markup and profit."}
              </p>

              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 font-semibold border-[rgba(145,70,255,0.15)] rounded-xl hover:border-[#9146FF]/30"
                  onPress={() => window.location.href = `/admin/services/${svc.id}/packages`}
                >
                  Edit Packages
                </Button>
                <Button 
                  variant="secondary" 
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
                    onChange={setNewServiceActive}
                    size="sm" 
                  />
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-[rgba(145,70,255,0.08)] flex justify-end gap-2">
                <Button 
                  variant="secondary" 
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

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Service Type
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm"
                  >
                    <option value="">None</option>
                    <option value="followers">Followers</option>
                    <option value="viewers">Viewers</option>
                    <option value="chat_bots">Chat Bots</option>
                    <option value="clip_views">Clip Views</option>
                    <option value="video_views">Video Views</option>
                    <option value="profile_views">Profile Views</option>
                    <option value="story_views">Story Views</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-[rgba(145,70,255,0.08)]">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">API Configuration</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                        API Provider
                      </label>
                      <select
                        value={editApiId}
                        onChange={(e) => {
                          setEditApiId(e.target.value);
                          // Clear API Service ID when switching to StreamRise
                          if (e.target.value === "streamrise") {
                            setEditApiServiceId("");
                          }
                        }}
                        className="w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm"
                      >
                        <option value="">No Provider</option>
                        {providers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} {p.isStreamRise ? "(ENV)" : `(${new URL(p.url).hostname})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {STREAMRISE_TYPES.includes(editType) && (
                      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">StreamRise Integration Active</p>
                        <p className="text-xs text-purple-600/80 dark:text-purple-400/80">
                          This service type (<strong>{editType}</strong>) is fulfilled via StreamRise. 
                          No external API provider is needed — orders are routed automatically.
                        </p>
                      </div>
                    )}

                    {editApiId ? (
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                          API Service ID
                        </label>
                        <input
                          type="text"
                          value={editApiServiceId}
                          onChange={(e) => setEditApiServiceId(e.target.value)}
                          placeholder="e.g. 8"
                          className="w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm font-mono"
                        />
                        <p className="text-xs text-zinc-500 mt-1">The service ID from the SMM panel&apos;s service list.</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-[rgba(145,70,255,0.08)] flex justify-end gap-2">
                <Button 
                  variant="secondary" 
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
