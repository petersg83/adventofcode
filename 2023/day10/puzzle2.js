import getLinesFromFile from "../utils/get-lines-from-file.js";

const oppositeDir = { N: 'S', S: 'N', O: 'E', E: 'O' };

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
    let comesFroms = '';
    if (['-', 'F', 'L'].includes(map[y][x - 1])) comesFroms += 'E';
    if (['-', 'J', '7'].includes(map[y][x + 1])) comesFroms += 'O';
    if (['|', 'F', '7'].includes(map[y - 1]?.[x])) comesFroms += 'S';
    if (['|', 'J', 'L'].includes(map[y + 1]?.[x])) comesFroms += 'N';
    const nextComesFrom = comesFrom ? comesFroms.replace(oppositeDir[comesFrom], '') : comesFroms[0];

    if (['-', 'J', '7'].includes(map[y][x + 1]) && comesFrom !== 'E') return { x: x + 1, y, comesFrom: nextComesFrom };
    if (['-', 'F', 'L'].includes(map[y][x - 1]) && comesFrom !== 'O') return { x: x - 1, y, comesFrom: nextComesFrom };
    if (['|', 'J', 'L'].includes(map[y + 1]?.[x]) && comesFrom !== 'S') return { x, y: y + 1, comesFrom: nextComesFrom };
    if (['|', 'F', '7'].includes(map[y - 1]?.[x]) && comesFrom !== 'N') return { x, y: y - 1, comesFrom: nextComesFrom };
  };
};

const getFirstLoopTileByRayTracing = (map, loopTiles) => {
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[0].length; x += 1) {
      if (loopTiles[y]?.[x]) { // is always F
        return { y, x, comesFrom: 'S' }; // S rather than E to be clockwise
      }
    }
  }
};

const getLoopTiles = (map) => {
  const tiles = {};
  const startY = map.findIndex(row => row.includes('S'));
  const startX = map[startY].findIndex(tile => tile === 'S');

  let tile = { x: startX, y: startY };
  do {
    tile = getNextTile(tile, map);
    tiles[tile.y] = tiles[tile.y] || {};
    tiles[tile.y][tile.x] =  true;
  } while (tile.y !== startY || tile.x !== startX);
  
  return tiles;
};

const countArea = (map) => {
  const loopTiles = getLoopTiles(map);
  const firstTile = getFirstLoopTileByRayTracing(map, loopTiles);

  let areaCount = 0;
  let prevTile = firstTile;
  let tile;
  do {
    tile = getNextTile(prevTile, map);
    if ( // if loop is going up
      (prevTile.comesFrom === 'O' && tile.y < prevTile.y) || // case J
      (prevTile.comesFrom === 'S' && tile.y < prevTile.y) || // case |
      (prevTile.comesFrom === 'S' && tile.x < prevTile.x) // case 7
    ) {
      let x = prevTile.x + 1;
      while (!loopTiles[prevTile.y][x] && x < map[0].length) {
        x += 1;
        areaCount += 1;
      }
    }
    prevTile = tile;
  } while (tile.y !== firstTile.y || tile.x !== firstTile.x);

  return areaCount;
};

const inputLines = await getLinesFromFile('./data.txt');
const map = inputLines.map(l => l.split(''));
const area = countArea(map);
console.log(area);