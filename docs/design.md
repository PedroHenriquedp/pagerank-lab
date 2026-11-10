# Decisões de design

Referências: [Material Design 3 UI/UX Skill](https://github.com/skydashnet/material-design-3-ui-skill) e [Material Design 3](https://m3.material.io/).

**Objetivo:** explicar a ideia do PageRank por uma mudança observável na posição da página D. A pessoa realiza somente uma previsão e dois avanços. A interface apresenta uma ação principal por etapa.

**Estrutura:** título curto, indicação das três etapas, grafo e explicação lado a lado em janelas largas; grafo acima da explicação em janelas estreitas. A explicação conceitual vem depois do experimento.

**Cores e tipo:** Roboto, azul como cor primária da ação, tons claros de superfície para separar o grafo da narrativa e cores do Google reservadas à marca e à identificação das páginas. Controles e estados usam nomes de função no CSS (`primary`, `surface`, `on-surface`, `outline-variant`).

**Componentes:** escolha mutuamente exclusiva por botões com `aria-pressed`, ação principal preenchida, reinício secundário contornado, etapas com estado atual textual e ranking como lista. A cor nunca é o único indício de resultado: letras, setas, posição e texto permanecem visíveis.

**Acessibilidade:** botões com alvo amplo, foco visível, nomes para o grafo, ordem de leitura estável, mensagens de erro com tentativa de recuperação e animação reduzida quando o sistema solicita menos movimento. A animação destaca setas, mas os estados estáticos explicam a mudança.

**Limite do modelo:** a página ilustra PageRank com quatro páginas fictícias e uma alteração C→D. Não simula o sistema atual de busca do Google.
