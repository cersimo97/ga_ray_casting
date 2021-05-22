class GA {
  static MUTATION_RATE = 0.2
  constructor({ numPop, boundaries }) {
    this.population = new Population(numPop)
    this.boundaries = boundaries
  }

  run() {
    this.population.calcFitness(this.boundaries)
    this.population.selection()
    this.population.updateStatistics()
    this.population.reproduce()
    this.population.mutate(GA.MUTATION_RATE)
    this.population.incrementGeneration()
    return this.population.getStatistics()
  }
}
