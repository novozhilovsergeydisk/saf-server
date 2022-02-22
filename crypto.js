const crypto = require('crypto');
// const { XXHash3, XXHash64 } = require('xxhash-addon');
// const hasher3 = new XXHash3(0xDEADBEAF);
// const hasher64 = new XXHash64(0xDEADBEAF);

const buf = Buffer.allocUnsafe(16);
const getBinFromHash = (hash) => buf.fill(hash, 'hex').toString('binary');

const funcs = {
//   xxhash64 : (str) => hasher64.hash(Buffer.from(str)).toString('binary')
// , xxhash3  : (str) => hasher3.hash(Buffer.from(str)).toString('binary')
  md5      : (str) => getBinFromHash(crypto.createHash('md5').update(str).digest('hex'))
};

const check = (hash) => {
  let log = [];
  let cnt = 10000;
  while (cnt--) log.push(crypto.randomBytes(cnt).toString('hex'));

  console.time(hash);
  log.forEach(funcs[hash]);
  console.timeEnd(hash);
};

Object.keys(funcs).forEach(check);
