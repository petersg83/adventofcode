import getLinesFromFile from "../../utils/get-lines-from-file.js";

const maxColorMap = {
  red: 12,
  green: 13,
  blue: 14,
};

const isGamePossible = (gameLine) => {
  const picks = gameLine.split(":")[1].split(";");
  return picks.every((pick) => {
    const sets = pick.split(",").map((set) => set.trim());
    return sets.every((set) => {
      const [number, color] = set.split(" ");
      return maxColorMap[color] >= Number(number);
    });
  });
};

const inputLines = await getLinesFromFile("./data.txt");
const sum = inputLines.reduce((sum, line, index) => (isGamePossible(line) ? sum + index + 1 : sum), 0);
console.log(sum);
