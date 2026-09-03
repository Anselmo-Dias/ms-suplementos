/* ==========================================================================
   MS Suplementos — configuração do link na bio
   É só editar este arquivo: nomes, telefones, endereços e horários.
   ========================================================================== */

/** Um turno de atendimento: ['09:00', '12:00']. */
export type Turno = [abre: string, fecha: string]

/**
 * Turnos de cada dia da semana. 0 = domingo … 6 = sábado.
 * Lista vazia = fechado naquele dia; duas entradas = fecha para o almoço.
 */
export type Horario = Record<number, Turno[]>

export type Loja = {
  nome: string
  whatsapp: string // formato internacional, só dígitos: 55 + DDD + número
  telefone: string
  /** Endereço em duas linhas */
  endereco: [string, string]
  /** Texto de busca usado no Google Maps */
  query: string
  horario: Horario
}

export const SITE = {
  nome: 'MS Suplementos',
  handle: '@mssuplementos12',
  bio: 'Força, foco e resultado. Suplementos originais com preço justo em Aracaju — SE.',
  instagram: 'https://www.instagram.com/mssuplementos12',
  logo: '/logo-ms.jpg',
  cidade: 'Aracaju/SE',

  /** Qual loja responde o botão flutuante. 0 = Centro, 1 = Orlando Dantas. */
  lojaPrincipal: 1,

  lojas: [
    {
      nome: 'Loja do Centro',
      whatsapp: '5579999933612',
      telefone: '(79) 99993-3612',
      endereco: ['R. Capela, 167 — Centro', 'Aracaju/SE • 49010-370'],
      query: 'R. Capela, 167 - Centro, Aracaju - SE, 49010-370',
      horario: {
        0: [], // domingo
        1: [['08:00', '18:00']],
        2: [['08:00', '18:00']],
        3: [['08:00', '18:00']],
        4: [['08:00', '18:00']],
        5: [['08:00', '18:00']],
        6: [['08:00', '13:00']], // sábado
      },
    },
    {
      nome: 'Loja Orlando Dantas',
      whatsapp: '5579999992460',
      telefone: '(79) 99999-2460',
      endereco: [
        'R. Eduardo Dantas do Espírito Santo, 505 — São Conrado',
        'Aracaju/SE • 49042-140',
      ],
      query:
        'R. Eduardo Dantas do Espírito Santo, 505 - São Conrado, Aracaju - SE, 49042-140',
      horario: {
        0: [], // domingo
        // fecha para o almoço
        1: [
          ['09:00', '12:00'],
          ['13:00', '19:00'],
        ],
        2: [
          ['09:00', '12:00'],
          ['13:00', '19:00'],
        ],
        3: [
          ['09:00', '12:00'],
          ['13:00', '19:00'],
        ],
        4: [
          ['09:00', '12:00'],
          ['13:00', '19:00'],
        ],
        5: [
          ['09:00', '12:00'],
          ['13:00', '19:00'],
        ],
        6: [['09:00', '13:00']], // sábado
      },
    },
  ] as Loja[],
} as const

export function loja(i?: number): Loja {
  return SITE.lojas[i ?? SITE.lojaPrincipal] ?? SITE.lojas[SITE.lojaPrincipal]
}
