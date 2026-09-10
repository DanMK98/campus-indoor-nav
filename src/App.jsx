import { useState } from 'react'
import sampleBuilding from './data/sampleBuilding-home.json'
import libraryBuilding from './data/librarySocial-UC3M-GetafeBuilding.json'
import torresQuevedoFloor0 from './data/buildings/4-torres-quevedo-leganes/floor-0.json'
import dijkstra, { buildGraph } from './utils/djikstra.js'
import './App.css'

function mergeFloors(floors, extraEdges = []) {
  const building = floors.reduce(
    (building, floorData) => ({
      nodes: {
        ...building.nodes,
        ...Object.fromEntries(
          Object.entries(floorData.nodes).map(([id, node]) => [
            id,
            { floor: floorData.floor, ...node },
          ]),
        ),
      },
      edges: [...building.edges, ...floorData.edges],
    }),
    { nodes: {}, edges: [] },
  )

  return {
    ...building,
    edges: [...building.edges, ...extraEdges],
  }
}

const buildings = {
  sample: {
    name: 'Sample Building',
    data: sampleBuilding,
    defaultStart: 'entrance',
    defaultDestination: 'classroom',
  },
  library: {
    name: 'UC3M Social Sciences Library',
    data: libraryBuilding,
    defaultStart: 'main-entrance',
    defaultDestination: 'study-tables',
  },
  torresQuevedo: {
    name: 'UC3M Torres Quevedo',
    data: mergeFloors([torresQuevedoFloor0]),
    defaultStart: 'male-bathroom-d-f0',
    defaultDestination: 'room-4-0-e02',
  },
}

function calculateRoute(building, start, destination) {
  const graph = Array.isArray(building.data.edges)
    ? buildGraph(building.data.edges)
    : building.data.edges

  return {
    ...dijkstra(graph, start, destination),
    start,
    destination,
  }
}

function App() {
  const [buildingId, setBuildingId] = useState('library')
  const [start, setStart] = useState(buildings.library.defaultStart)
  const [destination, setDestination] = useState(
    buildings.library.defaultDestination,
  )
  const [route, setRoute] = useState(() =>
    calculateRoute(
      buildings.library,
      buildings.library.defaultStart,
      buildings.library.defaultDestination,
    ),
  )

  const currentBuilding = buildings[buildingId]
  const nodes = Object.keys(currentBuilding.data.nodes)

  function formatNodeName(nodeId) {
    return (
      currentBuilding.data.nodes[nodeId]?.label ??
      nodeId
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (letter) => letter.toUpperCase())
    )
  }

  function getNodeTags(nodeId) {
    return currentBuilding.data.nodes[nodeId]?.tags ?? []
  }

  function changeBuilding(event) {
    const nextBuildingId = event.target.value
    const nextBuilding = buildings[nextBuildingId]
    const nextStart = nextBuilding.defaultStart
    const nextDestination = nextBuilding.defaultDestination

    setBuildingId(nextBuildingId)
    setStart(nextStart)
    setDestination(nextDestination)
    setRoute(calculateRoute(nextBuilding, nextStart, nextDestination))
  }

  function findRoute(event) {
    event.preventDefault()
    setRoute(calculateRoute(currentBuilding, start, destination))
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">
          IN
        </div>
        <div>
          <p className="eyebrow">Campus navigation</p>
          <h1>IndoorNav</h1>
        </div>
      </header>

      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Shortest path finder</p>
          <h2>Where are you right now?</h2>
          <p className="intro">
            Choose your building, then select two locations to find the shortest
            indoor route.
          </p>
        </div>

        <label className="building-picker">
          Building
          <select value={buildingId} onChange={changeBuilding}>
            {Object.entries(buildings).map(([id, building]) => (
              <option key={id} value={id}>
                {building.name}
              </option>
            ))}
          </select>
        </label>

        <form className="route-form" onSubmit={findRoute}>
          <label>
            Starting point
            <select value={start} onChange={(event) => setStart(event.target.value)}>
              {nodes.map((node) => (
                <option key={node} value={node}>
                  {formatNodeName(node)}
                </option>
              ))}
            </select>
            <div className="tags">
              {getNodeTags(start).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </label>

          <button
            className="swap-button"
            type="button"
            aria-label="Swap starting point and destination"
            onClick={() => {
              setStart(destination)
              setDestination(start)
            }}
          >
            &#8644;
          </button>

          <label>
            Destination
            <select
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            >
              {nodes.map((node) => (
                <option key={node} value={node}>
                  {formatNodeName(node)}
                </option>
              ))}
            </select>
            <div className="tags">
              {getNodeTags(destination).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </label>

          <button className="find-button" type="submit">
            Find shortest route
          </button>
        </form>
      </section>

      <section className="result-card" aria-live="polite">
        <div className="result-heading">
          <div>
            <p className="eyebrow">{currentBuilding.name}</p>
            <h2>
              {formatNodeName(route.start)} to {formatNodeName(route.destination)}
            </h2>
          </div>
          <div className="distance">
            <strong>{route.distance}</strong>
            <span>distance units</span>
          </div>
        </div>

        {route.path.length > 0 ? (
          <ol className="route-path">
            {route.path.map((node, index) => (
              <li
                key={node}
                className={
                  index === route.path.length - 1 ? 'destination-node' : undefined
                }
              >
                <span className="node-number">{index + 1}</span>
                <span>{formatNodeName(node)}</span>
                {index === route.path.length - 1 && (
                  <span className="destination-label">Destination</span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="no-route">No route connects these locations.</p>
        )}
      </section>
    </main>
  )
}

export default App
