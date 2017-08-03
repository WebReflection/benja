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
    const qml = require('child_process').spawn(
      'qml',
      [
        'browse',
          process.argv[2] ||
          `http://localhost:${address.port}/`
      ],
      {stdio: 'inherit'}
    );
    qml.on('exit', (code) => process.exit(code || 0));
  }
);

// reload when needed
require('fs').watch('reload', () => process.exit(0));