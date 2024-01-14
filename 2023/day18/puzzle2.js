import getLinesFromFile from "../utils/get-lines-from-file.js";

const parseInputLines = (inputLines) => {
  return inputLines.map(line => {
    const digits = line.split(' ')[2].slice(2, 8);
    const length = parseInt(digits.slice(0, -1), 16);
    const dir = ['R', 'D', 'L', 'U'][Number(digits[5])];

    return {
      dir,
      axis: ['R', 'L'].includes(dir) ? 'x' : 'y',
      length: ['U', 'L'].includes(dir) ? -Number(length) : Number(length),
    }
  });
};

const computeVolume = (instructions) => {
  const trenchVolume = instructions.reduce((sum, { length }) => sum + Math.abs(length), 0);

  let insideVolume = 0;
  const cursor = { x: 0, y: 0 };
  for (let i = 0; i < instructions.length; i += 1) {
    const inst = instructions[i];
    cursor[inst.axis] += inst.length;
    if (inst.axis === 'y') {
    const inst = instructions[i];
      const prevDir = instructions[i - 1].dir;
      const nextDir = instructions[(i + 1) % instructions.length].dir;
      let lengthOffset = 0;
      if (`${prevDir}${nextDir}` === 'LR') lengthOffset = 1;
      if (`${prevDir}${nextDir}` === 'RL') lengthOffset = -1;
      const insideHeight = inst.length + lengthOffset;
      const insideWidth = inst.dir === 'D' ? cursor.x - 1 : cursor.x;
      insideVolume += insideHeight * insideWidth;
    }
  }

  return insideVolume + trenchVolume;
};

const inputLines = await getLinesFromFile('./data.txt');
const instructions = parseInputLines(inputLines);
const volume = computeVolume(instructions);
console.log(volume);