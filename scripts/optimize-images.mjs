/**
 * 压缩 / 降采样品牌图，满足微信「单图 ≤ 200KB」建议并减小主包。
 * Usage: npm run images:optimize
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imgDir = path.resolve(__dirname, '../src/assets/images')

/** @type {{ name: string, maxWidth: number, quality?: number, format?: 'jpeg' | 'png' }[]} */
const JOBS = [
  // 联系页横版 logo：源图 7485px 过宽，屏上约半屏宽即可
  { name: 'logo-horizontal.png', maxWidth: 900, format: 'png' },
  // 公司介绍配图（合计需压进「图片+音频 ≤200KB」建议线）
  { name: 'mockup-intro.jpg', maxWidth: 800, quality: 70, format: 'jpeg' },
]

async function optimizeOne(job) {
  const file = path.join(imgDir, job.name)
  if (!fs.existsSync(file)) {
    console.warn('skip missing', job.name)
    return
  }
  const before = fs.statSync(file).size
  const meta = await sharp(file).metadata()
  let pipeline = sharp(file).rotate()
  if (meta.width && meta.width > job.maxWidth) {
    pipeline = pipeline.resize({
      width: job.maxWidth,
      withoutEnlargement: true,
    })
  }

  let buf
  if (job.format === 'jpeg') {
    buf = await pipeline
      .jpeg({ quality: job.quality ?? 80, mozjpeg: true })
      .toBuffer()
  } else {
    buf = await pipeline
      .png({ compressionLevel: 9, palette: true, quality: 80, effort: 10 })
      .toBuffer()
  }

  // 若 palette png 反而更大，回退普通 png
  if (job.format === 'png' && buf.length >= before) {
    let p2 = sharp(file).rotate()
    if (meta.width && meta.width > job.maxWidth) {
      p2 = p2.resize({ width: job.maxWidth, withoutEnlargement: true })
    }
    buf = await p2.png({ compressionLevel: 9 }).toBuffer()
  }

  fs.writeFileSync(file + '.tmp', buf)
  fs.renameSync(file + '.tmp', file)
  const after = buf.length
  console.log(
    `${job.name}: ${(before / 1024).toFixed(1)}KB → ${(after / 1024).toFixed(1)}KB` +
      (meta.width ? ` (${meta.width}→≤${job.maxWidth}w)` : ''),
  )
}

async function main() {
  for (const job of JOBS) await optimizeOne(job)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
