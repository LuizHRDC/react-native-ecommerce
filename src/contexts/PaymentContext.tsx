import React, { createContext, useContext, useState, ReactNode } from "react";

type PaymentMethod = "credit_card" | "pix" | "cash";

interface PaymentInfo {
  method: PaymentMethod;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

interface PaymentContextType {
  paymentInfo: PaymentInfo | null;
  setPaymentInfo: (info: PaymentInfo) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  return (
    <PaymentContext.Provider value={{ paymentInfo, setPaymentInfo }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment deve ser usado dentro de um PaymentProvider");
  }
  return context;
}
