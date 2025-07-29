import React from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { Appbar, Text, Button } from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PedidoStackParamList } from "../types/navigation";
import * as Clipboard from "expo-clipboard";

type NavigationProp = NativeStackNavigationProp<PedidoStackParamList>;

export default function PIXScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<PedidoStackParamList, "PIX">>();
  const valor = route.params.total.toFixed(2);

  const codigoPIX = "CODIGO-PIX-EXEMPLO-1234567890"; // Simulação de código PIX

  const copiarCodigo = async () => {
    await Clipboard.setStringAsync(codigoPIX);
    Alert.alert(
      "Código copiado!",
      "O código PIX foi copiado para a área de transferência."
    );
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Pagamento via PIX" />
      </Appbar.Header>
      <View style={styles.container}>
        <Text style={styles.title}>Escaneie o QR Code abaixo</Text>
        <Image
          source={require("../../assets/qrcodeFake.png")} // Imagem de QR Code estático para simulação visual
          style={styles.qrCode}
        />

        <Text style={styles.codigo} onPress={copiarCodigo}>
          Copiar código PIX
        </Text>

        <Text style={styles.valor}>Valor: R$ {valor}</Text>

        <Button
          mode="text"
          onPress={() =>
            navigation.navigate("Confirmacao", {
              paymentMethod: route.params.paymentMethod,
              deliveryMethod: route.params.deliveryMethod,
              cardNumber: route.params.cardNumber,
              address: route.params.address!,
            })
          }
        >
          Pular Simulação
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  valor: {
    fontSize: 16,
    color: "#333",
  },
  qrCode: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  codigo: {
    color: "#0A0A6A",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
