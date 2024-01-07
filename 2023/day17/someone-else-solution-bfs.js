/*
  This solution is a refactored version of someone else code : https://github.com/yolocheezwhiz/adventofcode/blob/main/2023/day17.js
  Using Breadth First Search's algorithm
*/

import getLinesFromFile from "../utils/get-lines-from-file.js";

const getId = (x, y, suffix) => `${x},${y}_${suffix}`;
const sumCol = (from, to, row, grid) => Array(to - from + 1).fill().reduce((sum, _, j) => sum += +grid[from + j][row], 0);
const sumRow = (from, to, col, grid) => Array(to - from + 1).fill().reduce((sum, _, j) => sum += +grid[col][from + j], 0);

const buildGraph = (inputs, minRange, maxRange) => {
  const graph = {};
  let yBound = inputs.length;
  let xBound = inputs[0].length;

  for (let col = 0; col < yBound; col++) {
    for (let row = 0; row < xBound; row++) {
      const vNeighbors = {};
      const hNeighbors = {};
      
      for (let i = minRange; i <= maxRange; i++) {
        if (col + i < yBound) {
          hNeighbors[getId(col + i, row, 'h')] = sumCol(col + 1, col + i, row, inputs);
        }
        if (col - i >= 0) {
          hNeighbors[getId(col - i, row, 'h')] = sumCol(col - i, col - 1, row, inputs);
        }
        if (row + i < xBound) {
          vNeighbors[getId(col, row + i, 'v')] = sumRow(row + 1, row + i, col, inputs);
        }
        if (row - i >= 0) {
          vNeighbors[getId(col, row - i, 'v')] = sumRow(row - i, row - 1, col, inputs);
        }
      }

      graph[getId(col, row, 'v')] = { neighbors: hNeighbors };
      graph[getId(col, row, 'h')] = { neighbors: vNeighbors };
    }
  }
  
  return graph;
};

function walk(graph) {
  const costTo = { '0,0_h': 0, '0,0_v': 0};
  const frontiers = ['0,0_h', '0,0_v'];
  while (frontiers.length > 0) {
    let curr = frontiers.shift();
    for (let neighbor in graph[curr].neighbors) {
      let newCost = graph[curr].neighbors[neighbor] + costTo[curr];
      if (!(neighbor in costTo) || newCost < costTo[neighbor]) {
        costTo[neighbor] = newCost;
        frontiers.push(neighbor);
      }
    }
  }

  return costTo;
}

const inputs = await getLinesFromFile('./data.txt');
const maxCol = inputs[0].length - 1;
const maxRow = inputs.length - 1; 
const graph = buildGraph(inputs, 1, 3); // puzzle 1
// const graph = buildGraph(inputs, 4, 10); // puzzle 2
const costs = walk(graph);
console.log("answer: " + Math.min(costs[`${maxCol},${maxRow}_h`], costs[`${maxCol},${maxRow}_v`]));