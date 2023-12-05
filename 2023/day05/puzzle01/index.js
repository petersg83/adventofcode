import getLinesFromFile from "../../utils/get-lines-from-file.js";

const parseRawAlmanac = (rawAlmanac) => {
  const maps = [];
  let mapIndex = -1;
  for (const line of rawAlmanac) {
    if (/^[0-9]/.test(line)) {
      const [destStart, srcStart, range] = line.split(' ').map(Number);
      maps[mapIndex].push({ srcStart, destStart, range });
    } else if (line.endsWith('map:')) {
      mapIndex += 1;
      maps[mapIndex] = [];
    }
  }

  return {
    maps,
    seeds: rawAlmanac[0].split(':')[1].trim().split(' ').map(Number),
  };
};

const getLocationFor = (seed, maps) => {
  let nextNumber = seed;
  for (const map of maps) {
    // could be perf improved by sorting the maps and doing a dichotomy search
    const matchData = map.find(mapEl => mapEl.srcStart <= nextNumber && nextNumber <= (mapEl.srcStart + mapEl.range));
    nextNumber = matchData ? nextNumber = matchData.destStart + nextNumber - matchData.srcStart : nextNumber;
  }
  return nextNumber;
};

const inputLines = await getLinesFromFile('./data.txt');
const almanac = parseRawAlmanac(inputLines);
const locations = almanac.seeds.map(seed => getLocationFor(seed, almanac.maps));
const minLocation = [...locations].sort((a, b) => a < b ? - 1 : 1)[0];
console.log(minLocation);