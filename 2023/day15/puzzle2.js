import getLinesFromFile from "../utils/get-lines-from-file.js";

const hashLabel = (label) => label.split('').reduce((prevHash, char) => (prevHash + char.charCodeAt()) * 17 % 256, 0);

const organizeBoxes = (steps) => {
  const boxes = [];
  for (const step of steps) {
    const [label, focal] = step.match(/[^-|=]+/g);
    const boxNb = hashLabel(label);
    boxes[boxNb] = boxes[boxNb] || new Map();

    if (!focal) { // remove
      boxes[boxNb].delete(label);
    } else { // add or replace
      boxes[boxNb].set(label, Number(focal));
    }
  }
  return boxes;
};

const computeBoxesFocusPower = (boxes) => boxes.reduce((boxesSum, box, boxesIndex) => {
  let i = 1;
  let boxSum = 0;
  for (const focal of box.values()) {
    boxSum += focal * i;
    i += 1;
  };
  return boxesSum + boxSum * (boxesIndex + 1);
}, 0);

const inputLines = await getLinesFromFile('./data.txt');
const steps = inputLines[0].split(',');
const boxes = organizeBoxes(steps);
const focusPower = computeBoxesFocusPower(boxes);
console.log(focusPower);