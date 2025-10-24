#!/usr/bin/env node

import program from 'commander';


const parseFile = require('../src/parse');

program
  .version('1.0.0')
  .description('Compare two configuration files and show differences')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const data1 = parseFile(firstDesktop);
    const data2 = parseFile(secondConfig);
    
    // Здесь будет логика сравнения (пока просто вывод для проверки)
    console.log('File 1:', data1);
    console.log('File 2:', data2);
  })
  .parse(process.argv);
