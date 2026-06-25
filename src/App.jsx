import { useState } from 'react'
import buildingTest from './data/sampleBuilding-home.json'
import dijkstra from './utils/djikstra.js'
import './App.css'

const nodes = Object.keys(buildingTest.nodes)

function formatNodeName(nodeId) {
  return buildingTest.nodes[nodeId]?.label ?? nodeId
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (letter) => letter.toUpperCase())
}

function App() {
  const [start, setStart] = useState('entrance')
  const [destination, setDestination] = useState('classroom')
  const [route, setRoute] = useState(() => ({
    ...dijkstra(buildingTest.edges, 'entrance', 'classroom'),
    start: 'entrance',
    destination: 'classroom',
  }))

  function findRoute(event) {
    event.preventDefault()
    setRoute({
      ...dijkstra(buildingTest.edges, start, destination),
      start,
      destination,
    })
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
          <h2>Where would you like to go?</h2>
          <p className="intro">
            Select two locations to find the shortest indoor route through the
            sample building.
          </p>
        </div>

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
          </label>

          <button className="find-button" type="submit">
            Find shortest route
          </button>
        </form>
      </section>

      <section className="result-card" aria-live="polite">
        <div className="result-heading">
          <div>
            <p className="eyebrow">Recommended route</p>
            <h2>
              {formatNodeName(route.start)} to {formatNodeName(route.destination)}
            </h2>
          </div>
          <div className="distance">
            <strong>{route.distance}</strong>
            <span>distance units "to be meters"</span>
          </div>
        </div>

        {route.path.length > 0 ? (
          <ol className="route-path">
            {route.path.map((node, index) => (
              <li key={node}>
                <span className="node-number">{index + 1}</span>
                <span>{formatNodeName(node)}</span>
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
