import getLinesFromFile from "../utils/get-lines-from-file.js";

const inputLines = await getLinesFromFile('./data.txt');

let sum = 0; 
for (let x = 0; x < inputLines[0].length; x += 1) {
  let nextLoad = inputLines.length;
  for (let y = 0; y < inputLines.length; y += 1) {
    if (inputLines[y][x] === 'O') {
      sum += nextLoad;
      nextLoad -= 1;
    } else if (inputLines[y][x] === '#') {
      nextLoad = inputLines.length - y - 1;
    }
  }
}

console.log(sum);