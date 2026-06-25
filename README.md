# IndoorNav

IndoorNav is a React web application that finds the shortest route between
locations inside a building.

It uses Dijkstra's shortest-path algorithm and a sample graph containing rooms,
hallways, stairs, and other indoor locations.

## Features

- Select a starting point and destination
- Calculate the shortest available route
- Display every location along the route
- Show the total route distance
- Swap the start and destination

## Technologies

- React
- Vite
- JavaScript
- CSS

## Run the Project

Open a terminal in the project folder and install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local address displayed in the terminal. It will usually look like:

```text
http://localhost:5173
```

## Test Dijkstra's Algorithm

Run the standalone test:

```bash
node src/testDjikstra.js
```

Expected result:

```text
Path: entrance -> lobby -> hallway -> stairs -> classroom
Distance: 16
```

## Important Files

```text
src/
├── App.jsx                         Main React interface
├── App.css                         Interface styling
├── testDjikstra.js                 Standalone algorithm test
├── data/
│   └── sampleBuilding-home.json    Sample nodes and edges
└── utils/
    └── djikstra.js                 Dijkstra algorithm
```

## Graph Data Format

The sample building is represented as an adjacency list:

```json
{
  "entrance": {
    "lobby": 3,
    "reception": 5
  },
  "lobby": {
    "entrance": 3,
    "hallway": 4
  }
}
```

Each top-level property is a location. Its nested properties are directly
connected locations, and each number is the distance between them.

For example, `"lobby": 3` means that the lobby is three distance units away.

## Editing This README

Open `README.md` in VS Code and edit it like a normal text file.

Useful Markdown syntax:

```markdown
# Main heading
## Smaller heading

Normal paragraph text.

- Bullet point
- Another bullet point

[Link text](https://example.com)

`inline code`
```

Use VS Code's Markdown preview to see the formatted result:

1. Open `README.md`.
2. Press `Ctrl + Shift + V`.
3. Continue editing the file while viewing the preview.

## Future Improvements

- Add a visual building map
- Support multiple building floors
- Add elevators and accessible routes
- Load real campus building data
- Display turn-by-turn directions
