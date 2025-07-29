import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { Text, Title, Avatar } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";

export default function PerfilScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Avatar.Text
            label={user?.name?.charAt(0).toUpperCase() || "U"}
            size={80}
            style={styles.avatar}
            color="#0b0f8b"
          />
          <Title style={styles.title}>Olá, {user?.name || "usuário"}!</Title>

          <View style={styles.infoBox}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.value}>{user?.name || "-"}</Text>

            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{user?.email || "-"}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "#0b0f8b",
    alignItems: "center",
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomEndRadius: 24,
    borderBottomStartRadius: 24,
    marginTop: 12,
    marginBottom: 50,
  },
  avatar: {
    backgroundColor: "#ffffff",
    marginTop: 24,
  },
  title: {
    color: "#ffffff",
    marginTop: 16,
    fontSize: 22,
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginTop: 32,
    width: "100%",
  },
  label: {
    color: "#6370f5",
    fontWeight: "bold",
    marginTop: 12,
    fontSize: 14,
  },
  value: {
    color: "#000000",
    fontSize: 16,
  },
});
