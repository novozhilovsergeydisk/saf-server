// const v8 = require('v8');
const {log} = require('../../helpers.js');


// Print heap snapshot to the console
// const stream = v8.getHeapSnapshot();
// stream.pipe(process.stdout);

// 2
// const v8 = require('v8');
// let res = v8.getHeapStatistics();
// log({ res });

// 3
// Print GC events to stdout for one minute.
// const v8 = require('v8');
// v8.setFlagsFromString('--trace_gc');
// setTimeout(() => { v8.setFlagsFromString('--notrace_gc'); }, 60e3);

// 4
// const assert = require('assert');
// const realFs = require('fs');
//
// const fakeFs = {};
// require.cache.fs = { exports: fakeFs };
//
// assert.strictEqual(require('fs'), fakeFs);
// assert.strictEqual(require('node:fs'), realFs);

// 5
// const { writeHeapSnapshot } = require('v8');
// const {
//     Worker,
//     isMainThread,
//     parentPort
// } = require('worker_threads');
//
// if (isMainThread) {
//     const worker = new Worker(__filename);
//
//     worker.once('message', (filename) => {
//         console.log(`worker heapdump: ${filename}`);
//         // Now get a heapdump for the main thread.
//         console.log(`main thread heapdump: ${writeHeapSnapshot()}`);
//     });
//
//     // Tell the worker to create a heapdump.
//     worker.postMessage('heapdump');
// } else {
//     parentPort.once('message', (message) => {
//         if (message === 'heapdump') {
//             // Generate a heapdump for the worker
//             // and return the filename to the parent.
//             // parentPort.postMessage('test');
//             parentPort.postMessage(writeHeapSnapshot());
//         }
//     });
// }

// 6
// const X = {foo: 'bar', do: 'it'};
//
// const {
//     setImmediate,
// } = require('timers/promises');
//
// // setImmediate('result').then((res) => {
// //     console.log(res);  // Prints 'result'
// // });
//
// setImmediate(X).then((res) => {
//     log({ res });  // Prints 'result'
// });

// 7

setImmediate(() => {
    console.log('setImmediate')
    //выполнить некий код
})

const bar = () => console.log('bar')
const baz = () => console.log('baz')
const foo = () => {
    console.log('foo')
    setTimeout(bar, 0)
    new Promise((resolve, reject) =>
        resolve('should be right after baz, before bar')
    ).then(resolve => console.log(resolve))
    baz()
}
foo();
process.nextTick(() => {
    console.log('process.nextTick')
    //выполнить какие-то действия
});
//console.log('=================');





