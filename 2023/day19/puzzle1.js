import getLinesFromFile from "../utils/get-lines-from-file.js";

const parseWorkflow = (string) => {
  const [name, rest] = string.split('{');
  const stringRules = rest.split('}')[0].split(',');
  const rules = stringRules.map((stringRule) => {
    if (!stringRule.includes(':')) {
      return {
        isValid: () => true,
        destination: stringRule,
      }
    }
    
    const category = stringRule[0];
    const operator = stringRule[1];
    const value = Number(stringRule.split(':')[0].slice(2));
      
    return {
      isValid: (part) => operator === '<' ? part[category] < value : part[category] > value,
      destination: stringRule.split(':')[1],
    }
  });

  return { name, rules };
};

const parsePart = (string) => string
  .slice(1, -1)
  .split(',')
  .reduce((part, stringCat) => {
    const [name, value] = stringCat.split('=');
    return { ...part, [name]: Number(value) };
  }, {});

const parseInputLines = (lines) => {
  const splitIndex = lines.findIndex(line => line === '');
  const workflows = lines.slice(0, splitIndex).reduce((workflows, line) => {
    const { name, rules } = parseWorkflow(line);
    return { ...workflows, [name]: rules };
  }, {});
  const parts = lines.slice(splitIndex + 1).map(parsePart);

  return { workflows, parts };
};

const isPartAccepted = (part, workflows) => {
  let wfName = 'in';
  while (true) {
    if (wfName === 'R') {
      return false;
    } else if (wfName === 'A') {
      return true;
    }

    const rules = workflows[wfName];
    for (const rule of rules) {
      if (rule.isValid(part)) {
        wfName = rule.destination;
        break;
      }
    }
  }
};

const getCategoriesSum = (part) => part.x + part.m + part.a + part.s;

const inputLines = await getLinesFromFile('./data.txt');
const { workflows, parts } = parseInputLines(inputLines);
const sum = parts.reduce((sum, part) => isPartAccepted(part, workflows) ? sum + getCategoriesSum(part) : sum, 0);
console.log(sum);