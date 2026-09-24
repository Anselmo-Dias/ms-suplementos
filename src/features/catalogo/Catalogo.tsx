import { ShoppingCart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { buscar, produtoPorId, produtosDe } from '../../data/catalogo'
import type { FiltroCategoria, Produto, SubcategoriaWhey } from '../../data/types'
// import { Banners } from './Banners'
import { Cabecalho } from './Cabecalho'
import { CarrosselProdutos } from './CarrosselProdutos'
import { CarrinhoDrawer } from './CarrinhoDrawer'
import { ProdutoCard } from './ProdutoCard'
import { ProdutoModal } from './ProdutoModal'
import { RodapeCatalogo } from './Rodape'
import { nomeDaCategoria } from './categorias'
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

  // Indisponíveis vão para o fim da grade — quem está comprando vê primeiro
  // o que dá para comprar.
  const lista = useMemo(() => {
    const filtrados = buscar(produtosDe(categoria), busca)
    return [...filtrados].sort(
      (a, b) => Number(semCompra(a)) - Number(semCompra(b)),
    )
  }, [categoria, busca])

  const aberto = produtoAberto ? produtoPorId(produtoAberto) : undefined
  const faixasWhey = categoria === 'whey' && !busca.trim()

  return (
    <div className="catalogo">
      <Cabecalho
        categoriaAtiva={categoria}
        busca={busca}
        onBusca={setBusca}
      />

      <main>
        {/* Banners desativados — para voltar, descomente esta linha e o import.
        {categoria === 'todos' && !busca.trim() && <Banners />} */}

        <section className="section" id="catalogo">
          <div className="container">
            <div className="section-head">
              <p className="label">
                {busca.trim() ? 'Resultados da busca' : nomeDaCategoria(categoria)}
              </p>
            </div>

            {faixasWhey ? (
              <FaixasWhey produtos={lista} onAbrir={onAbrirProduto} />
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

const FAIXAS_WHEY: Array<{ id: SubcategoriaWhey | undefined; nome: string }> = [
  { id: 'isolado', nome: 'Whey Isolado' },
  { id: 'concentrado', nome: 'Whey Concentrado' },
  { id: 'blend', nome: 'Blends' },
  // Albuminas, proteína da carne e veganas ficam na aba, mas não são whey.
  { id: undefined, nome: 'Outras proteínas' },
]

/** A aba Whey separada por tipo, uma faixa arrastável para cada. */
function FaixasWhey({
  produtos,
  onAbrir,
}: {
  produtos: Produto[]
  onAbrir: (id: string) => void
}) {
  return (
    <>
      {FAIXAS_WHEY.map((f) => {
        const daFaixa = produtos.filter((p) => p.subcategoria === f.id)
        if (!daFaixa.length) return null
        return (
          <CarrosselProdutos
            key={f.nome}
            titulo={f.nome}
            produtos={daFaixa}
            onAbrir={onAbrir}
          />
        )
      })}
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
