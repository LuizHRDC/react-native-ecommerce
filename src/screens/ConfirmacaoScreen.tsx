import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Text, Button } from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PedidoStackParamList } from "../types/navigation";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import OrderService, { Order } from "../services/OrderService";

export default function ConfirmacaoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<RouteProp<PedidoStackParamList, "Confirmacao">>();
  const { clearCart, cartItems, getTotal } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const save = async () => {
      try {
        if (!route || !route.params) return;

        const { paymentMethod, address, deliveryMethod, cardNumber } =
          route.params as PedidoStackParamList["Confirmacao"];

        const novoPedido: Order = {
          id: Date.now().toString(),
          items: cartItems,
          total: getTotal(),
          paymentMethod,
          cardNumber,
          deliveryMethod,
          address,
          createdAt: new Date().toISOString(),
        };

        await OrderService.saveOrder(user!.email, novoPedido);
        clearCart();
      } catch (e) {
        console.error("Erro ao salvar pedido:", e);
      }
    };

    save();
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Pedido Confirmado" />
      </Appbar.Header>

      <View style={styles.container}>
        <Text style={styles.title}>✅ Pedido Realizado com Sucesso!</Text>
        <Text style={styles.subtitle}>
          Você pode acompanhar os detalhes no seu histórico.
        </Text>

        <Button
          mode="contained"
          style={styles.button}
          buttonColor="#0b0f8b"
          textColor="#ffffff"
          onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
        >
          Fazer Novo Pedido
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    marginTop: 16,
    width: "100%",
  },
});
