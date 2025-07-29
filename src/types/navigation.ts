import { NavigatorScreenParams } from "@react-navigation/native";
import { Order } from "../services/OrderService";

// Rotas da pilha de autenticação
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Rotas das abas principais (acesso após login)
export type BottomTabParamList = {
  Home: undefined;
  Cart: undefined;
};

// Navegação principal para usuários logados
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  Pedido: NavigatorScreenParams<PedidoStackParamList>;
  Perfil: undefined;
  Historico: undefined;
  DetalhesPedido: { pedido: Order };
};

// Fluxo completo do processo de pedido
export type PedidoStackParamList = {
  Endereco: undefined;
  Pagamento: undefined;
  Resumo: undefined;
  Confirmacao: {
    paymentMethod: string;
    deliveryMethod: "delivery" | "pickup";
    cardNumber?: string;
    address: {
      rua: string;
      numero: string;
      bairro: string;
      cidade: string;
      cep: string;
    };
  };
  PIX: {
    total: number;
    paymentMethod: string;
    deliveryMethod: "delivery" | "pickup";
    cardNumber?: string;
    address: {
      rua: string;
      numero: string;
      bairro: string;
      cidade: string;
      cep: string;
    };
  };
  Historico: undefined;
  DetalhesPedido: {
    pedido: Order;
  };
};
