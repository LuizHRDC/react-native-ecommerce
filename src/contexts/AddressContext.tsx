import React, { createContext, useContext, useState, ReactNode } from "react";

interface AddressInfo {
  deliveryMethod: "delivery" | "pickup";
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  zipCode?: string;
}

interface AddressContextType {
  addressInfo: AddressInfo | null;
  setAddressInfo: (info: AddressInfo) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);

  return (
    <AddressContext.Provider value={{ addressInfo, setAddressInfo }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress deve ser usado dentro de um AddressProvider");
  }
  return context;
}
