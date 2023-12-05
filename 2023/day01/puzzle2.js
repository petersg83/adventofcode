import getLinesFromFile from "../utils/get-lines-from-file.js";

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

const castToSingleStringDigit = (text) => {
  return text in digitMap ? digitMap[text] : text;
};

const getCalibrationValue = (text) => {
  const matches = Array.from(text.matchAll(DIGIT_AND_SPELLED_DIGIT_REGEX), (match) => match[1]);
  const firstDigit = castToSingleStringDigit(matches[0]);
  const lastDigit = castToSingleStringDigit(matches[matches.length - 1]);
  return Number(firstDigit + lastDigit);
};

// execution

const inputLines = await getLinesFromFile("./data.txt");
const sum = inputLines.reduce((sum, line) => sum + getCalibrationValue(line), 0);
console.log(sum);
