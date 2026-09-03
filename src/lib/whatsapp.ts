import { loja } from '../config/site'

/** Monta o link do WhatsApp de uma loja com a mensagem já preenchida. */
export function waLink(msg: string, iLoja?: number): string {
  return `https://wa.me/${loja(iLoja).whatsapp}?text=${encodeURIComponent(msg || 'Olá!')}`
}

/** Link de rota no Google Maps até a loja. */
export function rotaLink(iLoja: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loja(iLoja).query)}`
}

/** URL do mapa embutido (só é usada quando o visitante pede). */
export function mapaEmbedLink(iLoja: number): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(loja(iLoja).query)}&hl=pt-BR&z=16&output=embed`
}
