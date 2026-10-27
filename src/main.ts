import './styles/main.css'
import { Audio } from './engine/audio'
import { Input } from './engine/input'
import { GameLoop } from './engine/loop'
import { Renderer, suggestQuality } from './engine/renderer'
import { SaveStore } from './engine/save'
import { Game } from './game/game'
import { UI } from './ui/ui'

const mark = (name: string): void => {
  performance.mark(`aegis:${name}`)
}
async function boot(): Promise<void> {
  mark('boot')
  const canvas = document.getElementById('game') as HTMLCanvasElement
  const root = document.getElementById('ui') as HTMLElement
  const bootEl = document.getElementById('boot')
  const save = new SaveStore()
  if (save.data.runs === 0 && !localStorage.getItem('aegis-after-hours.quality-set')) {
    save.update({ quality: suggestQuality() })
    try {
      localStorage.setItem('aegis-after-hours.quality-set', '1')
    } catch {
      /* storage unavailable */
    }
  }
  // Fonts feed canvas textures (signs, map glyphs), so wait briefly for them.
  await Promise.race([
    Promise.all(['40px Bangers', '16px Figtree', '16px Sora'].map(f => document.fonts.load(f))).catch(() => undefined),
    new Promise(r => setTimeout(r, 2500)),
  ])

  mark('fonts')
  let renderer: Renderer
  try {
    renderer = new Renderer(canvas, save.data.quality)
  } catch {
    if (bootEl) bootEl.innerHTML = '<div class="boot-card"><h1>Không hỗ trợ WebGL</h1><p>Tháp Ngục Vô Tận cần trình duyệt bật WebGL. Hãy thử Chrome, Edge, Firefox hoặc Safari mới nhất.</p></div>'
    return
  }
  mark('renderer')
  const input = new Input(canvas)
  input.sensitivity = save.data.sensitivity
  input.invertY = save.data.invertY
  const audio = new Audio()
  audio.setVolumes(save.data.musicVolume, save.data.sfxVolume, save.data.muted)
  const ui = new UI(root, input)
  ui.sound = () => audio.play('ui')
  mark('ui')
  const game = new Game(renderer, input, audio, save, ui)
  mark('game')
  if (import.meta.env.DEV) {
    try {
      const [{ registerGameTuning }, { tuning }] = await Promise.all([
        import('../scripts/manus-tuning/adapter.js'),
        import('./game/tuning'),
      ])
      await registerGameTuning(tuning)
    } catch {
      /* dev tuning bridge optional */
    }
  }
  ui.onPlay = () => {
    audio.unlock()
    game.play()
  }
  ui.onTitleHowTo = () => {
    audio.unlock()
    ui.openHowTo(() => ui.showTitle(true, save.data))
  }
  ui.onTitleSettings = () => {
    audio.unlock()
    game.openSettings(() => ui.showTitle(true, save.data))
  }
  // Losing the mouse or the tab mid-fight pauses instead of letting the hero get hit.
  document.addEventListener('pointerlockchange', () => {
    if (!document.pointerLockElement && input.method === 'keyboard' && !ui.modalOpen) game.pause()
  })
  document.addEventListener('visibilitychange', () => {
    audio.setHidden(document.hidden)
    if (document.hidden) game.pause()
  })
  const loop = new GameLoop({ step: dt => game.step(dt), render: (alpha, frame) => game.render(alpha, frame) })
  // Staged boot: only the title poster blocks the title screen. The campus (hero, props,
  // shaders) is built behind it and fades in live, then the first wave's assets load; later
  // stages stream in the background, paused during busy fights (see Game.registerAssets).
  const bar = bootEl?.querySelector<HTMLElement>('.boot-bar i')
  bar?.parentElement?.classList.add('det')
  const status = bootEl?.querySelector<HTMLElement>('p')
  status?.classList.add('boot-status')
  await game.boot((p, label) => {
    if (bar) bar.style.width = `${Math.round(10 + p * 90)}%`
    if (status && label) status.textContent = label
  })
  mark('title-ready')
  loop.start()
  game.showTitle()
  bootEl?.classList.add('done')
  mark('title')
  window.setTimeout(() => bootEl?.remove(), 600)
}

void boot()
