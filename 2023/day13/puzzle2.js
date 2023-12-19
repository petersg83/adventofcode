import getLinesFromFile from "../utils/get-lines-from-file.js";


const parseGroundPatterns = (lines) => {
  const patterns = [{ rows: [], columns: [] }];
  let patternIndex = 0;
  for (const line of lines) {
    if (line === '') {
      patternIndex += 1;
      patterns.push({ rows: [], columns: [] });
      continue;
    }

    patterns[patternIndex].rows.push(line);
    line.split('').forEach((char, index) => {
      patterns[patternIndex].columns[index] = patterns[patternIndex].columns[index] || '';
      patterns[patternIndex].columns[index] += char;
    });
  };

  return patterns;
};

const hasOneDifference = (stringA, stringB) => {
  let errorCount = 0;
  for (let index = 0; index < stringA.length; index += 1) {
    if (stringA[index] !== stringB[index]) {
      errorCount += 1;
    }
  }

  return errorCount === 1;
};

const isMirror = (indexA, indexB, arr, fixed = false) => {
  if (indexA < 0 || indexB >= arr.length) {
    return fixed;
  }

  if (arr[indexA] === arr[indexB]) {
    return isMirror(indexA - 1, indexB + 1, arr, fixed);
  }
  if (!fixed && hasOneDifference(arr[indexA], arr[indexB])) {
    return isMirror(indexA - 1, indexB + 1, arr, true);
  }

  return false;
};

const summarizePattern = ({ rows, columns }) => {
  let summary = 0;
  
  rows.slice(0, -1).forEach((_, rowIndex) => {
    if (isMirror(rowIndex, rowIndex + 1, rows)) {
      summary += 100 * (rowIndex + 1);
    }
  });

  columns.slice(0, -1).forEach((_, columnIndex) => {
    if (isMirror(columnIndex, columnIndex + 1, columns)) {
      summary += columnIndex + 1;
    }
  });

  return summary;
};

const inputLines = await getLinesFromFile('./data.txt');
const groundPatterns = parseGroundPatterns(inputLines);
const sum = groundPatterns.reduce((sum, pattern) => sum + summarizePattern(pattern), 0);
console.log(sum);
