class Population {
  constructor(num) {
    this.individuals = Array.from({ length: num })
    this.individuals.fill(new Individual({}))
    this.selectionPool = []
    this.generation = 0
    this.statistics = []
  }

  calcFitness(boundaries) {
    this.individuals.forEach(individual => individual.calcFitness(boundaries))
  }

  selection() {
    this.individuals.sort((a, b) => b.fitness - a.fitness)
    this.selectionPool = this.individuals.slice(0, this.individuals.length / 2)
  }

  updateStatistics() {
    let best = this.individuals[0]
    let fitness = {
      best: this.individuals[0].fitness,
      worst: this.individuals[this.individuals.length - 1].fitness,
      avg:
        this.individuals.map(m => m.fitness).reduce((a, b) => a + b, 0) /
        this.individuals.length,
    }
    this.statistics.push({ best, fitness })
    this.statistics.forEach((stats, index, arr) => {
      if (index !== arr.length - 1) {
        delete stats.best
      }
    })
  }

  reproduce() {
    let newGeneration = []
    newGeneration.push(
      new Individual({ positions: this.selectionPool[0].particles })
    )
    newGeneration.push(
      new Individual({ positions: this.selectionPool[1].particles })
    )
    while (newGeneration.length < this.individuals.length) {
      let indexA = floor(random(this.selectionPool.length))
      let indexB = floor(random(this.selectionPool.length))
      let parentA = this.selectionPool[indexA]
      let parentB = this.selectionPool[indexB]

      const newBorn = parentA.crossover(parentB)
      newGeneration.push(newBorn[0])
      newGeneration.push(newBorn[1])
    }
    this.individuals = newGeneration
  }

  mutate(mutation_rate) {
    this.individuals.forEach(individual => individual.mutate(mutation_rate))
  }

  incrementGeneration() {
    this.generation++
  }

  getGeneration() {
    return this.generation
  }

  getStatistics() {
    return this.statistics
  }
}
