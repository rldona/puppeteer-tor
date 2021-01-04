const pm2 = require('pm2');

(async () => {

  pm2.connect(err => {

    if (err) {
      console.error(err);
      process.exit(2);
    }

    pm2.start({
      cwd: '/Users/raul/workspace/scrapping/puppeteer-tor/src',
      name: 'scrapper',
      script: 'index.js',
      args: [100000, 100100],
      exec_mode: 'fork',
      instances: 1,
      interpreter: 'node'
    }, function (err, apps) {
      pm2.disconnect();
      if (err) throw err
    });

  });

})();
