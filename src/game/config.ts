/**
 * All gameplay tuning in one place. Change numbers here before touching game code; tests read
 * the same values so rule changes stay covered.
 */
export const DEFAULT_CONFIG = {
  run: {
    baseHp: 100,
    maxPower: 100,
    novaCost: 60,
  },
  player: {
    radius: 0.45,
    walkSpeed: 9.2,
    sprintSpeed: 12.7,
    jumpSpeed: 9.8,
    gravity: 30,
    coyoteTime: 0.1,
    jumpBuffer: 0.14,
    dashSpeed: 22,
    dashTime: 0.22,
    dashCooldown: 0.75,
    turnSpeed: 16,
  },
  camera: {
    distance: 11.5,
    height: 1.75,
    shoulder: 0.85,
    minPitch: -0.2,
    maxPitch: 1.05,
    follow: 10,
    fov: 52,
  },
} as const

// Gameplay always reads active values here. Source defaults remain immutable for
// Tweak Reset and Save with Manus; Apply never writes source or local storage.
type MutableConfig<T> = { -readonly [K in keyof T]: T[K] extends number ? number : T[K] extends object ? MutableConfig<T[K]> : T[K] }
export const CONFIG: MutableConfig<typeof DEFAULT_CONFIG> = structuredClone(DEFAULT_CONFIG)
