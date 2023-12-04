import getLinesFromFile from "../../utils/get-lines-from-file.js";
import fp from "https://esm.sh/lodash@4.17.21/fp.js";

const getNbOfWinnersFor = (card) => {
  const [winningNumbers, personalNumbers] = card.split(':')[1].split('|').map(set => set.split(' ').filter(Boolean));
  return fp.intersection(winningNumbers)(personalNumbers).length;
};

const getNbOfCopiesFor = (cards) => {
  const nbOfWinnersArray = cards.map(card => getNbOfWinnersFor(card));
  const nbOfCopiesArray = [];
  for (let index = 0; index < cards.length; index += 1) {
    nbOfCopiesArray[index] = (nbOfCopiesArray[index] || 0) + 1;
    for (let copyIndex = index + 1; copyIndex <= index + nbOfWinnersArray[index] && copyIndex < cards.length; copyIndex += 1) {
      nbOfCopiesArray[copyIndex] = (nbOfCopiesArray[copyIndex] || 0) + nbOfCopiesArray[index];
    }
  } 

  return nbOfCopiesArray.reduce((sum, nb) => sum + nb, 0);
};

const inputLines = await getLinesFromFile('./data.txt');
console.log(getNbOfCopiesFor(inputLines));
