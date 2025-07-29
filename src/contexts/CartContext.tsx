import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { ProductInCart } from "../types/Product";

type CartContextType = {
  cartItems: ProductInCart[];
  addToCart: (product: ProductInCart | Omit<ProductInCart, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<ProductInCart[]>([]);

  const storageKey = user?.email ? `@cart_${user.email}` : null;

  useEffect(() => {
    if (storageKey) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [storageKey]);

  const loadCart = async () => {
    if (!storageKey) return;
    const data = await AsyncStorage.getItem(storageKey);
    if (data) {
      setCartItems(JSON.parse(data));
    } else {
      setCartItems([]);
    }
  };

  const saveCart = async (items: ProductInCart[]) => {
    if (!storageKey) return;
    await AsyncStorage.setItem(storageKey, JSON.stringify(items));
  };

  const addToCart = (
    product: ProductInCart | Omit<ProductInCart, "quantity">
  ) => {
    const existing = cartItems.find((p) => p.id === product.id);
    const updated = existing
      ? cartItems.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      : [...cartItems, { ...product, quantity: 1 }];

    setCartItems(updated);
    saveCart(updated);
  };

  const removeFromCart = (id: string) => {
    const updated = cartItems.filter((p) => p.id !== id);
    setCartItems(updated);
    saveCart(updated);
  };

  const updateQuantity = (id: string, quantity: number) => {
    const updated = cartItems.map((p) =>
      p.id === id ? { ...p, quantity } : p
    );
    setCartItems(updated);
    saveCart(updated);
  };

  const clearCart = async () => {
    setCartItems([]);
    if (storageKey) {
      await AsyncStorage.removeItem(storageKey);
    }
  };

  const getTotal = (): number => {
    return cartItems.reduce(
      (sum: number, item) => sum + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
