# Decisões de design

Referências: [Frontend Design, da Anthropic](https://github.com/anthropics/skills/tree/main/skills/frontend-design), [Material Design 3 UI/UX Skill](https://github.com/skydashnet/material-design-3-ui-skill) e [Material Design 3](https://m3.material.io/).

**Objetivo:** explicar a ideia do PageRank por uma mudança observável na posição da página D. A pessoa realiza somente uma previsão e dois avanços. A interface apresenta uma ação principal por etapa.

**Estrutura:** a primeira tela pergunta sobre importância e responde imediatamente o que é PageRank e como os links pesam. “Veja um exemplo” apresenta quatro páginas, explica as setas e pede um palpite. Em janelas largas, o grafo e a explicação ficam lado a lado; no celular, ficam em sequência. A síntese final aparece após o novo link e nomeia as ligações que produziram a ordem.

**Cores e tipo:** Roboto, texto #202124, azul #1967d2 para ação, branco #ffffff para a página e #f8fafd para o grafo. Vermelho #ea4335, amarelo #fbbc04 e verde #34a853 aparecem na marca e na identificação das páginas. A tipografia cria a hierarquia sem títulos coloridos ou rótulos decorativos.

**Critério editorial:** a abertura define o conceito antes de solicitar uma interação. Foi retirado o link redundante do cabeçalho, o rótulo “experiência interativa” e o grafo decorativo que duplicava o experimento. O único diagrama é a rede com a qual a pessoa trabalha.

**Movimento com função:** após cada avanço, pontos nas cores das páginas percorrem os links no sentido das setas e as barras mostram a importância relativa subir ou descer. O grafo volta ao centro da tela para que o movimento seja visto também no celular. Os rótulos de posição, a descrição e a ordem em texto permitem entender o resultado sem depender da animação. Pessoas que preferem menos movimento veem os estados finais diretamente.

**Componentes:** escolha mutuamente exclusiva por botões com `aria-pressed`, ação principal preenchida, reinício secundário contornado, etapas com estado atual textual e ranking como lista. A cor nunca é o único indício de resultado: letras, setas, posição e texto permanecem visíveis.

**Acessibilidade:** botões com alvo amplo, foco visível, nomes para o grafo, ordem de leitura estável, anúncio textual da nova ordem, mensagens de erro com tentativa de recuperação e animação reduzida quando o sistema solicita menos movimento.

**Limite do modelo:** a página ilustra PageRank com quatro páginas fictícias e uma alteração C→D. Não simula o sistema atual de busca do Google.
