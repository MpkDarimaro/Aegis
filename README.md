# 🦅 Aegis - Foco no Alvo

> "Siga o Protocolo."

O **Aegis** é uma aplicação mobile focada em produtividade, disciplina e gerenciamento de rotinas. Diferente de listas de tarefas comuns, o Aegis utiliza conceitos de gamificação (XP, Níveis, Conquistas) para incentivar a constância e o foco.

## 📱 Screenshots

| Tela Inicial | Adicionar Missão | Splash Screen |
|:---:|:---:|:---:|
| | | |

## 🚀 Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as tecnologias mais modernas do ecossistema JavaScript:

-   **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
-   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
-   **Mobile/Nativo:** [Capacitor](https://capacitorjs.com/) (Geração de APK Android)
-   **Ícones:** Lucide React

## ✨ Funcionalidades

-   ✅ **Gerenciamento de Missões:** Criação de tarefas com prioridades e tipos (Comum/Foco).
-   🔄 **Recorrência:** Sistema de hábitos diários.
-   🏆 **Gamificação:** Ganhe XP e suba de nível ao completar tarefas.
-   🎨 **Temas:** Suporte a múltiplos temas visuais (Default, Onyx, Crimson).
-   📱 **Mobile-First:** Interface 100% adaptada para gestos e telas de toque.

## 🔧 Como rodar o projeto

```bash
# Clone este repositório
git clone [https://github.com/SEU_USUARIO/Aegis.git](https://github.com/SEU_USUARIO/Aegis.git)

# Instale as dependências
npm install

# Rodar no navegador (Desenvolvimento)
npm run dev

# Gerar Build para Android
npm run build
npx cap sync
npx cap open android
