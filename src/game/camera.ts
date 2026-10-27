import * as THREE from 'three'
import { CONFIG } from './config'
import type { Level } from './level'

const C = CONFIG.camera

/**
 * Over-the-shoulder follow camera. Mouse/stick yaw + pitch orbit a pivot above the hero's right
 * shoulder; the boom pulls in when walls get in the way, and trauma-based shake sells impacts.
 */
export class ShoulderCamera {
  readonly camera = new THREE.PerspectiveCamera(C.fov, 1, 0.1, 160)
  yaw = Math.PI
  pitch = 0.32
  private boom: number = C.distance
  private shoulder: number = C.shoulder
  private readonly height: number = C.height
  private trauma = 0
  private readonly pivot = new THREE.Vector3()
  private readonly desired = new THREE.Vector3()
  private readonly look = new THREE.Vector3()
  private readonly smoothPivot = new THREE.Vector3()
  private initialized = false
  reducedMotion = false
  /** Extra zoom-out used for the boss arena. */
  zoom = 1
  /** 0..1 sprint amount: widens the FOV slightly for a sense of speed. */
  sprint = 0
  private sprintFov = 0

  forward(out = new THREE.Vector3()): THREE.Vector3 {
    return out.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw))
  }
  right(out = new THREE.Vector3()): THREE.Vector3 {
    return out.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw))
  }
  addTrauma(v: number): void {
    this.trauma = Math.min(1, this.trauma + v)
  }
  snap(): void {
    this.initialized = false
  }

  update(target: THREE.Vector3, look: { x: number; y: number }, dt: number, level?: Level): void {
    this.yaw -= look.x
    this.pitch = THREE.MathUtils.clamp(this.pitch + look.y, C.minPitch, C.maxPitch)
    const f = this.forward()
    const r = this.right()
    this.pivot.copy(target).addScaledVector(r, this.shoulder)
    this.pivot.y += this.height
    const snap = !this.initialized
    if (snap) {
      this.smoothPivot.copy(this.pivot)
      this.initialized = true
    } else this.smoothPivot.lerp(this.pivot, 1 - Math.exp(-dt * C.follow))
    const want = C.distance * this.zoom
    const cp = Math.cos(this.pitch)
    const sp = Math.sin(this.pitch)
    this.desired.copy(this.smoothPivot).addScaledVector(f, -want * cp)
    this.desired.y += want * sp
    let clear = 1
    if (level) clear = level.cameraClear(this.smoothPivot, this.desired)
    const boomTarget = Math.max(0.9, want * clear)
    // Pull in instantly when blocked or snapping; ease back out when recovering from wall occlusion.
    this.boom = boomTarget < this.boom || snap || !level ? boomTarget : this.boom + (boomTarget - this.boom) * (1 - Math.exp(-dt * C.follow))
    this.camera.position.copy(this.smoothPivot).addScaledVector(f, -this.boom * cp)
    this.camera.position.y += this.boom * sp
    this.look.copy(this.smoothPivot).addScaledVector(f, 4)
    this.look.y -= 0.6
    this.camera.lookAt(this.look)
    const sprintTarget = this.reducedMotion ? 0 : this.sprint * 7
    this.sprintFov += (sprintTarget - this.sprintFov) * (1 - Math.exp(-dt * 6))
    const fov = C.fov + (Math.abs(this.sprintFov) < 1e-3 ? 0 : this.sprintFov)
    if (Math.abs(fov - this.camera.fov) > 1e-4) {
      this.camera.fov = fov
      this.camera.updateProjectionMatrix()
    }
    if (this.trauma > 0) {
      const s = this.reducedMotion ? 0 : this.trauma * this.trauma
      this.camera.rotation.z += (Math.random() - 0.5) * 0.05 * s
      this.camera.position.x += (Math.random() - 0.5) * 0.35 * s
      this.camera.position.y += (Math.random() - 0.5) * 0.35 * s
      this.trauma = Math.max(0, this.trauma - dt * 1.8)
    }
  }
}

export { ShoulderCamera as CameraRig }
