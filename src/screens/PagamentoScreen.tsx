import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Appbar,
  Button,
  RadioButton,
  Text,
  TextInput,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PedidoStackParamList } from "../types/navigation";
import { usePayment } from "../contexts/PaymentContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = NativeStackNavigationProp<PedidoStackParamList>;

export default function PagamentoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { setPaymentInfo } = usePayment();

  const [metodo, setMetodo] = useState("cartao");
  const [numero, setNumero] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [temCartaoSalvo, setTemCartaoSalvo] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("savedCard").then((json) => {
      if (json) setTemCartaoSalvo(true);
    });
  }, []);

  const formatCardNumber = (text: string) => {
    const digits = text.replace(/\D/g, "");
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(" ").slice(0, 19);
  };

  const formatExpiry = (text: string) => {
    const digits = text.replace(/\D/g, "");
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`.slice(0, 5);
    }
    return digits;
  };

  const isCartaoValido =
    metodo !== "cartao" ||
    (numero.replace(/\s/g, "").length === 16 &&
      validade.length === 5 &&
      cvv.length === 3);

  // Preenche os campos com os dados do cartão salvos localmente
  const preencherComCartaoSalvo = async () => {
    const json = await AsyncStorage.getItem("savedCard");
    if (json) {
      const saved = JSON.parse(json);
      setNumero(formatCardNumber(saved.cardNumber));
      setValidade(saved.expiry);
      setCvv(saved.cvv);
    }
  };

  const handleAvancar = () => {
    if (!isCartaoValido) return;

    setPaymentInfo({
      method:
        metodo === "cartao" ? "credit_card" : metodo === "pix" ? "pix" : "cash",
      cardNumber: numero.replace(/\s/g, ""),
      expiry: validade,
      cvv: cvv,
    });

    navigation.navigate("Endereco");
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Pagamento" />
      </Appbar.Header>

      <View style={styles.container}>
        <Text style={styles.label}>Escolha o método de pagamento:</Text>
        <RadioButton.Group onValueChange={setMetodo} value={metodo}>
          <RadioButton.Item label="Cartão de Crédito" value="cartao" />
          <RadioButton.Item label="PIX" value="pix" />
          <RadioButton.Item label="Dinheiro" value="dinheiro" />
        </RadioButton.Group>

        {metodo === "cartao" && (
          <View>
            {temCartaoSalvo && (
              <Button
                mode="outlined"
                style={styles.buttonSalvo}
                onPress={preencherComCartaoSalvo}
              >
                Usar cartão salvo
              </Button>
            )}

            <TextInput
              label="Número do Cartão"
              value={numero}
              onChangeText={(text) => setNumero(formatCardNumber(text))}
              keyboardType="numeric"
              maxLength={19}
              style={styles.input}
            />
            <TextInput
              label="Validade (MM/AA)"
              value={validade}
              onChangeText={(text) => setValidade(formatExpiry(text))}
              keyboardType="numeric"
              maxLength={5}
              style={styles.input}
            />
            <TextInput
              label="CVV"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              maxLength={3}
              style={styles.input}
            />
          </View>
        )}

        <Button
          mode="contained"
          buttonColor="#0b0f8b"
          textColor="#ffffff"
          onPress={handleAvancar}
          disabled={!isCartaoValido}
        >
          Avançar
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  buttonSalvo: {
    marginBottom: 12,
  },
});
