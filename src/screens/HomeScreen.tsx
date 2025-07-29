import React, { useEffect, useState, useRef } from "react";
import { FlatList, View, StyleSheet, ActivityIndicator } from "react-native";
import ProductCard from "../components/ProductCard";
import { ProductService } from "../services/ProductService";
import { Product } from "../types/Product";
import { Text, Appbar, Menu, Searchbar } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../types/navigation";

const PAGE_SIZE = 10;

export default function HomeScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const shuffledProductsRef = useRef<Product[]>([]);

  const [sortVisible, setSortVisible] = useState(false);
  const [sortOption, setSortOption] = useState<
    "name" | "priceAsc" | "priceDesc"
  >("name");

  const [menuVisible, setMenuVisible] = useState(false);

  const { signOut } = useAuth();
  const { addToCart } = useCart();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  useEffect(() => {
    ProductService.getAll().then((data) => {
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      shuffledProductsRef.current = shuffled;
      setAllProducts(shuffled);
      setVisibleProducts(paginate(shuffled, 1));
      setLoading(false);
    });
  }, []);

  const loadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const nextItems = paginate(shuffledProductsRef.current, nextPage);

    setVisibleProducts((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const uniqueNextItems = nextItems.filter(
        (item) => !existingIds.has(item.id)
      );
      return [...prev, ...uniqueNextItems];
    });

    setPage(nextPage);
    setLoadingMore(false);
  };

  const sortProducts = (
    products: Product[],
    option: "name" | "priceAsc" | "priceDesc"
  ) => {
    const sorted = [...products];
    switch (option) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "priceAsc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.price - a.price);
        break;
    }
    return sorted;
  };

  const paginate = (products: Product[], page: number) => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return products.slice(start, end);
  };

  const handleSortChange = (option: "name" | "priceAsc" | "priceDesc") => {
    setSortVisible(false);
    setSortOption(option);
    const sorted = sortProducts(allProducts, option);
    setVisibleProducts(paginate(sorted, 1));
    setPage(1);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Toast.show({
      type: "success",
      text1: `${product.name} adicionado ao carrinho`,
      text2: "Confira o carrinho para finalizar a compra",
      position: "bottom",
      visibilityTime: 4000,
    });
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    const sorted = sortProducts(filtered, sortOption);
    setVisibleProducts(paginate(sorted, 1));
    setPage(1);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <>
      <Appbar.Header style={{ backgroundColor: "#0b0f8b", elevation: 4 }}>
        <Appbar.Content
          title="Vitrine"
          titleStyle={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
          }}
        />

        <Appbar.Action
          icon="sort"
          color="white"
          onPress={() => setSortVisible(true)}
          accessibilityLabel="Ordenar"
        />

        <Appbar.Action
          icon="account"
          color="white"
          onPress={() => setMenuVisible(true)}
          accessibilityLabel="Perfil"
        />
      </Appbar.Header>

      <Menu
        visible={sortVisible}
        onDismiss={() => setSortVisible(false)}
        anchor={{ x: 400, y: 20 }}
      >
        <Menu.Item
          onPress={() => handleSortChange("name")}
          title="Nome (A-Z)"
        />
        <Menu.Item
          onPress={() => handleSortChange("priceAsc")}
          title="Preço (Menor > Maior)"
        />
        <Menu.Item
          onPress={() => handleSortChange("priceDesc")}
          title="Preço (Maior > Menor)"
        />
      </Menu>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 400, y: 20 }}
      >
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate("Historico");
          }}
          title="Histórico de Pedidos"
          leadingIcon="history"
        />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate("Perfil");
          }}
          title="Perfil"
          leadingIcon="account-circle"
        />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            signOut();
          }}
          title="Sair"
          leadingIcon="logout"
        />
      </Menu>

      <View style={{ padding: 12, backgroundColor: "#fff" }}>
        <Searchbar
          placeholder="Buscar tênis..."
          value={search}
          onChangeText={handleSearch}
          style={{ borderRadius: 12 }}
        />
      </View>

      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onAddToCart={() => handleAddToCart(item)}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={8}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ marginVertical: 16 }} />
          ) : null
        }
        contentContainerStyle={styles.container}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 64,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
