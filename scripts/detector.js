class Detector {
  constructor(x, y) {
    this.pos = createVector(x, y)
    this.collisions = []
  }

  show(origins) {
    stroke(255, 0, 0)
    origins.forEach(o => {
      line(o.x, o.y, this.pos.x, this.pos.y)
    })
    this.collisions.forEach(origin => {
      origin.forEach(collision => {
        circle(collision.x, collision.y, 10)
      })
    })
  }

  update(x, y) {
    this.pos.set(x, y)
  }

  cast(wall, origin) {
    const x1 = wall.a.x
    const y1 = wall.a.y
    const x2 = wall.b.x
    const y2 = wall.b.y

    const x3 = origin.x
    const y3 = origin.y
    const x4 = this.pos.x
    const y4 = this.pos.y

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

  look(walls, origins) {
    this.collisions = []
    origins.forEach((origin, index) => {
      this.collisions[index] = []
      walls.forEach(wall => {
        const pt = this.cast(wall, origin)
        if (pt) {
          this.collisions[index].push(pt)
        }
      })
    })
  }
}
