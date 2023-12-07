import getLinesFromFile from "../utils/get-lines-from-file.js";

const getNbOfWaysToWin = (time, record) => {
  const delta = time ** 2 - 4 * record;

  if (delta < 0) {
    return 0;
  }

  let s1 = (-Math.sqrt(delta) + time) / 2;
  s1 = Number.isInteger(s1) ? s1 + 1 : s1;
  s1 = Math.ceil(s1);

  let s2 = (Math.sqrt(delta) + time) / 2;
  s2 = Number.isInteger(s2) ? s2 - 1 : s2;
  s2 = Math.floor(s2);

  return s2 - s1 + 1;
};

const parseSheet = (lines) => {
  const times = lines[0].split(':')[1].split(' ').filter(Boolean).map(Number);
  const records = lines[1].split(':')[1].split(' ').filter(Boolean).map(Number);

  return times.map((t, i) => ({ time: t, record: records[i] }));
};

const inputLines = await getLinesFromFile('./data.txt');
const races = parseSheet(inputLines);
const factor = races.reduce((factor, race) => factor * getNbOfWaysToWin(race.time, race.record), 1);
console.log(factor);