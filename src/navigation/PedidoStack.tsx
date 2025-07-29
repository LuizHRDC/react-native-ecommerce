import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EnderecoScreen from "../screens/EnderecoScreen";
import PagamentoScreen from "../screens/PagamentoScreen";
import ResumoScreen from "../screens/ResumoScreen";
import ConfirmacaoScreen from "../screens/ConfirmacaoScreen";
import PIXScreen from "../screens/PIXScreen";
import HistoricoScreen from "../screens/HistoricoScreen";
import DetalhesPedidoScreen from "../screens/DetalhesPedidoScreen";
import type { PedidoStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<PedidoStackParamList>();

export default function PedidoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Endereco" component={EnderecoScreen} />
      <Stack.Screen name="Pagamento" component={PagamentoScreen} />
      <Stack.Screen name="Resumo" component={ResumoScreen} />
      <Stack.Screen name="Confirmacao" component={ConfirmacaoScreen} />
      <Stack.Screen name="PIX" component={PIXScreen} />
      <Stack.Screen name="Historico" component={HistoricoScreen} />
      <Stack.Screen name="DetalhesPedido" component={DetalhesPedidoScreen} />
    </Stack.Navigator>
  );
}
