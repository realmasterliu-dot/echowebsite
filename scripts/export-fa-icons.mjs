/**
 * Export Font Awesome solid icons used by the H5 site as PNGs for WeChat.
 * Source of truth: same @fortawesome/free-solid-svg-icons package as E:\echowebsite.
 *
 * Usage: npm run icons:export
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import {
  faObjectUngroup,
  faPhotoFilm,
  faUser,
  faUsersBetweenLines,
  faWandMagicSparkles,
  faCompass,
  faSquareRss,
  faMessage,
  faDonate,
  faRedo,
  faArrowUpWideShort,
  faBroadcastTower,
  faCubes,
  faHeart,
  faArrowTrendUp,
  faDollarSign,
  faHandshake,
  faBolt,
  faBed,
  faListCheck,
  faClipboard,
  faMagnifyingGlassChart,
  faNetworkWired,
  faClapperboard,
  faShareNodes,
  faChartBar,
  faPhone,
  faPaperPlane,
  faHome,
  faTags,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const contentDir = path.join(root, 'src/static/icons/content')
const tabDir = path.join(root, 'src/static/icons/tab')

const BRAND = '#FF5500'
const MUTED = '#999999'
const WHITE = '#FFFFFF'

/** @type {Record<string, { icon: object, color?: string }>} */
const contentIcons = {
  'object-ungroup': { icon: faObjectUngroup },
  'photo-film': { icon: faPhotoFilm },
  user: { icon: faUser },
  'users-between-lines': { icon: faUsersBetweenLines },
  'wand-magic-sparkles': { icon: faWandMagicSparkles },
  compass: { icon: faCompass },
  'square-rss': { icon: faSquareRss },
  message: { icon: faMessage },
  donate: { icon: faDonate },
  redo: { icon: faRedo },
  'arrow-up-wide-short': { icon: faArrowUpWideShort },
  'broadcast-tower': { icon: faBroadcastTower },
  cubes: { icon: faCubes },
  heart: { icon: faHeart },
  'arrow-trend-up': { icon: faArrowTrendUp },
  'dollar-sign': { icon: faDollarSign },
  handshake: { icon: faHandshake },
  bolt: { icon: faBolt },
  bed: { icon: faBed },
  'list-check': { icon: faListCheck },
  clipboard: { icon: faClipboard },
  'magnifying-glass-chart': { icon: faMagnifyingGlassChart },
  'network-wired': { icon: faNetworkWired },
  clapperboard: { icon: faClapperboard },
  'share-nodes': { icon: faShareNodes },
  'chart-bar': { icon: faChartBar },
  phone: { icon: faPhone },
  'paper-plane': { icon: faPaperPlane },
  'paper-plane-white': { icon: faPaperPlane, color: WHITE },
}

/** Tab bar: inactive muted / active brand */
const tabIcons = {
  home: faHome,
  about: faCompass,
  pricing: faTags,
  contact: faEnvelope,
}

function iconToSvg(icon, color, size = 128) {
  const [w, h, , , d] = icon.icon
  const paths = Array.isArray(d) ? d : [d]
  const pathEl = paths.map((p) => `<path fill="${color}" d="${p}"/>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${w} ${h}">${pathEl}</svg>`
}

async function writePng(svg, outPath) {
  await sharp(Buffer.from(svg)).png().toFile(outPath)
}

async function main() {
  fs.mkdirSync(contentDir, { recursive: true })
  fs.mkdirSync(tabDir, { recursive: true })

  for (const [name, { icon, color = BRAND }] of Object.entries(contentIcons)) {
    await writePng(iconToSvg(icon, color, 128), path.join(contentDir, `${name}.png`))
    console.log('content', name)
  }

  for (const [name, icon] of Object.entries(tabIcons)) {
    await writePng(iconToSvg(icon, MUTED, 81), path.join(tabDir, `${name}.png`))
    await writePng(iconToSvg(icon, BRAND, 81), path.join(tabDir, `${name}-active.png`))
    console.log('tab', name)
  }

  console.log('Done:', Object.keys(contentIcons).length, 'content +', Object.keys(tabIcons).length, 'tabs')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
