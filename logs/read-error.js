const fs = require('fs');
const readline = require('readline');
const { log } = require('../server/helpers.js')

async function processLineByLine(delimiter) {
  const fileStream = fs.createReadStream('error.log');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  let errorLog = [];
  let count = 1;
  for await (const line of rl) {
    const error = line.split(delimiter);
    if (error.length > 1) {
      const date = error[0]
        log({ '#':  count + ' ' + delimiter })
        // log({ '#':  count + ' ' + delimiter })
        // log( '# ' + count)
        log(date)
      const errorText = error[1].split(',');
        errorBlock.push(l);

      let errorBlock = [];
      for (const l of errorText) {
          log(l)
          errorBlock.push(l);
      }
      console.log('-----------------------------------------');
      errorLog.push({ date: date, log: errorBlock });
      count++;
    }
  }
  errorLog.forEach(item => {
    console.log(item)
  })
  // console.log('-----------------------------------------');
  // console.log({ 'Number of lines with errors:': errorLog.length });
  // console.log('-----------------------------------------');
}

processLineByLine('[error]');
// processLineByLine('[crit]');
// processLineByLine('[warn]');
// processLineByLine('[notice]');
