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

const getPulsesProductAfterNRun = (initialModules, runNb) => {
  const modules = fp.cloneDeep(initialModules);
  let highCount = 0;
  let lowCount = 0;
  
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
        if (exitPulse === LOW) lowCount += module.destModNames.length;
        if (exitPulse === HIGH) highCount += module.destModNames.length;
      }
    }
  
    return nextPulsesToSend;
  };

  for (let i = 0; i < runNb; i += 1) {
    let nextPulses = [['broadcaster', LOW]];
    lowCount += 1;
    while (nextPulses.length) {
      nextPulses = processPulse(nextPulses, modules);
    };
  }
  return highCount * lowCount;
}

const inputLines = await getLinesFromFile('./data.txt');
const modules = parseInputLines(inputLines);
const result = getPulsesProductAfterNRun(modules, 1000);
console.log(result);
