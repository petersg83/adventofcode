/*
  This solution works but doesn't seem very efficient.
  I found what seems a better solution done by someone else that I refactored my own way
  in ./someone-else-solution-bfs.js and ./someone-else-solution-dijkstra.js
*/

import getLinesFromFile from "../utils/get-lines-from-file.js";

const oppositeDir = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
};

const parseInputLines = (lines) => {
  const mapGraph = lines.map((line) => line.split('').map(() => ({})));

  for (let y = 0; y < lines.length; y += 1) {
    for (let x = 0; x < lines[y].length; x += 1) {
      Object.assign(mapGraph[y][x], {
        id: `${y}-${x}`,
        x,
        y,
        up: mapGraph[y - 1]?.[x],
        down: mapGraph[y + 1]?.[x],
        left: mapGraph[y][x - 1],
        right: mapGraph[y][x + 1],
        heatLoss: Number(lines[y][x]),
      });
    }
  }
  
  return mapGraph;
};

const getNewIdentifier = (node, prevNodeIdentifier, dir) => {
  const [_, ...dirs] = prevNodeIdentifier.split('_');
  return [node.id, dir, ...dirs].slice(0, 4).join('_');
};
const getId = (nodeIdentifier) => nodeIdentifier.split('_')[0];
const getPrevDirs = (nodeIdentifier) => nodeIdentifier.split('_').slice(1, 4);
const toNodes = (graph) => graph.reduce((nodes, row) => {
  row.forEach(node => nodes[node.id] = node);
  return nodes;
}, {});

const removeMin = (array, comparisonObject) => {
  let minIndex;
  let minValue = Infinity;
  for (let i = 0; i < array.length; i += 1) {
    const value = comparisonObject[array[i]];
    if (value < minValue) {
      minValue = value;
      minIndex = i;
    }
  }

  return array.splice(minIndex, 1)[0];
};

const computeMinHeatLossPossible = (start, end, nodes) => {
  const frontiers = [start.id];
  const costTo = { [start.id]: 0 };
  const cameFrom = { [start.id]: null }
  let curr;
  while (frontiers.length) {
    curr = removeMin(frontiers, costTo);
    const currId = getId(curr);
    
    if (currId === end.id) {
      break;
    }

    ['up', 'right', 'down', 'left'].forEach((dir) => {
      const neighbor = nodes[currId][dir];
      if (neighbor) {
        const newCost = costTo[curr] + neighbor.heatLoss;
        const neighborIdentifier = getNewIdentifier(neighbor, curr, dir);
        const prevDirs = getPrevDirs(curr);
        if (
          prevDirs[0] !== oppositeDir[dir] && // don't go backward
          (prevDirs.length < 3 || prevDirs.some(prevDir => prevDir !== dir)) &&
          (!(neighborIdentifier in costTo) || (newCost < costTo[neighborIdentifier]))
        ) {
          cameFrom[neighborIdentifier] = curr;
          costTo[neighborIdentifier] = newCost;
          frontiers.push(neighborIdentifier);
        }
      }
    });
  }

  return costTo[curr];
};

const inputLines = await getLinesFromFile('./data.txt');
const graph = parseInputLines(inputLines);
const minHeatLoss = computeMinHeatLossPossible(graph[0][0], graph[graph.length - 1][graph[0].length - 1], toNodes(graph));
console.log(minHeatLoss);
