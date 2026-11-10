# Decisões de design

Referências: [Frontend Design, da Anthropic](https://github.com/anthropics/skills/tree/main/skills/frontend-design), [Material Design 3 UI/UX Skill](https://github.com/skydashnet/material-design-3-ui-skill) e [Material Design 3](https://m3.material.io/).

**Objetivo:** explicar a ideia do PageRank por uma mudança observável na posição da página D. A pessoa realiza somente uma previsão e dois avanços. A interface apresenta uma ação principal por etapa.

**Estrutura:** a primeira tela pergunta sobre importância e responde imediatamente o que é PageRank e como os links pesam. Abaixo, três etapas conduzem à rede real. Em janelas largas, o grafo e a explicação ficam lado a lado; no celular, ficam em sequência. A síntese final descreve o ciclo do algoritmo.

**Cores e tipo:** Roboto, texto #202124, azul #1967d2 para ação, branco #ffffff para a página e #f8fafd para o grafo. Vermelho #ea4335, amarelo #fbbc04 e verde #34a853 aparecem na marca e na identificação das páginas. A tipografia cria a hierarquia sem títulos coloridos ou rótulos decorativos.

**Critério editorial:** a abertura define o conceito antes de solicitar uma interação. Foi retirado o link redundante do cabeçalho, o rótulo “experiência interativa” e o grafo decorativo que duplicava o experimento. O único diagrama é a rede com a qual a pessoa trabalha.

**Componentes:** escolha mutuamente exclusiva por botões com `aria-pressed`, ação principal preenchida, reinício secundário contornado, etapas com estado atual textual e ranking como lista. A cor nunca é o único indício de resultado: letras, setas, posição e texto permanecem visíveis.

**Acessibilidade:** botões com alvo amplo, foco visível, nomes para o grafo, ordem de leitura estável, mensagens de erro com tentativa de recuperação e animação reduzida quando o sistema solicita menos movimento. A animação destaca setas, mas os estados estáticos explicam a mudança.

**Limite do modelo:** a página ilustra PageRank com quatro páginas fictícias e uma alteração C→D. Não simula o sistema atual de busca do Google.
