import getLinesFromFile from "../utils/get-lines-from-file.js";

const getNextValue = (values) => {
  if (values.every((v) => v === values[0])) return values[0];

  const valuesDiffs = values.reduce((diffs, v, i) => i > 0 ? [...diffs, v - values[i - 1]] : diffs, []);
  const nextValue = getNextValue(valuesDiffs);
  return values[values.length - 1] + nextValue;
};

const inputLines = await getLinesFromFile('./data.txt');
const metricsHistory = inputLines.map(l => l.split(' ').map(Number));
const sum = metricsHistory.reduce((sum, metricHistory) => sum + getNextValue(metricHistory), 0);
console.log(sum);