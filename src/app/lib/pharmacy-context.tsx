import { createContext, useContext, useState, ReactNode } from "react";
import { mockLocations } from "./data";

export type PharmacyLocation = (typeof mockLocations)[number] & { type: "Pharmacy" };

const pharmacyLocations = mockLocations.filter(
  (l): l is PharmacyLocation => l.type === "Pharmacy"
);

interface PharmacyContextType {
  selectedPharmacyId: string;
  setSelectedPharmacyId: (id: string) => void;
  pharmacyLocations: PharmacyLocation[];
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export function PharmacyProvider({ children }: { children: ReactNode }) {
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>("all");

  return (
    <PharmacyContext.Provider
      value={{
        selectedPharmacyId,
        setSelectedPharmacyId,
        pharmacyLocations,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
}

export function usePharmacy() {
  const context = useContext(PharmacyContext);
  if (context === undefined) {
    throw new Error("usePharmacy must be used within a PharmacyProvider");
  }
  return context;
}
