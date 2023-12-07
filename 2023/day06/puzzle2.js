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
  const time = lines[0].split(':')[1].split(' ').filter(Boolean).join('');
  const record = lines[1].split(':')[1].split(' ').filter(Boolean).join('');

  return { time: Number(time), record: Number(record) };
};

const inputLines = await getLinesFromFile('./data.txt');
const race = parseSheet(inputLines);
console.log(getNbOfWaysToWin(race.time, race.record));