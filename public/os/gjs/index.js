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
    const child = require('child_process').spawn(
      'gjs',
      [
        'browse',
          process.argv[2] ||
          `http://localhost:${address.port}/`
      ],
      {stdio: 'inherit'}
    );
    child.once('exit', (code) => process.exit(code || 0));
    process.once('exit', () => child.kill());
  }
);

// reload when needed
require('fs').watch('reload', () => process.exit(0));
