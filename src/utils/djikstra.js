/**
 * Finds the shortest path between two nodes in a weighted graph.
 *
 * Graph format:
 * {
 *   entrance: { hallway: 4, stairs: 10 },
 *   hallway: { entrance: 4, stairs: 3 },
 *   stairs: { entrance: 10, hallway: 3 }
 * }
 *
 * All edge weights must be non-negative numbers.
 *
 * @param {Record<string, Record<string, number>>} graph
 * @param {string} start
 * @param {string} destination
 * @returns {{
 *   path: string[],
 *   distance: number,
 *   distances: Record<string, number>,
 *   previous: Record<string, string | null>
 * }}
 */
export function dijkstra(graph, start, destination) {
  validateGraph(graph, start, destination)

  const nodes = collectNodes(graph)
  const distances = Object.fromEntries(nodes.map((node) => [node, Infinity]))
  const previous = Object.fromEntries(nodes.map((node) => [node, null]))
  const queue = new MinPriorityQueue()

  distances[start] = 0
  queue.enqueue(start, 0)

  while (!queue.isEmpty()) {
    const current = queue.dequeue()

    // An improved distance may have been queued after this entry.
    if (current.priority !== distances[current.value]) continue
    if (current.value === destination) break

    const neighbours = graph[current.value] ?? {}

    for (const [neighbour, weight] of Object.entries(neighbours)) {
      const candidateDistance = current.priority + weight

      if (candidateDistance < distances[neighbour]) {
        distances[neighbour] = candidateDistance
        previous[neighbour] = current.value
        queue.enqueue(neighbour, candidateDistance)
      }
    }
  }

  return {
    path: buildPath(previous, start, destination, distances[destination]),
    distance: distances[destination],
    distances,
    previous,
  }
}

function collectNodes(graph) {
  const nodes = new Set(Object.keys(graph))

  for (const neighbours of Object.values(graph)) {
    Object.keys(neighbours).forEach((node) => nodes.add(node))
  }

  return [...nodes]
}

function buildPath(previous, start, destination, distance) {
  if (distance === Infinity) return []

  const path = []
  let current = destination

  while (current !== null) {
    path.unshift(current)
    if (current === start) return path
    current = previous[current]
  }

  return []
}

export function buildGraph(edges) {
  const graph = {}

  for (const [from, to, weight] of edges) {
    graph[from] ??= {}
    graph[to] ??= {}

    graph[from][to] = weight
    graph[to][from] = weight
  }

  return graph
}

function validateGraph(graph, start, destination) {
  if (!graph || typeof graph !== 'object' || Array.isArray(graph)) {
    throw new TypeError('graph must be an adjacency-list object')
  }

  if (typeof start !== 'string' || typeof destination !== 'string') {
    throw new TypeError('start and destination must be node names')
  }

  const nodes = new Set(Object.keys(graph))

  for (const [node, neighbours] of Object.entries(graph)) {
    if (!neighbours || typeof neighbours !== 'object' || Array.isArray(neighbours)) {
      throw new TypeError(`Neighbours for "${node}" must be an object`)
    }

    for (const [neighbour, weight] of Object.entries(neighbours)) {
      nodes.add(neighbour)

      if (!Number.isFinite(weight) || weight < 0) {
        throw new RangeError(
          `Edge "${node}" -> "${neighbour}" must have a non-negative weight`,
        )
      }
    }
  }

  if (!nodes.has(start)) throw new Error(`Unknown start node: "${start}"`)
  if (!nodes.has(destination)) {
    throw new Error(`Unknown destination node: "${destination}"`)
  }
}

class MinPriorityQueue {
  constructor() {
    this.heap = []
  }

  isEmpty() {
    return this.heap.length === 0
  }

  enqueue(value, priority) {
    this.heap.push({ value, priority })
    this.bubbleUp(this.heap.length - 1)
  }

  dequeue() {
    const minimum = this.heap[0]
    const last = this.heap.pop()

    if (this.heap.length > 0) {
      this.heap[0] = last
      this.bubbleDown(0)
    }

    return minimum
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)

      if (this.heap[parentIndex].priority <= this.heap[index].priority) break

      ;[this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ]
      index = parentIndex
    }
  }

  bubbleDown(index) {
    while (true) {
      const leftIndex = index * 2 + 1
      const rightIndex = leftIndex + 1
      let smallestIndex = index

      if (
        leftIndex < this.heap.length &&
        this.heap[leftIndex].priority < this.heap[smallestIndex].priority
      ) {
        smallestIndex = leftIndex
      }

      if (
        rightIndex < this.heap.length &&
        this.heap[rightIndex].priority < this.heap[smallestIndex].priority
      ) {
        smallestIndex = rightIndex
      }

      if (smallestIndex === index) break

      ;[this.heap[index], this.heap[smallestIndex]] = [
        this.heap[smallestIndex],
        this.heap[index],
      ]
      index = smallestIndex
    }
  }
}

// Keep a default export for straightforward imports from this utility file.
export default dijkstra
