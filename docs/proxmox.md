# Instalação na VM Proxmox

O site roda dentro de uma VM Linux. O host Proxmox não precisa receber Node.js nem os arquivos do site.

## Preparar a VM

Use uma distribuição Linux com Docker Engine e Compose, ou Node.js 24 ou mais recente para execução sem Docker. Reserve uma porta livre, por padrão 4173. Confirme o IP da VM e que seu computador consegue alcançá-lo.

## Obter o código

Depois que o projeto estiver no repositório remoto:

```sh
git clone <URL-DO-REPOSITORIO>
cd pagerank-lab
```

## Executar com Docker Compose

```sh
docker compose up -d --build
docker compose ps
curl -f http://127.0.0.1:4173/health
```

O Compose reinicia o site após reboot. Por padrão, a porta só escuta em `127.0.0.1` da VM. Para acesso de outros dispositivos na rede local, crie `.env` com:

```dotenv
PAGERANK_BIND=0.0.0.0
PAGERANK_PORT=4173
```

Rode `docker compose up -d --build` novamente. Acesse `http://IP-DA-VM:4173`. Libere a porta no firewall apenas para os clientes desejados.

Para acesso pela internet, mantenha a porta do Compose em `127.0.0.1` e aponte um proxy reverso com HTTPS para `http://127.0.0.1:4173`. A configuração do domínio e dos certificados depende do proxy que você usa na VM.

## Atualizar e diagnosticar

```sh
git pull
docker compose up -d --build
docker compose logs --tail=100 pagerank-lab
curl -f http://127.0.0.1:4173/health
```

Sem Docker, use `HOST=0.0.0.0 PORT=4173 sh scripts/start-linux.sh` e configure seu gerenciador de serviços para reiniciar o processo. Não é necessário instalar dependências npm.
