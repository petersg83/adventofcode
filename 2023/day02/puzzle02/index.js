import getLinesFromFile from "../../utils/get-lines-from-file.js";

const getGamePower = (gameLine) => {
  const colorMax = { red: 0, green: 0, blue: 0 };

  const picks = gameLine.split(":")[1].split(";");
  for (const pick of picks) {
    const sets = pick.split(",").map((set) => set.trim());
    for (const set of sets) {
      const [number, color] = set.split(" ");
      if (colorMax[color] < Number(number)) {
        colorMax[color] = Number(number);
      }
    }
  }

  return colorMax.red * colorMax.green * colorMax.blue;
};

const inputLines = await getLinesFromFile("./data.txt");
const sum = inputLines.reduce((sum, line) => getGamePower(line) + sum, 0);
console.log(sum);
