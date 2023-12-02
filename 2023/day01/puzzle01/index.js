import getLinesFromFile from "../../utils/get-lines-from-file.js";

const DIGIT_REGEX = /[0-9]/;

const getFirstDigit = (text) => {
  return DIGIT_REGEX.exec(text)[0];
};

const reverseString = (text) => {
  return text.split("").reverse().join("");
};

const getCalibrationValue = (text) => {
  const firstDigit = getFirstDigit(text);
  const lastDigit = getFirstDigit(reverseString(text));
  return Number(firstDigit + lastDigit);
};

// execution

const inputLines = await getLinesFromFile("./data.txt");
const sum = inputLines.reduce((sum, line) => sum + getCalibrationValue(line), 0);
console.log(sum);
