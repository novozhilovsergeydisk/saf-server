'use strict'

const { log } = require('./server/helpers.js')
const http = require('http')
// const router = require('find-my-way')()
const router = require('./server/lib/Route/index.js')()
const reportController = require('./server/controllers/reports/index.js')
const { MIME_TYPES } = require('./constants.js');
const conf = require('./server/conf.js')


const {staticController}  = require('./server/controllers/main/index.js')
const app = require('./server/lib/Client/index.js')
const { tmpl } = require('./server/lib/Renderer/index.js')

// const nunjucks = require('nunjucks');
// nunjucks.configure('/Users/sergionov/Projects/transplant.net/node-server/html', { autoescape: true });

process.env.PGHOST = conf.db.host;
process.env.PGUSER = conf.db.user;
process.env.PGDATABASE = conf.db.name;
process.env.PGPASSWORD = conf.db.password;
process.env.PGPORT = conf.db.port;

const pipe = ((mimeType, stream, res, status = 200) => {
    res.setHeader('Content-Type', mimeType);
    res.statusCode = status;
    stream.pipe(res);
})

const _post = ((req, res, params) => {
    res.setHeader('Content-Type', MIME_TYPES.json)
    res.end(JSON.stringify({foo:"bar"}))
    // log({ params })
})

const _main = ((req, res) => {
    res.setHeader('Content-Type', MIME_TYPES.json)
    res.end(JSON.stringify({foo:"bar"}))
    // log({ params })
})

// router.on('POST', '/', (req, res, pipe) => {
//     res.setHeader('Content-Type', MIME_TYPES.json)
//     res.end(JSON.stringify({one:"two"}))
//     log({ pipe })
//     //   res.setHeader('Content-Type', MIME_TYPES.json)
//     //   res.end({"get": "hello world"})
// })

// router.on('GET', '/', (req, res, params) => {
//     res.setHeader('Content-Type', MIME_TYPES.json)
//     res.end(JSON.stringify({foo:"bar"}))
//     log({ params })
//   //   res.setHeader('Content-Type', MIME_TYPES.json)
//   //   res.end({"get": "hello world"})
// })

const getUser = ((req, res) => {
    res.setHeader('Content-Type', MIME_TYPES.json)
    res.end({user: 'bar'})
})

const reportClinics = ((req, res) => {
    const data = reportController.clinics()
    data.then(data => {
        res.setHeader('Content-Type', MIME_TYPES.html)
        res.end(data.stream)
    })
})

const _static = ((req, res) => {
    const client = new app(req, res)
    const data = staticController.staticContent(client)
    data.then(data => {
        pipe(client.mimeType, data.stream, res)
    })
})

const _index = ((req, res) => {



    // res.setHeader('Content-Type', MIME_TYPES.html)
    // const render = tmpl.process({foo: 'bar'}, 'reports/index.html')
    //
    // res.end(render)
})

router.on('GET', '/css/*', _static)
router.on('GET', '/img/*', _static)
router.on('GET', '/js/*', _static)
router.on('GET', '/', _main, _index, {low: 'pass'})
router.on('GET', '/user/:userId', getUser)
router.on('GET', '/reports/clinics', reportClinics)
router.on('POST', '/', _post)

const server = http.createServer((req, res) => {
  router.lookup(req, res)

    // const trees = router.trees.GET
    // console.log({ 'router.trees.GET': trees })
})

server.listen(3001, err => {
  if (err) throw err
  console.log('Server listening on: http://localhost:3001')
})
