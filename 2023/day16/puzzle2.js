import getLinesFromFile from "../utils/get-lines-from-file.js";

const parseInputLines = (lines) => lines.map(l => l.split(''));

const runBeam = (initX, initY, initDir, map, beamMap) => {
  let x = initX;
  let y = initY;
  let dir = initDir;

  while (x >= 0 && x < map[0].length && y >= 0 && y < map.length && !beamMap[y][x]?.[dir]) {
    beamMap[y][x] = beamMap[y][x] || {};
    beamMap[y][x][dir] = true;

    const tile = map[y][x];
    if (tile === '|' && ['left', 'right'].includes(dir)) {
      runBeam(x, y - 1, 'up', map, beamMap);
      dir = 'down';
    } else if (tile === '-' && ['up', 'down'].includes(dir)) {
      runBeam(x - 1, y, 'left', map, beamMap);
      dir = 'right';
    } else if (
      (tile === '/' && dir === 'left') ||
      (tile === '\\' && dir === 'right')
    ) {
      dir = 'down';
    } else if (
      (tile === '/' && dir === 'right') ||
      (tile === '\\' && dir === 'left')
    ) {
      dir = 'up';
    } else if (
      (tile === '/' && dir === 'up') ||
      (tile === '\\' && dir === 'down')
    ) {
      dir = 'right';
    } else if (
      (tile === '/' && dir === 'down') ||
      (tile === '\\' && dir === 'up')
    ) {
      dir = 'left';
    }

    if (dir === 'left') x -= 1;
    if (dir === 'right') x += 1;
    if (dir === 'up') y -= 1;
    if (dir === 'down') y += 1;
  }
};

const countEnergizedTiles = (initX, initY, initDir, map) => {
  const beamMap = map.map(row => Array(row.length).fill(undefined));
  runBeam(initX, initY, initDir, map, beamMap);
  return beamMap.map(row => row.filter(Boolean).length).reduce((sum, v) => sum + v, 0);
};

const countMaxEnergizedTilesPossible = (map) => {
  let maxEnergizedTiles = 0;
  let count;
  for (let x = 0; x < map[0].length; x += 1) {
    count = countEnergizedTiles(x, 0, 'down', map);
    maxEnergizedTiles = Math.max(count, maxEnergizedTiles);
    
    count = countEnergizedTiles(x, map.length - 1, 'up', map);
    maxEnergizedTiles = Math.max(count, maxEnergizedTiles);
  }

  for (let y = 0; y < map.length; y += 1) {
    count = countEnergizedTiles(0, y, 'right', map);
    maxEnergizedTiles = Math.max(count, maxEnergizedTiles);
    
    count = countEnergizedTiles(map[0].length - 1, y, 'left', map);
    maxEnergizedTiles = Math.max(count, maxEnergizedTiles);
  }

  return maxEnergizedTiles;
};

const inputLines = await getLinesFromFile('./data.txt');
const map = parseInputLines(inputLines);
const count = countMaxEnergizedTilesPossible(map);
console.log(count);