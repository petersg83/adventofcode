import getLinesFromFile from "../utils/get-lines-from-file.js";

const parseInputLines = (inputLines) => {
  return inputLines.map(line => {
    const [dir, length] = line.split(' ');

    return {
      dir,
      axis: ['R', 'L'].includes(dir) ? 'x' : 'y',
      length: ['U', 'L'].includes(dir) ? -Number(length) : Number(length),
    }
  });
};

const getAxisInfo = (insts, axis) => insts
  .filter(inst => inst.axis === axis)
  .reduce(({ sum, max, min }, { length }) => {
    sum += length;
    return {
      sum,
      max: sum > max ? sum : max,
      min: sum < min ? sum : min,
      range: max - min + 1,
    };
  }, { sum: 0, max: 0, min: 0 });

const drawTrench = (instructions) => {
  const { min: minX, range: width } = getAxisInfo(instructions, 'x');
  const { min: minY, range: height } = getAxisInfo(instructions, 'y');
  const trench = Array(height).fill().map(() => Array(width).fill('.'));

  const cursor = { x: -minX, y: -minY }; // offset is added
  for (const instNb in instructions) {
    const inst = instructions[instNb];
    for (let i = 0; i < Math.abs(inst.length); i += 1) {
      trench[cursor.y][cursor.x] = inst.dir;
      cursor[inst.axis] += inst.length < 0 ? -1 : 1;
    }
  }

  return trench;
};

const computeVolume = (instructions, trench) => {
  const trenchVolume = instructions.reduce((sum, { length }) => sum + Math.abs(length), 0);

  let interiorVolume = 0;
  let prevDir;
  let currDir;
  const start = { x: trench[0].findIndex(tile => tile !== '.'), y: 0 };
  const clockWise = trench[start.y][start.x] === 'R';
  let x = start.x;
  let y = start.y;
  do {
    // walk the loop
    prevDir = trench[y][x];
    if (['L', 'R'].includes(prevDir)) {
      x += prevDir === 'L' ? -1 : 1;
    } else if (['U', 'D'].includes(prevDir)) {
      y += prevDir === 'U' ? -1 : 1;
    }
    currDir = trench[y][x];

    // count the inside when the loop goes up if clockwise or down if non-clockwise
    if (
      (clockWise && (currDir === 'U' || (currDir === 'L' && prevDir === 'U'))) ||
      (!clockWise && (currDir === 'D' || (currDir === 'L' && prevDir === 'D')))
    ) {
      let xTile = x + 1;
      while (trench[y][xTile] === '.') {
        xTile += 1;
        interiorVolume += 1;
      }
    }
  } while (x !== start.x || y !== start.y)

  return trenchVolume + interiorVolume;
};

const inputLines = await getLinesFromFile('./data.txt');
const instructions = parseInputLines(inputLines);
const trench = drawTrench(instructions);
console.log(computeVolume(instructions, trench));