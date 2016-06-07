// simple server example
require('http')
  .createServer(require('tiny-cdn').create({}))
  .listen(8080, '0.0.0.0');
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
app.once('ready', () => {

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
    .once('closed', () => {
      // cleanup the reference
      this.window = null;
    })
    .loadURL('http://localhost:8080/');
    // test CSS
 // .loadURL('https://codepen.io/bennettfeely/full/tfbCo/');
    // test WebGL
 // .loadURL('http://get.webgl.org/');
    // stress WebGL
 // .loadURL('http://webglsamples.org/aquarium/aquarium.html');


  // for debugging purpose, it might be handy to be able
  // to reload the window simply via `touch ~/app/reload`
  require('fs').watch('reload', () =>
    require('child_process').execSync('killall weston-launch && logout')
  );

});