import { createContext, useContext, useState, ReactNode } from 'react';

interface LocationContextType {
  currentLocationId: string;
  setCurrentLocationId: (id: string) => void;
  currentLocationName: string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocationId, setCurrentLocationId] = useState<string>('all');
  
  // Get location name based on ID
  const getLocationName = (id: string) => {
    if (id === 'all') return 'All Locations';
    // Import dynamically to avoid circular dependency
    return 'Selected Location';
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocationId,
        setCurrentLocationId,
        currentLocationName: getLocationName(currentLocationId),
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
