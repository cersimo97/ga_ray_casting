let boundaries = []
let particles = []
let detectors = []
const MAX_DISTANCE = Infinity
let ga
let stats
let fitnessChart
let isDrawingGrid = false

function setup() {
  const parent = document.querySelector('main')
  const c = createCanvas(parent.clientWidth * 0.75, parent.clientHeight * 0.6)
  c.parent('canvas-container')
  initGA()
}

function draw() {
  background(0)
  stats = ga.run()
  updateChart(stats)
  let std = calcStd(stats)
  let total = stats[stats.length - 1].best.detectors.length
  let std_perc = std / total
  if (
    (std_perc !== undefined && std_perc < 0.001) ||
    stats[stats.length - 1].fitness.best / total === 1
  ) {
    initGA()
    return
  }

  if (isDrawingGrid) drawGrid(stats[stats.length - 1].best.detectors)

  boundaries.forEach(b => b.show())

  stats[stats.length - 1].best.particles.forEach(particle => {
    particle.show()
    particle.look(boundaries, MAX_DISTANCE)
  })
}

function keyTyped() {
  switch (key) {
    case 'g':
      isDrawingGrid = !isDrawingGrid
      break
    case '+':
      if (Individual.DETECTOR_GAP > 5) Individual.DETECTOR_GAP--
      break
    case '-':
      Individual.DETECTOR_GAP++
      break
    case 'n':
      initGA()
      break
    default:
      return
  }
}

const createBuilding = boundaries => {
  const NUM_BOUNDARIES = 6
  while (boundaries.length < NUM_BOUNDARIES) {
    let new_boundary = new Boundary(
      random(width),
      random(height),
      random(width),
      random(height)
    )

    let noIntersection = true
    let i = 0
    while (noIntersection && i < boundaries.length) {
      const p = new_boundary.cast(boundaries[i])
      if (p) {
        noIntersection = false
      }
      i++
    }

    if (noIntersection) {
      boundaries.push(new_boundary)
    }
  }

  boundaries.push(new Boundary(0, 0, width, 0))
  boundaries.push(new Boundary(width, 0, width, height))
  boundaries.push(new Boundary(0, height, width, height))
  boundaries.push(new Boundary(0, 0, 0, height))
}

function drawGrid(detectors = null) {
  if (detectors) {
    strokeWeight(2)
    detectors.forEach(detector => {
      if (detector.collisions.some(c => c.length === 0)) {
        stroke(0, 255, 0, 200)
      } else {
        stroke(255, 0, 0, 200)
      }
      point(detector.pos.x, detector.pos.y)
    })
    strokeWeight(1)
  } else {
    stroke(80)
    for (let i = 5; i < height; i += 10) {
      for (let j = 5; j < width; j += 10) {
        point(j, i)
        // detectors.push(new Detector(j, i))
      }
    }
  }
}

function updateChart(stats) {
  const best = stats[stats.length - 1].fitness.best
  const total = stats[stats.length - 1].best.detectors.length
  const percentage = Math.floor((best / total) * 100)
  const prevBest =
    stats.length > 1 ? stats[stats.length - 2].fitness.best : best
  const prevPercentage = Math.floor((prevBest / total) * 100)

  const statsDisplay = {
    generazione: stats.length,
    migliore: `${best}/${total}`,
    copertura: `${percentage}%`,
  }

  const statsElements = Object.entries(statsDisplay).map(m => {
    let div = document.createElement('div')
    let value = document.createElement('p')
    let description = document.createElement('p')
    value.className = 'stat-value'
    description.className = 'stat-description'
    value.innerText = m[1]
    description.innerText = m[0]
    if (m[0] === 'copertura') {
      if (percentage < prevPercentage) {
        value.style = 'color: rgba(255, 0, 0, 0.5)'
      } else if (percentage > prevPercentage) {
        value.style = 'color: rgba(0, 255, 0, 0.5)'
      }
    }
    if (m[0] === 'migliore') {
      if (best < prevBest) {
        value.style = 'color: rgba(255, 0, 0, 0.5)'
      } else if (best > prevBest) {
        value.style = 'color: rgba(0, 255, 0, 0.5)'
      }
    }
    div.append(value)
    div.append(description)
    return div
  })
  document.querySelector('#stats').innerHTML = ''
  statsElements.forEach(el => document.querySelector('#stats').append(el))

  document.querySelector('#num_punti_luce').innerHTML = Individual.NUM_PARTICLES
  document.querySelector('#num_boundaries').innerHTML = boundaries.length
  document.querySelector('#dist_detectors').innerHTML = Individual.DETECTOR_GAP
}

function initGA() {
  boundaries = []
  createBuilding(boundaries)
  ga = new GA({ numPop: 100, boundaries })
}

function calcStd(stats) {
  const threeshold = 25
  if (stats.length > threeshold) {
    let last = stats.slice(stats.length - threeshold)
    let avgBest =
      last.map(m => m.fitness.best).reduce((acc, curr) => (acc += curr), 0) /
      last.length
    let square_sum =
      last
        .map(m => m.fitness.best)
        .reduce((acc, curr) => (acc += Math.pow(curr - avgBest, 2)), 0) /
      last.length
    return Math.sqrt(square_sum)
  }
}
