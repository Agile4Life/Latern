// Batch-generate the bespoke meshes for the visual overhaul via Tripo3D (text_to_model -> get_task).
// Usage: manus-node scripts/assets/tripo-batch.mjs [name ...]   (no names = all 17 jobs below)
// Outputs: assets/source/tripo/<name>.glb + <name>.webp preview + tasks.json (resumable: finished names are skipped).
import { pathToFileURL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const { ApiClient } = await import(pathToFileURL('/home/ubuntu/skills/data-api/lib/data-api.mjs').href)
const client = new ApiClient()
const OUT = path.resolve('assets/source/tripo')
fs.mkdirSync(OUT, { recursive: true })
const TASKS = path.join(OUT, 'tasks.json')
const state = fs.existsSync(TASKS) ? JSON.parse(fs.readFileSync(TASKS, 'utf8')) : {}
const save = () => fs.writeFileSync(TASKS, JSON.stringify(state, null, 2))

const NEG = 'low quality, blurry texture, base plate, ground plane, pedestal, text, watermark, multiple objects'
const JOBS = [
  ['monitor_drone', 12000, 'A floating spherical security drone game enemy, glossy white ceramic and blue plastic shell, an orange stripe band around the middle like a hall monitor sash, a small blue peaked police-style cap shape on top with a short rotor mast, one large round red glowing camera lens eye on the front, small side vents, realistic PBR materials, clean hard-surface detail'],
  ['origami_bat', 6000, 'A bat folded from a single white exam paper sheet, crisp origami folds, wings spread wide, printed multiple-choice bubbles and red ink grade marks and handwriting on the paper, two small glowing red eyes, realistic paper material, symmetrical'],
  ['mascot_head', 10000, 'Oversized plush sports mascot costume head of a fierce griffin eagle, white and brown faux fur feathers, large cracked orange beak, angry brows, glowing violet eyes, purple team headband, realistic fur and fabric materials, head only, open neck at the bottom'],
  ['proctor_body', 20000, 'A towering floating spectral exam proctor ghost, wearing a flowing deep indigo academic graduation gown with wide bell sleeves and a gold satin stole, graduation mortarboard cap with a gold tassel, a smooth pale porcelain mask face with one single large round eye socket in the center, arms held close to the body with hands hidden inside the sleeves, no legs, the gown dissolves into tattered wisps at the bottom, realistic fabric and porcelain materials'],
  ['proctor_hand', 8000, 'A single giant open right hand wearing a pale white formal glove, fingers slightly spread, realistic stitched leather glove material, cuff at the wrist, no arm'],
  ['red_pen', 4000, 'A giant red ballpoint pen, glossy red plastic barrel, chrome clip and tip, realistic materials, straight, single object'],
  ['librarian_body', 20000, 'A towering floating spectral old librarian ghost woman, grey hair in a tight bun pierced by a yellow pencil, round glowing mint-green spectacles, long teal knitted cardigan robe with brass buttons over a long dark skirt, hands hidden inside long sleeves held together at the waist, no feet, the robe dissolves into wispy tatters at the bottom, realistic fabric materials, stern expression'],
  ['librarian_hand', 8000, 'A single large ghostly pale hand with long thin elegant fingers and long nails, slightly translucent-looking pale blue-green skin, open palm, realistic, no arm'],
  ['tome_open', 6000, 'An ancient open spell book tome, thick leather cover with brass corners, yellowed pages with handwritten text and diagrams, pages slightly fanned, realistic PBR materials'],
  ['book_closed', 2500, 'A single old closed hardcover book, worn brown leather cover with gold embossed spine bands, realistic materials'],
  ['lockers', 8000, 'A bank of three tall blue metal high school lockers side by side, vents at the top, handles and padlocks, slightly dented and scratched, realistic painted steel material'],
  ['trophy_case', 10000, 'A school trophy display cabinet, dark polished wood frame with glass doors and glass shelves, several gold trophy cups and medals inside, realistic materials'],
  ['lab_bench', 10000, 'A high school chemistry lab bench, black epoxy countertop on white cabinets, with glass beakers and flasks holding glowing green and blue liquids, a test tube rack and a small microscope on top, realistic materials'],
  ['bookshelf', 10000, 'A tall old wooden library bookshelf with five shelves fully packed with old leather books of various colors and sizes, some books leaning, realistic wood and leather materials'],
  ['gym_mats', 6000, 'A stack of three folded blue gymnastics mats next to a wooden vaulting box with a red leather top, realistic vinyl and wood materials, school gym equipment'],
  ['vending_machine', 8000, 'A modern school snack vending machine, red and white metal body, glass front with rows of colorful snacks and drinks, glowing display panel, realistic materials'],
  ['debris', 5000, 'A small cluster of broken floor tile and concrete rubble chunks with a few torn paper sheets, realistic materials, low pile'],
]

const only = process.argv.slice(2)
const jobs = JOBS.filter(([n]) => only.length === 0 || only.includes(n))
for (const [name, faces, prompt] of jobs) {
  if (state[name]?.status === 'downloaded' || state[name]?.taskId) continue
  const res = await client.callApi('Tripo3D/text_to_model', {
    body: { type: 'text_to_model', prompt, negative_prompt: NEG, face_limit: faces, texture: true, pbr: true },
  })
  const taskId = res?.data?.task_id
  console.log('submitted', name, taskId ?? JSON.stringify(res).slice(0, 300))
  if (taskId) { state[name] = { taskId, status: 'submitted' }; save() }
}

const t0 = Date.now()
while (Date.now() - t0 < 40 * 60 * 1000) {
  const pending = jobs.filter(([n]) => state[n]?.taskId && state[n].status !== 'downloaded' && state[n].status !== 'failed')
  if (pending.length === 0) break
  for (const [name] of pending) {
    const r = await client.callApi('Tripo3D/get_task', { pathParams: { task_id: state[name].taskId } })
    const d = r?.data ?? {}
    if (d.status === 'success') {
      const url = d.output?.pbr_model ?? d.output?.model ?? d.result?.pbr_model?.url ?? d.outputs?.model?.url ?? d.result?.model?.url
      const prev = d.output?.rendered_image ?? d.result?.rendered_image?.url ?? d.outputs?.previews?.[0]?.url
      if (!url) { console.log('no model url', name, JSON.stringify(d).slice(0, 600)); state[name].status = 'failed'; save(); continue }
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
      fs.writeFileSync(path.join(OUT, `${name}.glb`), buf)
      if (prev) fs.writeFileSync(path.join(OUT, `${name}-preview.webp`), Buffer.from(await (await fetch(prev)).arrayBuffer()))
      state[name].status = 'downloaded'
      state[name].bytes = buf.length
      save()
      console.log('downloaded', name, (buf.length / 1024 / 1024).toFixed(2), 'MB')
    } else if (d.status === 'failed' || d.status === 'banned' || d.status === 'cancelled') {
      state[name].status = 'failed'
      state[name].error = d.error ?? d.status
      save()
      console.log('FAILED', name, JSON.stringify(d).slice(0, 300))
    } else {
      state[name].status = d.status ?? 'unknown'
      state[name].progress = d.progress
    }
  }
  const summary = jobs.map(([n]) => `${n}:${state[n]?.status ?? '-'}${state[n]?.progress != null && state[n]?.status !== 'downloaded' ? `(${state[n].progress})` : ''}`).join(' ')
  console.log(`[${Math.round((Date.now() - t0) / 1000)}s]`, summary)
  save()
  await new Promise(r => setTimeout(r, 20000))
}
console.log('BATCH_DONE', JSON.stringify(Object.fromEntries(Object.entries(state).map(([k, v]) => [k, v.status]))))
