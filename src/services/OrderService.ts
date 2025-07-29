import AsyncStorage from "@react-native-async-storage/async-storage";

export type Order = {
  id: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  paymentMethod: string;
  cardNumber?: string;
  deliveryMethod: "delivery" | "pickup";
  address?: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
  };
  createdAt: string;
};

export default class OrderService {
  // Salva o pedido no AsyncStorage usando o email do usuário como chave
  static async saveOrder(userEmail: string, order: Order): Promise<void> {
    try {
      const key = `orders:${userEmail}`;
      const existing = await AsyncStorage.getItem(key);
      const orders = existing ? JSON.parse(existing) : [];

      orders.push(order);
      await AsyncStorage.setItem(key, JSON.stringify(orders));
    } catch (error: any) {
      throw new Error("Erro ao salvar pedido");
    }
  }

  static async getOrders(userEmail: string): Promise<Order[]> {
    const key = `orders:${userEmail}`;
    const existing = await AsyncStorage.getItem(key);
    return existing ? JSON.parse(existing) : [];
  }

  static async clearOrders(userEmail: string): Promise<void> {
    const key = `orders:${userEmail}`;
    await AsyncStorage.removeItem(key);
  }
}
