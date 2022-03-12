'use strict'

// const validate = ((schema, data) => {
//     const validate__ = ajv.compile(schema)
//     const valid = validate__(data)
//
//     if (!valid) {
//         log({ valid })
//         return valid.errors
//         log(valid.errors)
//     } else {
//         log({ valid })
//         return 'data is valid'
//         // log('data is valid')
//     }
// })

const Ajv = require('ajv')
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

const schema = {
    type: 'object',
    properties: {
        foo: {type: 'integer'},
        bar: {type: 'string'}
    },
    required: ['foo', 'bar'],
    additionalProperties: false
}

const data = {
    foo: 1,
    bar: 2
}

// const res = validate(schema, data)

// log({ res })

const validate = ajv.compile(schema)
const valid = validate(data)

if (!valid) {
    log({ valid })
    // return valid.errors
} else {
    log({ valid })
    // return 'data is valid'
    // log('data is valid')
}