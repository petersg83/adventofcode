import getLinesFromFile from "../utils/get-lines-from-file.js";

const cardPowerMap = 'J23456789TQKA'.split('').reduce((map, card, index) => ({ ...map, [card]: index }), {});

const getHandCount = (hand) => {
  const cleanHand = hand.replaceAll('J', '');
  const countByCard = cleanHand.split('').reduce((map, card) => {
    map[card] = (map[card] || 0) + 1;
    return map;
  }, {});

  const handCount = Object.values(countByCard).reduce((map, count, index) => {
    map[index] = map[index] || 0;
    map[count] = (map[count] || 0) + 1;
    return map;
  }, {});
  handCount.j = hand.length - cleanHand.length;

  return handCount;
};

const getKindPower = (hand) => {
  const handCount = getHandCount(hand);
  const jokerNumber = handCount.j;
  let power = 0;
  if (handCount['5']) power = 6;
  else if (handCount['4']) power = 5;
  else if (handCount['3'] && handCount['2']) power = 4;
  else if (handCount['3']) power = 3;
  else if (handCount['2'] === 2) power = 2;
  else if (handCount['2']) power = 1;

  if (jokerNumber === 0) {
    return power;
  }
  
  if (power === 5 && jokerNumber) power = 6;
  else if (power === 3 && jokerNumber === 1) power = 5;
  else if (power === 3 && jokerNumber === 2) power = 6;
  else if (power === 2 && jokerNumber) power = 4;
  else if (power === 1 && jokerNumber === 1) power = 3;
  else if (power === 1 && jokerNumber === 2) power = 5;
  else if (power === 1 && jokerNumber === 3) power = 6;
  else if (power === 0 && jokerNumber === 1) power = 1;
  else if (power === 0 && jokerNumber === 2) power = 3;
  else if (power === 0 && jokerNumber === 3) power = 5;
  else if (power === 0 && jokerNumber >= 4) power = 6;

  return power;
};

const compareHands = (hand1, hand2) => {
  const kindPower1 = getKindPower(hand1);
  const kindPower2 = getKindPower(hand2);

  if (kindPower1 === kindPower2) {
    const firstCardDiffIndex = hand1.split('').findIndex((card1, index) => card1 !== hand2[index]);
    return cardPowerMap[hand1[firstCardDiffIndex]] - cardPowerMap[hand2[firstCardDiffIndex]];
  }

  return kindPower1 - kindPower2;
};

// TODO: improve by precalculating kindPower for each hand instead of computing it in each comparison
const inputLines = await getLinesFromFile('./data.txt');
const handsAndBids = inputLines.map(line => line.split(' '));
handsAndBids.sort(([hand1], [hand2]) => compareHands(hand1, hand2));
const sum = handsAndBids.reduce((sum, [_hand, bid], rank) => sum + bid * (rank + 1), 0);
console.log(sum);
