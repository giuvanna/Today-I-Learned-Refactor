# 🌐 Today I Learned 

Uma aplicação web simples e interativa que permite adicionar fatos categorizados por tópicos. Desenvolvido com React, Supabase e CSS.

## 💻 Instalação
1. Clone o repositório
   
   `git clone https://github.com/giuvanna/today-i-learned-refactor.git`

   `cd today-i-learned-refactor`

2. Instale as dependências

   `npm install`

4. Rode o servidor
   
   `npm run dev`

6. Abra a aplicação no navegador
   
    `http://localhost:5173`

# ✏️ Refatoração 
**Factory Method Pattern**: é um padrão criacional de projeto que fornece uma interface para criar objetos em uma superclasse, mas permite que as subclasses alterem o tipo de objetos que serão criados. [Fonte](https://refactoring.guru/design-patterns/factory-method)

Na aplicação Today I Learned, o padrão de projeto Factory foi implementado no `ButtonFactory` para criar diferentes tipos de botões.

**Strategy Pattern**: é um padrão de projeto comportamental que permite que você defina uma família de algoritmos, coloque-os em classes separadas, e faça os objetos deles intercambiáveis. [Fonte](https://refactoring.guru/pt-br/design-patterns/strategy)

Na aplicação Today I Learned, o padrão de projeto Strategy foi implementado na lógica de votação facilitando a adição de diferentes tipos de voto no futuro.
