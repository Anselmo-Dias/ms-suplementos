import { ShoppingCart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { buscar, produtoPorId, produtosDe } from '../../data/catalogo'
import type { FiltroCategoria } from '../../data/types'
import { Banners } from './Banners'
import { Cabecalho } from './Cabecalho'
import { CarrosselProdutos } from './CarrosselProdutos'
import { CarrinhoDrawer } from './CarrinhoDrawer'
import { ProdutoCard } from './ProdutoCard'
import { ProdutoModal } from './ProdutoModal'
import { RodapeCatalogo } from './Rodape'
import { CATEGORIAS_NAV, nomeDaCategoria } from './categorias'
import { CarrinhoProvider } from './carrinho'
import { useCarrinho } from './carrinho-contexto'
import { formatarCentavos, semCompra } from './lib/preco'

type Props = {
  categoria: FiltroCategoria
  produtoAberto?: string
  onAbrirProduto: (id: string | undefined) => void
}

export function Catalogo(props: Props) {
  return (
    <CarrinhoProvider>
      <Conteudo {...props} />
    </CarrinhoProvider>
  )
}

function Conteudo({ categoria, produtoAberto, onAbrirProduto }: Props) {
  const [busca, setBusca] = useState('')
  const [menuAberto, setMenuAberto] = useState(false)

  // Indisponíveis vão para o fim da grade — quem está comprando vê primeiro
  // o que dá para comprar.
  const lista = useMemo(() => {
    const filtrados = buscar(produtosDe(categoria), busca)
    return [...filtrados].sort(
      (a, b) => Number(semCompra(a)) - Number(semCompra(b)),
    )
  }, [categoria, busca])

  const aberto = produtoAberto ? produtoPorId(produtoAberto) : undefined
  const vitrine = categoria === 'mais-vendidos' && !busca.trim()

  return (
    <div className="catalogo">
      <Cabecalho
        categoriaAtiva={categoria}
        busca={busca}
        onBusca={setBusca}
        menuAberto={menuAberto}
        onMenu={setMenuAberto}
      />

      <main>
        {categoria === 'todos' && !busca.trim() && <Banners />}

        <section className="section" id="catalogo">
          <div className="container">
            <div className="section-head">
              <p className="label">
                {busca.trim() ? 'Resultados da busca' : nomeDaCategoria(categoria)}
              </p>
            </div>

            {vitrine ? (
              <Vitrine onAbrir={onAbrirProduto} />
            ) : lista.length === 0 ? (
              <p className="empty">Nenhum produto encontrado.</p>
            ) : (
              <div className="grid">
                {lista.map((p) => (
                  <ProdutoCard key={p.id} produto={p} onAbrir={onAbrirProduto} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <RodapeCatalogo />

      {aberto && (
        <ProdutoModal produto={aberto} onFechar={() => onAbrirProduto(undefined)} />
      )}

      <CarrinhoDrawer />
      <BotaoFlutuante />
    </div>
  )
}

/** "Mais Vendidos" mostra os 5 primeiros de cada categoria, em carrosséis. */
function Vitrine({ onAbrir }: { onAbrir: (id: string) => void }) {
  const secoes = useMemo(
    () =>
      CATEGORIAS_NAV.slice(2)
        .map((cat) => ({
          ...cat,
          produtos: produtosDe(cat.id)
            .filter((p) => !p.indisponivel)
            .slice(0, 5),
        }))
        .filter((s) => s.produtos.length > 0),
    [],
  )

  if (!secoes.length) return <p className="empty">Nenhum produto encontrado.</p>

  return (
    <>
      {secoes.map((s) => (
        <CarrosselProdutos
          key={s.id}
          titulo={s.nome}
          produtos={s.produtos}
          onAbrir={onAbrir}
        />
      ))}
    </>
  )
}

/** Barra de carrinho fixa no mobile. */
function BotaoFlutuante() {
  const { quantidade, totalCentavos, abrir } = useCarrinho()
  if (quantidade === 0) return null

  return (
    <button
      type="button"
      className="cart-float-btn is-visible"
      aria-label="Ver carrinho"
      onClick={abrir}
    >
      <ShoppingCart className="ico cart-float-icon" />
      <span className="cart-float-count">{quantidade}</span>
      <span className="cart-float-total">{formatarCentavos(totalCentavos)}</span>
    </button>
  )
}
