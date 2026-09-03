import { SITE } from '../config/site'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const hh = (h: number) => `${h < 10 ? '0' : ''}${h}h`

/** Monta "Seg a Sáb • 08h às 18h" a partir dos dias abertos com a mesma faixa. */
export function resumoHorario(): string {
  const abertos: number[] = []
  for (let d = 0; d <= 6; d++) if (SITE.horario[d]) abertos.push(d)
  if (!abertos.length) return 'Consulte nosso horário'

  const faixa = SITE.horario[abertos[0]]!
  const mesmaFaixa = abertos.every((d) => {
    const f = SITE.horario[d]!
    return f[0] === faixa[0] && f[1] === faixa[1]
  })
  if (!mesmaFaixa) return 'Consulte nosso horário'

  const horas = `${hh(faixa[0])} às ${hh(faixa[1])}`
  if (abertos.length === 1) return `${DIAS[abertos[0]]} • ${horas}`

  const seguidos = abertos[abertos.length - 1] - abertos[0] === abertos.length - 1
  if (seguidos) return `${DIAS[abertos[0]]} a ${DIAS[abertos[abertos.length - 1]]} • ${horas}`
  return `${abertos.map((d) => DIAS[d]).join(', ')} • ${horas}`
}

export type StatusAgora = { aberto: boolean; texto: string }

/** Diz se está aberto agora e o texto da pílula de status. */
export function statusAgora(agora = new Date()): StatusAgora {
  const resumo = resumoHorario()
  const faixa = SITE.horario[agora.getDay()]
  const aberto = !!faixa && agora.getHours() >= faixa[0] && agora.getHours() < faixa[1]

  return {
    aberto,
    texto: aberto
      ? `Aberto agora • até ${hh(faixa![1])}`
      : // evita dois bullets seguidos
        `Fechado • ${resumo.replace(' • ', ', ')}`,
  }
}

/** Quebra "Seg a Sáb • 08h às 18h" em [rótulo, horas] para o rodapé. */
export function partesHorario(): [string, string] {
  const resumo = resumoHorario()
  const i = resumo.indexOf('•')
  if (i < 0) return [resumo, '']
  return [resumo.slice(0, i).trim(), resumo.slice(i + 1).trim()]
}
