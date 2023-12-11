import getLinesFromFile from "../utils/get-lines-from-file.js";

const getNextTile = ({ x, y, comesFrom }, map) => {
  if (map[y][x] === '|' && comesFrom === 'S') return { x, y: y - 1, comesFrom };
  if (map[y][x] === '|' && comesFrom === 'N') return { x, y: y + 1, comesFrom };
  if (map[y][x] === '-' && comesFrom === 'O') return { x: x + 1, y, comesFrom };
  if (map[y][x] === '-' && comesFrom === 'E') return { x: x - 1, y, comesFrom };
  if (map[y][x] === 'L' && comesFrom === 'N') return { x: x + 1, y, comesFrom: 'O' };
  if (map[y][x] === 'L' && comesFrom === 'E') return { x, y: y - 1, comesFrom: 'S' };
  if (map[y][x] === 'J' && comesFrom === 'N') return { x: x - 1, y, comesFrom: 'E' };
  if (map[y][x] === 'J' && comesFrom === 'O') return { x, y: y - 1, comesFrom: 'S' };
  if (map[y][x] === 'F' && comesFrom === 'S') return { x: x + 1, y, comesFrom: 'O' };
  if (map[y][x] === 'F' && comesFrom === 'E') return { x, y: y + 1, comesFrom: 'N' };
  if (map[y][x] === '7' && comesFrom === 'O') return { x, y: y + 1, comesFrom: 'N' };
  if (map[y][x] === '7' && comesFrom === 'S') return { x: x - 1, y, comesFrom: 'E' };
  if (map[y][x] === 'S') {
    if (['-', 'J', '7'].includes(map[y][x + 1])) return { x: x + 1, y, comesFrom: 'O' };
    if (['-', 'F', 'L'].includes(map[y][x - 1])) return { x: x - 1, y, comesFrom: 'E' };
    if (['|', 'J', 'L'].includes(map[y + 1][x])) return { x, y: y + 1, comesFrom: 'N' };
    if (['|', 'F', '7'].includes(map[y - 1][x])) return { x, y: y - 1, comesFrom: 'S' };
  };
}

const getLoopSize = (map) => {
  const startY = map.findIndex(row => row.includes('S'));
  const startX = map[startY].findIndex(tile => tile === 'S');
  let stepCount = 0;
  let tile = { y: startY, x: startX };
  do {
    tile = getNextTile(tile, map);
    stepCount += 1;
  } while (tile.y !== startY || tile.x !== startX);
  
  return stepCount;
};

const inputLines = await getLinesFromFile('./data.txt');
const map = inputLines.map(l => l.split(''));
const loopSize = getLoopSize(map);
console.log(Math.floor(loopSize / 2));