import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Appbar, Text, List, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../types/navigation";
import OrderService, { Order } from "../services/OrderService";
import { useAuth } from "../contexts/AuthContext";

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export default function HistoricoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      OrderService.getOrders(user.email).then(setOrders);
    }
  }, []);

  function formatarMetodo(metodo?: string) {
    if (!metodo) return "Método não informado";
    switch (metodo) {
      case "credit_card":
        return "Cartão de Crédito";
      case "pix":
        return "PIX";
      case "cash":
        return "Dinheiro";
      default:
        return metodo.toUpperCase();
    }
  }

  const renderItem = ({ item }: { item: Order }) => (
    <List.Item
      title={`Pedido em ${new Date(item.createdAt).toLocaleDateString()}`}
      description={`Total: R$ ${item.total.toFixed(2)} - ${formatarMetodo(
        item.paymentMethod
      )}`}
      onPress={() =>
        navigation.navigate("Pedido", {
          screen: "DetalhesPedido",
          params: { pedido: item },
        })
      }
    />
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Histórico de Pedidos" />
      </Appbar.Header>

      <View style={styles.container}>
        {orders.length === 0 ? (
          <Text>Nenhum pedido encontrado.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Divider />}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
