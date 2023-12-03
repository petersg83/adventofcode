import getLinesFromFile from "../../utils/get-lines-from-file.js";

const getIsEnginePartFor = engineSchematic => (number, row, column) => {
  const maxRow = engineSchematic.length - 1;
  const maxColumn = engineSchematic[0].length - 1;
  const numberLength = String(number).length;
  const adjacentSpots = [
    [row, column - 1],
    [row, column + numberLength],
    ...Array(numberLength + 2).fill().map((_v, index) => [row - 1, column - 1 + index]),
    ...Array(numberLength + 2).fill().map((_v, index) => [row + 1, column - 1 + index]),
  ].filter(([row, column]) => row >= 0 && row <= maxRow && column >= 0 && column <= maxColumn);
  
  return !adjacentSpots.every(([row, column]) => /\.|[0-9]/.test(engineSchematic[row][column]));
};

const inputLines = await getLinesFromFile("./data.txt");
const isEnginePart = getIsEnginePartFor(inputLines);
const numberRegex = /[0-9]+/g;
let sum = 0;
inputLines.forEach((line, rowIndex) => {
  let regexRes;
  while ((regexRes = numberRegex.exec(line)) !== null) {
    const number = regexRes[0];
    if (isEnginePart(number, rowIndex, regexRes.index)) {
      sum += Number(number);
    }
  };
});

console.log(sum);