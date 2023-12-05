import getLinesFromFile from "../utils/get-lines-from-file.js";
import fp from "https://esm.sh/lodash@4.17.21/fp.js";

const countPointsFor = (card) => {
  const [winningNumbers, personalNumbers] = card.split(':')[1].split('|').map(set => set.split(' ').filter(Boolean));
  const nbOfWinners = fp.intersection(winningNumbers)(personalNumbers).length;
  return nbOfWinners ? 2 ** (nbOfWinners - 1) : 0;
};

const inputLines = await getLinesFromFile('./data.txt');
const sum = inputLines.reduce((sum, line) => sum + countPointsFor(line), 0);
console.log(sum);