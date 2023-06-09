import { map, random } from '../scripts/utils'

export class Drop {
  x: number
  y: number
  size: number
  thickness: number
  brightness: number
  mass: number
  velocity: number

  constructor() {
    this.x = 0
    this.y = 0
    this.size = 0
    this.thickness = 0
    this.brightness = 0
    this.mass = 0
    this.velocity = 0

    this.regen()
  }

  minimumSize() {
    return 3
  }
  maximumSize() {
    return 15
  }
  calcMass() {
    this.mass = this.size * this.thickness
  }
  calcVelocity() {
    this.velocity = this.mass
  }

  regen() {
    this.size = random(this.minimumSize(), this.maximumSize())
    this.brightness = +map(
      this.size,
      this.minimumSize(),
      this.maximumSize(),
      0.15,
      0.9,
      true
    )
    this.thickness = this.brightness > 0.85 ? 2 : 1

    this.calcMass()
    this.calcVelocity()
  }

  draw(ctx: CanvasRenderingContext2D, opt: { wind: number }) {
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.x + (opt.wind / 4) * (this.size / 4), this.y + this.size)
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.brightness})`
    ctx.lineWidth = this.thickness
    ctx.stroke()
    ctx.closePath()
  }
}
