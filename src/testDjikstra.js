import { readFileSync } from 'node:fs'
import dijkstra from './utils/djikstra.js'

const graph = JSON.parse(
  readFileSync(new URL('./data/sampleBuilding-home.json', import.meta.url), 'utf8'),
)

const result = dijkstra(graph, 'entrance', 'classroom')

console.log('Path:', result.path.join(' -> '))
console.log('Distance:', result.distance)
