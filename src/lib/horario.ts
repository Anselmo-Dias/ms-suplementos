import type { Horario, Loja, Turno } from '../config/site'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const DIA_EM_MINUTOS = 24 * 60

/** '09:30' -> 570 (minutos desde a meia-noite) */
function emMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + (m || 0)
}

/** '09:00' -> '09h' ; '09:30' -> '09h30' */
export function formatarHora(hora: string): string {
  const [h, m] = hora.split(':')
  return m && m !== '00' ? `${h}h${m}` : `${h}h`
}

/** [['09:00','12:00'], ['13:00','19:00']] -> '09h às 12h e 13h às 19h' */
export function formatarTurnos(turnos: Turno[]): string {
  if (!turnos.length) return 'Fechado'
  return turnos
    .map(([abre, fecha]) => `${formatarHora(abre)} às ${formatarHora(fecha)}`)
    .join(' e ')
}

const mesmaFaixa = (a: Turno[], b: Turno[]) =>
  a.length === b.length && a.every((t, i) => t[0] === b[i][0] && t[1] === b[i][1])

export type LinhaHorario = { dias: string; turnos: string; fechado: boolean }

/**
 * Agrupa dias seguidos com o mesmo atendimento numa linha só:
 * [{ dias: 'Seg a Sex', turnos: '09h às 12h e 13h às 19h' }, …]
 */
export function linhasDoHorario(horario: Horario): LinhaHorario[] {
  const linhas: LinhaHorario[] = []
  // Começa na segunda e termina no domingo — é como se lê um horário de loja.
  const ordem = [1, 2, 3, 4, 5, 6, 0]

  let inicio = 0
  while (inicio < ordem.length) {
    const turnos = horario[ordem[inicio]] ?? []
    let fim = inicio
    while (fim + 1 < ordem.length && mesmaFaixa(horario[ordem[fim + 1]] ?? [], turnos)) {
      fim++
    }

    const nomes =
      inicio === fim
        ? DIAS[ordem[inicio]]
        : fim === inicio + 1
          ? `${DIAS[ordem[inicio]]} e ${DIAS[ordem[fim]]}`
          : `${DIAS[ordem[inicio]]} a ${DIAS[ordem[fim]]}`

    linhas.push({
      dias: nomes,
      turnos: formatarTurnos(turnos),
      fechado: turnos.length === 0,
    })
    inicio = fim + 1
  }

  return linhas
}

export type StatusLoja = {
  aberto: boolean
  /** Quando aberto: hora em que fecha o turno atual, já formatada. */
  fechaAs?: string
  /** Quando fechado: próxima abertura em texto ('hoje às 13h', 'amanhã às 09h'). */
  abreEm?: string
  /**
   * Minutos a partir de agora até fechar (se aberto) ou até abrir (se fechado).
   * É por aqui que se compara uma loja com a outra — o texto acima já está
   * formatado e não serve para conta.
   */
  minutos?: number
}

/** Diz se a loja está aberta agora e o que vem a seguir. */
export function statusDaLoja(loja: Loja, agora = new Date()): StatusLoja {
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes()
  const hoje = agora.getDay()

  for (const [abre, fecha] of loja.horario[hoje] ?? []) {
    if (minutosAgora >= emMinutos(abre) && minutosAgora < emMinutos(fecha)) {
      return {
        aberto: true,
        fechaAs: formatarHora(fecha),
        minutos: emMinutos(fecha) - minutosAgora,
      }
    }
  }

  // Fechada: procura a próxima abertura, hoje ou nos dias seguintes.
  const proximoHoje = (loja.horario[hoje] ?? []).find(
    ([abre]) => emMinutos(abre) > minutosAgora,
  )
  if (proximoHoje) {
    return {
      aberto: false,
      abreEm: `hoje às ${formatarHora(proximoHoje[0])}`,
      minutos: emMinutos(proximoHoje[0]) - minutosAgora,
    }
  }

  for (let d = 1; d <= 7; d++) {
    const dia = (hoje + d) % 7
    const turnos = loja.horario[dia] ?? []
    if (turnos.length) {
      const quando = d === 1 ? 'amanhã' : DIAS[dia]
      return {
        aberto: false,
        abreEm: `${quando} às ${formatarHora(turnos[0][0])}`,
        minutos: d * DIA_EM_MINUTOS - minutosAgora + emMinutos(turnos[0][0]),
      }
    }
  }

  return { aberto: false }
}

/** Texto curto para a pílula: 'Aberto agora • até 19h'. */
export function textoDoStatus(status: StatusLoja): string {
  if (status.aberto) {
    return status.fechaAs ? `Aberto agora • até ${status.fechaAs}` : 'Aberto agora'
  }
  return status.abreEm ? `Fechado • abre ${status.abreEm}` : 'Fechado'
}
