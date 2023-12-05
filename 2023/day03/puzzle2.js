import getLinesFromFile from "../utils/get-lines-from-file.js";

const getNumbersWithInRange = (text, minIndex, maxIndex) => {
  if (typeof text !== 'string') {
    return [];
  }

  const numberRegex = /[0-9]+/g;
  const numbers = [];
  let regexRes;
  while ((regexRes = numberRegex.exec(text)) !== null) {
    const number = Number(regexRes[0]);
    if (regexRes.index <= maxIndex && numberRegex.lastIndex - 1 >= minIndex) {
      numbers.push(number);
    }
  };
  return numbers;
};

const getAdjacentNumbersFor = engineSchematic => (row, column) => {
  const beforeNumbers = getNumbersWithInRange(engineSchematic[row], column - 1, column - 1);
  const afterNumbers = getNumbersWithInRange(engineSchematic[row], column + 1, column + 1);
  const topNumbers = getNumbersWithInRange(engineSchematic[row - 1], column - 1, column + 1);
  const bottomNumbers = getNumbersWithInRange(engineSchematic[row + 1], column - 1, column + 1);

  return [...beforeNumbers, ...afterNumbers, ...topNumbers, ...bottomNumbers];
};

const inputLines = await getLinesFromFile("./data.txt");
const getAdjacentNumbers = getAdjacentNumbersFor(inputLines);
const starRegex = /\*/g;
let sum = 0;
inputLines.forEach((line, rowIndex) => {
  let regexRes;
  while ((regexRes = starRegex.exec(line)) !== null) {
    const adjacentNumbers = getAdjacentNumbers(rowIndex, regexRes.index);
    if (adjacentNumbers.length === 2) { // is gear
      sum += adjacentNumbers[0] * adjacentNumbers[1];
    }
  };
});

console.log(sum);