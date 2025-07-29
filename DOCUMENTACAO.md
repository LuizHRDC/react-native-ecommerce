# 📄 DOCUMENTACAO.md

## 🛒 Aplicativo de E-commerce - React Native (Desafio Técnico Macle)

---

### 📌 Objetivo do Projeto

Criar um aplicativo mobile de e-commerce com funcionalidades completas de compra, incluindo:

- Autenticação com JWT
- Listagem de produtos
- Carrinho persistente
- Pagamento com validação
- Escolha de entrega
- Finalização e histórico de pedidos

---

### 🧱 Tecnologias Utilizadas

| Tecnologia                     | Finalidade                                            |
| ------------------------------ | ----------------------------------------------------- |
| **React Native + Expo**        | Desenvolvimento mobile multiplataforma                |
| **React Navigation**           | Navegação com Tabs + Stacks aninhadas                 |
| **Context API + AsyncStorage** | Gerenciamento de estado global com persistência local |
| **React Native Paper**         | Componentes de UI acessíveis e modernos               |
| **json-server-auth**           | Mock API com autenticação via JWT                     |
| **TypeScript**                 | Tipagem segura em todo o projeto                      |

---

### 🌐 APIs e Integração com Backend

O projeto utiliza duas APIs diferentes hospedadas no Render para separar autenticação e dados do e-commerce:

```text
1️⃣ API de Produtos e Pedidos (Mock)
🔹 URL: https://ecommerce-api-99h8.onrender.com
🔹 Finalidade:

- Listagem de produtos
- Salvar e recuperar pedidos

2️⃣ API de Autenticação com JWT
🔹 URL: https://auth-api-wixi.onrender.com
🔹 Baseada em json-server-auth
🔹 Endpoints:

- POST /login
- POST /register
- Proteção de rotas com token JWT

Um ponto de observação importante é o pequeno delay que a API causa ao carregar o Cadastro e os cards de produtos.
```

### 🧱 Arquitetura e Estrutura de Pastas

```text
vitrine/
├── src/
│   ├── components/      # Componentes reutilizáveis (ex: ProductCard)
│   ├── contexts/        # AuthContext, CartContext
│   ├── navigation/      # Pilhas de navegação (AppStack, MainTabs, etc.)
│   ├── screens/         # Todas as telas do app
│   ├── services/        # Integração com API (ProductService, OrderService)
│   ├── types/           # Tipos globais (Product, Order)
│   └── utils/           # Funções utilitárias (getImage.ts)
```

---

### 🔐 Autenticação com JWT

- Login e registro via `json-server-auth`
- Resposta da API retorna:

```json
{
  "accessToken": "...",
  "user": { "email": "...", "name": "...", "id": ... }
}
```

O token e os dados do usuário são salvos com AsyncStorage

Requisições autenticadas usam Authorization: Bearer <token>

```text
🛍️ Carrinho de Compras:

Gerenciado com CartContext.tsx

Permite:

Adicionar/remover produtos

Alterar quantidade

Calcular total

Persistência por usuário: @cart_email

Armazenamento local com AsyncStorage
```

```text
💳 Pagamento

Formas de pagamento:

Cartão (com validação de número, nome, validade, CVV)

PIX (simulação com QR code fake)

Dinheiro (bloqueado se entrega for em casa)

Validação obrigatória de todos os campos antes de continuar
```

```text
🚚 Entrega:

Opção de retirada na loja ou entrega em casa

Endereços salvos por usuário

Suporte a múltiplos endereços reutilizáveis

Validação completa do formulário de endereço
```

```text
📦 Finalização do Pedido

Tela de resumo exibe:

Produtos selecionados

Forma de pagamento

Endereço

Total calculado com quantidade

Pedido é salvo na API mock

Tela de confirmação ao final da compra
```

```text
📜 Histórico de Pedidos

Lista de pedidos anteriores

Tela de detalhes com:

Produtos

Preço total

Pagamento

Endereço
```

```text
👤 Perfil do Usuário

Tela exibe:

Nome e e-mail do usuário logado

Visual adaptado à identidade visual da Macle
```

```text
🧪 Testes

Não foram implementados testes automatizados

O projeto está pronto para receber testes com:

jest

@testing-library/react-native
```

```text
📌 Decisões Técnicas

Context API foi utilizado no lugar do Redux Toolkit para manter a simplicidade, reduzir dependências externas e atender perfeitamente ao escopo do projeto, com gerenciamento de autenticação, carrinho, endereço e pedidos.

Persistência por usuário foi implementada com AsyncStorage, usando chaves únicas baseadas no e-mail (@cart_email, @enderecos_email, @pedidos_email) para garantir dados isolados entre diferentes usuários logados.

Autenticação com JWT foi implementada com json-server-auth em uma API mock separada, isolando a autenticação dos demais dados. O token é salvo no AsyncStorage e utilizado no header Authorization nas requisições protegidas.

Imagens de produtos foram disponibilizadas via servidor estático no Render, garantindo funcionamento no Expo Go.

Scroll infinito foi escolhido no lugar de paginação tradicional para melhorar a fluidez da navegação de produtos e experiência do usuário.

Validações visuais e lógicas foram aplicadas em formulários de pagamento e endereço para garantir fluxo confiável e amigável.

Simulação de pagamento por PIX foi implementada com QR Code fake, trazendo uma camada de realismo sem necessidade de integrações externas complexas.

Navegação aninhada com React Navigation foi estruturada com pilhas (Stack) e abas (Tab) conforme exigido, organizando fluxos como login, pedido, carrinho e histórico.

Design visual foi adaptado com base nas cores e identidade visual da empresa Macle, utilizando React Native Paper para manter consistência e acessibilidade.

```

### 🧭 Navegação organizada em:

```text
AppStack
├── MainTabs
│ ├── Home
│ └── Cart
├── PedidoStack
├── Perfil
└── Histórico
```

💾 Persistência com AsyncStorage
| Dado | Chave |
| --------- | --------------------- |
| Token JWT | `@token` |
| Usuário | `@user` |
| Carrinho | `@cart_${email}` |
| Endereços | `@enderecos_${email}` |
| Pedidos | `@pedidos_${email}` |

```text
✅ Status Final

Todos os requisitos funcionais e técnicos foram implementados com sucesso.
```
