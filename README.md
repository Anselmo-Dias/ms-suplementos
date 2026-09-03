# MS Suplementos

Link na bio + catálogo completo, em React + TypeScript + Vite, com
[TanStack Router](https://tanstack.com/router/latest/docs/overview).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + build de produção
npm run lint
```

## Telas

| Rota | O que é |
| --- | --- |
| `/` | Link na bio: perfil, WhatsApp de cada loja, mapa das unidades |
| `/catalogo` | Catálogo completo (categoria "Todos") |
| `/catalogo/$categoria` | Catálogo filtrado por categoria |
| `?produto=<id>` | Abre a ficha do produto em modal, em qualquer das duas rotas acima |

O catálogo antigo selecionava a categoria por `?cat=whey`. Links já
compartilhados continuam funcionando: `/catalogo?cat=whey` redireciona para
`/catalogo/whey`, preservando `?produto=`.

## Estrutura

```
src/
  routes/            rotas (file-based; routeTree.gen.ts é gerado pelo Vite)
  config/site.ts     lojas, WhatsApp, endereços e horário — edite só aqui
  data/
    types.ts         tipo Produto e as categorias
    catalogo.ts      índices por id/categoria/marca + busca
    produtos/*.json  261 produtos, um arquivo por categoria
  features/
    linktree/        tela do link na bio
    catalogo/        header, grade, card, modal e carrinho
  hooks/  lib/  components/
  styles/
    global.css       tokens e reset compartilhados
    linktree.css     tela `/`
    catalogo.css     tela `/catalogo` (tokens escopados em `.catalogo`)
public/img/          imagens dos produtos e banners (webp)
```

### Sobre os dados

Os produtos vivem em `src/data/produtos/*.json`, um arquivo por categoria.
Para editar um produto, mexa no JSON da categoria dele — o tipo `Produto`
(`src/data/types.ts`) descreve todos os campos.

Pontos que valem saber:

- **Preço em centavos** (`precoCentavos: 11000`). `null` significa "sob
  consulta" e bloqueia o botão de adicionar ao carrinho.
- **Modo atacado** aplica um desconto fixo de 15% (`lib/preco.ts`). Não existe
  preço de atacado por produto — se um dia existir, é ali que entra.
- **"Mais Vendidos"** é o campo `destaque: true`. A aba mostra os 5 primeiros
  de cada categoria, então ela não tem contador na barra de navegação.
- **Imagens** são caminhos absolutos (`/img/whey/...`), servidas de `public/`.
  Nunca são importadas — ficam fora do bundle.

## Migração do site antigo

`public_html/catalogo-deploy` é a versão anterior (HTML + JS solto). Os scripts
que trouxeram os dados para cá rodam uma vez e ficam no repositório como
registro do que foi feito:

```bash
npm run migrar:catalogo   # extrai os 261 produtos do script.js legado
npm run migrar:banners    # converte os 3 banners
```

O relatório da última execução está em `scripts/relatorio-migracao.md`, com as
pendências que sobraram (33 produtos sem marca, 39 indisponíveis).
