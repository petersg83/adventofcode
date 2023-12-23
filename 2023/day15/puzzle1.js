import getLinesFromFile from "../utils/get-lines-from-file.js";

const hashStep = (step) => step.split('').reduce((prevHash, char) => (prevHash + char.charCodeAt()) * 17 % 256, 0);

const inputLines = await getLinesFromFile('./data.txt');
const sum = inputLines[0].split(',').reduce((sum, step) => sum + hashStep(step), 0);
console.log(sum);