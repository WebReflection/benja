// serve static content
const app = require('@webreflection/node-worker')(
  require('http').createServer(
    require('tiny-cdn').create({})
  )
).listen(
  process.env.PORT || 8080,
  '0.0.0.0',
  () => {
    const address = app.address();
    const gjs = require('child_process').spawn(
      'gjs',
      ['browse', `http://localhost:${address.port}/`],
      { stdio: 'inherit' }
    );
    //gjs.stdout.pipe(process.stdout);
    //gjs.stderr.pipe(process.stderr);
    gjs.on('exit', () => process.exit(0));
  }
);

// reload when needed
require('fs').watch('reload', () => process.exit(0));