import getLinesFromFile from "../../utils/get-lines-from-file.js";

const parseRawAlmanac = (rawAlmanac) => {
  const seedRanges = [];
  const seedLineNumbers = rawAlmanac[0].split(':')[1].trim().split(' ').map(Number);
  for (let i = 0; i < seedLineNumbers.length; i += 2) {
    seedRanges.push([seedLineNumbers[i], seedLineNumbers[i] + seedLineNumbers[i + 1]]);
  }

  const maps = [];
  let mapIndex = -1;
  for (const line of rawAlmanac) {
    if (/^[0-9]/.test(line)) {
      const [destStart, srcStart, range] = line.split(' ').map(Number);
      maps[mapIndex].push({
        srcStart,
        srcEnd: srcStart + range - 1,
        destStart,
        destEnd: destStart + range - 1,
        offset: destStart - srcStart,
      });
    } else if (line.endsWith('map:')) {
      mapIndex += 1;
      maps[mapIndex] = [];
    }
  }

  return { seedRanges, maps };
};

const getFinalRangesFor = (range, maps, mapIndex = 0) => {
  if (mapIndex >= maps.length) {
    return [range];
  }

  const ranges = [];
  const remainingRanges = [range];
  while (remainingRanges.length) {
    const range = remainingRanges.shift();
    let newRange = range;
    for (const match of maps[mapIndex]) {
      if (range[1] >= match.srcStart && range[0] <= match.srcEnd) {
        if (range[0] < match.srcStart) {
          remainingRanges.push([range[0], match.srcStart - 1]);
        }
        if (range[1] > match.srcEnd) {
          remainingRanges.push([match.srcEnd + 1, range[1]]);
        }
        newRange = [Math.max(match.srcStart, range[0]) + match.offset, Math.min(match.srcEnd, range[1]) + match.offset];
        break;
      }
    }
    const finalRanges = getFinalRangesFor(newRange, maps, mapIndex + 1);
    ranges.push(...finalRanges);
  }

  return ranges;
};

const inputLines = await getLinesFromFile('./data.txt');
const almanac = parseRawAlmanac(inputLines);
const minLocation = almanac.seedRanges.reduce((min, seedRange) => {
  const finalRanges = getFinalRangesFor(seedRange, almanac.maps);
  const minLocaltionForSeedRange = finalRanges.sort((a, b) => a[0] < b[0] ? -1 : 1)[0][0];
  return Math.min(minLocaltionForSeedRange, min);
}, Infinity);
console.log(minLocation);