import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text, Button, Card, Appbar, Divider } from "react-native-paper";
import { useCart } from "../contexts/CartContext";
import Toast from "react-native-toast-message";
import { getImage } from "../utils/getImage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../types/navigation";

export default function CartScreen() {
  const { cartItems, removeFromCart, updateQuantity, getTotal } = useCart();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const renderItem = ({ item }: any) => (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Image source={getImage(item.image)} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>

          <View style={styles.quantityRow}>
            <TouchableOpacity
              onPress={() =>
                updateQuantity(item.id, Math.max(1, item.quantity - 1))
              }
              style={styles.qtyButton}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                removeFromCart(item.id);
                Toast.show({
                  type: "info",
                  text1: "Produto removido",
                  text2: `${item.name} foi removido do carrinho`,
                  position: "bottom",
                });
              }}
              style={{ marginLeft: 16 }}
            >
              <Text style={{ color: "red" }}>Remover</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Carrinho" />
      </Appbar.Header>

      {cartItems.length === 0 ? (
        <View style={styles.centered}>
          <Text>Seu carrinho está vazio.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => (
              <Divider style={{ marginVertical: 8 }} />
            )}
          />
          <View style={styles.footer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>R$ {getTotal().toFixed(2)}</Text>
            <Button
              mode="contained"
              style={{ marginTop: 12 }}
              buttonColor="#0b0f8b"
              textColor="#ffffff"
              onPress={() =>
                navigation.navigate("Pedido", { screen: "Pagamento" })
              }
            >
              Finalizar Compra
            </Button>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 8,
  },
  content: {
    flexDirection: "row",
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    marginTop: 4,
    color: "#333",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  qtyValue: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  list: {
    padding: 16,
    paddingBottom: 96,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A0A6A",
  },
});
