import getLinesFromFile from "../utils/get-lines-from-file.js";

const parseWorkflow = (string) => {
  const [name, rest] = string.split('{');
  const stringRules = rest.split('}')[0].split(',');
  const rules = stringRules.map((stringRule) => {
    if (!stringRule.includes(':')) {
      return {
        destination: stringRule,
      }
    }
    
    const category = stringRule[0];
    const operator = stringRule[1];
    const value = Number(stringRule.split(':')[0].slice(2));
    return {
      category,
      range: operator === '<' ? [1, value - 1] : [value + 1, 4000],
      destination: stringRule.split(':')[1],
    }
  });

  return { name, rules };
};

const parseInputLines = (lines) => {
  const splitIndex = lines.findIndex(line => line === '');
  const workflows = lines.slice(0, splitIndex).reduce((workflows, line) => {
    const { name, rules } = parseWorkflow(line);
    return { ...workflows, [name]: rules };
  }, {});

  return workflows;
};

const complementTo4000 = (range) => range[0] === 1 ? [range[1] + 1, 4000] : [1, range[0] - 1]; // designed to work only if range starts at 1 or ends with 4000
const intersection = (rangeA, rangeB) => [Math.max(rangeA[0], rangeB[0]), Math.min(rangeA[1], rangeB[1])]; // designed to work only if intersection exists
const getAcceptedXmasRanges = (wfName, ranges, workflows) => {
  if (wfName === 'A') return [ranges];
  if (wfName === 'R') return [];

  const acceptedRanges = [];
  const rules = workflows[wfName];
  const newRanges = { ...ranges };
  for (const rule of rules) {
    if (rule.category === undefined) {
      acceptedRanges.push(...getAcceptedXmasRanges(rule.destination, newRanges, workflows));
      break;
    }

    // Passing rule
    const rangesWhenPassRule = getAcceptedXmasRanges(rule.destination, { ...newRanges, [rule.category]: intersection(newRanges[rule.category], rule.range) }, workflows);
    acceptedRanges.push(...rangesWhenPassRule);

    // failing rule
    newRanges[rule.category] = intersection(newRanges[rule.category], complementTo4000(rule.range));
  };

  return acceptedRanges;
};
const countXmasRangeCombinaison = ({ x, m, a, s }) => (x[1] - x[0] + 1) * (m[1] - m[0] + 1) * (a[1] - a[0] + 1) * (s[1] - s[0] + 1);

const inputLines = await getLinesFromFile('./data.txt');
const workflows = parseInputLines(inputLines);
const acceptedXmasRanges = getAcceptedXmasRanges('in', { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }, workflows);
const sum = acceptedXmasRanges.reduce((sum, xmasRange) => sum + countXmasRangeCombinaison(xmasRange), 0);
console.log(sum);