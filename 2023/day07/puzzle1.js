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

const compareHands = (handDetail1, handDetail2) => {
  const hand1 = handDetail1.hand;
  const hand2 = handDetail2.hand;
  if (handDetail1.power === handDetail2.power) {
    const firstCardDiffIndex = hand1.split('').findIndex((card1, index) => card1 !== hand2[index]);
    return cardPowerMap[hand1[firstCardDiffIndex]] - cardPowerMap[hand2[firstCardDiffIndex]];
  }

  return handDetail1.power - handDetail2.power;
};

const parseHandsDetails = (lines) => {
  return lines.map(line => {
    const [hand, bid] = line.split(' ');
    return {
      hand,
      bid: Number(bid),
      power: getKindPower(hand),
    };
  });
};

const inputLines = await getLinesFromFile('./data.txt');
const handsDetails = parseHandsDetails(inputLines);
handsDetails.sort((handDetail1, handDetail2) => compareHands(handDetail1, handDetail2));
const sum = handsDetails.reduce((sum, { bid }, rank) => sum + bid * (rank + 1), 0);
console.log(sum);