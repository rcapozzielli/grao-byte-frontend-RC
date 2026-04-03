# Grão & Byte — Frontend

Interface web do sistema interno de gestão de produtos da cafeteria **Grão & Byte**, desenvolvido como solução para o Case COFFEE I do Hackaton Insper Jr.

---

## Sobre o projeto

O sistema centraliza o gerenciamento do cardápio da cafeteria, substituindo o controle manual por uma interface web integrada a uma API REST. Foi desenvolvido com foco em usabilidade, clareza visual e controle de acesso por cargo.

---

## Funcionalidades

- **Autenticação** — login com e-mail e senha, sessão mantida via JWT
- **Controle de acesso por cargo** — admins têm acesso ao painel de gerenciamento de funcionários; todos os funcionários podem gerenciar produtos
- **Listagem de produtos** — produtos organizados por categoria (Café, Salgado, Doce, Bebida)
- **Busca** — filtro por nome em tempo real
- **Abas de categoria e disponibilidade** — filtragem rápida combinável
- **Métricas** — total de produtos, disponíveis, indisponíveis e preço médio
- **Adicionar produto** — cadastro com nome, descrição, preço, categoria e disponibilidade
- **Editar produto** — atualização de qualquer campo
- **Remover produto** — exclusão com confirmação
- **Toggle de disponibilidade** — clique no badge do card para alternar instantaneamente
- **Registrar funcionário** — admin cadastra novos usuários com nome, e-mail, senha e cargo *(admin only)*
- **Gerenciar funcionários** — admin lista e remove funcionários *(admin only)*

---

## Arquitetura da aplicação

O projeto segue uma arquitetura cliente-servidor desacoplada:

```
Usuário → Frontend (React) → API REST (Node.js/Express) → MongoDB
Usuário ← Frontend (React) ← API REST (Node.js/Express) ← MongoDB
```

- O **frontend** (este repositório) é responsável apenas pela interface e pela lógica de apresentação. Ele nunca acessa o banco de dados diretamente.
- Toda comunicação acontece via **requisições HTTP** para a API REST do backend, usando o método `fetch` nativo do JavaScript.
- O **backend** valida os dados, aplica as regras de negócio e persiste as informações no **MongoDB**.
- As respostas da API retornam em **JSON**, e o frontend atualiza o estado da aplicação em tempo real, sem recarregar a página.

Essa separação facilita a manutenção, permite escalar o backend de forma independente e deixa o código de cada camada com uma responsabilidade clara.

---

## Autenticação

O sistema utiliza **JWT (JSON Web Token)** para autenticar os usuários:

1. O funcionário informa e-mail e senha na tela de login.
2. O frontend envia as credenciais para `POST /api/auth/login`.
3. O backend valida as credenciais e retorna um token JWT assinado junto com os dados do usuário (nome e cargo).
4. O frontend armazena o token no `localStorage` do navegador, sob a chave `gb_token`, e os dados do usuário (`gb_user`) para uso em sessões futuras.
5. A partir desse momento, **todas as requisições protegidas** incluem o cabeçalho `Authorization: Bearer <token>`, injetado automaticamente pelo wrapper de `fetch` centralizado em `src/services/api.ts`.
6. Ao fechar e reabrir o navegador, o token é recuperado do `localStorage` e a sessão é restaurada sem necessidade de novo login.

### Controle de acesso por cargo

O backend define dois cargos: `admin` e `employee`. O cargo é retornado no login e salvo junto ao estado de autenticação. O frontend usa essa informação para:

- Exibir ou ocultar botões e modais exclusivos de administrador (registrar funcionário, gerenciar funcionários)
- Impedir acesso visual a funcionalidades não autorizadas

A proteção real das rotas é feita no backend — o frontend apenas adapta a interface ao cargo do usuário.

---

## Operações CRUD

Todas as operações de produto estão integradas ao backend via API REST e disponíveis para qualquer funcionário autenticado:

| Operação | Descrição | Endpoint |
|---|---|---|
| **Create** | Cadastro de novo produto com nome, descrição, preço, categoria e disponibilidade | `POST /api/products` |
| **Read** | Listagem de todos os produtos ao carregar o dashboard | `GET /api/products` |
| **Update** | Edição de qualquer campo de um produto existente, incluindo toggle de disponibilidade | `PUT /api/products/:id` |
| **Delete** | Remoção de um produto com confirmação via AlertDialog | `DELETE /api/products/:id` |

O estado local da aplicação é atualizado imediatamente após cada operação bem-sucedida, sem necessidade de recarregar todos os dados da API — garantindo uma experiência fluida.

---

## Demonstração

Foi gravado um vídeo demonstrando o funcionamento completo do sistema, cobrindo:

- Login com conta de funcionário e conta de administrador
- Listagem do cardápio com busca, filtros por categoria e disponibilidade
- Criação, edição e remoção de produtos
- Toggle de disponibilidade diretamente pelo card
- Funcionalidades administrativas: registro e gerenciamento de funcionários

---

## Tecnologias

| Tecnologia | Versão |
|---|---|
| React | 19 |
| TypeScript | 5.9 |
| Vite | 8 |
| Tailwind CSS | 4 |
| shadcn/ui | — |
| React Router DOM | 7 |
| Sonner | — |

---

## Pré-requisitos

- Node.js 18+
- Backend da aplicação rodando ([repositório do backend](https://github.com/RafaelCapozzielli/grao-byte-backend-RC))

---

## Instalação e execução

```bash
# Clone o repositório
git clone https://github.com/RafaelCapozzielli/grao-byte-frontend-RC.git
cd grao-byte-frontend-RC

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

> O backend deve estar rodando em `http://localhost:5000` para a aplicação funcionar corretamente.

---

## Estrutura do projeto

```
src/
├── components/              # Componentes reutilizáveis
│   ├── ui/                  # Componentes base (shadcn/ui)
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── ProductFormModal.tsx
│   ├── DeleteConfirmModal.tsx
│   ├── RegisterEmployeeModal.tsx
│   └── ManageUsersModal.tsx
├── contexts/                # Contexto de autenticação (token, nome, cargo)
├── pages/                   # Páginas da aplicação
│   ├── LoginPage.tsx
│   └── DashboardPage.tsx
├── services/                # Comunicação com a API
│   ├── api.ts
│   ├── auth.ts
│   ├── products.ts
│   └── users.ts
└── config/                  # Configurações (URL da API)
```

---

## Build para produção

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist/`.
