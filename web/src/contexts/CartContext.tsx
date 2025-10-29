import { createContext, useContext, useState, ReactNode } from 'react';
import { ServicePackage, Addon } from '../lib/supabase';

export interface ServiceConfiguration {
  eventDate: string;
  guestCount: string;
  startTime: string;
  endTime: string;
}

interface CartContextType {
  selectedPackage: ServicePackage | null;
  selectedAddons: Addon[];
  serviceConfig: ServiceConfiguration;
  setSelectedPackage: (pkg: ServicePackage | null) => void;
  addAddon: (addon: Addon) => void;
  removeAddon: (addonId: string) => void;
  setServiceConfig: (config: ServiceConfiguration) => void;
  clearCart: () => void;
  getTotal: () => number;
  getPriceMultiplier: () => number;
  isCartExpanded: boolean;
  setIsCartExpanded: (expanded: boolean) => void;
  toggleCart: () => void;
  isCartCollapsed: boolean;
  setIsCartCollapsed: (collapsed: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [isCartCollapsed, setIsCartCollapsed] = useState(false);
  const [serviceConfig, setServiceConfig] = useState<ServiceConfiguration>({
    eventDate: '',
    guestCount: '',
    startTime: '17:00',
    endTime: '22:00',
  });

  const addAddon = (addon: Addon) => {
    if (!selectedAddons.find(a => a.id === addon.id)) {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const removeAddon = (addonId: string) => {
    setSelectedAddons(selectedAddons.filter(a => a.id !== addonId));
  };

  const clearCart = () => {
    setSelectedPackage(null);
    setSelectedAddons([]);
  };

  const calculateDuration = () => {
    if (!serviceConfig.startTime || !serviceConfig.endTime) return 0;

    const [startHour, startMin] = serviceConfig.startTime.split(':').map(Number);
    const [endHour, endMin] = serviceConfig.endTime.split(':').map(Number);

    let duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    if (duration < 0) duration += 24 * 60;

    return duration / 60;
  };

  const getPriceMultiplier = () => {
    let multiplier = 1;

    if (serviceConfig.guestCount) {
      const guestRange = serviceConfig.guestCount;
      if (guestRange === '51-75') multiplier += 0.15;
      else if (guestRange === '76-100') multiplier += 0.3;
      else if (guestRange === '101-150') multiplier += 0.5;
      else if (guestRange === '151+') multiplier += 0.75;
    }

    const duration = calculateDuration();
    if (duration >= 5) multiplier += 0.2;
    if (duration >= 6) multiplier += 0.15;
    if (duration >= 7) multiplier += 0.15;

    return multiplier;
  };

  const getTotal = () => {
    const multiplier = getPriceMultiplier();
    const packagePrice = selectedPackage?.price || 0;
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return Math.round((packagePrice + addonsTotal) * multiplier);
  };

  const toggleCart = () => {
    setIsCartExpanded(!isCartExpanded);
  };

  return (
    <CartContext.Provider
      value={{
        selectedPackage,
        selectedAddons,
        serviceConfig,
        setSelectedPackage,
        addAddon,
        removeAddon,
        setServiceConfig,
        clearCart,
        getTotal,
        getPriceMultiplier,
        isCartExpanded,
        setIsCartExpanded,
        toggleCart,
        isCartCollapsed,
        setIsCartCollapsed,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
