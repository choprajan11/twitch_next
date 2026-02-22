"use client";

import { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Switch, useOverlayState } from "@heroui/react";

const initialServices = [
  { id: "srv_1", name: "Twitch Followers", category: "Followers", active: true, plans: 4, sales: 1245 },
  { id: "srv_2", name: "Live Viewers", category: "Viewers", active: true, plans: 3, sales: 852 },
  { id: "srv_3", name: "Twitch Chatbot", category: "Engagement", active: false, plans: 2, sales: 341 },
  { id: "srv_4", name: "Clip Views", category: "Views", active: true, plans: 2, sales: 5092 },
];

export default function ServicesPage() {
  const [services, setServices] = useState(initialServices);
  const modalState = useOverlayState();

  const toggleService = (id: string) => {
    setServices(services.map(svc => 
      svc.id === id ? { ...svc, active: !svc.active } : svc
    ));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Services & Packages</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage the catalog of services you offer to customers.</p>
        </div>
        <Button 
          onPress={modalState.open}
          style={{ backgroundColor: '#9146FF', color: 'white' }} 
          className="font-bold shadow-[#9146FF]/30"
        >
          + Add Service
        </Button>
      </div>

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
                onValueChange={() => toggleService(svc.id)}
                color="secondary"
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

      <Modal.Root state={modalState}>
        <Modal.Backdrop />
        <Modal.Container placement="top">
          <Modal.Dialog>
            <Modal.Header className="flex flex-col gap-1 text-zinc-900 dark:text-white">Create New Service</Modal.Header>
            <Modal.Body>
              <Input
                autoFocus
                label="Service Name"
                placeholder="e.g. Channel Subscriptions"
                variant="bordered"
              />
              <Input
                label="Category"
                placeholder="e.g. Engagement"
                variant="bordered"
              />
              <div className="flex items-center justify-between mt-2 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Set Active Immediately</span>
                  <Switch defaultSelected color="secondary" size="sm" />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button color="danger" variant="flat" onPress={modalState.close}>
                Cancel
              </Button>
              <Button style={{ backgroundColor: '#9146FF', color: 'white' }} onPress={modalState.close}>
                Create Service
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Root>

    </div>
  );
}