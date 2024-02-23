import getLinesFromFile from "../utils/get-lines-from-file.js";

const parseInputLines = (inputLines) => inputLines.map(line => line.split(''));
const getId = ({ x, y }) => `${x}-${y}`;

const findStart = (map) => {
  const y = map.findIndex(row => row.includes('S'));
  const x = map[y].indexOf('S');

  return { x, y, id: getId({ x, y }) };
}

const getPlotsCost = (map, start) => {
  const maxY = map.length - 1;
  const maxX = map[0].length - 1;
  const frontier = [start];
  const comeFrom = { [start.id]: null };
  const costTo = { [start.id]: 0 };

  while (frontier.length) {
    const { x, y, id } = frontier.shift();

    const nextTiles = [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ]
      .filter(({ x }) => x >= 0 && x <= maxX)
      .filter(({ y }) => y >= 0 && y <= maxY)
      .filter(({ x, y }) => map[y][x] !== '#')
      .map(({ x, y }) => ({ x, y, id: getId({ x, y }) }));
  
    for (const nextTile of nextTiles) {
      if (comeFrom[nextTile.id] === undefined) {
        comeFrom[nextTile.id] = id;
        costTo[nextTile.id] = costTo[id] + 1;
        frontier.push(nextTile);
      }
    }
  }

  return costTo;
};

const countAccessiblePlotsFor = (plotsCost, steps) => {
  return Object.values(plotsCost)
    .filter(cost => cost <= steps)
    .filter(cost => (steps - cost) % 2 === 0)
    .length;
};

const inputLines = await getLinesFromFile('./data.txt');
const map = parseInputLines(inputLines);
const start = findStart(map);
const plotsCost = getPlotsCost(map, start);
const count = countAccessiblePlotsFor(plotsCost, 64);
console.log(count);
