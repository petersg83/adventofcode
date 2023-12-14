import getLinesFromFile from "../utils/get-lines-from-file.js";

const parseRecords = (lines) => {
  return lines.map(l => {
    const [rawSprings, rawDamagedGroup] = l.split(' ');
    return {
      springs: rawSprings.split(''),
      damagedGroups: rawDamagedGroup.split(',').map(Number),
    }
  });
}

const sum = (arr) => arr.reduce((sum, v) => sum + v, 0);

// Only checks if it fits the beginning of the springs row
const damagedGroupFits = (springs, group) =>
  springs.slice(0, group).every(s => ['?', '#'].includes(s)) &&
  springs[group] !== '#'; // undefined is end of spring row

const countArrangements = ({ springs, damagedGroups }) => {
  if (springs.length < damagedGroups.length - 1 + sum(damagedGroups)) {
    return 0;
  }

  if (damagedGroups.length === 0) {
    return springs.includes('#') ? 0 : 1;
  }

  let totalArrangementNb = 0;
  const group = damagedGroups[0];
  // goes one level deeper
  if (damagedGroupFits(springs, group)) {
    totalArrangementNb += countArrangements({ springs: springs.slice(group + 1), damagedGroups: damagedGroups.slice(1) });
  }

  // tries other arrangements
  if (['.', '?'].includes(springs[0])) {
    totalArrangementNb += countArrangements({ springs: springs.slice(1), damagedGroups });
  } 
  
  return totalArrangementNb;
};



const inputLines = await getLinesFromFile('./data.txt');
const records = parseRecords(inputLines);
const arrangementSum = records.reduce((sum, record) => sum + countArrangements(record), 0);
console.log(arrangementSum);