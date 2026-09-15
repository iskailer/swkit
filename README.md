# Sw Toolkit

Aplicação web offline-first de ferramentas rápidas para facilitar um Sw.

## Stack

HTML, CSS, JavaScript com ES Modules, Material Web, PouchDB, Service Worker e GitHub Pages.

## Arquitetura

- `src/app`: inicialização, configuração de subpath, router e registro de ferramentas.
- `src/tools`: ferramentas isoladas e respectivas camadas de apresentação.
- `src/shared`: tokens e estilos compartilhados.
- `tests`: testes de regras e contratos conforme cada fase.

A Home renderiza os tiles exclusivamente a partir de `src/app/tool-registry.js`. Para adicionar uma ferramenta, crie-a em `src/tools/nova-ferramenta`, registre seus metadados e implemente sua rota na composição da aplicação. O Timer separa regras de contagem em `domain`, áudio Web Audio em `infrastructure` e interface em `presentation`.

## Executar

Requer Node.js 20 ou superior.

```sh
npm install
npm run build
npm run serve
npm test
```

> O pacote `pouchdb` está declarado nas dependências. Caso o ambiente atual não tenha acesso ao npm registry, execute `npm install` em uma rede com acesso antes de iniciar; isso também atualizará o `package-lock.json`.

Enquanto o pacote não estiver instalado, o gerenciamento de cartas usa um repositório em memória apenas para permitir validar o fluxo de interface. Após instalar PouchDB, a composição do aplicativo deve usar `PouchDbCardRepository` para manter cartas entre recarregamentos.

O build estático fica em `dist/`, pronto para GitHub Pages. Publique o conteúdo de `dist/` (por exemplo, com GitHub Actions ou a pasta `docs/` do repositório). As URLs são relativas (`./`), portanto a aplicação funciona tanto na raiz quanto em um subpath como `/s-w-toolkit/`.

## PWA e cache

O Service Worker faz cache do app shell na primeira visita. Para invalidar esse cache após uma alteração estrutural, aumente `CACHE_VERSION` em `service-worker.js` (por exemplo, de `v1` para `v2`) e publique o novo build.

## PouchDB e seed

A camada `PouchDbCardRepository` concentra `create`, `find`, `findAll`, `update` e `delete`. A exclusão é lógica: a carta continua marcada como removida e um seed excluído não retorna em uma nova inicialização. `ensureSeedCards()` só inclui seeds ausentes. A persistência permanece local ao navegador, sem backend ou sincronização remota.

## Publicação no GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` executa testes, gera `dist/` e publica o artefato em cada push para `main`. No repositório, habilite **Settings → Pages → Source: GitHub Actions**. Os caminhos usam `./`, portanto funcionam em um subpath como `/s-w-toolkit/`.

## Offline e atualização

Após a primeira visita por HTTP(S), o Service Worker armazena o app shell e permite reabrir a aplicação offline. Para publicar alterações cacheadas, aumente `CACHE_VERSION` em `service-worker.js` e gere um novo build. A versão atual é `v5`.
