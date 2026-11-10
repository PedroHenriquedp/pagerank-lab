# Laboratório PageRank

Site interativo para o seminário de grafos. Permite pesquisar qualquer termo presente nas páginas, criar e editar páginas, mudar links, acompanhar rodadas e comparar a classificação antes e depois das mudanças.

O cenário **Exemplo dos slides: A–D** reproduz as cinco setas da apresentação. **Web diversa** inclui grafos, busca, viagens, receitas e música. A consulta filtra as páginas pelo conteúdo; entre as encontradas, este modelo as ordena pelo PageRank. É uma demonstração didática, não uma reprodução da busca atual do Google.

## Windows

Instale Node.js 24 ou mais recente. O projeto usa apenas módulos nativos, sem instalação de pacotes. No PowerShell, dentro do projeto:

```powershell
.\scripts\start-windows.ps1
```

Se a política do PowerShell impedir scripts:

```powershell
node server.js
```

Abra **http://127.0.0.1:4173**. A porta pode ser alterada com `.\scripts\start-windows.ps1 -Port 8080`.

## VM Linux no Proxmox

Instale o projeto **dentro da VM**. Com Docker Compose:

```sh
docker compose up -d --build
docker compose ps
```

Por padrão, a porta 4173 fica acessível apenas na própria VM. Para abrir na rede local, crie `.env` a partir de `.env.example` e defina `PAGERANK_BIND=0.0.0.0`; depois execute `docker compose up -d --build` novamente. Acesse pelo IP da VM e configure o firewall conforme sua rede. Para acesso público, use um proxy HTTPS.

Sem Docker, com Node.js instalado:

```sh
sh scripts/start-linux.sh
# Para aceitar conexões da rede:
HOST=0.0.0.0 PORT=4173 sh scripts/start-linux.sh
```

Veja [docs/proxmox.md](docs/proxmox.md) para instalar, atualizar e diagnosticar na VM.

## O que a turma pode fazer

1. Escolher um cenário ou criar páginas próprias (de 2 a 12).
2. Selecionar um vértice e criar ou remover links de saída.
3. Reproduzir, pausar, avançar, voltar ou arrastar a linha do tempo.
4. Ajustar a chance de seguir links e observar o salto aleatório.
5. Pesquisar palavras dos títulos, descrições e temas das páginas.
6. Restaurar o cenário para repetir o experimento.

As alterações ficam salvas no navegador de cada visitante. O servidor calcula as rodadas em `POST /api/simulate`; não há banco de dados nem conta de usuário. `GET /health` informa se o serviço está respondendo.

## Demonstração de três minutos

| Tempo | Ação | Pergunta à turma |
| --- | --- | --- |
| 0:00–0:30 | Abrir **Exemplo dos slides: A–D** e pesquisar “grafos”. | “Quem ficará em primeiro?” |
| 0:30–1:10 | Avançar algumas rodadas e clicar em **Ver resultado**. | “Por que C supera as outras?” |
| 1:10–2:10 | Selecionar C e criar o link **C→D**. | “D deve subir?” |
| 2:10–2:40 | Restaurar, abrir **Web diversa** e pesquisar “viagens”. | “O que a consulta mudou?” |
| 2:40–3:00 | Concluir e passar ao slide seguinte. | “Importância na rede é o mesmo que relevância?” |

No exemplo original, a ordem é **C, A, B, D**. Ao criar C→D, **D sobe e ultrapassa B**. Ensaie com cronômetro e deixe o cenário A–D aberto antes de começar.

## Desenvolvimento e testes

```sh
node --test
node --check server.js
node --check pagerank.js
node --check public/app.js
```

Este é um projeto Git independente. A interface está em `public/`, o cálculo em `pagerank.js`, a entrega HTTP em `server.js` e os testes em `test/`. O Dockerfile e o Compose executam a mesma versão na VM Linux. O fluxo em `.github/workflows/ci.yml` testa Windows e Linux quando o repositório estiver no GitHub.
