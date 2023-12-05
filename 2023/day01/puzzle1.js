import getLinesFromFile from "../utils/get-lines-from-file.js";

const DIGIT_REGEX = /[0-9]/g;

const getCalibrationValue = (text) => {
  const matches = text.match(DIGIT_REGEX);
  return Number(matches[0] + matches[matches.length - 1]);
};

// execution

const inputLines = await getLinesFromFile("./data.txt");
const sum = inputLines.reduce((sum, line) => sum + getCalibrationValue(line), 0);
console.log(sum);
