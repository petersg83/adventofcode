import getLinesFromFile from "../utils/get-lines-from-file.js";

const parseInputLines = (lines) => lines.map(line => line.split(''));
const cloneMap = (map) => [...map.map(line => [...line])];
const stringifyMap = (map) => map.map(line => line.join('')).join(',');
const parseMap = (string) => string.split(',').map(line => line.split(''));

const pivot = (map) => {
  const clonedMap = cloneMap(map);
  clonedMap.forEach((line, y) => {
    line.forEach((char, x) => {
      map[x][map.length - 1 - y] = char;
    });
  });
};

const tiltUp = (map) => {
  for (let x = 0; x < map[0].length; x += 1) {
    let nextIndex = 0;
    for (let y = 0; y < map.length; y += 1) {
      if (map[y][x] === 'O') {
        if (nextIndex !== y) {
          map[nextIndex][x] = 'O';
          map[y][x] = '.';
        }
        nextIndex += 1
      } else if (map[y][x] === '#') {
        nextIndex = y + 1;
      }
    }
  }
};

const cycle = (map, cycleNb = 1) => {
  const cycledMap = cloneMap(map);
  const prevMaps = {};
  let stringifiedMap;

  for (let i = 0; i < cycleNb; i += 1) {
    for (let i = 0; i < 4; i += 1) {
      tiltUp(cycledMap);
      pivot(cycledMap);
    }
    stringifiedMap = stringifyMap(cycledMap);
    if (stringifiedMap in prevMaps) {
      const loopLength = i - prevMaps[stringifiedMap];
      const reducedCycleNb = prevMaps[stringifiedMap] + (cycleNb - 1 - prevMaps[stringifiedMap]) % loopLength;
      return parseMap(Object.entries(prevMaps).find(([_, n]) => n === reducedCycleNb)[0]);
    }
    prevMaps[stringifiedMap] = i;
  }

  return cycledMap;
};

const computeMapLoad = (map) => map.reduce(
  (sum, line, i) => sum += Array.from(line.join('').matchAll(/O/g)).length * (map.length - i),
  0,
);

const inputLines = await getLinesFromFile('./data.txt');
const map = parseInputLines(inputLines);
const load = computeMapLoad(cycle(map, 1000000000));
console.log(load);