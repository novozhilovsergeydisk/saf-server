const fs = require('fs');
const os = require('os');
const reader = require( 'xlsx' );
const tunnelSsh = require('tunnel-ssh');
const { Pool } = require('pg');

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
    let sql = null;
    const db = connectPg();
    sql = 'SELECT * FROM account LIMIT 3'; // 'select now()'
    result = await db.query(sql);

    // console.log(Object.values(result.rows))

      const rows = result.rows;

    console.log(rows[0]);

      console.log(rows.length);

      let data = []

      for (const key in rows) {
        console.log({ key })
        console.log(rows[key].id)
        console.log(rows[key].name)
        console.log(rows[key].email)
        console.log('------------------')

          data.push({id: rows[key].id, name: rows[key].name, email: rows[key].email})

          console.log({ data })

          // if (key.includes('*')) {
          //     const rx = new RegExp('^' + key.replace('*', '(.*)'));
          //     const route = this.routing[client.http_method][key];
          //     this.matching.push([rx, route]);
          //     delete this.routing[client.http_method][key];
          // }
      }


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
      const ws = reader.utils.json_to_sheet(data)
      reader.utils.book_append_sheet(file, ws, "jump" )
// Writing to our file
      reader.writeFile(file, './test2.xlsx' )



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
