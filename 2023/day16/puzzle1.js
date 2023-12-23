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

const countEnergizedTiles = (map) => {
  const beamMap = map.map(row => Array(row.length).fill(undefined));
  runBeam(0, 0, 'right', map, beamMap);
  return beamMap.map(row => row.filter(Boolean).length).reduce((sum, v) => sum + v, 0);
};

const inputLines = await getLinesFromFile('./data.txt');
const map = parseInputLines(inputLines);
const count = countEnergizedTiles(map);
console.log(count);