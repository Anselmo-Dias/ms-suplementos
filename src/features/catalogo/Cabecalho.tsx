import { Link } from '@tanstack/react-router'
import { Menu, Package, Search, ShoppingCart, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { CATEGORIAS_NAV } from './categorias'
import { useCarrinho } from './carrinho-contexto'
import type { FiltroCategoria } from '../../data/types'
import { contarCategoria } from '../../data/catalogo'

type Props = {
  categoriaAtiva: FiltroCategoria
  busca: string
  onBusca: (termo: string) => void
  menuAberto: boolean
  onMenu: (aberto: boolean) => void
}

export function Cabecalho({
  categoriaAtiva,
  busca,
  onBusca,
  menuAberto,
  onMenu,
}: Props) {
  const { quantidade, abrir, atacado, alternarAtacado } = useCarrinho()
  const trilho = useRef<HTMLDivElement>(null)

  // Mantém a categoria ativa visível quando a barra rola no mobile.
  useEffect(() => {
    const t = trilho.current
    const ativo = t?.querySelector<HTMLElement>('.is-active')
    if (t && ativo) {
      t.scrollLeft = ativo.offsetLeft - t.clientWidth / 2 + ativo.offsetWidth / 2
    }
  }, [categoriaAtiva])

  return (
    <div className="site-header">
      <header className="header">
        <div className="container header-inner">
          <button
            type="button"
            className="mobile-menu-trigger"
            aria-label="Menu"
            onClick={() => onMenu(true)}
          >
            <Menu className="ico" />
          </button>

          <Link className="logo" to="/">
            <img src="/logo-ms.jpg" alt="MS Suplementos" className="logo-img" />
            <span>
              MS<span className="logo-dot">.</span>Suplementos
            </span>
          </Link>

          <div className="header-search">
            <input
              type="search"
              className="header-search-input"
              placeholder="Buscar produtos e marcas"
              aria-label="Buscar produtos no catálogo"
              value={busca}
              onChange={(e) => onBusca(e.target.value)}
            />
            <span className="header-search-btn" aria-hidden="true">
              <Search className="ico" />
            </span>
          </div>

          <div className="header-actions">
            {/* Pílula com rótulo — não usa `.header-action`, que é a caixa
                quadrada dos botões só de ícone. */}
            <button
              type="button"
              className={`btn-atacado ${atacado ? 'is-active' : ''}`}
              aria-pressed={atacado}
              title={
                atacado
                  ? 'Modo atacado ativo — clique para voltar ao varejo'
                  : 'Ver preços de atacado'
              }
              onClick={alternarAtacado}
            >
              <Package className="ico" />
              {/* Rótulo fixo: o estado vem da cor e do aria-pressed. Trocar o
                  texto mudava a largura do botão e empurrava a busca. */}
              <span className="atacado-label">Atacado</span>
            </button>

            <button
              type="button"
              className="header-action cart-trigger"
              aria-label="Abrir carrinho"
              aria-expanded={false}
              onClick={abrir}
            >
              <span className="header-action-badge-wrap">
                <ShoppingCart className="ico header-action-ico" />
                <span className="cart-count">{quantidade}</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-menu-overlay ${menuAberto ? 'is-open' : ''}`}
        onClick={() => onMenu(false)}
      />

      <nav className={`mainnav ${menuAberto ? 'is-open' : ''}`} aria-label="Categorias">
        <div className="mainnav-header">
          <span className="mainnav-title">Categorias</span>
          <button
            type="button"
            className="mobile-menu-close"
            aria-label="Fechar menu"
            onClick={() => onMenu(false)}
          >
            <X className="ico" />
          </button>
        </div>
        <div className="container mainnav-inner" ref={trilho}>
          <div className="mainnav-list">
            {CATEGORIAS_NAV.map((c) => {
              const ativo = c.id === categoriaAtiva
              return (
                <Link
                  key={c.id}
                  to="/catalogo/$categoria"
                  params={{ categoria: c.id }}
                  className={`mainnav-item ${ativo ? 'is-active' : ''}`}
                  aria-current={ativo ? 'true' : 'false'}
                  onClick={() => onMenu(false)}
                >
                  {c.nome}
                  {/* "Mais Vendidos" é uma vitrine (top 5 de cada categoria),
                      não uma lista filtrada — um número ali enganaria. */}
                  {c.id !== 'mais-vendidos' && (
                    <span className="mainnav-count">{contarCategoria(c.id)}</span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
