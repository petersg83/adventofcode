import getLinesFromFile from "../utils/get-lines-from-file.js";

const parseCamelMap = (lines) => {
  const instructions = lines[0].split('');
  const nodes = lines.slice(2).reduce((map, line) => {
    const [nodeName, L, R] = line.match(/[A-Z]{3}/g);
    return { ...map, [nodeName]: { L, R } };
  }, {});

  return {
    instructions,
    nodes,
  };
};

const countStepsToReachZZZ = ({ instructions, nodes }) => {
  let nodeName = 'AAA';
  let stepCount = 0;
  while (nodeName !== 'ZZZ') {
    const instruction = instructions[stepCount % instructions.length];
    nodeName = nodes[nodeName][instruction];
    stepCount += 1;
  };

  return stepCount;
};

const inputLines = await getLinesFromFile('./data.txt');
const camelMap = parseCamelMap(inputLines);
const stepCounts = countStepsToReachZZZ(camelMap);
console.log(stepCounts);