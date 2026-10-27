import { afterEach, describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { CONFIG, DEFAULT_CONFIG } from '../src/game/config'
import { tuning } from '../src/game/tuning'
import { Hero, type HeroIntent } from '../src/game/hero'
import { ShoulderCamera } from '../src/game/camera'
import { deriveStats, emptyBuild, emptyDev } from '../src/game/rules'
import type { Level } from '../src/game/level'

const defaults = Object.fromEntries(tuning.controls.map(control => [control.id, control.default]))
afterEach(() => {
  tuning.apply(defaults)
  for (const boundary of ['jump', 'dash', 'run'] as const) tuning.activate(boundary)
})

const flatLevel = {
  collide: () => {},
  cameraClear: () => 1,
} as unknown as Level

const baseIntent = (): HeroIntent => ({
  move: new THREE.Vector3(1, 0, 0),
  attack: false,
  bolt: false,
  dash: false,
  jump: false,
  sprint: false,
  nova: false,
  aim: new THREE.Vector3(0, 0, -1),
})

describe('Three.js tuning', () => {
  it('validates the entire patch before committing and preserves source defaults', () => {
    const before = tuning.read()
    for (const patch of [
      { 'player.walkSpeed': 10, 'camera.fov': 999 },
      { 'player.walkSpeed': 14 },
      { 'player.walkSpeed': 9.1 },
      { 'player.walkSpeed': '10' },
      { 'camera.fov': Infinity },
      { unknown: 4 },
    ]) {
      expect(() => tuning.apply(patch)).toThrow()
      expect(tuning.read()).toEqual(before)
    }
    tuning.apply({ 'player.walkSpeed': 12, 'player.sprintSpeed': 15 })
    expect(CONFIG.player.walkSpeed).toBe(12)
    expect(CONFIG.player.sprintSpeed).toBe(15)
    expect(DEFAULT_CONFIG.player.walkSpeed).toBe(9.2)
    const applied = tuning.read()
    tuning.apply({ 'player.walkSpeed': 12 })
    expect(tuning.read()).toEqual(applied)
  })

  it('keeps next-action and next-run values pending until their own boundary', () => {
    tuning.apply({ 'player.jumpSpeed': 14, 'player.dashSpeed': 28, 'run.baseHp': 150 })
    expect(CONFIG.player.jumpSpeed).toBe(DEFAULT_CONFIG.player.jumpSpeed)
    expect(deriveStats(emptyBuild(), { dev: emptyDev(), rescued: [] }).maxHp).toBe(100)
    tuning.activate('jump')
    expect(CONFIG.player.jumpSpeed).toBe(14)
    expect(CONFIG.player.dashSpeed).toBe(DEFAULT_CONFIG.player.dashSpeed)
    expect(tuning.read().requested['run.baseHp']).toBe(150)
    tuning.activate('run')
    expect(deriveStats(emptyBuild(), { dev: emptyDev(), rescued: [] }).maxHp).toBe(150)
    expect(CONFIG.player.dashSpeed).toBe(DEFAULT_CONFIG.player.dashSpeed)
  })

  it('changes live hero movement, the next jump and next dash at their boundaries', () => {
    const hero = new Hero()
    hero.place(0, 0)
    hero.step(1 / 60, baseIntent(), flatLevel)
    const oldSpeed = hero.velocity.x

    hero.place(0, 0)
    tuning.apply({ 'player.walkSpeed': 12 })
    hero.step(1 / 60, baseIntent(), flatLevel)
    expect(hero.velocity.x).toBeGreaterThan(oldSpeed)
    expect(hero.velocity.x).toBeCloseTo(12)

    hero.place(0, 0)
    tuning.apply({ 'player.jumpSpeed': 14 })
    hero.step(1 / 60, { ...baseIntent(), move: new THREE.Vector3(), jump: true }, flatLevel)
    expect(hero.vy).toBeCloseTo(14 - CONFIG.player.gravity / 60)
    tuning.apply({ 'player.jumpSpeed': 16 })
    hero.step(1 / 60, { ...baseIntent(), move: new THREE.Vector3() }, flatLevel)
    expect(tuning.read().active['player.jumpSpeed']).toBe(14)
    expect(hero.vy).toBeLessThan(14)

    hero.place(0, 0)
    hero.dashCd = 0
    tuning.apply({ 'player.dashSpeed': 28, 'player.dashTime': 0.24 })
    hero.step(1 / 60, { ...baseIntent(), dash: true }, flatLevel)
    expect(hero.velocity.x).toBeCloseTo(28)
    tuning.apply({ 'player.dashSpeed': 32 })
    hero.step(1 / 60, baseIntent(), flatLevel)
    expect(hero.velocity.x).toBeCloseTo(28)
    expect(tuning.read().active['player.dashSpeed']).toBe(28)
  })

  it('updates the actual camera projection and follow distance without replacing the camera', () => {
    const camera = new ShoulderCamera()
    const before = camera.camera.projectionMatrix.clone()
    tuning.apply({ 'camera.fov': 80, 'camera.distance': 9 })
    camera.update(new THREE.Vector3(0, 0, 0), { x: 0, y: 0 }, 1)
    expect(camera.camera.fov).toBe(80)
    expect(camera.camera.projectionMatrix.equals(before)).toBe(false)
    const pivot = new THREE.Vector3().addScaledVector(camera.right(), CONFIG.camera.shoulder)
    pivot.y += CONFIG.camera.height
    expect(camera.camera.position.distanceTo(pivot)).toBeCloseTo(9)
  })
})

describe('ranked eligibility', () => {
  it('ignores cosmetics and unapplied next-run values, latches live gameplay until a clean new run', () => {
    tuning.activate('run')
    tuning.apply({ 'camera.fov': 80, 'run.baseHp': 150 })
    expect(tuning.unranked).toBe(false)
    tuning.apply({ 'player.walkSpeed': 10 })
    expect(tuning.unranked).toBe(true)
    tuning.apply(defaults)
    expect(tuning.unranked).toBe(true)
    tuning.activate('run')
    expect(tuning.unranked).toBe(false)
  })

  it('marks next-action gameplay only when activated and cannot erase an affected run with Reset', () => {
    tuning.activate('run')
    tuning.apply({ 'player.jumpSpeed': 14 })
    expect(tuning.unranked).toBe(false)
    tuning.activate('jump')
    expect(tuning.unranked).toBe(true)
    tuning.apply(defaults)
    tuning.activate('jump')
    expect(tuning.unranked).toBe(true)
    tuning.activate('run')
    expect(tuning.unranked).toBe(false)
    tuning.apply({ 'run.baseHp': 150 })
    tuning.activate('run')
    expect(tuning.unranked).toBe(true)
  })
})
