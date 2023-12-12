import getLinesFromFile from "../utils/get-lines-from-file.js";

const getEmptyRowsAndColumns = (map) => ({
  rows: map.reduce((rows, row, y) => row.every(spot => spot === '.') ? [...rows, y] : rows, []),
  columns: map[0].reduce((columns, _, x) => map.every(row => row[x] === '.') ? [...columns, x] : columns, []),
});

const sliceBetweenValues = (sortedArr, a, b) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  if (min > sortedArr[sortedArr.length - 1] || max < sortedArr[0]) {
    return [];
  }

  const minIndex = sortedArr.findIndex(v => v > min);
  const maxIndex = sortedArr.findLastIndex(v => v < max);
  return sortedArr.slice(minIndex, maxIndex + 1);
}

const getDistanceBetween = (a, b, emptyRowsAndColumns) => {
  let distance = Math.abs(b.y - a.y) + Math.abs(b.x - a.x);
  // add universe expension
  distance += sliceBetweenValues(emptyRowsAndColumns.rows, a.y, b.y).length * (1000000 - 1);
  distance += sliceBetweenValues(emptyRowsAndColumns.columns, a.x, b.x).length * (1000000 - 1);
  return distance;
};

const findGalaxies = (map) => {
  const galaxies = [];
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      if (map[y][x] === '#') {
        galaxies.push({ x, y });
      }
    }
  }
  return galaxies;
};

const sumGalaxyDistances = (map) => {
  const emptyRowsAndColumns = getEmptyRowsAndColumns(map);
  const galaxies = findGalaxies(map);
  let sum = 0;
  for (let i = 0; i < galaxies.length - 1; i += 1) {
    for (let j = i + 1; j < galaxies.length; j += 1) {
      sum += getDistanceBetween(galaxies[i], galaxies[j], emptyRowsAndColumns)
    }
  }
  return sum;
}

const inputLines = await getLinesFromFile('./data.txt');
const map = inputLines.map(line => line.split(''));
const sum = sumGalaxyDistances(map);
console.log(sum);