import getLinesFromFile from "../utils/get-lines-from-file.js";

const cardPowerMap = '23456789TJQKA'.split('').reduce((map, card, index) => ({ ...map, [card]: index }), {});

const getHandCount = (hand) => {
  const countByCard = hand.split('').reduce((map, card) => {
    map[card] = (map[card] || 0) + 1;
    return map;
  }, {});

  const handCount = Object.values(countByCard).reduce((map, count, index) => {
    map[index] = map[index] || 0;
    map[count] = (map[count] || 0) + 1;
    return map;
  }, {});

  return handCount;
};

const getKindPower = (hand) => {
  const handCount = getHandCount(hand);
  if (handCount['5']) return 6;
  if (handCount['4']) return 5;
  if (handCount['3'] && handCount['2']) return 4;
  if (handCount['3']) return 3;
  if (handCount['2'] === 2) return 2;
  if (handCount['2']) return 1;
  return 0;
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