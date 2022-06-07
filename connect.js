const fs = require('fs');
const os = require('os');
const reader = require( 'xlsx' );
const tunnelSsh = require('tunnel-ssh');
const { Pool } = require('pg');
const {log} = require('./server/helpers.js');

(async () => {

  /** @type {import('net').Server} */
  let tunnel;
  try {
    tunnel = await createTunnel();
  } catch (err) {
    console.error(err);
    return;
  }

  try {
      let result = null;
      let rows = null;
      let _count_ = '';
      let sql = '';
      let year = '2022';
      let month = '05';
      let _date_ = '';
      let sum = 0;
      const db = connectPg();

      for (let i = 1; i <= 30; i++) {
          if (i < 10) {
              _date_ = `${year}-${month}-0${i}`;
          } else {
              _date_ = `${year}-${month}-${i}`;
          }

          sql = `SELECT count(*) FROM sitelog s WHERE 1=1 AND datetime > '${_date_} 00:00:00' AND datetime < '${_date_} 23:59:59' AND uri LIKE '%pat%'`
          console.log({ sql })
          result = await db.query(sql);
          rows = result.rows;
          _count_ = Number(rows[0].count)
          sum += _count_
          log(`${_date_} - ` + _count_);
          log('---------------------')
      }

      log({ sum })

    // sql = 'SELECT * FROM account LIMIT 3'; // 'select now()'
    // sql = `SELECT count(*) FROM sitelog s WHERE 1=1 AND datetime > '2022-06-01 00:00:00' AND datetime < '2022-06-07 23:59:59' AND (uri = '/' OR uri LIKE '%info%' OR uri LIKE '%usr%' OR uri LIKE '%pat%' OR uri LIKE '%doc%' OR uri LIKE '%adm%' OR uri LIKE '%sup%')`

      // sql = `SELECT count(*) FROM sitelog s WHERE 1=1 AND datetime > '2022-06-04 00:00:00' AND datetime < '2022-06-04 23:59:59' AND uri LIKE '%pat%'`
      // result = await db.query(sql);
      // rows = result.rows;
      // console.log(rows[0].count);
      // console.log('---------------------')

      // for (const key in rows) {
      //     console.log(rows[key])
      //     console.log(rows[key].id)
      //     console.log(rows[key].name)
      //     console.log(rows[key].email)
      //     console.log('------------------')
      //
      //       data.push({id: rows[key].id, name: rows[key].name, email: rows[key].email})
      //
      //       console.log({ data })
      //
      //     if (key.includes('*')) {
      //         const rx = new RegExp('^' + key.replace('*', '(.*)'));
      //         const route = this.routing[client.http_method][key];
      //         this.matching.push([rx, route]);
      //         delete this.routing[client.http_method][key];
      //     }
      // }

      // sql = `SELECT count(*) FROM sitelog s WHERE 1=1 AND datetime > '2022-06-05 00:00:00' AND datetime < '2022-06-05 23:59:59' AND uri LIKE '%pat%'`
      // result = await db.query(sql);
      // rows = result.rows;
      // console.log(rows[0].count);
      // console.log('---------------------')

      for (let i = 1; i >= 30; i++) {
        log({ i })
      }


      // let data = []

      // for (const key in rows) {
      //   console.log(rows[key])
      //   console.log(rows[key].id)
      //   console.log(rows[key].name)
      //   console.log(rows[key].email)
      //   console.log('------------------')
      //
      //     data.push({id: rows[key].id, name: rows[key].name, email: rows[key].email})
      //
      //     console.log({ data })
      //
      //     if (key.includes('*')) {
      //         const rx = new RegExp('^' + key.replace('*', '(.*)'));
      //         const route = this.routing[client.http_method][key];
      //         this.matching.push([rx, route]);
      //         delete this.routing[client.http_method][key];
      //     }
      // }


      // Requiring module
      // const reader = require( 'xlsx' )
// Reading our test file
      const file = reader.readFile( './test2.xlsx' )
// Sample data set
      let student_data = [{
          Student: 'Nikhil' ,
          Age:22,
          Branch: 'ISE' ,
          Marks: 70
      },
          {
              Name: 'Amitha' ,
              Age:21,
              Branch: 'EC' ,
              Marks:80
          }]
      // const ws = reader.utils.json_to_sheet(data)
//       reader.utils.book_append_sheet(file, ws, "jump" )
// // Writing to our file
//       reader.writeFile(file, './test2.xlsx' )



    //sql = "SELECT count(*) FROM sitelog s WHERE 1=1 AND datetime > '2022-05-31 00:00:00' AND datetime < '2022-05-31 23:59:59'"

      // AND (uri = '/' OR uri LIKE '%info%' OR uri LIKE '%usr%' OR uri LIKE '%pat%' OR uri LIKE '%doc%' OR uri LIKE '%adm%' OR uri LIKE '%sup%')
    // result = await db.query(sql);
    // console.log(result.rows);
  } catch (err) {
    console.error(err);
  } finally {
    tunnel.close();
  }

})();


/**
 * @param {number} [localPort=63334]
 * @returns {Promise<import('net').Server>}
 */
async function createTunnel(localPort = 63334) {

  /** @type {import('tunnel-ssh').Config} */
  const tunnelConfig = {
    username: 'medsenger',
    password: 'Supo61Stato19',
    // в случае если настроен доступ по ключу
    // privateKey: fs.readFileSync(`${os.homedir()}/.ssh/id_rsa`),
    host: '185.242.120.134',
    port: 22, // порт для ssh-соединения
    dstPort: 5432, // порт postgres на удалённом сервере
    localPort: localPort, // порт postgres на локальной машине
    keepAlive: true,
    readyTimeout: 10000,
  };

  return new Promise((resolve, reject) => {

    tunnelSsh(tunnelConfig, (err, server) => {
      if (err) {
        return reject(err);
      }
      resolve(server);
    })
    .on('error', (err) => console.error('[tunnel-ssh] error:', err))
    .on('connection', () => console.log('[tunnel-ssh] connected'))
    .on('close', () => console.log('[tunnel-ssh] closed'));

  });
}

/**
 * @param {number} [localPort=63334]
 * @returns {import('pg').Pool}
 */
function connectPg(localPort = 63334) {

  /** @type {import('pg').ConnectionConfig} */
  const connectionConfig = {
    database: 'trans',
    port: localPort, // порт, куда туннель проксирует postgres
    user: 'postgres',
    password: 'Porto3Presto89'
  };

  return new Pool(connectionConfig);
}
