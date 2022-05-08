class Individual {
  static NUM_PARTICLES = 3
  static MUTATION_GAP = 100
  static DETECTOR_GAP = 20

  constructor({ positions }) {
    this.fitness = null
    if (positions) this.particles = positions
    else {
      this.particles = []
      for (let i = 0; i < Individual.NUM_PARTICLES; i++)
        this.particles.push(
          new Particle(createVector(random(width), random(height)))
        )
    }
    this.detectors = []
  }

  calcFitness(boundaries) {
    this.detectors = []
    for (
      let i = Individual.DETECTOR_GAP / 2;
      i < height;
      i += Individual.DETECTOR_GAP
    ) {
      for (
        let j = Individual.DETECTOR_GAP / 2;
        j < width;
        j += Individual.DETECTOR_GAP
      ) {
        this.detectors.push(new Detector(j, i))
      }
    }
    this.detectors.forEach(detector => {
      detector.look(
        boundaries,
        this.particles.map(p => p.pos)
      )
    })

    this.fitness = this.detectors
      .map(detector => detector.collisions.some(c => c.length === 0))
      .filter(f => f === true).length
  }

  mutate(mutation_rate) {
    if (random() < mutation_rate) {
      let oldParticles = this.particles
      this.particles = []
      for (let i = 0; i < Individual.NUM_PARTICLES; i++) {
        let randDeltaX = floor(
          random(Individual.MUTATION_GAP * 2) - Individual.MUTATION_GAP
        )
        let randDeltaY = floor(
          random(Individual.MUTATION_GAP * 2) - Individual.MUTATION_GAP
        )
        let newX =
          randDeltaX < 0
            ? Math.max(oldParticles[i].pos.x + randDeltaX, 0)
            : Math.min(oldParticles[i].pos.x + randDeltaX, width)
        let newY =
          randDeltaY < 0
            ? Math.max(oldParticles[i].pos.y + randDeltaY, 0)
            : Math.min(oldParticles[i].pos.y + randDeltaY, height)
        this.particles.push(new Particle(createVector(newX, newY)))
      }
    }
  }

  crossover(other) {
    let splitIndex = random(this.particles.length)
    let a = new Individual({
      positions: this.particles
        .slice(0, splitIndex)
        .concat(other.particles.slice(splitIndex)),
    })
    let b = new Individual({
      positions: other.particles
        .slice(0, splitIndex)
        .concat(this.particles.slice(splitIndex)),
    })
    return [a, b]
  }
}
