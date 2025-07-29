import React from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import { Appbar, Text, Divider } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import type { PedidoStackParamList } from "../types/navigation";
import { Order } from "../services/OrderService";

type RouteParams = RouteProp<PedidoStackParamList, "DetalhesPedido">;

export default function DetalhesPedidoScreen() {
  const route = useRoute<RouteParams>();
  const { pedido } = route.params;

  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemDetails}>
        {item.quantity}x R$ {item.price.toFixed(2)} = R${" "}
        {(item.quantity * item.price).toFixed(2)}
      </Text>
    </View>
  );

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

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Detalhes do Pedido" />
      </Appbar.Header>

      <View style={styles.container}>
        <Text style={styles.section}>
          Data: {new Date(pedido.createdAt).toLocaleString()}
        </Text>
        <Text style={styles.section}>
          Pagamento: {formatarMetodo(pedido.paymentMethod)}
        </Text>
        <Text style={styles.section}>
          Entrega:{" "}
          {pedido.deliveryMethod === "delivery" ? "Entrega" : "Retirar na Loja"}
        </Text>

        {pedido.deliveryMethod === "delivery" && pedido.address && (
          <Text style={styles.section}>
            Endereço: {pedido.address.rua}, {pedido.address.numero} -{" "}
            {pedido.address.bairro}, {pedido.address.cidade} -{" "}
            {pedido.address.cep}
          </Text>
        )}

        <Text style={styles.sectionTitle}>Produtos:</Text>
        <FlatList
          data={pedido.items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={{ paddingBottom: 80 }}
        />

        <View style={styles.totalContainer}>
          <Text style={styles.total}>Total: R$ {pedido.total.toFixed(2)}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  section: {
    fontSize: 14,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 12,
  },
  item: {
    marginVertical: 12,
    gap: 6,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDetails: {
    color: "#666",
    fontSize: 14,
  },
  totalContainer: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
    alignItems: "flex-start",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A0A6A",
    bottom: 60,
  },
});
