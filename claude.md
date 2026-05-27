# FIFA Championship System — claude.md

## Visão Geral do Projeto

Sistema web para gerenciar campeonatos de FIFA entre amigos, com suporte a formato double elimination (Winner Bracket + Lower Bracket). Aplicação single-page em React com roteamento client-side, sem backend — todo estado persiste via localStorage.

---

## Estrutura de Páginas

### 1. `/cadastro` — Cadastro de Times e Jogadores
- Formulário para criar times com nome e escudo (emoji ou cor personalizada)
- Cada time tem de 1 a 2 jogadores cadastrados (nome)
- Times ficam salvos no localStorage
- CRUD completo: criar, editar, deletar times
- Validação: nome do time obrigatório, sem duplicatas

### 2. `/sorteio` — Sorteio de Times e Confrontos
- Usuário seleciona exatamente **8 times** dos times cadastrados
- Ao confirmar, o sistema realiza o sorteio das oitavas:
  - Embaralha os 8 times aleatoriamente com animação
  - Define os 4 confrontos da rodada inicial do **Winner Bracket**
  - Exibe os confrontos sorteados com animação de revelação
- Após confirmar o sorteio, o chaveamento é gerado e salvo no localStorage
- Não é possível realizar novo sorteio se já houver campeonato em andamento (exibir alerta com opção de resetar)

### 3. `/chaveamento` — Bracket Interativo
- Exibe o chaveamento completo em tempo real
- **Winner Bracket:**
  - Oitavas (4 jogos) → Semifinais (2 jogos) → Final Winner
- **Lower Bracket:**
  - Round 1: os 4 perdedores das Oitavas formam 2 confrontos
  - Round 2: os 2 perdedores das Semifinais do Winner entram
  - Semifinal Lower → Final Lower
- **Grande Final:**
  - Perdedor da Final Winner vs. Vencedor da Final Lower
- Para cada jogo, o usuário preenche o placar (gols de cada time)
- Ao confirmar o placar, o vencedor avança automaticamente no bracket
- Times eliminados ficam visualmente marcados (opacidade reduzida + ícone X)
- Estado do campeonato salvo em localStorage a cada atualização

---

## Regras de Negócio

### Formato Double Elimination (8 times)
```
WINNER BRACKET
Oitavas:   [1v8] [2v7] [3v6] [4v5]
Semis:     [W1vW2] [W3vW4]
Final W:   [WS1vWS2]  → vencedor vai pra Grande Final

LOWER BRACKET
Round 1:   [L_Oit1 v L_Oit2] [L_Oit3 v L_Oit4]
Round 2:   [Perdedor Semi Winner entra contra vencedor do LR1]
Semis L:   [vencedores do Round 2 se enfrentam]
Final L:   → vencedor vai pra Grande Final

GRANDE FINAL
[Perdedor da Final W] vs [Vencedor da Final L]
→ Vencedor é o CAMPEÃO
```

### Placar
- Apenas números inteiros ≥ 0
- Empate: exibir modal perguntando "Quem venceu nos pênaltis?" com botão de seleção manual
- Após confirmar placar, não é editável sem clicar explicitamente em "Editar placar"
- Jogos futuros ficam bloqueados até os dois participantes serem definidos

---

## Stack Técnica

- **Framework:** React 18 + Vite
- **Estilização:** Tailwind CSS
- **Roteamento:** React Router DOM v6
- **Estado:** Context API + localStorage (sem backend)
- **Ícones:** Lucide React
- **Animações:** Framer Motion

---

## Estrutura de Pastas

```
src/
├── components/
│   ├── Bracket/
│   │   ├── MatchCard.jsx        # Card de jogo com placar editável
│   │   ├── WinnerBracket.jsx    # Coluna Winner Bracket
│   │   ├── LowerBracket.jsx     # Coluna Lower Bracket
│   │   └── GrandFinal.jsx       # Card da grande final
│   ├── TeamCard.jsx
│   └── Navbar.jsx
├── pages/
│   ├── Cadastro.jsx
│   ├── Sorteio.jsx
│   └── Chaveamento.jsx
├── context/
│   └── ChampionshipContext.jsx  # Estado global + persistência
├── utils/
│   ├── bracket.js               # Lógica de geração e progressão
│   └── storage.js               # Helpers localStorage
└── App.jsx
```

---

## Modelo de Dados (localStorage)

### `fifa_teams`
```json
[
  {
    "id": "uuid",
    "name": "Real Madrid",
    "emoji": "⚽",
    "color": "#00ff87",
    "players": ["João", "Pedro"]
  }
]
```

### `fifa_championship`
```json
{
  "status": "in_progress",
  "createdAt": "ISO date",
  "teams": [],
  "winner_bracket": {
    "round_of_8": [
      { "id": "w_r1_1", "team1": {}, "team2": {}, "score1": null, "score2": null, "winner": null, "locked": false }
    ],
    "semis": [],
    "final": {}
  },
  "lower_bracket": {
    "round1": [],
    "round2": [],
    "semis": [],
    "final": {}
  },
  "grand_final": {
    "team1": null,
    "team2": null,
    "score1": null,
    "score2": null,
    "winner": null
  }
}
```

---

## Design

- Tema **dark**, inspirado em dashboards esportivos modernos
- Paleta: fundo `#0a0a0f`, cards `#12121a`, acentos verde neon `#00ff87` e amarelo `#f5c518`
- Fonte display: `Bebas Neue` (Google Fonts)
- Fonte corpo: `DM Sans` (Google Fonts)
- Bracket conectado com linhas SVG entre os jogos
- Animações ao avançar time: slide + glow
- Responsivo (mobile-first, funciona em TV 1080p e celular)
- Tela de campeão com animação de confete ao finalizar o campeonato

---

## Comportamentos Esperados

| Ação | Resultado |
|------|-----------|
| Cadastrar time | Salvo no localStorage |
| Selecionar 8 times + sortear | Confrontos aleatórios, chaveamento gerado |
| Preencher placar | Vencedor avança automaticamente |
| Empate no placar | Modal para escolha manual do vencedor nos pênaltis |
| Eliminar time no Lower | Marcado como eliminado visualmente |
| Campeão definido | Tela de celebração com confete |
| Resetar campeonato | Limpa `fifa_championship`, mantém times |

---

## Observações

- **Sem backend** — tudo via localStorage
- O bracket deve ser **visualmente conectado** com linhas/SVG mostrando o fluxo
- Otimizado para **tela cheia em TV** (1920×1080) durante partidas
- Botão de reset visível apenas no Sorteio, com modal de confirmação
