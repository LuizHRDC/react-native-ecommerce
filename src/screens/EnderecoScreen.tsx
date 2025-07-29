import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text, Button, RadioButton, Appbar, Card } from "react-native-paper";
import { useAddress } from "../contexts/AddressContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";
import { Endereco } from "../types/Endereco";

export default function AddressScreen({ navigation }: any) {
  const { setAddressInfo } = useAddress();
  const { user } = useAuth();

  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
    "delivery"
  );

  const [enderecosSalvos, setEnderecosSalvos] = useState<Endereco[]>([]);

  const [address, setAddress] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const isValid = () => {
    if (deliveryMethod === "pickup") return true;
    return (
      address.rua.trim() &&
      address.numero.trim() &&
      address.bairro.trim() &&
      address.cidade.trim() &&
      address.cep.trim() &&
      address.estado.trim()
    );
  };

  const salvarEndereco = async () => {
    const novoEndereco: Endereco = {
      id: Date.now().toString(),
      ...address,
    };

    const novaLista = [...enderecosSalvos, novoEndereco];
    setEnderecosSalvos(novaLista);
    await AsyncStorage.setItem(
      `@enderecos:${user?.email}`,
      JSON.stringify(novaLista)
    );
  };

  const carregarEnderecos = async () => {
    const json = await AsyncStorage.getItem(`@enderecos:${user?.email}`);
    if (json) {
      const lista = JSON.parse(json) as Endereco[];
      setEnderecosSalvos(lista);
    }
  };

  useEffect(() => {
    if (user?.email) carregarEnderecos();
  }, [user]);

  const handleNext = async () => {
    if (deliveryMethod === "delivery") {
      await salvarEndereco();
    }

    setAddressInfo({
      deliveryMethod,
      street: address.rua,
      number: address.numero,
      district: address.bairro,
      city: address.cidade,
      zipCode: address.cep,
    });

    navigation.navigate("Resumo");
  };

  const preencherComEndereco = (e: Endereco) => {
    setAddress({
      rua: e.rua,
      numero: e.numero,
      bairro: e.bairro,
      cidade: e.cidade,
      estado: e.estado,
      cep: e.cep,
    });
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Entrega ou Retirada" />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Escolha o método:</Text>
          <RadioButton.Group
            onValueChange={(value) => setDeliveryMethod(value as any)}
            value={deliveryMethod}
          >
            <View style={styles.radioOption}>
              <RadioButton value="delivery" />
              <Text>Entrega em casa</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="pickup" />
              <Text>Retirar na loja</Text>
            </View>
          </RadioButton.Group>

          {deliveryMethod === "delivery" && (
            <>
              <TextInput
                placeholder="Rua"
                value={address.rua}
                onChangeText={(t) => setAddress({ ...address, rua: t })}
                style={styles.input}
              />
              <TextInput
                placeholder="Número"
                value={address.numero}
                onChangeText={(t) => setAddress({ ...address, numero: t })}
                style={styles.input}
              />
              <TextInput
                placeholder="Bairro"
                value={address.bairro}
                onChangeText={(t) => setAddress({ ...address, bairro: t })}
                style={styles.input}
              />
              <TextInput
                placeholder="Cidade"
                value={address.cidade}
                onChangeText={(t) => setAddress({ ...address, cidade: t })}
                style={styles.input}
              />
              <TextInput
                placeholder="Estado"
                value={address.estado}
                onChangeText={(t) => setAddress({ ...address, estado: t })}
                style={styles.input}
              />
              <TextInput
                placeholder="CEP"
                keyboardType="numeric"
                value={address.cep}
                onChangeText={(t) => setAddress({ ...address, cep: t })}
                style={styles.input}
              />

              {enderecosSalvos.length > 0 && (
                <>
                  <Text style={styles.label}>Endereços salvos:</Text>
                  {enderecosSalvos.map((e) => (
                    <Card
                      key={e.id}
                      style={styles.card}
                      onPress={() => preencherComEndereco(e)}
                    >
                      <Card.Title title={`${e.rua}, ${e.numero}`} />
                    </Card>
                  ))}
                </>
              )}
            </>
          )}

          <Button
            mode="contained"
            buttonColor="#0b0f8b"
            textColor="#ffffff"
            onPress={handleNext}
            disabled={!isValid()}
            style={{ marginTop: 24 }}
          >
            Continuar
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  card: {
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
});
