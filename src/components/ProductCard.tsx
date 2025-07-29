import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { Product } from "../types/Product";
import { getImage } from "../utils/getImage";

type Props = {
  product: Product;
  onAddToCart: () => void;
};

export default function ProductCard({ product, onAddToCart }: Props) {
  return (
    <Card style={styles.card}>
      <Image
        source={getImage(product.image)}
        style={styles.image}
        resizeMode="cover"
      />
      <Card.Content>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          buttonColor="#0b0f8b"
          textColor="#ffffff"
          onPress={onAddToCart}
        >
          Adicionar ao Carrinho
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  name: {
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 16,
  },
  price: {
    color: "#0b0f8b",
    marginTop: 4,
    marginBottom: 8,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#f0f0f0",
  },
});
