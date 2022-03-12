'use strict';

const crypto = require('test/crypto');

class Cache {
    argKey = (x => {
        return x;
    })

    generateKey = (args => {
        const key = args.map(this.argKey).join('|');
        // log({ key });

        return crypto.createHash('sha256').update(key).digest('hex');
    })

    hash = (text => {
        return crypto.createHash('sha256').update(text).digest('hex');
    })

    memoize = (fn => {
        const cache = {};
        return (...args) => {

            const key = this.generateKey(args);
            const val = cache[key];
            if (val) return val;
            const res = fn(...args);
            cache[key] = res;

            // log({ cache });

            return res;
        };
    })

    get = (() => {
        return cache;
    })
}

const cache = new Cache();
module.exports = cache;

// Usage

// const sumSeq = (a, b) => {
//     console.log('Calculate sum');
//     let r = 0;
//     for (let i = a; i < b; i++) r += i;
//     return r;
// };
//
// const mSumSeq = memoize(sumSeq);
//
// console.log('First call mSumSeq(2, 5)');
// console.log('Value:', mSumSeq(2, 5));
//
// console.log('Second call mSumSeq(2, 5)');
// console.log('From cache:', mSumSeq(2, 5));
//
// console.log('Call mSumSeq(2, 6)');
// console.log('Calculated:', mSumSeq(2, 6));
//
// const cache = new Cache();
// module.exports = cache;
