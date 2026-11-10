# Como funciona o PageRank

Site que define o PageRank logo na abertura e explica a ideia com um exemplo em **três passos**: observar quatro páginas fictícias e seus links, prever a mais importante e ver como um novo link muda a ordem. Não há fórmulas nem controles avançados na interface.

## Rodar no Windows

Instale Node.js 24 ou mais recente. O projeto usa apenas módulos nativos, sem instalar pacotes.

```powershell
.\scripts\start-windows.ps1
```

Se o PowerShell impedir a execução de scripts, execute `node server.js` na pasta do projeto. Abra [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Rodar na VM Linux do Proxmox

Clone o repositório **dentro da VM** e inicie com Docker Compose:

```sh
docker compose up -d --build
docker compose ps
```

A porta escuta apenas na própria VM por padrão. Veja [docs/proxmox.md](docs/proxmox.md) para abrir na rede, colocar um proxy HTTPS, atualizar e diagnosticar. Também é possível executar sem Docker com `sh scripts/start-linux.sh` quando Node.js estiver instalado.

## A experiência

1. **Observe:** a pessoa vê quatro páginas fictícias e cinco links. Escolhe qual ficará em primeiro lugar.
2. **Descubra:** pontos coloridos percorrem as setas enquanto barras mostram a importância mudar. O site revela a ordem **C, A, B, D** e explica as indicações entre as páginas.
3. **Compare:** um clique adiciona **C→D**. A barra de D sobe e a ordem vira **C, A, D, B**. O texto mostra por que C passou a dividir sua importância entre A e D.

A revisão de conteúdo e visual segue a [skill Frontend Design, da Anthropic](https://github.com/anthropics/skills/tree/main/skills/frontend-design), para priorizar o conceito, retirar decoração redundante e melhorar a hierarquia. A base de componentes continua alinhada ao [Material Design 3](https://m3.material.io/). As escolhas estão em [docs/design.md](docs/design.md).

O exemplo é didático. PageRank mede importância na rede de links; relevância para uma consulta e qualidade do conteúdo exigem outros critérios. O site não reproduz a busca atual do Google.

## Código e testes

`public/` contém a interface. `pagerank.js` calcula a pontuação; `server.js` serve a página e a API. `GET /health` verifica o serviço. Os dados da rede são fixos nesta experiência para manter a interação simples.

```sh
node --test
node --check public/app.js
```

O fluxo de CI executa esses testes no Windows e no Linux após cada envio ao GitHub.
