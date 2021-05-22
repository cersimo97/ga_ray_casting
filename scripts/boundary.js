class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1)
    this.b = createVector(x2, y2)
  }

  show() {
    stroke(0, 180, 180, 200)
    strokeWeight(2)
    line(this.a.x, this.a.y, this.b.x, this.b.y)
  }

  cast(other) {
    const x1 = other.a.x
    const y1 = other.a.y
    const x2 = other.b.x
    const y2 = other.b.y

    const x3 = this.a.x
    const y3 = this.a.y
    const x4 = this.b.x
    const y4 = this.b.y

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if (den === 0) return

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den

    if (t > 0 && t < 1 && u > 0 && u < 1) {
      const pt = createVector()
      pt.x = x1 + t * (x2 - x1)
      pt.y = y1 + t * (y2 - y1)
      return pt
    } else {
      return
    }
  }
}
