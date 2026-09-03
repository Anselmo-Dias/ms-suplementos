/* ==========================================================================
   MS Suplementos — configuração do link na bio
   É só editar este arquivo: nomes, telefones, endereços e horário.
   ========================================================================== */

export type Loja = {
  nome: string
  whatsapp: string // formato internacional, só dígitos: 55 + DDD + número
  telefone: string
  /** Endereço em duas linhas (usa <br /> no meio) */
  endereco: [string, string]
  /** Texto de busca usado no Google Maps */
  query: string
}

/** 0 = domingo … 6 = sábado. [abre, fecha] em horas. null = fechado. */
export type Horario = Record<number, [number, number] | null>

export const SITE = {
  nome: 'MS Suplementos',
  handle: '@mssuplementos12',
  bio: 'Força, foco e resultado. Suplementos originais com preço justo em Aracaju — SE.',
  instagram: 'https://www.instagram.com/mssuplementos12',
  logo: '/logo-ms.jpg',
  cidade: 'Aracaju/SE',

  /** Qual loja responde o botão flutuante. 0 = Centro, 1 = Orlando Dantas. */
  lojaPrincipal: 1,

  horario: {
    0: null,
    1: [8, 18],
    2: [8, 18],
    3: [8, 18],
    4: [8, 18],
    5: [8, 18],
    6: [8, 18],
  } as Horario,

  lojas: [
    {
      nome: 'Loja do Centro',
      whatsapp: '5579999933612',
      telefone: '(79) 99993-3612',
      endereco: ['R. Capela, 167 — Centro', 'Aracaju/SE • 49010-370'],
      query: 'R. Capela, 167 - Centro, Aracaju - SE, 49010-370',
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
    },
  ] as Loja[],
} as const

export function loja(i?: number): Loja {
  return SITE.lojas[i ?? SITE.lojaPrincipal] ?? SITE.lojas[SITE.lojaPrincipal]
}
