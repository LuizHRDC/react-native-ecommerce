import React from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Text, Appbar, Button, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PedidoStackParamList } from "../types/navigation";

import { useCart } from "../contexts/CartContext";
import { usePayment } from "../contexts/PaymentContext";
import { useAddress } from "../contexts/AddressContext";
import { useAuth } from "../contexts/AuthContext";

type NavigationProp = NativeStackNavigationProp<PedidoStackParamList>;

export default function ResumoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { cartItems, getTotal } = useCart();
  const { paymentInfo } = usePayment();
  const { addressInfo } = useAddress();
  const { user } = useAuth();

  const handleConfirmarPedido = async () => {
    const isEntrega = addressInfo?.deliveryMethod === "delivery";

    if (
      !user?.email ||
      !paymentInfo ||
      !addressInfo ||
      (isEntrega &&
        (!addressInfo.street ||
          !addressInfo.number ||
          !addressInfo.district ||
          !addressInfo.city ||
          !addressInfo.zipCode))
    ) {
      Alert.alert("Erro", "Preencha todos os dados obrigatórios para entrega.");
      return;
    }

    if (
      paymentInfo.method === "cash" &&
      addressInfo.deliveryMethod === "delivery"
    ) {
      Alert.alert(
        "Forma de Entrega Inválida",
        "Pagamentos em dinheiro só são permitidos para retirada na loja."
      );
      return; // Regra de negócio: pagamento em dinheiro só é permitido para retirada na loja
    }

    const deliveryMapped: "delivery" | "pickup" = isEntrega
      ? "delivery"
      : "pickup";

    const address = isEntrega
      ? {
          rua: addressInfo.street!,
          numero: addressInfo.number!,
          bairro: addressInfo.district!,
          cidade: addressInfo.city!,
          cep: addressInfo.zipCode!,
        }
      : {
          rua: "Retirada na loja",
          numero: "-",
          bairro: "-",
          cidade: "-",
          cep: "-",
        };

    if (paymentInfo.method === "pix") {
      navigation.navigate("PIX", {
        total: getTotal(),
        paymentMethod: paymentInfo.method,
        deliveryMethod: deliveryMapped,
        cardNumber: paymentInfo.cardNumber,
        address,
      });
    } else {
      navigation.navigate("Confirmacao", {
        paymentMethod: paymentInfo.method,
        deliveryMethod: deliveryMapped,
        cardNumber: paymentInfo.cardNumber,
        address,
      });
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemDetails}>
        {item.quantity}x R$ {item.price.toFixed(2)} ={" "}
        <Text style={{ fontWeight: "bold" }}>
          R$ {(item.quantity * item.price).toFixed(2)}
        </Text>
      </Text>
    </View>
  );

  const enderecoFormatado =
    addressInfo?.deliveryMethod === "delivery"
      ? `${addressInfo.street}, ${addressInfo.number} - ${addressInfo.district}, ${addressInfo.city}/${addressInfo.zipCode}`
      : "Retirar na loja";

  const formaPagamento =
    paymentInfo?.method === "credit_card"
      ? `Cartão de Crédito **** ${paymentInfo.cardNumber?.slice(-4)}`
      : paymentInfo?.method === "pix"
      ? "PIX"
      : "Dinheiro";

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Resumo do Pedido" />
      </Appbar.Header>

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Produtos:</Text>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <Divider style={{ marginVertical: 6 }} />
          )}
        />

        <Text style={styles.sectionTitle}>Endereço de Entrega:</Text>
        <Text style={styles.info}>{enderecoFormatado}</Text>

        <Text style={styles.sectionTitle}>Forma de Pagamento:</Text>
        <Text style={styles.info}>{formaPagamento}</Text>

        <Text style={styles.total}>
          Total:{" "}
          <Text style={{ color: "#0A0A6A" }}>R$ {getTotal().toFixed(2)}</Text>
        </Text>

        <Button
          mode="contained"
          style={styles.button}
          buttonColor="#0b0f8b"
          textColor="#ffffff"
          onPress={handleConfirmarPedido}
        >
          Confirmar Pedido
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  item: {
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 15,
  },
  itemDetails: {
    color: "#666",
  },
  info: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  button: {
    marginBottom: 50,
  },
});
