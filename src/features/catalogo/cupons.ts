export type Cupom = {
  codigo: string
  descricao: string
  tipo: 'percentual' | 'fixo'
  /** Percentual inteiro (ex.: 10) ou valor fixo em centavos. */
  valor: number
  minimoCentavos?: number
  descontoMaximoCentavos?: number
  permiteAtacado?: boolean
  ativo?: boolean
  validoAte?: string
}

export type ResultadoCupom =
  | { sucesso: true; cupom: Cupom }
  | { sucesso: false; mensagem: string }

/**
 * Cadastre os cupons aqui. Exemplo:
 * { codigo: 'BEMVINDO10', descricao: '10% de desconto', tipo: 'percentual',
 *   valor: 10, minimoCentavos: 10000, descontoMaximoCentavos: 5000 }
 */
export const CUPONS: Cupom[] = []

export function normalizarCodigoCupom(codigo: string): string {
  return codigo.trim().toLocaleUpperCase('pt-BR').replace(/\s+/g, '')
}

export function validarCupom(
  codigoInformado: string,
  subtotalCentavos: number,
  atacado: boolean,
): ResultadoCupom {
  const codigo = normalizarCodigoCupom(codigoInformado)
  if (!codigo) return { sucesso: false, mensagem: 'Digite um código de cupom.' }

  const cupom = CUPONS.find((item) => normalizarCodigoCupom(item.codigo) === codigo)
  if (!cupom || cupom.ativo === false) {
    return { sucesso: false, mensagem: 'Cupom inválido ou indisponível.' }
  }
  if (cupom.validoAte && Date.now() > new Date(cupom.validoAte).getTime()) {
    return { sucesso: false, mensagem: 'Este cupom expirou.' }
  }
  if (atacado && !cupom.permiteAtacado) {
    return { sucesso: false, mensagem: 'Este cupom não é válido no atacado.' }
  }
  if (subtotalCentavos < (cupom.minimoCentavos ?? 0)) {
    return {
      sucesso: false,
      mensagem: `Pedido mínimo de ${formatarValor(cupom.minimoCentavos ?? 0)} para usar este cupom.`,
    }
  }
  return { sucesso: true, cupom }
}

export function calcularDesconto(cupom: Cupom | null, subtotalCentavos: number): number {
  if (!cupom || subtotalCentavos <= 0) return 0
  const bruto =
    cupom.tipo === 'percentual'
      ? Math.round(subtotalCentavos * (cupom.valor / 100))
      : cupom.valor
  return Math.min(bruto, cupom.descontoMaximoCentavos ?? bruto, subtotalCentavos)
}

function formatarValor(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
