# Grão & Byte — Frontend

Interface web do sistema interno de gestão de produtos da cafeteria **Grão & Byte**, desenvolvido como solução para o Case COFFEE I do Hackaton Insper Jr.

---

## Sobre o projeto

O sistema permite que funcionários da cafeteria gerenciem o cardápio de forma centralizada, substituindo o controle manual por planilhas. A interface foi projetada para ser intuitiva e acessível, mesmo para usuários sem conhecimento técnico.

## Funcionalidades

- **Autenticação** — login com e-mail e senha, sessão mantida via JWT
- **Listagem de produtos** — produtos organizados por categoria (Café, Salgado, Doce, Bebida)
- **Busca** — filtro por nome em tempo real
- **Abas de categoria** — filtragem rápida por categoria
- **Adicionar produto** — cadastro com nome, descrição, preço, categoria e disponibilidade
- **Editar produto** — atualização de qualquer campo
- **Remover produto** — exclusão com confirmação
- **Disponibilidade** — alternância entre disponível/indisponível por produto

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

## Pré-requisitos

- Node.js 18+
- Backend da aplicação rodando ([repositório do backend](https://github.com/RafaelCapozzielli/grao-byte-backend-RC))

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

## Estrutura do projeto

```
src/
├── components/         # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── ProductFormModal.tsx
│   └── DeleteConfirmModal.tsx
├── contexts/           # Contexto de autenticação
├── pages/              # Páginas da aplicação
│   ├── LoginPage.tsx
│   └── DashboardPage.tsx
├── services/           # Comunicação com a API
│   ├── api.ts
│   ├── auth.ts
│   └── products.ts
└── config/             # Configurações (URL da API)
```

## Build para produção

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist/`.