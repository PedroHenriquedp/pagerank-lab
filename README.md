# Como funciona o PageRank

Site interativo que explica a ideia do PageRank em **três passos**: observar uma pequena rede de páginas, prever o primeiro lugar e comparar o resultado depois de mudar um link. Não há fórmulas nem controles avançados na interface.

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

1. **Observe:** a pessoa vê quatro páginas fictícias e cinco links. Escolhe qual página imagina que ficará em primeiro lugar.
2. **Descubra:** o site revela a ordem **C, A, B, D** e explica que as páginas compartilham importância pelos links repetidamente.
3. **Compare:** um clique adiciona **C→D**. D sobe para o terceiro lugar. A pessoa pode recomeçar.

A interface foi redesenhada com a [skill Material Design 3 UI/UX](https://github.com/skydashnet/material-design-3-ui-skill) como referência para hierarquia, tokens semânticos, componentes, adaptação de layout e acessibilidade. As escolhas estão em [docs/design.md](docs/design.md).

O exemplo é didático. PageRank mede importância na rede de links; relevância para uma consulta e qualidade do conteúdo exigem outros critérios. O site não reproduz a busca atual do Google.

## Código e testes

`public/` contém a interface. `pagerank.js` calcula a pontuação; `server.js` serve a página e a API. `GET /health` verifica o serviço. Os dados da rede são fixos nesta experiência para manter a interação simples.

```sh
node --test
node --check public/app.js
```

O fluxo de CI executa esses testes no Windows e no Linux após cada envio ao GitHub.
