// const pm2 = require('pm2');

// TODO: proceso único de lanzamiento ETL
//
// [ ] Crear un punto de entrada en la app de node.js para que:
//    [ ] 1. Lance el batch-long
//    [ ] 2. Lance la Google Cloud Function
//    [ ] 3. Lance el batch-short (depende de 2.)
//
// Sondear el API de PM2 por si fuera util o lo hacemos con JS puro
//

// (async () => {

//   pm2.connect(err => {

//     if (err) {
//       console.error(err);
//       process.exit(2);
//     }

//     pm2.start({
//       cwd: '/Users/raul/workspace/scrapping/puppeteer-tor/src',
//       name: 'Scrapper long',
//       script: 'batch-long.js',
//       args: [100000, 1000000, 'es'],
//       exec_mode: 'fork',
//       instances: 1,
//       interpreter: 'node'
//     }, function (err, apps) {
//       pm2.disconnect();
//       if (err) throw err
//     });

//     pm2.start({
//       cwd: '/Users/raul/workspace/scrapping/puppeteer-tor/src',
//       name: 'Scrapper long',
//       script: 'batch-long.js',
//       args: [100000, 1000000, 'en'],
//       exec_mode: 'fork',
//       instances: 1,
//       interpreter: 'node'
//     }, function (err, apps) {
//       pm2.disconnect();
//       if (err) throw err
//     });

//     pm2.start({
//       cwd: '/Users/raul/workspace/scrapping/puppeteer-tor/src',
//       name: 'Scrapper short',
//       script: 'batch-short.js',
//       args: ['es'],
//       exec_mode: 'fork',
//       instances: 1,
//       interpreter: 'node'
//     }, function (err, apps) {
//       pm2.disconnect();
//       if (err) throw err
//     });

//     pm2.start({
//       cwd: '/Users/raul/workspace/scrapping/puppeteer-tor/src',
//       name: 'Scrapper short',
//       script: 'batch-short.js',
//       args: ['en'],
//       exec_mode: 'fork',
//       instances: 1,
//       interpreter: 'node'
//     }, function (err, apps) {
//       pm2.disconnect();
//       if (err) throw err
//     });

//     // TODO: Realizar una copia de seguridad de la base de datos y subir a: 1. Google Drive y 2. One Drive

//     // TODO: Realizar un script (batch) que cada cierto tiempo pase lo datos de las base de datos a un Elastic Search

//   });

// })();
