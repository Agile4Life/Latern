import { CONFIG, DEFAULT_CONFIG } from './config'

type Mode = 'LIVE' | 'NEXT_ACTION' | 'NEXT_RUN'
type Boundary = 'jump' | 'dash' | 'run'
type Control = {
  id: string
  type: 'number'
  category: string
  label: string
  description: string
  unit: string
  default: number
  min: number
  max: number
  step: number
  applyMode: Mode
  integrity: 'COSMETIC' | 'GAMEPLAY'
}
type Binding = { control: Control; boundary?: Boundary; read(): number; write(value: number): void }

const bindings: Binding[] = []
function number<S extends keyof typeof CONFIG>(
  section: S,
  key: keyof typeof CONFIG[S] & string,
  label: string,
  min: number,
  max: number,
  step: number,
  unit: string,
  boundary?: Boundary,
): void {
  const values = CONFIG[section] as Record<string, number>
  const defaults = DEFAULT_CONFIG[section] as Record<string, number>
  bindings.push({
    control: Object.freeze({
      id: `${section}.${key}`,
      type: 'number',
      category: section === 'player' ? 'Movement' : section === 'camera' ? 'Camera' : 'Run',
      label,
      description:
        boundary === 'jump'
          ? 'Áp dụng ở cú nhảy tiếp theo.'
          : boundary === 'dash'
            ? 'Áp dụng ở cú lướt tiếp theo.'
            : boundary === 'run'
              ? 'Áp dụng khi bắt đầu lượt chơi mới.'
              : 'Cập nhật ngay lập tức trong bản xem trước.',
      unit,
      default: defaults[key],
      min,
      max,
      step,
      applyMode: boundary === 'run' ? 'NEXT_RUN' : boundary ? 'NEXT_ACTION' : 'LIVE',
      integrity: section === 'camera' ? 'COSMETIC' : 'GAMEPLAY',
    }),
    boundary,
    read: () => values[key],
    write: value => {
      values[key] = value
    },
  })
}

number('player', 'walkSpeed', 'Tốc độ di chuyển', 4, 16, 0.2, 'm/s')
number('player', 'sprintSpeed', 'Tốc độ chạy nước rút', 6, 22, 0.2, 'm/s')
number('player', 'jumpSpeed', 'Lực nhảy', 5, 16, 0.2, 'm/s', 'jump')
number('player', 'dashSpeed', 'Tốc độ lướt', 10, 36, 1, 'm/s', 'dash')
number('player', 'dashTime', 'Thời gian lướt', 0.1, 0.4, 0.02, 's', 'dash')
number('camera', 'fov', 'Góc nhìn (FOV)', 40, 90, 1, '°')
number('camera', 'distance', 'Khoảng cách camera', 6, 18, 0.5, 'm')
number('camera', 'follow', 'Tốc độ bám camera', 4, 20, 1, '')
number('run', 'baseHp', 'Máu khởi điểm', 50, 250, 10, 'HP', 'run')

const byId = new Map(bindings.map(binding => [binding.control.id, binding]))
let requested = Object.fromEntries(bindings.map(({ control }) => [control.id, control.default]))
const valid = (values: Record<string, number>) => values['player.walkSpeed'] <= values['player.sprintSpeed']

let unranked = false
const gameplayModified = () =>
  bindings.some(binding => binding.control.integrity === 'GAMEPLAY' && binding.read() !== binding.control.default)

export const tuning = {
  get unranked(): boolean {
    return unranked
  },
  controls: Object.freeze(bindings.map(binding => binding.control)),
  read() {
    return {
      requested: { ...requested },
      active: Object.fromEntries(bindings.map(binding => [binding.control.id, binding.read()])),
    }
  },
  apply(patch: unknown): void {
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) throw new Error('Invalid patch')
    const entries = Object.entries(patch)
    if (entries.length > bindings.length) throw new Error('Invalid patch')
    for (const [id, value] of entries) {
      const control = byId.get(id)?.control
      if (!control || typeof value !== 'number' || !Number.isFinite(value) || value < control.min || value > control.max) {
        throw new Error('Invalid value')
      }
      const steps = (value - control.min) / control.step
      if (value !== control.default && Math.abs(steps - Math.round(steps)) > 1e-7) throw new Error('Invalid increment')
    }
    const candidate = { ...requested, ...patch } as Record<string, number>
    const nextActive = this.read().active
    for (const [id, value] of entries) {
      if (byId.get(id)!.control.applyMode === 'LIVE') nextActive[id] = value
    }
    if (!valid(candidate) || !valid(nextActive)) throw new Error('Walking speed must not exceed sprint speed')
    // All writes are simple assignments, synchronously committed before the next
    // physics/render callback. No engine callbacks run during this transaction.
    requested = candidate
    for (const [id, value] of entries) {
      const binding = byId.get(id)!
      if (binding.control.applyMode === 'LIVE') binding.write(value)
    }
    unranked ||= gameplayModified()
  },
  activate(boundary: Boundary): void {
    for (const binding of bindings) {
      if (binding.boundary === boundary) binding.write(requested[binding.control.id])
    }
    // Reset only at a new run; resetting values mid-run cannot restore eligibility.
    unranked = boundary === 'run' ? gameplayModified() : unranked || gameplayModified()
  },
}
