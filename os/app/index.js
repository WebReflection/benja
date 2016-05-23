// simple server example
const
  fs = require('fs'),
  index = fs.readFileSync(__dirname + '/index.html'),
  logo = fs.readFileSync(__dirname + '/logo-dark.svg')
;
require('http')
  .createServer((req, res) => {
    res.statusCode = 200;
    if (req.url === '/logo-dark.svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.end(logo);
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.end(index);
    }
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
    width: area.width,
    height: area.height
  });

  this.window
    .once('closed', function () {
      // cleanup the reference
      this.window = null;
    })
    .loadURL('http://localhost:8080/');
 // .loadURL('https://codepen.io/bennettfeely/full/tfbCo/');
 // .loadURL('http://webglsamples.org/aquarium/aquarium.html');
});
