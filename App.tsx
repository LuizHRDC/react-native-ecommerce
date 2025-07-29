import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import AppNavigation from "./src/navigation/AppNavigation";
import { AuthProvider } from "./src/contexts/AuthContext";
import { CartProvider } from "./src/contexts/CartContext";
import { PaymentProvider } from "./src/contexts/PaymentContext";
import { AddressProvider } from "./src/contexts/AddressContext";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <CartProvider>
            <PaymentProvider>
              <AddressProvider>
                <StatusBar style="auto" />
                <AppNavigation />
                <Toast />
              </AddressProvider>
            </PaymentProvider>
          </CartProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
