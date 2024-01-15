/*
  Based on reddit message https://www.reddit.com/r/adventofcode/comments/18l0qtr/comment/kg4t5ns/?utm_source=share&utm_medium=web2x&context=3
  Based on github code https://github.com/JoanaBLate/advent-of-code-js/blob/main/2023/day18/solve2-math-style.js

  Using the shoelace formula and Pick formula
*/

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

const computeVolume = (instructions) => {
  const point = { x: 0, y: 0 };
  const nextPoint = { x: 0, y: 0 };
  let volume = 0;
  for (const inst of instructions) {
    nextPoint[inst.axis] += inst.length;
    volume += point.x * nextPoint.y - point.y * nextPoint.x + Math.abs(inst.length);
    point[inst.axis] += inst.length;
  }

  return volume / 2 + 1;
};

const inputLines = await getLinesFromFile('./data.txt');
const instructions = parseInputLines(inputLines);
const volume = computeVolume(instructions);
console.log(volume);