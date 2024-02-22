import fp from "https://esm.sh/lodash@4.17.21/fp.js";
import getLinesFromFile from "../utils/get-lines-from-file.js";

const LOW = 'low';
const HIGH = 'high';
const BROADCASTER = 'broadcaster';
const FLIPFLOP = 'flipflop';
const CONJONCTION = 'conjonction';

const parseInputLines = (inputLines) => {
  const modules = {};

  for (const line of inputLines) {
    let type = BROADCASTER;
    let name = line.split(' ')[0];
    
    if (name.startsWith('%') || name.startsWith('&')) {
      type = name.startsWith('%') ? FLIPFLOP : CONJONCTION;
      name = name.slice(1)
    }

    const destModNames = line.split('>')[1].replaceAll(',', '').trim().split(' ');
    modules[name] = modules[name] || {};
    modules[name].type = type;
    modules[name].destModNames = destModNames;

    for (const destModName of destModNames) {
      modules[destModName] = modules[destModName] || {};
      modules[destModName].inputModNames = modules[destModName].inputModNames || [];
      modules[destModName].inputModNames.push(name);
    };
  }

  return modules;
};

const countRunsToReach = (moduleName, initialModules) => {
  const modules = fp.cloneDeep(initialModules);
  
  const processPulse = (pulsesToSend, modules) => {
    const nextPulsesToSend = [];
  
    for (const [name, pulse] of pulsesToSend) {
      const module = modules[name];
      let exitPulse;
  

      if (module.type === FLIPFLOP) {
        if (pulse === LOW) {
          module.isOn = !module.isOn;
          exitPulse = module.isOn ? HIGH : LOW;
        }
      } else if (module.type === CONJONCTION) {
        const allHigh = module.inputModNames.every(inputModName => modules[inputModName].lastSentPulse === HIGH);
        exitPulse = allHigh ? LOW : HIGH;
      } else if (module.type === BROADCASTER) {
        exitPulse = pulse;
      }
  
      if (exitPulse !== undefined) {
        for (const destModName of module.destModNames) {
          nextPulsesToSend.push([destModName, exitPulse]);
          module.lastSentPulse = exitPulse;
        }
      }
    }
  
    return nextPulsesToSend;
  };

  let runCount = 1;
  let found = false;
  while (!found) {
    let nextPulses = [['broadcaster', LOW]];
    while (nextPulses.length) {
      const hash = JSON.stringify(modules) + JSON.stringify(nextPulses);
      nextPulses = processPulse(nextPulses, modules);
      if (nextPulses.length && nextPulses.some(([name, pulse]) => name === moduleName && pulse === LOW)) {
        found = true;
        break;
      }
    };
    
    if (found) {
      break;
    }

    runCount += 1;
  }

  return runCount;
}

/*
  The graph visualization corresponding to data.txt is accessible at data-graph.jpg.
  It was produced using graphViz command : dot -Tjpg data-graph.txt > output.jpg
  Based on this visualization, we can see 4 lookalike counters that loops with a regular ratio
  When those counters are all "on", they trigger rx.
  Assuming they all start at 0, they will all be "on" when the will all end of the loop at the same time
  with is equivalent to find the PPCM of the loops ratios.
*/

const inputLines = await getLinesFromFile('./data.txt');
const modules = parseInputLines(inputLines);
const tzLoopRatio = countRunsToReach('fk', modules);
const mmLoopRatio = countRunsToReach('mm', modules);
const ffLoopRatio = countRunsToReach('ff', modules);
const lhLoopRatio = countRunsToReach('lh', modules);
console.log(tzLoopRatio * mmLoopRatio * ffLoopRatio * lhLoopRatio); // assuming that the product is also the PPCM

