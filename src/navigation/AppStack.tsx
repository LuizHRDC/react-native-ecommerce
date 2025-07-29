import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import PedidoStack from "./PedidoStack";
import type { AppStackParamList } from "../types/navigation";
import HistoricoScreen from "../screens/HistoricoScreen";
import DetalhesPedidoScreen from "../screens/DetalhesPedidoScreen";
import PerfilScreen from "../screens/PerfilScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Pedido" component={PedidoStack} />
      <Stack.Screen name="Historico" component={HistoricoScreen} />
      <Stack.Screen name="DetalhesPedido" component={DetalhesPedidoScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
    </Stack.Navigator>
  );
}
