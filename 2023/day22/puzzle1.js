import getLinesFromFile from "../utils/get-lines-from-file.js";

const parseInputLines = (inputLines) => {
  return inputLines.map((line) => {
    const [start, end] = line.split('~')
      .map((pos) => pos.split(','))
      .map(([x, y, z]) => ({ x: Number(x), y: Number(y), z: Number(z) }));

    return { start, end };
  });
};

const doOverlap = (brick1, brick2) => (brick1.end.x >= brick2.start.x && brick1.start.x <= brick2.end.x) &&
  (brick1.end.y >= brick2.start.y && brick1.start.y <= brick2.end.y);

const doOverlapMany = (bricks1, bricks2) => bricks1.length > 0 &&
  bricks2.length > 0 &&
  bricks1.some(brick1 => bricks2.some(brick2 => doOverlap(brick1, brick2)));

const stack = (bricks) => {
  const sortedBricks = bricks.slice().sort((a, b) => a.start.z < b.start.z ? -1 : 1);
  const stackedBricks = [];

  for (const brick of sortedBricks) {
    stackedBricks.sort((a, b) => a.end.z < b.end.z ? -1 : 1);
    const overlapBrick = stackedBricks.findLast(stackedBrick => doOverlap(brick, stackedBrick));
    const zFallBy = overlapBrick
      ? brick.start.z - overlapBrick.end.z - 1
      : brick.start.z - 1;
    
    stackedBricks.push(({
      start: { ...brick.start, z: brick.start.z - zFallBy },
      end: { ...brick.end, z: brick.end.z - zFallBy },
    }));
  }

  return stackedBricks;
};

const mapByZ = (bricks, startOrEnd) => {
  return bricks.reduce((map, brick) => {
    map[brick[startOrEnd].z] = map[brick[startOrEnd].z] || [];
    map[brick[startOrEnd].z].push(brick);
    return map;
  }, {});
};

const getDisintegratableBricksCount = (bricks) => {
  const stackedBricks = stack(bricks);
  const startZMap = mapByZ(stackedBricks, 'start');
  const endZMap = mapByZ(stackedBricks, 'end');
  let count = 0;

  Object.keys(endZMap).map(Number).forEach(z => {
    const supportingBricks = endZMap[z];
    const supportedBricks = startZMap[z + 1];

    for (let i = 0; i < supportingBricks.length; i += 1) {
      const remainingSupportingBricks = [...supportingBricks.slice(0, i), ...supportingBricks.slice(i + 1)];
      if (
        !supportedBricks ||
        (remainingSupportingBricks.length > 0 && supportedBricks.every(supportedBrick => doOverlapMany([supportedBrick], remainingSupportingBricks)))
      ) {
        count += 1;
      }
    }
  });

  return count;
}

const inputLines = await getLinesFromFile('./data.txt');
const bricks = parseInputLines(inputLines);
const count = getDisintegratableBricksCount(bricks);
console.log(count);