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
  /**
   * Cupom que não mexe no total: o desconto é combinado no atendimento e só
   * viaja como observação no pedido do WhatsApp.
   */
  informativo?: boolean
  /** Rótulo curto da condição, usado no resumo e na mensagem (ex.: "no dinheiro ou Pix"). */
  rotuloCondicao?: string
  /** Condição de uso levada para a mensagem do WhatsApp. */
  observacao?: string
}

export type ResultadoCupom =
  | { sucesso: true; cupom: Cupom }
  | { sucesso: false; mensagem: string }

/**
 * Cadastre os cupons aqui. Exemplo:
 * { codigo: 'BEMVINDO10', descricao: '10% de desconto', tipo: 'percentual',
 *   valor: 10, minimoCentavos: 10000, descontoMaximoCentavos: 5000 }
 */
export const CUPONS: Cupom[] = [
  {
    codigo: 'MEL10',
    descricao: '10% de desconto no dinheiro ou Pix',
    tipo: 'percentual',
    valor: 10,
    informativo: true,
    rotuloCondicao: 'no dinheiro ou Pix',
    observacao:
      'O desconto de 10% do cupom MEL10 vale somente para pagamento em dinheiro ou Pix e é aplicado pelo atendente na confirmação do pedido.',
  },
]

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

function descontoBruto(cupom: Cupom, subtotalCentavos: number): number {
  if (subtotalCentavos <= 0) return 0
  const bruto =
    cupom.tipo === 'percentual'
      ? Math.round(subtotalCentavos * (cupom.valor / 100))
      : cupom.valor
  return Math.min(bruto, cupom.descontoMaximoCentavos ?? bruto, subtotalCentavos)
}

/** Desconto que já entra no total do pedido. */
export function calcularDesconto(cupom: Cupom | null, subtotalCentavos: number): number {
  if (!cupom || cupom.informativo) return 0
  return descontoBruto(cupom, subtotalCentavos)
}

/**
 * Desconto do cupom informativo: não mexe no total do pedido, mas o valor já
 * sai calculado para o cliente ver quanto pagaria cumprindo a condição
 * (ex.: dinheiro ou Pix).
 */
export function calcularDescontoCondicional(
  cupom: Cupom | null,
  subtotalCentavos: number,
): number {
  if (!cupom || !cupom.informativo) return 0
  return descontoBruto(cupom, subtotalCentavos)
}

function formatarValor(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
