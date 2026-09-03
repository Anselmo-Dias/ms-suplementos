/**
 * Converte os 3 banners usados no catálogo legado para webp em public/img/banners.
 *   node scripts/migrar-banners.mjs
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const raiz = path.resolve(fileURLToPath(import.meta.url), '../..')
const legado = path.resolve(raiz, '../public_html/catalogo-deploy')
const destino = path.join(raiz, 'public/img/banners')

const BANNERS = [
  ['banners/promo-6.webp_2K_202608042023.jpeg', 'banner-1.webp'],
  ['banners/Translate_prompt_to_generate_banner_202608042023.jpeg', 'banner-2.webp'],
  ['banners/Create_product_banner_2K_202608041955.jpeg', 'banner-3.webp'],
]

await fs.mkdir(destino, { recursive: true })

let antes = 0
let depois = 0

for (const [origem, nome] of BANNERS) {
  const entrada = path.join(legado, origem)
  const saida = path.join(destino, nome)
  antes += (await fs.stat(entrada)).size
  await sharp(entrada)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(saida)
  depois += (await fs.stat(saida)).size
  console.log(`${origem} -> img/banners/${nome}`)
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`
console.log(`\nBanners: ${mb(antes)} -> ${mb(depois)}`)
