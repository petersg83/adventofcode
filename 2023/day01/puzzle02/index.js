import getLinesFromFile from "../../utils/get-lines-from-file.js";

const DIGIT_AND_SPELLED_DIGIT_REGEX = /(?=([0-9]|one|two|three|four|five|six|seven|eight|nine))/g;

const digitMap = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const isEmptyLine = (text) => !!text;

const castToSingleStringDigit = (text) => {
  return text in digitMap ? digitMap[text] : text;
};

const getFirstDigit = (text) => {
  const firstValue = Array.from(text.matchAll(DIGIT_AND_SPELLED_DIGIT_REGEX), (match) => match[1])[0];
  return castToSingleStringDigit(firstValue);
};

const getLastDigit = (text) => {
  const lastValue = Array.from(text.matchAll(DIGIT_AND_SPELLED_DIGIT_REGEX), (match) => match[1]).pop();
  return castToSingleStringDigit(lastValue);
};

const getCalibrationValue = (text) => {
  const firstDigit = getFirstDigit(text);
  const lastDigit = getLastDigit(text);
  return Number(firstDigit + lastDigit);
};

// execution

const inputLines = await getLinesFromFile("./data.txt");
const nonEmptyLines = inputLines.filter((line) => isEmptyLine(line));

const sum = nonEmptyLines.reduce((sum, line) => sum + getCalibrationValue(line), 0);

console.log(sum);
