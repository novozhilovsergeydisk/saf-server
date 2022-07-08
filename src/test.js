

// 'use strict'
//
// var EventEmitter = require('events').EventEmitter
// var util = require('util')
// var utils = require('pg/lib/utils')
//
// // var NativeTest = new (module.exports = function (config, callback) {
// //     this.prototype.get = function() {console.log('out')}
// //     console.log({ 'this': this })
// //     callback()
// // })
//
// var NativeTest = (module.exports = function (/*config, values, callback*/) {
//
//     // const myEmitter = new EventEmitter();
//     EventEmitter.call(this)
//     return this.on('event', function (a, b) {
//         // console.log(a, b, this, this === myEmitter);
//         // Prints:
//         //   a b MyEmitter {
//         //     domain: null,
//         //     _events: { event: [Function] },
//         //     _eventsCount: 1,
//         //     _maxListeners: undefined } true¡
//     });
//     // myEmitter.emit('event', 'a', 'b');
//
//     // EventEmitter.call(this)
//     // config = utils.normalizeQueryConfig(config, values, callback)
//     // this.text = config.text
//     // this.values = config.values
//     // this.name = config.name
//     // this.callback = config.callback
//     // this.state = 'new'
//     // this._arrayMode = config.rowMode === 'array'
//     //
//     // // if the 'row' event is listened for
//     // // then emit them as they come in
//     // // without setting singleRowMode to true
//     // // this has almost no meaning because libpq
//     // // reads all rows into memory befor returning any
//     // this._emitRowEvents = false
//     // this.on(
//     //     'newListener',
//     //     function (event) {
//     //         console.log('event')
//     //         if (event === 'rowTest') this._emitRowEvents = true
//     //     }.bind(this)
//     // )
// })
