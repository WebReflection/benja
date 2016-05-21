// simple server example
const index = require('fs').readFileSync(__dirname + '/index.html');
require('http')
  .createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(index);
  })
  .listen(8080);
  // will respond to :80 too via iptables

// simple app example
const
  electron = require('electron'),
  app = electron.app,
  BrowserWindow = electron.BrowserWindow
;

// in case by default WebGL doesn't work ...
app.commandLine.appendSwitch('--ignore-gpu-blacklist');

// once the app is ready
app.once('ready', function () {

  const area = electron.screen.getPrimaryDisplay().workAreaSize;

  // a reference is needed so the GC
  // won't kill the view
  this.window = new BrowserWindow({
    backgroundColor: '#000000',
    frame: false,
    // in some case kiosk: true is not working
    // same goes for fullscreen but this is working
    fullscreen: true,
    x: 0,
    y: 0,
    width: area.width || parseFloat(process.env.WIDTH),
    height: area.height || parseFloat(process.env.HEIGHT)
  });

  this.window
    .once('closed', function () {
      // cleanup the reference
      this.window = null;
    })
    .loadURL('http://localhost/');
 // .loadURL('https://codepen.io/bennettfeely/full/tfbCo/');
});
