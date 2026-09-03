import { Check, ChevronLeft, ChevronRight, Eye, Plus, Slash } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Produto } from '../../data/types'
import { useCarrinho } from './carrinho-contexto'
import { formatarCentavos, precoVigente, semCompra } from './lib/preco'

type Props = {
  produto: Produto
  onAbrir: (id: string) => void
}

export function ProdutoCard({ produto: p, onAbrir }: Props) {
  const { adicionar, atacado } = useCarrinho()
  const [iVariacao, setIVariacao] = useState(0)
  const [confirmando, setConfirmando] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const variacoes = p.variacoes ?? []
  const variacaoAtual = variacoes[iVariacao]
  const imagem = variacaoAtual?.imagem ?? p.imagem
  const bloqueado = semCompra(p)
  const preco = precoVigente(p, atacado)

  const textoAcao = p.indisponivel
    ? 'Indisponível'
    : preco === null
      ? 'Consultar preço'
      : 'Adicionar'

  function girarVariacao(dir: number) {
    setIVariacao((i) => (i + dir + variacoes.length) % variacoes.length)
  }

  function aoAdicionar() {
    adicionar(p, variacaoAtual?.nome ?? null)
    // Feedback no próprio card: a partir do segundo item o painel não abre mais.
    setConfirmando(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setConfirmando(false), 1400)
  }

  return (
    <article
      className="card"
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes de ${p.nome}`}
      onClick={() => onAbrir(p.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onAbrir(p.id)
        }
      }}
    >
      <div className={`card-media ${p.indisponivel ? 'is-esgotado' : ''}`}>
        {imagem ? (
          <img src={imagem} alt={p.nome} loading="lazy" decoding="async" />
        ) : (
          <span className="placeholder">Sem imagem</span>
        )}

        {variacoes.length > 1 && (
          <>
            <button
              type="button"
              className="promo-nav promo-prev card-media-nav"
              aria-label="Imagem anterior"
              onClick={(e) => {
                e.stopPropagation()
                girarVariacao(-1)
              }}
            >
              <ChevronLeft className="ico" />
            </button>
            <button
              type="button"
              className="promo-nav promo-next card-media-nav"
              aria-label="Próxima imagem"
              onClick={(e) => {
                e.stopPropagation()
                girarVariacao(1)
              }}
            >
              <ChevronRight className="ico" />
            </button>
          </>
        )}
      </div>

      <h4 className="card-name">{p.nome}</h4>

      <div className="card-price-block">
        <BlocoPreco produto={p} atacado={atacado} />
      </div>

      <div className="card-btns">
        <button
          type="button"
          className="btn-detalhes"
          title="Ver detalhes do produto"
          aria-label={`Ver detalhes de ${p.nome}`}
          onClick={(e) => {
            e.stopPropagation()
            onAbrir(p.id)
          }}
        >
          <Eye className="ico" />
        </button>

        <button
          type="button"
          className={`btn-add-card ${confirmando ? 'is-added' : ''}`}
          disabled={bloqueado}
          title={bloqueado ? textoAcao : 'Adicionar ao carrinho'}
          aria-label={
            bloqueado ? `${textoAcao}: ${p.nome}` : `Adicionar ${p.nome} ao carrinho`
          }
          onClick={(e) => {
            e.stopPropagation()
            aoAdicionar()
          }}
        >
          {p.indisponivel ? (
            <Slash className="ico" />
          ) : confirmando ? (
            <Check className="ico" />
          ) : (
            <Plus className="ico" />
          )}
          <span className="btn-add-label">
            {confirmando ? 'Adicionado' : textoAcao}
          </span>
        </button>
      </div>
    </article>
  )
}

/** Bloco de preço do card — no atacado mostra o varejo riscado e a economia. */
export function BlocoPreco({
  produto: p,
  atacado,
}: {
  produto: Produto
  atacado: boolean
}) {
  if (p.precoCentavos === null) {
    return (
      <>
        <span className="card-price">Preço a definir</span>
        <span className="card-installment preco-nota">Consulte a loja</span>
      </>
    )
  }

  const vigente = precoVigente(p, atacado)!

  if (atacado) {
    return (
      <>
        <span className="preco-antigo">{formatarCentavos(p.precoCentavos)}</span>
        <span className="card-price">{formatarCentavos(vigente)}</span>
        <span className="card-installment preco-nota">
          Atacado · economize {formatarCentavos(p.precoCentavos - vigente)}
        </span>
      </>
    )
  }

  return (
    <>
      <span className="card-price">{formatarCentavos(vigente)}</span>
      <span className="card-installment">5% de desconto no dinheiro ou pix</span>
    </>
  )
}
